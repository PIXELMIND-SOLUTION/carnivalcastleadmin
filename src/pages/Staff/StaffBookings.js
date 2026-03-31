import React, { useEffect, useState } from "react"
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
import moment from "moment" // Import moment for date handling

const Staff = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [userInCsv, setuserInCsv] = useState([])
  const [form1, setform1] = useState([])
  
  function tog_small() {
    setmodal_small(!modal_small)
  }

  const [users, setusers] = useState([])
  const [users1, setusers1] = useState([])
  const [users2, setusers2] = useState({ staffId: "" })
  const [form, setform] = useState({ search: "" })
  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  // Get all data
  const Get = () => {
    var token = datas
    axios
      .post(
        URLS.GetStaffBookings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers(res.data.Data)
        setuserInCsv(res.data.staffEcxcell || [])
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      })
  }

  // Search functionality
  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    if (e.target.value.trim() === "") {
      Get()
      return
    }

    const token = datas
    axios
      .post(
        URLS.GetStaffBookingsSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.Data)
            setuserInCsv(res.data.staffEcxcell || [])
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  useEffect(() => {
    Get()
    GetSelect()
  }, [])

  // Pagination
  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  // View booking
  const Actinid1 = data => {
    sessionStorage.setItem("BookingId", data._id)
    history.push("/ViewBooking")
  }

  // Edit status
  const handleSubmit1 = e => {
    e.preventDefault()
    Edit()
  }

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const Edit = () => {
    var token = datas
    var formid = form1._id
    const dataArray = {
      status: form1.status,
      cancellReason: form1.cancellReason,
    }
    axios
      .put(URLS.UpdateBookingsStatus + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setmodal_small(false)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  // Filter functionality
  const [filter, setfilter] = useState(false)
  const [filters, setfilters] = useState({
    fromDate: "",
    toDate: "",
  })

  const handleChangeflt = e => {
    let myUser = { ...filters }
    myUser[e.target.name] = e.target.value
    setfilters(myUser)
  }

  const getfilter = e => {
    e.preventDefault()
    GetOrderFiliter()
  }

  // Get filtered data
  const GetOrderFiliter = () => {
    const token = datas
    const data = {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      staffId: users2.staffId || "",
    }

    axios
      .post(URLS.GetStaffBookings, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setusers(res.data.Data || [])
          setuserInCsv(res.data.staffEcxcell || [])
          hidefilter()
          setfilters({
            fromDate: "",
            toDate: "",
          })
          toast.success("Filter applied successfully")
        }
      })
      .catch(error => {
        console.error("Filter error:", error)
        toast.error("Failed to apply filter")
      })
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return moment().format("YYYY-MM-DD")
  }

  // Get yesterday's date
  const getYesterdayDate = () => {
    return moment().subtract(1, 'days').format("YYYY-MM-DD")
  }

  // Get tomorrow's date
  const getTomorrowDate = () => {
    return moment().add(1, 'days').format("YYYY-MM-DD")
  }

  // Filter today's data
  const filterTodayData = () => {
    const today = getTodayDate()
    
    // First filter from all data on frontend
    const todayData = users.filter(item => {
      return item.date === today
    })
    
    if (todayData.length > 0) {
      setusers(todayData)
      toast.success(`Found ${todayData.length} bookings for today`)
    } else {
      // If no data found in current state, try API call
      const token = datas
      const data = {
        fromDate: today,
        toDate: today,
        staffId: users2.staffId || "",
      }

      axios
        .post(URLS.GetStaffBookings, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          if (res.status === 200) {
            const filteredData = res.data.Data || []
            setusers(filteredData)
            setuserInCsv(res.data.staffEcxcell || [])
            if (filteredData.length > 0) {
              toast.success(`Found ${filteredData.length} bookings for today`)
            } else {
              toast.info("No bookings found for today")
            }
          }
        })
        .catch(error => {
          console.error("Today filter error:", error)
          toast.error("Failed to load today's data")
        })
    }
  }

  // Filter yesterday's data
  const filterYesterdayData = () => {
    const yesterday = getYesterdayDate()
    
    // First filter from all data on frontend
    const yesterdayData = users.filter(item => {
      return item.date === yesterday
    })
    
    if (yesterdayData.length > 0) {
      setusers(yesterdayData)
      toast.success(`Found ${yesterdayData.length} bookings for yesterday`)
    } else {
      // If no data found in current state, try API call
      const token = datas
      const data = {
        fromDate: yesterday,
        toDate: yesterday,
        staffId: users2.staffId || "",
      }

      axios
        .post(URLS.GetStaffBookings, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          if (res.status === 200) {
            const filteredData = res.data.Data || []
            setusers(filteredData)
            setuserInCsv(res.data.staffEcxcell || [])
            if (filteredData.length > 0) {
              toast.success(`Found ${filteredData.length} bookings for yesterday`)
            } else {
              toast.info("No bookings found for yesterday")
            }
          }
        })
        .catch(error => {
          console.error("Yesterday filter error:", error)
          toast.error("Failed to load yesterday's data")
        })
    }
  }

  // Filter tomorrow's data
  const filterTomorrowData = () => {
    const tomorrow = getTomorrowDate()
    
    // First filter from all data on frontend
    const tomorrowData = users.filter(item => {
      return item.date === tomorrow
    })
    
    if (tomorrowData.length > 0) {
      setusers(tomorrowData)
      toast.success(`Found ${tomorrowData.length} bookings for tomorrow`)
    } else {
      // If no data found in current state, try API call
      const token = datas
      const data = {
        fromDate: tomorrow,
        toDate: tomorrow,
        staffId: users2.staffId || "",
      }

      axios
        .post(URLS.GetStaffBookings, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          if (res.status === 200) {
            const filteredData = res.data.Data || []
            setusers(filteredData)
            setuserInCsv(res.data.staffEcxcell || [])
            if (filteredData.length > 0) {
              toast.success(`Found ${filteredData.length} bookings for tomorrow`)
            } else {
              toast.info("No bookings found for tomorrow")
            }
          }
        })
        .catch(error => {
          console.error("Tomorrow filter error:", error)
          toast.error("Failed to load tomorrow's data")
        })
    }
  }

  // Reset to all data
  const resetFilter = () => {
    Get()
    toast.info("Showing all bookings")
  }

  // Get staff list
  const GetSelect = () => {
    var token = datas
    axios
      .post(
        URLS.GetStaff,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers1(res.data.staff || [])
      })
  }

  const handleStaddId = (e) => {
    const myUser = { ...users2 }
    myUser[e.target.name] = e.target.value
    setusers2(myUser)
  }

  const hidefilter = () => setfilter(false)

  // CSV Export
  const csvReport = {
    filename: `Staff_Bookings_${moment().format('YYYY-MM-DD')}.csv`,
    data: userInCsv,
  }

  // PDF Export
  const exportPDF = () => {
    const unit = "pt"
    const size = "A2"
    const orientation = "portrait"
    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(15)
    doc.text("Staff Bookings Report", 40, 40)
    
    const headers = [
      ["S.No", "Booking ID", "Date", "Time", "Customer", "Phone", "Theater", "Occasion", "Amount", "Status", "Staff"]
    ]
    
    const data = users.map((elt, i) => [
      i + 1,
      elt.orderId || "N/A",
      elt.date || "N/A",
      elt.time || "N/A",
      elt.userName || "N/A",
      elt.userPhone || "N/A",
      elt.theatreName || "N/A",
      elt.occasionName || "N/A",
      elt.totalPrice || "0",
      elt.status || "N/A",
      elt.staffName || "N/A"
    ])
    
    let content = {
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] }
    }
    
    doc.autoTable(content)
    doc.save(`Staff_Bookings_${moment().format('YYYY-MM-DD')}.pdf`)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Staff Bookings"
          />
          
          {/* Filter Form */}
          {filter ? (
            <Card>
              <CardBody>
                <Form onSubmit={getfilter}>
                  <Row>
                    <Col lg="3">
                      <div className="mb-3">
                        <Label for="fromDate">
                          From Date <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="date"
                          required
                          className="form-control"
                          id="fromDate"
                          onChange={handleChangeflt}
                          name="fromDate"
                          value={filters.fromDate}
                          max={getTodayDate()}
                        />
                      </div>
                    </Col>
                    <Col lg="3">
                      <div className="mb-3">
                        <Label for="toDate">
                          To Date <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="date"
                          required
                          className="form-control"
                          id="toDate"
                          onChange={handleChangeflt}
                          name="toDate"
                          value={filters.toDate}
                          min={filters.fromDate}
                          max={getTodayDate()}
                        />
                      </div>
                    </Col>

                    <Col lg="3">
                      <div className="mb-3">
                        <Label for="staffSelect">
                          Select Staff
                        </Label>
                        <select
                          className="form-control"
                          id="staffSelect"
                          name="staffId"
                          value={users2.staffId}
                          onChange={handleStaddId}
                        >
                          <option value="">All Staff</option>
                          {users1.map((data, key) => (
                            <option key={key} value={data._id}>
                              {data.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>

                    <Col lg="3">
                      <div className="mt-4 d-flex flex-wrap gap-2">
                        <Button type="submit" color="info">
                          <i className="fas fa-search me-1"></i> Search
                        </Button>
                        <Button
                          type="button"
                          color="warning"
                          onClick={filterTodayData}
                        >
                          <i className="fas fa-calendar-day me-1"></i> Today
                        </Button>
                        <Button
                          onClick={hidefilter}
                          color="danger"
                        >
                          <i className="fas fa-times me-1"></i> Cancel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          ) : null}
          
          {/* Main Content */}
          <Row>
            <Col>
              <Card>
                <CardBody>
                  {/* Action Buttons */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="d-flex flex-wrap gap-2">
                        <CSVLink {...csvReport}>
                          <Button color="success">
                            <i className="fas fa-file-excel me-1"></i> Excel
                          </Button>
                        </CSVLink>
                        <Button color="danger" onClick={exportPDF}>
                          <i className="fas fa-file-pdf me-1"></i> PDF
                        </Button>
                        <Button
                          color="info"
                          onClick={() => setfilter(!filter)}
                        >
                          <i className="fas fa-filter me-1"></i> Filter
                        </Button>
                        <Button
                          color="primary"
                          onClick={filterTodayData}
                        >
                          <i className="fas fa-calendar-day me-1"></i> Today
                        </Button>
                        <Button
                          color="secondary"
                          onClick={filterYesterdayData}
                        >
                          <i className="fas fa-calendar me-1"></i> Yesterday
                        </Button>
                        <Button
                          color="success"
                          onClick={filterTomorrowData}
                        >
                          <i className="fas fa-calendar-plus me-1"></i> Tomorrow
                        </Button>
                        <Button
                          color="warning"
                          onClick={resetFilter}
                        >
                          <i className="fas fa-sync me-1"></i> All
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-end">
                        <div className="w-50">
                          <Input
                            name="search"
                            value={form.search}
                            onChange={custsearch}
                            type="search"
                            placeholder="Search by name, phone, booking ID..."
                            className="form-control"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Table */}
                  <div className="table-responsive mt-3">
                    <Table hover bordered className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">S.No</th>
                          <th>Staff Name</th>
                          <th>Staff Phone</th>
                          <th className="text-center">Pending</th>
                          <th className="text-center">Completed</th>
                          <th className="text-center">Cancelled</th>
                          <th>Booking ID</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Theater</th>
                          <th>Occasion</th>
                          <th className="text-end">Amount</th>
                          <th>Status</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.length > 0 ? (
                          lists.map((data, key) => (
                            <tr key={key}>
                              <td className="text-center">{pagesVisited + key + 1}</td>
                              <td>{data.staffName || "N/A"}</td>
                              <td>{data.staffPhone || "N/A"}</td>
                              <td className="text-center">
                                <span className="badge bg-warning">
                                  {data.PendingBookings || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-success">
                                  {data.CompletedBookings || 0}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-danger">
                                  {data.CancelledBookings || 0}
                                </span>
                              </td>
                              <td>
                                <span className="fw-semibold">{data.orderId}</span>
                              </td>
                              <td>
                                <span className={`badge ${data.date === getTodayDate() ? 'bg-info' : 'bg-secondary'}`}>
                                  {data.date || "N/A"}
                                </span>
                              </td>
                              <td>{data.time || "N/A"}</td>
                              <td>{data.userName || "N/A"}</td>
                              <td>{data.userPhone || "N/A"}</td>
                              <td>{data.theatreName || "N/A"}</td>
                              <td>{data.occasionName || "N/A"}</td>
                              <td className="text-end fw-bold">
                                ₹{data.totalPrice?.toLocaleString() || "0"}
                              </td>
                              <td>
                                <span className={`badge ${
                                  data.status === 'completed' ? 'bg-success' :
                                  data.status === 'cancelled' ? 'bg-danger' :
                                  data.status === 'booking-confirmed' ? 'bg-primary' :
                                  'bg-warning'
                                }`}>
                                  {data.status || "N/A"}
                                </span>
                              </td>
                              <td className="text-center">
                                {(Roles?.staffBookingView || Roles?.accessAll === true) && (
                                  <Button
                                    onClick={() => Actinid1(data)}
                                    className="btn-sm"
                                    color="info"
                                    size="sm"
                                  >
                                    <i className="fas fa-eye me-1"></i> View
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={16} className="text-center py-4">
                              <div className="text-muted">
                                <i className="fas fa-inbox fa-2x mb-2"></i>
                                <p>No bookings found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {users.length > listPerPage && (
                    <div className="d-flex justify-content-center mt-3">
                      <ReactPaginate
                        previousLabel={<i className="fas fa-chevron-left"></i>}
                        nextLabel={<i className="fas fa-chevron-right"></i>}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={changePage}
                        containerClassName={"pagination pagination-rounded"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Edit Status Modal */}
        <Modal
          size="md"
          isOpen={modal_small}
          toggle={tog_small}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title">Edit Booking Status</h5>
            <button
              type="button"
              className="btn-close"
              onClick={tog_small}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSubmit1}>
              <div className="mb-3">
                <Label className="form-label">Status <span className="text-danger">*</span></Label>
                <select
                  value={form1.status || ""}
                  name="status"
                  required
                  onChange={handleChange1}
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  <option value="booking-confirmed">Booking Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {form1.status === "cancelled" && (
                <div className="mb-3">
                  <Label className="form-label">
                    Cancellation Reason <span className="text-danger">*</span>
                  </Label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter cancellation reason..."
                    value={form1.cancellReason || ""}
                    name="cancellReason"
                    onChange={handleChange1}
                    required
                  />
                </div>
              )}
              
              <div className="d-flex justify-content-end gap-2">
                <Button
                  color="secondary"
                  type="button"
                  onClick={tog_small}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Update Status
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default Staff