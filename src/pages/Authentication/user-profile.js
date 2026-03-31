import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardText,
  FormGroup,
} from "reactstrap"
import classnames from "classnames"
import { ToastContainer, toast } from "react-toastify"
import pback from "../../assets/images/banner.jpg"
import { useSelector } from "react-redux"
import { withRouter } from "react-router-dom"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"
import { URLS } from "../../Url"

const UserProfile = () => {
  useEffect(() => {
    GetProfile()
  }, [])

  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  const [passwordType, setPasswordType] = useState("password")
  const [passwordType1, setPasswordType1] = useState("password")
  const [passwordType12, setPasswordType12] = useState("password")

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }
  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }))

  const [activeTab1, setactiveTab1] = useState("5")
  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab)
    }
  }

  const [admininfo, setadmininfo] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetProfile = () => {
    var token = datas

    axios
      .post(
        URLS.getProfile,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setadmininfo(res.data.profileResult)
        setform1(res.data.profileResult)
      })
  }

  const editprofiles = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("name", form1.name)
    dataArray.append("email", form1.email)
    dataArray.append("phone", form1.phone)
    dataArray.append("address", form1.address)

    axios
      .put(URLS.UpdateProfile, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetProfile()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const changepsw = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("password", form.old_password)
    dataArray.append("newpassword", form.new_password)
    dataArray.append("confirmpassword", form.confirm_password)

    axios
      .post(URLS.ChangePass, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetProfile()
            setform("")
            clearForm()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }
  const clearForm = () => {
    setform({
      old_password: "",
      new_password: "",
      confirm_password: "",
    })
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    editprofiles()
  }
  const handleSubmit = e => {
    e.preventDefault()
    changepsw()
  }

  const changeHandler = e => {
    const token = datas
    const dataArray = new FormData()
    for (let i = 0; i < e.target.files.length; i++) {
      dataArray.append("profilePic", e.target.files[i])
    }
    axios
      .put(
        URLS.UpdateImage,
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        {}
      )
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetProfile()
            window.location.reload()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text")
      return
    }
    setPasswordType("password")
  }

  const togglePassword1 = () => {
    if (passwordType1 === "password") {
      setPasswordType1("text")
      return
    }
    setPasswordType1("password")
  }

  const togglePassword12 = () => {
    if (passwordType12 === "password") {
      setPasswordType12("text")
      return
    }
    setPasswordType12("password")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Carnival Castle Admin" breadcrumbItem="Profile" />
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}
              <Card>
                <CardBody>
                  <div className="">
                    <Row>
                      <Col md={12}>
                        <div className="text-primary">
                          <h5 className="text-primary"></h5>
                          <p></p>
                        </div>
                        <img
                          style={{ height: "300px", width: "100%" }}
                          src={pback}
                          alt=""
                          className="img-fluid"
                        />
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col md={2}>
                        <Link to="#" className="auth-logo-light">
                          <div className="avatar-md1 profile-user-wid mb-4">
                            <span className="ml-5">
                              <img
                                src={URLS.Base + admininfo.profilePic}
                                className="avatar-md1 rounded-circle img-thumbnail"
                                style={{ height: "160px", width: "100%" }}
                              />
                            </span>
                          </div>
                        </Link>
                      </Col>
                      <Col md={4}>
                        <div className="mt-3">
                          <div className="row">
                            <div className="col-2">
                              <label>Name</label>
                              <br />
                              <label>Email </label>
                            </div>
                            <div className="col-10">
                              <label>: {admininfo.name}</label>
                              <br />
                              <label>: {admininfo.email}</label>
                              <br />
                            </div>
                          </div>
                          <Button
                            tag={Label}
                            className="mb-75 me-75 mt-3"
                            size="sm"
                            color="primary"
                          >
                            Upload <i className="fas fa-cloud-upload-alt"></i>
                            <Input
                              name="avatar"
                              type="file"
                              onChange={changeHandler}
                              hidden
                              accept="image/*"
                            />
                          </Button>
                          <p></p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mt-3">
                          <Nav pills className="navtab-bg nav-justified">
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "5",
                                })}
                                onClick={() => {
                                  toggle1("5")
                                }}
                              >
                                My Profile
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "6",
                                })}
                                onClick={() => {
                                  toggle1("6")
                                }}
                              >
                                Edit Profile
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "7",
                                })}
                                onClick={() => {
                                  toggle1("7")
                                }}
                              >
                                Change Password
                              </NavLink>
                            </NavItem>
                          </Nav>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
                <div className="mb-5">
                  <TabContent activeTab={activeTab1} className="p-3 text-muted">
                    <TabPane tabId="5">
                      <Row>
                        <Col sm="12">
                          <CardText className="mb-0">
                            <h5> About</h5>
                            <p>
                              <b>Welcome</b>
                            </p>
                            A personal profile is something that gives whoever
                            wants to hire you or needs your services the first
                            impression
                            <br /> that you are the best candidate for this
                            website.These sites take things to the next level.
                            <Row className="mt-4">
                              <Col md={8}>
                                <Row>
                                  <Col md={4}>
                                    <p>
                                      <b>User Name</b>
                                    </p>
                                    <p>
                                      <b>Email</b>
                                    </p>
                                    <p>
                                      <b>Phone</b>
                                    </p>
                                    <p>
                                      <b>Address</b>
                                    </p>
                                  </Col>
                                  <Col md={8}>
                                    <p>
                                      <b>:</b>
                                      <span> {admininfo.name}</span>
                                    </p>
                                    <p>
                                      <b>:</b>
                                      <span> {admininfo.email}</span>
                                    </p>
                                    <p>
                                      <b>:</b>
                                      <span> {admininfo.phone}</span>
                                    </p>

                                    <p>
                                      <b>:</b>
                                      <span> {admininfo.address}</span>
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={6}></Col>
                            </Row>
                          </CardText>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="6">
                      <form
                        onSubmit={e => {
                          handleSubmit1(e)
                        }}
                      >
                        <h5>Edit Profile</h5>
                        <Row>
                          <Col md={4} className="mb-3">
                            <Label>
                              User Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="name"
                              placeholder="Enter User Name"
                              type="text"
                              className="form-control"
                              value={form1.name}
                              onChange={e => {
                                handleChange1(e)
                              }}
                            />
                          </Col>
                          <Col md={4} className="mb-3">
                            <Label>
                              Email. <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="email"
                              placeholder="Enter Email"
                              type="email"
                              className="form-control"
                              value={form1.email}
                              onChange={e => {
                                handleChange1(e)
                              }}
                            />
                          </Col>
                          <Col md={4} className="mb-3">
                            <Label>
                              Phone. <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="phone"
                              placeholder="Enter Phone"
                              type="text"
                              minLength="10"
                              maxLength="10"
                              className="form-control"
                              value={form1.phone}
                              onChange={e => {
                                handleChange1(e)
                              }}
                            />
                          </Col>
                          <Col md={4}>
                            <Label>
                              Address <span className="text-danger">*</span>
                            </Label>
                            <textarea
                              name="address"
                              placeholder="Enter Address"
                              type="text"
                              className="form-control"
                              value={form1.address}
                              onChange={e => {
                                handleChange1(e)
                              }}
                            />
                          </Col>
                        </Row>
                        <div style={{ float: "right" }}>
                          <Button color="primary" type="submit">
                            Submit
                          </Button>
                        </div>
                      </form>
                    </TabPane>
                    <TabPane tabId="7">
                      <form
                        onSubmit={e => {
                          handleSubmit(e)
                        }}
                      >
                        <Row>
                          <Col sm="12">
                            <CardText className="mb-0">
                              <h5>Change Password</h5>
                              <Row className="mt-3">
                                <Col md="4">
                                  <FormGroup className="mb-3">
                                    <Label>
                                      Current Password{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <div className="input-group">
                                      <input
                                        name="old_password"
                                        placeholder="Current Password"
                                        className="form-control"
                                        required
                                        type={passwordType}
                                        value={form.old_password}
                                        onChange={e => {
                                          handleChange(e)
                                        }}
                                      />
                                      <div className="input-group-btn">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary"
                                          onClick={() => {
                                            togglePassword()
                                          }}
                                        >
                                          {passwordType === "password" ? (
                                            <i
                                              className="fa fa-eye-slash"
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <i
                                              className="fa fa-eye"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup className="mb-3">
                                    <Label>
                                      New Password{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <div className="input-group">
                                      <input
                                        name="new_password"
                                        placeholder="New Password"
                                        required
                                        type={passwordType1}
                                        className="form-control"
                                        value={form.new_password}
                                        onChange={e => {
                                          handleChange(e)
                                        }}
                                      />
                                      <div className="input-group-btn">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary"
                                          onClick={() => {
                                            togglePassword1()
                                          }}
                                        >
                                          {passwordType1 === "password" ? (
                                            <i
                                              className="fa fa-eye-slash"
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <i
                                              className="fa fa-eye"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup className="mb-3">
                                    <Label>
                                      Confirm Password{" "}
                                      <span className="text-danger">*</span>
                                    </Label>
                                    <div className="input-group">
                                      <input
                                        name="confirm_password"
                                        placeholder="Confirm Password"
                                        required
                                        type={passwordType12}
                                        className="form-control"
                                        value={form.confirm_password}
                                        onChange={e => {
                                          handleChange(e)
                                        }}
                                      />
                                      <div className="input-group-btn">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary"
                                          onClick={() => {
                                            togglePassword12()
                                          }}
                                        >
                                          {passwordType12 === "password" ? (
                                            <i
                                              className="fa fa-eye-slash"
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <i
                                              className="fa fa-eye"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </CardText>
                          </Col>
                        </Row>
                        <div style={{ float: "right" }}>
                          <Button color="primary" type="submit">
                            Submit
                          </Button>
                        </div>
                      </form>
                    </TabPane>
                    <TabPane tabId="8">
                      <Row>
                        <Col sm="12">
                          <CardText className="mb-0">
                            Trust fund seitan letterpress, keytar raw denim
                            keffiyeh etsy art party before they sold out master
                            cleanse gluten-free squid scenester freegan cosby
                            sweater. Fanny pack portland seitan DIY, art party
                            locavore wolf cliche high life echo park Austin.
                            Cred vinyl keffiyeh DIY salvia PBR, banh mi before
                            they sold out farm-to-table VHS viral locavore cosby
                            sweater. Lomo wolf viral, mustache readymade
                            thundercats keffiyeh craft beer marfa ethical. Wolf
                            salvia freegan, sartorial keffiyeh echo park vegan.
                          </CardText>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </Card>
            </Col>
          </Row>
          {/* </>
          )} */}
          <ToastContainer />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
