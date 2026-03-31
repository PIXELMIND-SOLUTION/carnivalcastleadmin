import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Table,
  Modal,
  Badge,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import Select from "react-select"

const Coupons = () => {
  const [modal_small, setmodal_small] = useState(false)

  function tog_small() {
    setmodal_small(!modal_small)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token
  console.log(datas)

  const [coup, setcoup] = useState([])
  const [theaters, setTheaters] = useState([])
  
  // Hide options for dropdown
  const hideOptions = [
    { value: "no", label: "No" },
    { value: "yes", label: "Yes" },
  ]

  const [form, setform] = useState({
    theaters: [],
    slots: [],
    days: [],
    discountType: "",
    value: "",
    title: "",
    couponCode: "",
    couponCodeType: "",
    amount: "",
    description: "",
    fromDate: "",
    toDate: "",
    websiteFor: "",
    hide: "no", // hide field with default "no"
  })
  const [form1, setform1] = useState({
    theaters: [],
    slots: [],
    days: [],
    discountType: "",
    value: "",
    title: "",
    couponCode: "",
    couponCodeType: "",
    amount: "",
    description: "",
    fromDate: "",
    toDate: "",
    websiteFor: "",
    hide: "no", // hide field with default "no"
  })

  // Fetch theaters from API
  const fetchTheaters = async () => {
    try {
      const response = await axios.post("https://api.carnivalcastle.com/v1/carnivalApi/web/getalltheatres/forweb")
      if (response.data.success) {
        setTheaters(response.data.theatres)
      }
    } catch (error) {
      console.error("Error fetching theaters:", error)
      toast.error("Failed to fetch theaters")
    }
  }

  // Convert theaters to options for react-select
  const theaterOptions = theaters.map(theater => ({
    value: theater._id,
    label: theater.name,
  }))

  const slotOptions = [
    { value: "morning", label: "Morning (9AM-12PM)" },
    { value: "afternoon", label: "Afternoon (12PM-5PM)" },
    { value: "evening", label: "Evening (5PM-9PM)" },
    { value: "night", label: "Night (9PM-12AM)" },
  ]

  const dayOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ]

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "fixed", label: "Fixed Amount" },
    { value: "freeTicket", label: "Free Ticket" },
  ]

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const handleTheaterChange = selectedOptions => {
    setform({ ...form, theaters: selectedOptions || [] })
  }

  const handleSlotChange = selectedOptions => {
    setform({ ...form, slots: selectedOptions || [] })
  }

  const handleDayChange = selectedOptions => {
    setform({ ...form, days: selectedOptions || [] })
  }

  const handleDiscountTypeChange = selectedOption => {
    setform({ ...form, discountType: selectedOption ? selectedOption.value : "", value: "" })
  }

  const handleTheaterChange1 = selectedOptions => {
    setform1({ ...form1, theaters: selectedOptions || [] })
  }

  const handleSlotChange1 = selectedOptions => {
    setform1({ ...form1, slots: selectedOptions || [] })
  }

  const handleDayChange1 = selectedOptions => {
    setform1({ ...form1, days: selectedOptions || [] })
  }

  const handleDiscountTypeChange1 = selectedOption => {
    setform1({ ...form1, discountType: selectedOption ? selectedOption.value : "", value: "" })
  }

  const getAllbcoupons = () => {
    var token = datas
    axios
      .post(
        URLS.GetCoupon,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setcoup(res.data.coupons)
      })
      .catch(error => {
        console.error("Error fetching coupons:", error)
        toast.error("Failed to fetch coupons")
      })
  }

  const addcoupons = () => {
    var token = datas
    const dataArray = {
      title: form.title,
      couponCode: form.couponCode,
      couponCodeType: form.couponCodeType,
      amount: form.amount,
      description: form.description,
      fromDate: form.fromDate,
      toDate: form.toDate,
      websiteFor: form.websiteFor,
      theaters: form.theaters ? form.theaters.map(t => t.value) : [],
      slots: form.slots ? form.slots.map(s => s.value) : [],
      days: form.days ? form.days.map(d => d.value) : [],
      discountType: form.discountType,
      value: form.value,
      hide: form.hide === "yes" ? true : false, // Convert to boolean for backend
    }

    console.log("Sending data to backend:", dataArray)

    axios
      .post(URLS.AddCoupon, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            getAllbcoupons()
            clearForm()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong")
          }
        }
      )
  }

  const getpopup = data => {
    // Convert array data to select options format
    const formattedData = {
      ...data,
      theaters: data.theaters
        ? data.theaters.map(t => ({
          value: t._id,
          label: t.name
        }))
        : [],
      slots: data.slots ? data.slots.map(s => ({ value: s, label: s })) : [],
      days: data.days ? data.days.map(d => ({ value: d, label: d })) : [],
      hide: data.hide ? "yes" : "no", // Convert boolean to "yes"/"no"
    }
    setform1(formattedData)
    tog_small()
  }

  const editcoupon = () => {
    var token = datas
    var formid = form1._id
    const dataArray = {
      title: form1.title,
      couponCode: form1.couponCode,
      couponCodeType: form1.couponCodeType,
      amount: form1.amount,
      description: form1.description,
      fromDate: form1.fromDate,
      toDate: form1.toDate,
      websiteFor: form1.websiteFor,
      theaters: form1.theaters ? form1.theaters.map(t => t.value) : [],
      slots: form1.slots ? form1.slots.map(s => s.value) : [],
      days: form1.days ? form1.days.map(d => d.value) : [],
      discountType: form1.discountType,
      value: form1.value,
      hide: form1.hide === "yes" ? true : false, // Convert to boolean for backend
    }

    console.log("Updating data to backend:", dataArray)

    axios
      .put(URLS.UpdateCoupon + "/" + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            getAllbcoupons()
            setmodal_small(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong")
          }
        }
      )
  }

  const handleSubmit = e => {
    e.preventDefault()
    addcoupons()
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    editcoupon()
  }

  const deletebenners = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteCoupon + "/" + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            getAllbcoupons()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong")
          }
        }
      )
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      deletebenners(data)
    }
  }

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = coup.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(coup.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  useEffect(() => {
    getAllbcoupons()
    fetchTheaters()
  }, [])

  const clearForm = () => {
    setform({
      theaters: [],
      slots: [],
      days: [],
      discountType: "",
      value: "",
      title: "",
      couponCode: "",
      couponCodeType: "",
      amount: "",
      description: "",
      fromDate: "",
      toDate: "",
      websiteFor: "",
      hide: "no",
    })
  }

  const [search, setsearch] = useState("")

  const searchAll = e => {
    const searchValue = e.target.value
    setsearch(searchValue)

    var token = datas
    axios
      .post(
        URLS.GeCouponSearch + searchValue,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setcoup(res.data.coupons)
      })
      .catch(error => {
        console.error("Error searching coupons:", error)
      })
  }

  const [dds, setdds] = useState("")

  const handleChangedates = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    if (e.target.value) {
      const tomorrow = new Date(e.target.value)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setdds(tomorrow.toISOString().split("T")[0])
    }
  }

  const [dds1, setdds1] = useState("")

  const handleChangedates1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)

    if (e.target.value) {
      const tomorrow = new Date(e.target.value)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setdds1(tomorrow.toISOString().split("T")[0])
    }
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  // Helper function to display arrays as badges
  const renderArrayAsBadges = (array, maxItems = 2) => {
    if (!array || array.length === 0) return "None"

    const displayArray = array.map(item =>
      typeof item === 'object' && item.name ? item.name : item
    )

    if (displayArray.length <= maxItems) {
      return displayArray.map((item, index) => (
        <Badge key={index} color="primary" className="me-1 mb-1">
          {item}
        </Badge>
      ))
    }

    return (
      <>
        {displayArray.slice(0, maxItems).map((item, index) => (
          <Badge key={index} color="primary" className="me-1 mb-1">
            {item}
          </Badge>
        ))}
        <Badge color="info" className="mb-1">
          +{displayArray.length - maxItems} more
        </Badge>
      </>
    )
  }

  // Helper function to render hide badge
  const renderHideBadge = (hide) => {
    return hide ? (
      <Badge color="warning" className="badge-soft-warning">Yes (Hidden)</Badge>
    ) : (
      <Badge color="success" className="badge-soft-success">No (Visible)</Badge>
    )
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Coupons" />
          <Row>
            {Roles?.CouponsAdd || Roles?.accessAll === true ? (
              <>
                <Col md={4}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Add Coupon</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <Label for="title">
                            Title <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Enter Title"
                            required
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <Label for="couponCode">
                            Coupon Code <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="couponCode"
                            placeholder="Enter Coupon Code"
                            required
                            name="couponCode"
                            value={form.couponCode}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <Label for="couponCodeType">
                            Coupon Code Type
                            <span className="text-danger">*</span>
                          </Label>
                          <select
                            name="couponCodeType"
                            value={form.couponCodeType}
                            onChange={handleChange}
                            required
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Price">Price</option>
                            <option value="Percentage">Percentage</option>
                          </select>
                        </div>
                        {form.couponCodeType === "Percentage" ? (
                          <div className="mb-3">
                            <Label for="amount">
                              Percentage % <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="amount"
                              placeholder="Enter Percentage"
                              required
                              name="amount"
                              value={form.amount}
                              onChange={handleChange}
                              min="0"
                              max="100"
                            />
                          </div>
                        ) : form.couponCodeType === "Price" ? (
                          <div className="mb-3">
                            <Label for="amount">
                              Price <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="amount"
                              placeholder="Enter Price"
                              required
                              name="amount"
                              value={form.amount}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        ) : null}

                        <div className="mb-3">
                          <Label for="websiteFor">
                            Website For <span className="text-danger">*</span>
                          </Label>
                          <select
                            name="websiteFor"
                            value={form.websiteFor}
                            onChange={handleChange}
                            required
                            className="form-select"
                          >
                            <option value="">Select Website</option>
                            <option value="carnivalcastle">Carnival Castle</option>
                            <option value="bingenjoy">Bingenjoy</option>
                            <option value="both">Both</option>
                          </select>
                        </div>

                        {/* Hide Dropdown */}
                        <div className="mb-3">
                          <Label for="hide">
                            Hide Coupon <span className="text-danger">*</span>
                          </Label>
                          <select
                            name="hide"
                            value={form.hide}
                            onChange={handleChange}
                            required
                            className="form-select"
                          >
                            {hideOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <small className="text-muted">
                            Select "Yes" to hide this coupon from users (still usable with code)
                          </small>
                        </div>

                        <div className="mb-3">
                          <Label>
                            Theaters (Optional)
                          </Label>
                          <Select
                            isMulti
                            options={theaterOptions}
                            value={form.theaters}
                            onChange={handleTheaterChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select theaters..."
                          />
                        </div>

                        <div className="mb-3">
                          <Label>
                            Time Slots (Optional)
                          </Label>
                          <Select
                            isMulti
                            options={slotOptions}
                            value={form.slots}
                            onChange={handleSlotChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select time slots..."
                          />
                        </div>

                        <div className="mb-3">
                          <Label>
                            Days (Optional)
                          </Label>
                          <Select
                            isMulti
                            options={dayOptions}
                            value={form.days}
                            onChange={handleDayChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select days..."
                          />
                        </div>

                        <div className="mb-3">
                          <Label>
                            Discount Type <span className="text-danger">*</span>
                          </Label>
                          <Select
                            options={discountTypeOptions}
                            value={discountTypeOptions.find(option => option.value === form.discountType) || null}
                            onChange={handleDiscountTypeChange}
                            className="basic-select"
                            classNamePrefix="select"
                            placeholder="Select discount type..."
                          />
                        </div>

                        {form.discountType && (
                          <div className="mb-3">
                            <Label>
                              Discount Value <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type={form.discountType === "percentage" ? "number" : "text"}
                              className="form-control"
                              placeholder={
                                form.discountType === "percentage"
                                  ? "Enter percentage (e.g., 10)"
                                  : form.discountType === "fixed"
                                    ? "Enter fixed amount (e.g., 5.00)"
                                    : "Enter number of free tickets"
                              }
                              required
                              name="value"
                              value={form.value}
                              onChange={handleChange}
                              min={form.discountType === "percentage" ? 0 : undefined}
                              max={form.discountType === "percentage" ? 100 : undefined}
                              step={form.discountType === "percentage" ? 1 : 0.01}
                            />
                          </div>
                        )}

                        <div className="mb-3">
                          <Label for="fromDate">
                            From Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            className="form-control"
                            id="fromDate"
                            required
                            name="fromDate"
                            min={new Date().toISOString().split("T")[0]}
                            value={form.fromDate}
                            onChange={handleChangedates}
                          />
                        </div>
                        <div className="mb-3">
                          <Label for="toDate">
                            Expire Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            className="form-control"
                            id="toDate"
                            placeholder="Enter Expire Date"
                            required
                            name="toDate"
                            min={dds}
                            value={form.toDate}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <Label for="description">
                            Description
                          </Label>
                          <textarea
                            rows={2}
                            className="form-control"
                            id="description"
                            placeholder="Enter Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div style={{ float: "right" }}>
                          <Button className="m-1" color="primary" type="submit">
                            Submit <i className="fas fa-check-circle"></i>
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </>
            ) : null}

            <Col md={Roles?.CouponsAdd || Roles?.accessAll === true ? 8 : 12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Coupons List</CardTitle>
                </CardHeader>

                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <div style={{ float: "right", marginBottom: "10px" }}>
                        <Input
                          type="search"
                          className="form-control"
                          placeholder="Search.."
                          value={search}
                          onChange={searchAll}
                          name="search"
                          style={{ width: "250px" }}
                        />
                      </div>
                      <Table className="table table-bordered mb-4">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Coupon Code</th>
                            <th>Coupon Type</th>
                            <th>Discount Type</th>
                            <th>Website For</th>
                            <th>Hide Status</th>
                            <th>Theaters</th>
                            <th>Time Slots</th>
                            <th>Days</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th style={{ width: "100px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.length > 0 ? (
                            lists.map((data, key) => (
                              <tr key={data._id || key}>
                                <th>{(pageNumber) * 5 + key + 1}</th>
                                <td>{data.title}</td>
                                <td>{data.couponCode}</td>
                                <td>{data.couponCodeType}</td>
                                <td>
                                  {data.discountType} {data.value && `(${data.value}${data.discountType === "percentage" ? "%" : data.discountType === "fixed" ? "₹" : ""})`}
                                </td>
                                <td>{data.websiteFor}</td>
                                <td>{renderHideBadge(data.hide)}</td>
                                <td>{renderArrayAsBadges(data.theaters)}</td>
                                <td>{renderArrayAsBadges(data.slots)}</td>
                                <td>{renderArrayAsBadges(data.days)}</td>
                                <td>{data.fromDate}</td>
                                <td>{data.toDate}</td>

                                <td>
                                  {Roles?.CouponsEdit || Roles?.accessAll === true ? (
                                    <Button
                                      onClick={() => {
                                        getpopup(data)
                                      }}
                                      className="mr-2"
                                      style={{ padding: "6px", margin: "3px" }}
                                      color="success"
                                      outline
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                  ) : null}
                                  {Roles?.CouponsDelete || Roles?.accessAll === true ? (
                                    <Button
                                      onClick={() => {
                                        manageDelete(data)
                                      }}
                                      style={{ padding: "6px", margin: "3px" }}
                                      color="danger"
                                      outline
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  ) : null}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="13" className="text-center">
                                No coupons found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      {pageCount > 1 && (
                        <div className="mt-3" style={{ float: "right" }}>
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"pagination"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"disabled"}
                            activeClassName={"active"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />

        <Modal
          size="lg"
          isOpen={modal_small}
          toggle={tog_small}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Coupon
            </h5>
            <button
              onClick={() => {
                setmodal_small(false)
              }}
              type="button"
              className="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSubmit1}>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="edit-title">
                      Title <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="edit-title"
                      placeholder="Enter Title"
                      required
                      name="title"
                      value={form1.title}
                      onChange={handleChange1}
                    />
                  </div>
                  <div className="mb-3">
                    <Label for="edit-couponCodeType">
                      Coupon Code Type<span className="text-danger">*</span>
                    </Label>
                    <select
                      name="couponCodeType"
                      value={form1.couponCodeType}
                      onChange={handleChange1}
                      className="form-select"
                    >
                      <option value="Price">Price</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <Label for="edit-websiteFor">
                      Website For <span className="text-danger">*</span>
                    </Label>
                    <select
                      name="websiteFor"
                      value={form1.websiteFor}
                      onChange={handleChange1}
                      required
                      className="form-select"
                    >
                      <option value="carnivalcastle">Carnival Castle</option>
                      <option value="bingenjoy">Bingenjoy</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  {/* Hide Dropdown in Edit Modal */}
                  <div className="mb-3">
                    <Label for="edit-hide">
                      Hide Coupon <span className="text-danger">*</span>
                    </Label>
                    <select
                      name="hide"
                      value={form1.hide}
                      onChange={handleChange1}
                      required
                      className="form-select"
                    >
                      {hideOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Select "Yes" to hide this coupon from users (still usable with code)
                    </small>
                  </div>

                  <div className="mb-3">
                    <Label>
                      Theaters (Optional)
                    </Label>
                    <Select
                      isMulti
                      options={theaterOptions}
                      value={form1.theaters}
                      onChange={handleTheaterChange1}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select theaters..."
                    />
                  </div>

                  <div className="mb-3">
                    <Label>
                      Time Slots (Optional)
                    </Label>
                    <Select
                      isMulti
                      options={slotOptions}
                      value={form1.slots}
                      onChange={handleSlotChange1}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select time slots..."
                    />
                  </div>

                  <div className="mb-3">
                    <Label>
                      Days (Optional)
                    </Label>
                    <Select
                      isMulti
                      options={dayOptions}
                      value={form1.days}
                      onChange={handleDayChange1}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select days..."
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label for="edit-couponCode">
                      Coupon Code <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="edit-couponCode"
                      placeholder="Enter Coupon Code"
                      required
                      name="couponCode"
                      value={form1.couponCode}
                      onChange={handleChange1}
                    />
                  </div>

                  {form1.couponCodeType === "Percentage" ? (
                    <div className="mb-3">
                      <Label for="edit-amount">
                        Percentage % <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="edit-amount"
                        placeholder="Enter Percentage"
                        required
                        name="amount"
                        value={form1.amount}
                        onChange={handleChange1}
                        min="0"
                        max="100"
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <Label for="edit-amount">
                        Price <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="edit-amount"
                        placeholder="Enter Price"
                        required
                        name="amount"
                        value={form1.amount}
                        onChange={handleChange1}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <Label>
                      Discount Type <span className="text-danger">*</span>
                    </Label>
                    <Select
                      options={discountTypeOptions}
                      value={discountTypeOptions.find(option => option.value === form1.discountType) || null}
                      onChange={handleDiscountTypeChange1}
                      className="basic-select"
                      classNamePrefix="select"
                      placeholder="Select discount type..."
                    />
                  </div>

                  {form1.discountType && (
                    <div className="mb-3">
                      <Label>
                        Discount Value <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type={form1.discountType === "percentage" ? "number" : "text"}
                        className="form-control"
                        placeholder={
                          form1.discountType === "percentage"
                            ? "Enter percentage (e.g., 10)"
                            : form1.discountType === "fixed"
                              ? "Enter fixed amount (e.g., 5.00)"
                              : "Enter number of free tickets"
                        }
                        required
                        name="value"
                        value={form1.value}
                        onChange={handleChange1}
                        min={form1.discountType === "percentage" ? 0 : undefined}
                        max={form1.discountType === "percentage" ? 100 : undefined}
                        step={form1.discountType === "percentage" ? 1 : 0.01}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <Label for="edit-fromDate">
                      From Date <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="edit-fromDate"
                      required
                      name="fromDate"
                      value={form1.fromDate}
                      onChange={handleChangedates1}
                    />
                  </div>

                  <div className="mb-3">
                    <Label for="edit-toDate">
                      Expire Date <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="edit-toDate"
                      placeholder="Enter Expire Date"
                      required
                      name="toDate"
                      min={dds1}
                      value={form1.toDate}
                      onChange={handleChange1}
                    />
                  </div>

                  <div className="mb-3">
                    <Label for="edit-description">Description</Label>
                    <textarea
                      className="form-control"
                      id="edit-description"
                      placeholder="Enter Description"
                      name="description"
                      value={form1.description}
                      onChange={handleChange1}
                      rows="2"
                    />
                  </div>
                </Col>
              </Row>

              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small(false)
                  }}
                  color="danger"
                  type="button"
                  className="me-2"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default Coupons