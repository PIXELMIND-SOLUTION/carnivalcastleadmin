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
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import axios from "axios"
import ReactPaginate from "react-paginate"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"

const Staff = () => {
  const [show, setshow] = useState(false)
  const [show1, setshow1] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookingStats, setBookingStats] = useState({})
  const [theaterLocations, setTheaterLocations] = useState([])

  const toggle = () => setshow1(!show1)
  const toggleWithdrawModal = () => setWithdrawModal(!withdrawModal)

  const [form, setform] = useState({
    email: "",
    phone: "",
    password: "",
    departmentId: "",
    roleId: "",
    name: "",
    address: "",
    assignedTheaterId: ""
  })
  const [users, setusers] = useState([])
  const [form1, setform1] = useState({})
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', remarks: '' })

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

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

  const handleWithdrawChange = e => {
    setWithdrawForm({
      ...withdrawForm,
      [e.target.name]: e.target.value
    })
  }

  const [Files, setFiles] = useState("")
  const [Files1, setFiles1] = useState("")

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("File format not supported. Please choose JPG, JPEG, or PNG.")
    }
  }
  
  const changeHandler1 = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles1(e.target.files)
    } else {
      e.target.value = null
      toast("File format not supported. Please choose JPG, JPEG, or PNG.")
    }
  }

  // Fetch theater locations
  const fetchTheaterLocations = () => {
    var token = datas
    axios
      .get("https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.data.success) {
          setTheaterLocations(res.data.data)
        }
      })
      .catch(error => {
        console.error("Error fetching theater locations:", error)
      })
  }

  const Get = () => {
    setLoading(true)
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
        setusers(res.data.staff)
        // Fetch booking stats for each staff
        fetchBookingStats(res.data.staff)
      })
      .catch(error => {
        setLoading(false)
        console.error("Error fetching staff:", error)
      })
  }

  const fetchBookingStats = (staffList) => {
    var token = datas
    const stats = {}
    let completedRequests = 0
    
    staffList.forEach(staff => {
      axios
        .post(
          URLS.GetStaffBookingsStats + staff._id,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(res => {
          completedRequests++
          stats[staff._id] = res.data.Data || {
            PendingBookings: 0,
            CompletedBookings: 0,
            CancelledBookings: 0
          }
          
          // When all requests are completed
          if (completedRequests === staffList.length) {
            setBookingStats(stats)
            setLoading(false)
          }
        })
        .catch(error => {
          completedRequests++
          stats[staff._id] = {
            PendingBookings: 0,
            CompletedBookings: 0,
            CancelledBookings: 0
          }
          
          if (completedRequests === staffList.length) {
            setBookingStats(stats)
            setLoading(false)
          }
        })
    })
  }

  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const token = datas
    axios
      .post(
        URLS.GetStaffSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.staff)
            fetchBookingStats(res.data.staff)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const Add = () => {
    var token = datas

    const dataArray = new FormData()
    dataArray.append("email", form.email)
    dataArray.append("phone", form.phone)
    dataArray.append("password", form.password)
    dataArray.append("departmentId", form.departmentId)
    dataArray.append("roleId", form.roleId)
    dataArray.append("name", form.name)
    dataArray.append("address", form.address)
    dataArray.append("assignedTheaterId", form.assignedTheaterId)

    for (let i = 0; i < Files.length; i++) {
      dataArray.append("profilepic", Files[i])
    }

    axios
      .post(URLS.AddStaff, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setform({
              email: "",
              phone: "",
              password: "",
              departmentId: "",
              roleId: "",
              name: "",
              address: "",
              assignedTheaterId: ""
            })
            setFiles({ profilepic: "" })
            Get()
            setshow(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  const formsubmit = e => {
    e.preventDefault()
    Add()
  }

  const Update = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("email", form1.email)
    dataArray.append("phone", form1.phone)
    dataArray.append("password", form1.password || "")
    dataArray.append("departmentId", form1.departmentId)
    dataArray.append("roleId", form1.roleId)
    dataArray.append("name", form1.name)
    dataArray.append("address", form1.address)
    dataArray.append("assignedTheaterId", form1.assignedTheaterId)
    
    if (Files1.length > 0) {
      for (let i = 0; i < Files1.length; i++) {
        dataArray.append("profilepic", Files1[i])
      }
    }
    
    axios
      .put(URLS.EditStaff + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            Get()
            setshow1(false)
            setFiles1({ profilepic: "" })
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  const formeditsubmit = e => {
    e.preventDefault()
    Update()
  }

  const usedata = datal => {
    setshow1(true)
    setform1(datal)
  }

  const handleWithdrawRequest = staff => {
    setSelectedStaff(staff)
    setWithdrawForm({ amount: '', remarks: '' })
    setWithdrawModal(true)
  }

  const submitWithdrawRequest = () => {
    if (!withdrawForm.amount || withdrawForm.amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    
    if (withdrawForm.amount > selectedStaff.walletBalance) {
      toast.error("Withdrawal amount cannot exceed wallet balance")
      return
    }
    
    // API call would go here
    toast.success(`Withdrawal request of ₹${withdrawForm.amount} submitted for ${selectedStaff.name}`)
    setWithdrawModal(false)
  }

  useEffect(() => {
    Get()
    GetRoles()
    fetchTheaterLocations()
  }, [])

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = datau => {
    var token = datas
    var remid = datau._id
    axios
      .delete(URLS.DeleteStaff + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
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

  const [dep, setdep] = useState([])

  useEffect(() => {
    Getalldep()
  }, [])

  const Getalldep = () => {
    var token = datas
    axios
      .post(
        URLS.GetDepartment,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          setdep(res.data.departments)
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }
  
  const [role, setrole] = useState([])

  const Optionchangess = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const GetRoles = () => {
    var token = datas
    axios
      .post(
        URLS.GetRole,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setrole(res.data.roles)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Staff Management" />
          
          <Row className="mb-3">
            <Col>
              <Card>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Staff Management</h4>
                  <div>
                    <Button color="success" className="me-2" onClick={() => setshow(!show)}>
                      <i className="bx bx-user-plus me-1"></i> Add New Staff
                    </Button>
                    <Button color="info" className="me-2" onClick={() => toast.info("Export feature coming soon")}>
                      <i className="bx bx-export me-1"></i> Export
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
              {show == true ? (
                <Card className="p-4">
                  <Form onSubmit={formsubmit}>
                    <h5 className="mb-3">Add New Staff</h5>
                    <Row>
                      <Col md="3">
                        <Label>Employee Name<span className="text-danger">*</span></Label>
                        <Input
                          onChange={handleChange}
                          name="name"
                          value={form.name}
                          required
                          type="text"
                          placeholder="Enter Employee Name"
                        />
                      </Col>
                      <Col md="3">
                        <Label>Email Id<span className="text-danger">*</span></Label>
                        <Input
                          name="email"
                          onChange={handleChange}
                          value={form.email}
                          required
                          type="email"
                          placeholder="Enter Email"
                        />
                      </Col>
                      <Col md="3">
                        <Label>Mobile No<span className="text-danger">*</span></Label>
                        <Input
                          name="phone"
                          onChange={handleChange}
                          value={form.phone}
                          required
                          type="text"
                          minLength="10"
                          maxLength="10"
                          pattern="[0-9]+"
                          placeholder="Enter Mobile No"
                          onKeyPress={e => {
                            const charCode = e.which ? e.which : e.keyCode
                            if (charCode < 48 || charCode > 57) {
                              e.preventDefault()
                            }
                          }}
                        />
                      </Col>
                      <Col md="3">
                        <Label>Password<span className="text-danger">*</span></Label>
                        <Input
                          name="password"
                          onChange={handleChange}
                          type="text"
                          value={form.password}
                          required
                          placeholder="Enter password"
                        />
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Employee Image <span className="text-danger">260 * 190</span></Label>
                          <Input
                            type="file"
                            required
                            name="profilepic"
                            onChange={changeHandler}
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Department<span className="text-danger">*</span></Label>
                          <select
                            value={form.departmentId}
                            name="departmentId"
                            required
                            onChange={Optionchangess}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {dep.map((data, key) => (
                              <option key={key} value={data._id}>
                                {data.departmentName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Roles<span className="text-danger">*</span></Label>
                          <select
                            name="roleId"
                            onChange={handleChange}
                            value={form.roleId}
                            required
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {role.map((data, key) => (
                              <option key={key} value={data._id}>
                                {data.roleName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Assign Location</Label>
                          <select
                            name="assignedTheaterId"
                            onChange={handleChange}
                            value={form.assignedTheaterId}
                            className="form-select"
                          >
                            <option value="">Select Theater Location</option>
                            {theaterLocations.map((location, key) => (
                              <option key={key} value={location._id}>
                                {location.name} - {location.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Address<span className="text-danger">*</span></Label>
                          <textarea
                            onChange={handleChange}
                            name="address"
                            required
                            rows={1}
                            value={form.address}
                            placeholder="Enter Address"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button type="submit" color="success m-1" outline>
                        Submit <i className="bx bx-check-circle"></i>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setshow(!show)}
                        color="danger m-1"
                        outline
                      >
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              ) : (
                ""
              )}
              <Card>
                <CardBody>
                  <Row>
                    {Roles.staffAdd || Roles?.accessAll === true ? (
                      <Col>
                        <Button onClick={() => setshow(!show)} color="primary">
                          New Staff <i className="bx bx-user-plus"></i>
                        </Button>
                      </Col>
                    ) : ""}
                    
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={custsearch}
                          type="search"
                          placeholder="Search staff..."
                        />
                      </div>
                    </Col>
                  </Row>
                  
                  {loading && (
                    <div className="text-center my-4">
                      <Spinner color="primary" />
                      <p className="mt-2">Loading staff data...</p>
                    </div>
                  )}
                  
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
                        <tr>
                          <th>Sl.No</th>
                          <th>Employee Image</th>
                          <th>Employee Name</th>
                          <th>Email</th>
                          <th>Mobile No</th>
                          <th>Department</th>
                          <th>Role</th>
                          <th>Assigned Location</th>
                          <th>Total Bookings</th>
                          <th>Pending</th>
                          <th>Completed</th>
                          <th>Cancelled</th>
                          <th>Success Rate</th>
                          <th>Wallet Balance</th>
                          <th>Upsells</th>
                          <th>Address</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => {
                          const stats = bookingStats[data._id] || {
                            PendingBookings: 0,
                            CompletedBookings: 0,
                            CancelledBookings: 0
                          }
                          
                          const totalBookings = stats.PendingBookings + stats.CompletedBookings + stats.CancelledBookings
                          const successRate = totalBookings > 0 
                            ? Math.round((stats.CompletedBookings / totalBookings) * 100) 
                            : 0
                          
                          return (
                            <tr key={key}>
                              <th scope="row">{(pageNumber) * listPerPage + key + 1}</th>
                              <td>
                                <img
                                  src={URLS.Base + data.profilepic}
                                  width="60px"
                                  height="60px"
                                  alt={data.name}
                                  style={{objectFit: 'cover', borderRadius: '5px'}}
                                />
                              </td>
                              <td>{data.name}</td>
                              <td>{data.email}</td>
                              <td>{data.phone}</td>
                              <td>{data.departmentName}</td>
                              <td>{data.roleName}</td>
                              <td>
                                {data.assignedTheaterName ? (
                                  <span className="badge bg-info">{data.assignedTheaterName}</span>
                                ) : (
                                  <span className="badge bg-secondary">Not Assigned</span>
                                )}
                              </td>
                              <td className="text-center">
                                <span className="badge bg-primary">{totalBookings}</span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-warning">{stats.PendingBookings}</span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-success">{stats.CompletedBookings}</span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-danger">{stats.CancelledBookings}</span>
                              </td>
                              <td className="text-center">
                                <span className={`badge ${
                                  successRate >= 70 ? 'bg-success' : 
                                  successRate >= 50 ? 'bg-warning' : 'bg-danger'
                                }`}>
                                  {successRate}%
                                </span>
                              </td>
                              <td>₹{data.walletBalance || 0}</td>
                              <td>{data.upsells || 0}</td>
                              <td>{data.address}</td>
                              <td>
                                <div className="d-flex flex-wrap">
                                  {Roles.staffEdit || Roles?.accessAll === true ? (
                                    <Button
                                      onClick={() => usedata(data)}
                                      className="m-1 btn-sm"
                                      color="success"
                                      outline
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                  ) : ''}
                                  {Roles.staffDelete || Roles?.accessAll === true ? (
                                    <Button
                                      className="m-1 btn-sm"
                                      color="danger"
                                      onClick={() => manageDelete(data)}
                                      outline
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  ) : ''}
                                  <Button
                                    className="m-1 btn-sm"
                                    color="primary"
                                    onClick={() => handleWithdrawRequest(data)}
                                    outline
                                    disabled={!data.walletBalance || data.walletBalance <= 0}
                                  >
                                    <i className="bx bx-wallet"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                    
                    {users.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No staff members found</p>
                      </div>
                    )}
                    
                    <Col sm="12">
                      <div className="d-flex mt-3 mb-1" style={{ float: "right" }}>
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
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
      
      {/* Edit Staff Modal */}
      <Modal size="lg" isOpen={show1} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Edit Staff Details</ModalHeader>
        <ModalBody>
          <Form onSubmit={formeditsubmit}>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label>Employee Name<span className="text-danger">*</span></Label>
                  <Input
                    name="name"
                    onChange={handleChange1}
                    value={form1.name}
                    required
                    type="text"
                    placeholder="Enter Employee Name"
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Email Id<span className="text-danger">*</span></Label>
                  <Input
                    name="email"
                    onChange={handleChange1}
                    value={form1.email}
                    required
                    type="email"
                    placeholder="Enter Email"
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Mobile No<span className="text-danger">*</span></Label>
                  <Input
                    name="phone"
                    onChange={handleChange1}
                    value={form1.phone}
                    required
                    type="text"
                    minLength="10"
                    maxLength="10"
                    pattern="[0-9]+"
                    placeholder="Enter Mobile No"
                    onKeyPress={e => {
                      const charCode = e.which ? e.which : e.keyCode
                      if (charCode < 48 || charCode > 57) {
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Employee Image <span className="text-danger">260 * 190</span></Label>
                  <Input
                    type="file"
                    name="profilepic"
                    onChange={changeHandler1}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Department<span className="text-danger">*</span></Label>
                  <select
                    value={form1.departmentId}
                    name="departmentId"
                    required
                    onChange={handleChange1}
                    className="form-select"
                  >
                    <option value="">Select</option>
                    {dep.map((data, key) => (
                      <option key={key} value={data._id}>
                        {data.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Roles<span className="text-danger">*</span></Label>
                  <select
                    name="roleId"
                    onChange={handleChange1}
                    value={form1.roleId}
                    required
                    className="form-select"
                  >
                    <option value="">Select</option>
                    {role.map((data, key) => (
                      <option key={key} value={data._id}>
                        {data.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Assigned Location</Label>
                  <select
                    name="assignedTheaterId"
                    onChange={handleChange1}
                    value={form1.assignedTheaterId}
                    className="form-select"
                  >
                    <option value="">Select Theater Location</option>
                    {theaterLocations.map((location, key) => (
                      <option key={key} value={location._id}>
                        {location.name} - {location.city}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>Address<span className="text-danger">*</span></Label>
                  <textarea
                    onChange={handleChange1}
                    name="address"
                    required
                    rows={1}
                    value={form1.address}
                    placeholder="Enter Address"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label>New Password (Optional)</Label>
                  <Input
                    name="password"
                    onChange={handleChange1}
                    type="password"
                    value={form1.password}
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button type="submit" color="success m-1" outline>
                Submit <i className="bx bx-check-circle"></i>
              </Button>
              <Button
                type="button"
                onClick={toggle}
                color="danger m-1"
                outline
              >
                Cancel <i className="bx bx-x-circle"></i>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      
      {/* Withdraw Request Modal */}
      <Modal isOpen={withdrawModal} toggle={toggleWithdrawModal} centered>
        <ModalHeader toggle={toggleWithdrawModal}>
          Withdraw Request for {selectedStaff?.name}
        </ModalHeader>
        <ModalBody>
          <Form>
            <div className="mb-3">
              <Label>Wallet Balance: ₹{selectedStaff?.walletBalance || 0}</Label>
            </div>
            <div className="mb-3">
              <Label>Amount to Withdraw</Label>
              <Input
                type="number"
                name="amount"
                value={withdrawForm.amount}
                onChange={handleWithdrawChange}
                placeholder="Enter amount"
                max={selectedStaff?.walletBalance || 0}
              />
            </div>
            <div className="mb-3">
              <Label>Remarks</Label>
              <Input
                type="textarea"
                name="remarks"
                value={withdrawForm.remarks}
                onChange={handleWithdrawChange}
                placeholder="Enter remarks (optional)"
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleWithdrawModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={submitWithdrawRequest}>
            Submit Request
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default Staff