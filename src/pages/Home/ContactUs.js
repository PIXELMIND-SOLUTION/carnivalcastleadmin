import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Table,
  Label,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

function DigitalBrochure() {
  const [files, setFiles] = useState([])

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (
      type == "jpg" ||
      type == "jpeg" ||
      type == "png" ||
      type == "JPG" ||
      type == "JPEG" ||
      type == "PNG" ||
      type == "JPEG" ||
      type == "WEBP" ||
      type == "webp"
    ) {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported.Pls choose Image")
    }
  }

  const [form, setform] = useState([])

  const [forms, setforms] = useState([])

  const handlechange = e => {
    const myform = { ...forms }
    myform[e.target.name] = e.target.value
    setforms(myform)
  }

  useEffect(() => {
    GetAllBroucher()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetAllBroucher = () => {
    var token = datas

    axios
      .post(
        URLS.GetContactUs,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.contactus)
        setforms(res.data.contactus)
      })
  }
  const [modal_small, setmodal_small] = useState(false)
  function tog_small() {
    setmodal_small(!modal_small)
  }

  const getpopup1 = () => {
    tog_small()
  }

  const submibooking = e => {
    e.preventDefault()

    changstatus()
  }

  const changstatus = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("email", forms.email)
    dataArray.append("phone", forms.phone)
    dataArray.append("toTime", forms.toTime)
    dataArray.append("twitter", forms.twitter)
    dataArray.append("youtube", forms.youtube)
    dataArray.append("address", forms.address)
    dataArray.append("fromTime", forms.fromTime)
    dataArray.append("facebook", forms.facebook)
    dataArray.append("instagram", forms.instagram)
    dataArray.append("description", forms.description)
    dataArray.append("phoneNumber", forms.phoneNumber)
    dataArray.append("map", forms.map)

    for (let i = 0; i < files.length; i++) {
      dataArray.append("logo", files[i])
    }

    axios
      .put(URLS.UpdatContactUs, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small(false)
            GetAllBroucher()
            setIsLoading(true)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
            setIsLoading(false)
          }
        }
      )
  }

  var gets = localStorage.getItem("authUser")

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Contact Us"
          />

          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row>
                    <Col>
                      <div style={{ float: "right" }}>
                      {Roles?.SettingsEdit == true ||
                            Roles?.accessAll == true ? (
                              <>
                        <Button
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit Booking"
                          onClick={() => {
                            getpopup1(form)
                          }}
                          className="mr-5 mb-1 m-1 mt-3"
                          color="success"
                          outline
                        >
                          <i className="bx bx-edit text-dark "></i>
                          <span>Edit Contact Us</span>
                        </Button>
                        </>
                            ) : (
                              ""
                            )}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <Row>
                    <div>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr >
                              <th>Email </th>
                              <td>{form.email}</td>
                            </tr>

                            <tr >
                              <th>About </th>
                              <td>{form.description}</td>
                            </tr>

                            <tr >
                              <th>Address </th>
                              <td>{form.address}</td>
                            </tr>

                            <tr >
                              <th>Contact Number</th>
                              <td>{form.phone}</td>
                            </tr>

                            <tr >
                              <th>Facebook Link</th>
                              <td>{form.facebook}</td>
                            </tr>

                            <tr >
                              <th>Twitter Link</th>
                              <td>{form.twitter}</td>
                            </tr>

                            <tr >
                              <th>Instagram Link</th>
                              <td>{form.instagram}</td>
                            </tr>

                            <tr >
                              <th>Youtube Link</th>
                              <td>{form.youtube}</td>
                            </tr>

                            <tr >
                              <th>Map Url</th>
                              <td>{form.map}</td>
                            </tr>

                            <tr >
                              <th>Logo</th>
                              <td>
                                <img
                                  src={URLS.Base + form.logo}
                                  width="100px"
                                ></img>
                              </td>
                            </tr>
                          </thead>
                        </Table>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            size="lg"
            isOpen={modal_small}
            toggle={() => {
              tog_small()
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="mySmallModalLabel">
                Edit Contact Us{" "}
              </h5>{" "}
              <button
                onClick={() => {
                  setmodal_small(false)
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                onSubmit={e => {
                  submibooking(e)
                }}
              >
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Email <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Email"
                        value={forms.email}
                        name="email"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Contact Number <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Contact Number"
                        value={forms.phone}
                        name="phone"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Facebook Link <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Facebook Link"
                        value={forms.facebook}
                        name="facebook"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Twitter Link<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Twitter Link"
                        value={forms.twitter}
                        name="twitter"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Instagram Link <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Instagram Link"
                        value={forms.instagram}
                        name="instagram"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Youtube Link <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Youtube Link"
                        value={forms.youtube}
                        name="youtube"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Logo <span className="text-danger">* 400*600</span>
                      </Label>
                      <Input
                        type="file"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        name="logo"
                        value={files.logo}
                        onChange={changeHandler}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Map Url <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        rows="1"
                        className="form-control "
                        id="basicpill-firstname-input1"
                        placeholder="Enter Map Url"
                        value={forms.map}
                        name="map"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>{" "}
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        About <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        rows="3"
                        className="form-control "
                        id="basicpill-firstname-input1"
                        placeholder="Enter About"
                        value={forms.description}
                        name="description"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>{" "}
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Address <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        rows="3"
                        className="form-control "
                        id="basicpill-firstname-input1"
                        placeholder="Enter Address"
                        value={forms.address}
                        name="address"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>{" "}
                  </Col>
                </Row>
                <hr></hr>
                <div style={{ float: "right" }} className="m-2">
                  <Button className="m-1" color="primary" type="submit">
                    Submit <i className="fas fa-check-circle"></i>
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default DigitalBrochure
