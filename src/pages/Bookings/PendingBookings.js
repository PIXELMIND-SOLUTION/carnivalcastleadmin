import React, { useEffect, useState, useRef } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Badge
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import { URLS } from "../../Url"
import axios from "axios"
import jsPDF from "jspdf"
import "jspdf-autotable"
import moment from "moment"

const Staff = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [selectedBookings, setSelectedBookings] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  const [userInCsv, setuserInCsv] = useState([])
  const [userInCsv2, setuserInCsv2] = useState([])
  const [productCsv, setproductCsv] = useState([])

  const [form1, setform1] = useState([])

  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ search: "" })
  const [filter, setFilter] = useState(false)
  const [filters, setFilters] = useState({ singleDate: "" })
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [listPerPage] = useState(10)
  const [pendingCount, setPendingCount] = useState(0)

  const cancelTokenRef = useRef(null)

  const gets = localStorage.getItem("authUser")
  const data = JSON.parse(gets)
  const token = data?.token
  const Roles = data?.rolesAndPermission?.[0] || {}

  const Actinid1 = data => {
    sessionStorage.setItem("BookingId", data._id)
    history.push("/ViewBooking")
  }

  function tog_small() {
    setmodal_small(!modal_small)
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  // Function to calculate GST amount (18% of subTotal)
  const calculateGST = (subTotal) => {
    return (parseFloat(subTotal || 0) * 0.18).toFixed(2)
  }

  // Function to calculate total with GST
  const calculateTotalWithGST = (subTotal) => {
    const gstAmount = parseFloat(calculateGST(subTotal))
    return (parseFloat(subTotal || 0) + gstAmount).toFixed(2)
  }

  // Function to get correct subTotal value from booking data
  const getSubTotal = (booking) => {
    if (booking?.subTotal) {
      return parseFloat(booking.subTotal)
    }
    if (booking?.totalPrice) {
      return parseFloat(booking.totalPrice)
    }
    return 0
  }

  const GetPendingBookings = async (page = 1, search = "", filtersData = null) => {
    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Canceled due to new request")
      }
      cancelTokenRef.current = axios.CancelToken.source()

      setLoading(true)

      const body = { 
        page, 
        limit: listPerPage, 
        searchQuery: search, 
        ...filtersData 
      }

      const res = await axios.post(URLS.GetPendingBookings, body, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelTokenRef.current.token,
      })

      if (res.data.success) {
        setUsers(res.data.data || [])
        setuserInCsv(res.data.pendingBookingExcel || [])
        setPageCount(res.data.totalPages || 1)
        setPendingCount(res.data.totalCount || 0)
        
        if (res.data.productsListExcell) {
          const apiData = res.data.productsListExcell
          const flattenedData = apiData.flatMap(order =>
            order.products.map(product => ({
              orderId: order.orderId,
              productName: product.productName,
              productQuantity: product.productQuantity,
            }))
          )
          setuserInCsv2(flattenedData)
        }
      } else {
        toast.error(res.data.message || "Failed to fetch pending bookings")
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        return
      }
      console.error("Error fetching pending bookings:", err)
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Bad request")
      } else {
        toast.error("Network error occurred while fetching bookings")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      GetPendingBookings(pageNumber)
    }
  }, [])

  const custsearch = (e) => {
    const value = e.target.value
    setForm({ ...form, search: value })
    setPageNumber(1)
    GetPendingBookings(1, value, filters.singleDate ? { singleDate: filters.singleDate } : null)
  }

  const handleChangeflt = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const getfilter = (e) => {
    e.preventDefault()
    setPageNumber(1)
    GetPendingBookings(1, form.search || "", { singleDate: filters.singleDate })
    setFilter(false)
  }

  const clearFilters = () => {
    setFilters({ singleDate: "" })
    setForm({ search: "" })
    setPageNumber(1)
    GetPendingBookings(1)
    setFilter(false)
  }

  const hidefilter = () => setFilter(false)

  const changePage = ({ selected }) => {
    const newPage = selected + 1
    setPageNumber(newPage)
    const filterData = filters.singleDate ? { singleDate: filters.singleDate } : null
    GetPendingBookings(newPage, form.search || "", filterData)
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    Edit()
  }

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const Edit = async () => {
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    try {
      const formid = form1._id
      const dataArray = {
        status: form1.status,
        cancellReason: form1.cancellReason,
      }

      const response = await axios.put(URLS.UpdateBookingsStatus + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setmodal_small(false)
        const filterData = filters.singleDate ? { singleDate: filters.singleDate } : null
        GetPendingBookings(pageNumber, form.search || "", filterData)
      } else {
        toast.error(response.data.message || "Update failed")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Update failed")
      } else {
        toast.error("Network error occurred")
      }
    }
  }

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  const GetAllCategories = async () => {
    if (!token) return

    try {
      const response = await axios.post(
        URLS.GetCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data.success) {
        setCategories(response.data.categorys || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    GetAllCategories()
  }, [])

  const handleCategoryChange = (event) => {
    const category = event.target.value
    setSelectedCategory(category)

    if (category) {
      console.log(`Selected category: ${category}`)
    }
  }

  // CSV Headers and Data - Updated with GST columns
  const headers2 = [
    { label: "S.No", key: "sno" },
    { label: "Event Id", key: "orderId" },
    { label: "Event Date", key: "date" },
    { label: "Event Time", key: "time" },
    { label: "Name", key: "userName" },
    { label: "Phone", key: "userPhone" },
    { label: "Theater Name", key: "theatreName" },
    { label: "Plan Name", key: "planName" },
    { label: "Occasion Name", key: "occasionName" },
    { label: "Sub Total (Without GST)", key: "subTotal" },
    { label: "GST Amount (18%)", key: "gstAmount" },
    { label: "Total Amount (With GST)", key: "totalWithGST" },
    { label: "Advance (Without GST)", key: "advanceWithoutGST" },
    { label: "Remaining (Without GST)", key: "remainingWithoutGST" },
    { label: "Remaining (With GST)", key: "remainingWithGST" },
    { label: "Status", key: "status" },
    { label: "Booking Source", key: "bookingSource" },
    { label: "Heard From", key: "heardFrom" },
    { label: "Booking Date", key: "logCreatedDate" },
  ]

  const productheaders = [
    { label: "S.No", key: "sno" },
    { label: "Event Id", key: "orderId" },
    { label: "Product Name", key: "productName" },
    { label: "Product Quantity", key: "productQuantity" },
  ]

  const csvData = userInCsv.map((elt, i) => {
    const subTotal = getSubTotal(elt);
    const gstAmount = calculateGST(subTotal);
    const totalWithGST = calculateTotalWithGST(subTotal);
    const advanceWithoutGST = parseFloat(elt?.advancePayment || 750);
    const remainingWithoutGST = (subTotal - advanceWithoutGST).toFixed(2);
    const remainingWithGST = (parseFloat(totalWithGST) - advanceWithoutGST).toFixed(2);

    return {
      sno: i + 1,
      orderId: elt.orderId,
      date: elt.date,
      time: elt.time,
      userName: elt.userName,
      userPhone: elt.userPhone,
      theatreName: elt.theatreName,
      planName: elt.planName || "N/A",
      occasionName: elt.occasionName || "N/A",
      subTotal: subTotal.toFixed(2),
      gstAmount: gstAmount,
      totalWithGST: totalWithGST,
      advanceWithoutGST: advanceWithoutGST.toFixed(2),
      remainingWithoutGST: remainingWithoutGST,
      remainingWithGST: remainingWithGST,
      status: elt.status,
      bookingSource: elt.bookingSource || "N/A",
      heardFrom: elt.heardFrom || "N/A",
      logCreatedDate: elt.logCreatedDate?.slice(0, 10) || "N/A",
    }
  })

  const productData = userInCsv2.map((elt, i) => ({
    sno: i + 1,
    orderId: elt.orderId,
    productName: elt.productName,
    productQuantity: elt.productQuantity
  }))

  const csvReport = {
    filename: "Pending_Bookings_Report.csv",
    headers: headers2,
    data: csvData,
  }

  const productReport = {
    filename: "Pending_Bookings_Products.csv",
    headers: productheaders,
    data: productData,
  }

  const exportPDF = () => {
    if (users.length === 0) {
      toast.warning("No data to export")
      return
    }

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Pending Bookings Report", 14, 15)
    
    const headers = [
      "S.No",
      "Event ID",
      "Booking Date",
      "Event Date",
      "Event Time",
      "Name",
      "Phone",
      "Theater",
      "Plan Name",
      "Occasion Name",
      "Sub Total",
      "GST (18%)",
      "Total (With GST)",
      "Advance",
      "Remaining (With GST)",
      "Remaining (Without GST)",
      "Status",
      "Booking Source",
      "Heard From"
    ]

    const data = users.map((elt, i) => {
      const subTotal = getSubTotal(elt);
      const gstAmount = calculateGST(subTotal);
      const totalWithGST = calculateTotalWithGST(subTotal);
      const advanceWithoutGST = parseFloat(elt?.advancePayment || 750);
      const remainingWithoutGST = (subTotal - advanceWithoutGST).toFixed(2);
      const remainingWithGST = (parseFloat(totalWithGST) - advanceWithoutGST).toFixed(2);

      return [
        i + 1 + (pageNumber - 1) * listPerPage,
        elt.orderId || "",
        elt.logCreatedDate?.slice(0, 10) || "",
        elt.date || "",
        elt.time || "",
        elt.userName || "",
        elt.userPhone || "",
        elt.theatreName || "",
        elt.planName || "N/A",
        elt.occasionName || "N/A",
        subTotal.toFixed(2),
        gstAmount,
        totalWithGST,
        advanceWithoutGST.toFixed(2),
        remainingWithGST,
        remainingWithoutGST,
        elt.status || "",
        elt.bookingSource || "N/A",
        elt.heardFrom || "N/A"
      ]
    })

    doc.autoTable({
      startY: 20,
      head: [headers],
      body: data,
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] }
    })

    doc.save("Pending_Bookings_Report.pdf")
  }

  const handleSelectBooking = (bookingId) => {
    setSelectedBookings(prevSelected => {
      if (prevSelected.includes(bookingId)) {
        return prevSelected.filter(id => id !== bookingId)
      } else {
        return [...prevSelected, bookingId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBookings([])
    } else {
      const allIds = users.map(booking => booking._id)
      setSelectedBookings(allIds)
    }
    setSelectAll(!selectAll)
  }

  const moveToHistory = () => {
    if (selectedBookings.length === 0) {
      toast.error("Please select at least one booking to move to history")
      return
    }
    setConfirmModal(true)
  }

  const confirmMoveToHistory = async () => {
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    try {
      const updatePromises = selectedBookings.map(bookingId => {
        const dataArray = {
          status: "completed",
          cancellReason: "Moved to history by admin"
        }
        
        return axios.put(URLS.UpdateBookingsStatus + bookingId, dataArray, {
          headers: { Authorization: `Bearer ${token}` },
        })
      })

      await Promise.all(updatePromises)
      toast.success(`${selectedBookings.length} booking(s) moved to history successfully`)
      
      const filterData = filters.singleDate ? { singleDate: filters.singleDate } : null
      GetPendingBookings(pageNumber, form.search || "", filterData)
      
      setSelectedBookings([])
      setSelectAll(false)
      setConfirmModal(false)
    } catch (error) {
      console.error("Error moving bookings to history:", error)
      toast.error("Error moving bookings to history")
      setConfirmModal(false)
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Pending Bookings"
          />

          <div className="mt-2 text-muted fs-5">
            Total Pending Bookings: {pendingCount}
            {loading && <Spinner size="sm" className="ms-2" />}
          </div>

          {filter && (
            <Card>
              <CardBody>
                <Form onSubmit={getfilter}>
                  <Row>
                    <Col lg="3">
                      <div className="mb-3">
                        <Label for="date-filter">
                          Date <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="date"
                          className="form-control"
                          id="date-filter"
                          onChange={handleChangeflt}
                          name="singleDate"
                          value={filters.singleDate}
                        />
                      </div>
                    </Col>
                    <Col lg="6">
                      <div className="mt-4">
                        <Button type="submit" className="m-1" color="info">
                          <i className="fas fa-check-circle"></i> Apply Filter
                        </Button>
                        <Button onClick={clearFilters} className="m-1" color="secondary">
                          <i className="fas fa-undo"></i> Clear
                        </Button>
                        <Button onClick={hidefilter} className="m-1" color="danger">
                          <i className="fas fa-times-circle"></i> Close
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          )}

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md="8" className="d-flex align-items-center flex-wrap gap-2">
                      <CSVLink {...csvReport}>
                        <Button color="success" className="me-2">
                          <i className="fas fa-file-excel"></i> Excel
                        </Button>
                      </CSVLink>

                      <Button color="danger" className="me-2" onClick={exportPDF}>
                        <i className="fas fa-file-pdf"></i> PDF
                      </Button>

                      <CSVLink {...productReport}>
                        <Button color="success" className="me-2">
                          <i className="fas fa-file-excel"></i> Product Excel
                        </Button>
                      </CSVLink>

                      <Button color="info" className="me-2" onClick={() => setFilter(!filter)}>
                        <i className="fas fa-filter"></i> Filter
                      </Button>

                      <div className="w-25">
                        <Input
                          type="select"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </Col>

                    <Col md="4">
                      <div className="d-flex align-items-center">
                        <Input
                          name="search"
                          value={form.search}
                          onChange={custsearch}
                          type="search"
                          placeholder="Search bookings..."
                          className="me-2"
                        />
                        
                        <Button
                          color="warning"
                          onClick={moveToHistory}
                          disabled={selectedBookings.length === 0 || loading}
                        >
                          <i className="fas fa-history"></i> Shift ({selectedBookings.length})
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <div className="table-rep-plugin mt-4">
                    {loading ? (
                      <div className="text-center py-4">
                        <Spinner color="primary" />
                        <div>Loading bookings...</div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover bordered>
                          <thead>
                            <tr>
                              <th>
                                <Input
                                  type="checkbox"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                  disabled={users.length === 0}
                                />
                              </th>
                              <th>S.No</th>
                              <th>Event Id</th>
                              <th>Booking Date</th>
                              <th>Event Date</th>
                              <th>Event Time</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Theater Name</th>
                              <th>Plan Name</th>
                              <th>Occasion Name</th>
                              {/* 🆕 GST Column */}
                              <th>GST (18%)</th>
                              {/* 🆕 Updated Remaining Price Columns */}
                              <th>Remaining (Without GST)</th>
                              <th>Remaining (With GST)</th>
                              <th>Status</th>
                              <th>Booking Source</th>
                              <th>Heard From</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.length > 0 ? (
                              users.map((data, key) => {
                                // GST calculations - only on subTotal
                                const subTotal = getSubTotal(data);
                                const gstAmount = calculateGST(subTotal);
                                const totalWithGST = calculateTotalWithGST(subTotal);
                                
                                // MANUAL ADVANCE: 750 (without GST) - advance par GST nahi lagta
                                const advanceWithoutGST = parseFloat(data?.advancePayment || 750);
                                
                                // FIXED: Advance subtract karo
                                const remainingWithoutGST = (subTotal - advanceWithoutGST).toFixed(2);
                                
                                // FIXED: Total with GST me se advance subtract karo
                                const remainingWithGST = (parseFloat(totalWithGST) - advanceWithoutGST).toFixed(2);

                                return (
                                  <tr key={data._id} className={selectedBookings.includes(data._id) ? "table-primary" : ""}>
                                    <td>
                                      <Input
                                        type="checkbox"
                                        checked={selectedBookings.includes(data._id)}
                                        onChange={() => handleSelectBooking(data._id)}
                                      />
                                    </td>
                                    <td>{(pageNumber - 1) * listPerPage + key + 1}</td>
                                    <td>{data.orderId}</td>
                                    <td>{data.logCreatedDate?.slice(0, 10)}</td>
                                    <td>{data.date}</td>
                                    <td>{data.time}</td>
                                    <td>{data.userName}</td>
                                    <td>{data.userPhone}</td>
                                    <td>{data.theatreName}</td>
                                    <td>{data.planName || "Basic Plan"}</td>
                                    <td>{data.occasionName || "N/A"}</td>
                                    
                                    {/* 🆕 GST Amount Column Data */}
                                    <td>
                                      <Badge color="warning">
                                        {gstAmount}
                                      </Badge>
                                    </td>
                                    
                                    {/* 🆕 UPDATED: Remaining Price with and without GST */}
                                    <td>
                                      <div className="fw-bold text-danger">
                                        {remainingWithoutGST}
                                      </div>
                                      <small className="text-muted">
                                        Sub: {subTotal.toFixed(2)} - Adv: {advanceWithoutGST.toFixed(2)}
                                      </small>
                                    </td>
                                    <td>
                                      <div className="fw-bold text-primary">
                                        {remainingWithGST}
                                      </div>
                                      <small className="text-muted">
                                        Total: {totalWithGST} - Adv: {advanceWithoutGST.toFixed(2)}
                                      </small>
                                    </td>
                                    
                                    <td>
                                      <span className={`badge bg-${data.status === 'completed' ? 'success' : data.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                        {data.status}
                                      </span>
                                    </td>
                                    <td>{data.bookingSource || "N/A"}</td>
                                    <td>{data.heardFrom || "N/A"}</td>
                                    <td>
                                      <div className="d-flex gap-1">
                                        {(Roles.pendingView || Roles?.accessAll) && (
                                          <Button
                                            onClick={() => Actinid1(data)}
                                            size="sm"
                                            color="info"
                                          >
                                            <i className="fas fa-eye"></i>
                                          </Button>
                                        )}
                                        {(Roles.pendingEdit || Roles?.accessAll) && (
                                          <Button
                                            onClick={() => getpopup(data)}
                                            size="sm"
                                            color="success"
                                          >
                                            <i className="bx bx-edit"></i>
                                          </Button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="18" className="text-center py-4">
                                  No pending bookings found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    )}

                    {pageCount > 1 && (
                      <div className="d-flex justify-content-center mt-3">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          forcePage={pageNumber - 1}
                          containerClassName={"pagination"}
                          previousLinkClassName={"page-link"}
                          nextLinkClassName={"page-link"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <Modal isOpen={modal_small} toggle={tog_small} centered>
          <ModalHeader toggle={tog_small}>Edit Booking Status</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit1}>
              <div className="mb-3">
                <Label>Status <span className="text-danger">*</span></Label>
                <Input
                  type="select"
                  value={form1.status || ""}
                  name="status"
                  required
                  onChange={handleChange1}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Input>
              </div>
              
              {form1.status === "cancelled" && (
                <div className="mb-3">
                  <Label>Cancellation Reason <span className="text-danger">*</span></Label>
                  <Input
                    type="textarea"
                    rows="3"
                    placeholder="Enter cancellation reason"
                    value={form1.cancellReason || ""}
                    name="cancellReason"
                    onChange={handleChange1}
                    required
                  />
                </div>
              )}
              
              <div className="d-flex justify-content-end gap-2">
                <Button color="secondary" onClick={tog_small}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
          <ModalHeader toggle={() => setConfirmModal(false)}>
            Confirm Action
          </ModalHeader>
          <ModalBody>
            Are you sure you want to move {selectedBookings.length} booking(s) to history?
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setConfirmModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={confirmMoveToHistory} disabled={loading}>
              {loading ? "Processing..." : "Yes, Move to History"}
            </Button>
          </ModalFooter>
        </Modal>

        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Staff