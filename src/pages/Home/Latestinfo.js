import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Label,
  Input,
  CardTitle,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

function DigitalBrochure() {
  const [inputList, setInputList] = useState([])

  const [show, setshow] = useState(false)

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
        URLS.GetLatestInfo,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.latestInfo)
        setforms(res.data.latestInfo)
        setInputList(res.data.latestInfo.count)
      })
  }

  function tog_small() {
    setshow(!show)
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

    const dataArray = {
      title: forms.title,
      count: inputList,
      toDate: forms.toDate,
      address: forms.address,
      fromDate: forms.fromDate,
      description: forms.description,
    }

    axios
      .put(URLS.UpdatLatestInfo, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow(false)
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  var gets = localStorage.getItem("authUser")

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const list = [...inputList]
    list[index][name] = value
    setInputList(list)
  }

  const handleRemoveClick = index => {
    const list = [...inputList]
    list.splice(index, 1)
    setInputList(list)
  }

  const handleAddClick = () => {
    setInputList([...inputList, { title: "", count: "" }])
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Latest Info"
          />
          {show == true ? (
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      submibooking(e)
                    }}
                  >
                    <Row>
                      <CardTitle className="mb-3">Edit Latest Info</CardTitle>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Title <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Title"
                            required
                            value={forms.title}
                            name="title"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            From Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter From Date"
                            required
                            value={forms.fromDate}
                            name="fromDate"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            To Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter To Date"
                            required
                            value={forms.toDate}
                            name="toDate"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Address <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="2"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Address"
                            required
                            value={forms.address}
                            name="address"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Description <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="2"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Description"
                            required
                            value={forms.description}
                            name="description"
                            onChange={e => {
                              handlechange(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={12} className="mt-3">
                        {inputList.map((x, i) => {
                          return (
                            <>
                              <Row>
                                <div key={i} className="box row">
                                  <Col md="5">
                                    <Label>Title</Label>
                                    <Input
                                      type="text"
                                      required
                                      placeholder="Enter Title"
                                      name="title"
                                      value={x.title}
                                      onChange={e => handleInputChange(e, i)}
                                    />
                                  </Col>
                                  <Col md="5">
                                    <Label>Count</Label>
                                    <Input
                                      type="number"
                                      required
                                      placeholder="Enter Count"
                                      name="count"
                                      value={x.count}
                                      onChange={e => handleInputChange(e, i)}
                                    />
                                  </Col>
                                  <Col md="2">
                                    <div className="btn-box mt-4">
                                      {inputList.length !== 1 && (
                                        <button
                                          className="mr10 btn btn-outline-danger btn-sm m-1"
                                          type="button"
                                          onClick={() => handleRemoveClick(i)}
                                        >
                                          Remove
                                          <i className="bx bx-x-circle"></i>
                                        </button>
                                      )}
                                      {inputList.length - 1 === i && (
                                        <button
                                          className="btn btn-sm btn-outline-info m-1"
                                          onClick={handleAddClick}
                                        >
                                          Add
                                          <i className="bx bx-plus-circle"></i>
                                        </button>
                                      )}
                                    </div>
                                  </Col>
                                </div>
                              </Row>
                            </>
                          )
                        })}
                      </Col>
                    </Row>
                    <div style={{ float: "right" }} className="mt-3">
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row>

                    <Col>
                      <div style={{ float: "right" }}>
                      {Roles?.aboutusEdit === true || Roles?.accessAll === true ? (
                        <Button
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit Booking"
                          onClick={() => {
                            getpopup1()
                          }}
                          className="mr-5 mb-1 m-1 mt-3"
                          color="success"
                          outline
                        >
                          <i className="bx bx-edit text-dark "></i>
                          <span>Edit Latest Info</span>
                        </Button>):""}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <h4>Latest Info</h4>
                        <Table hover className="table table-bordered mb-4 mt-3">
                          <thead>
                            <tr className="text-center">
                              <th>Title </th>
                              <td>{form.title}</td>
                            </tr>
                            <tr className="text-center">
                              <th>Description</th>
                              <td>{form.description}</td>
                            </tr>
                            <tr className="text-center">
                              <th>Address</th>
                              <td>{form.address}</td>
                            </tr>
                            <tr className="text-center">
                              <th>From Date / To Date</th>
                              <td>
                                {form.fromDate} - {form.toDate}
                              </td>
                            </tr>
                          </thead>
                        </Table>
                      </div>
                    </div>
                    <div>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <h4>Count</h4>
                        <Table hover className="table table-bordered mb-4 mt-3">
                          <thead>
                            <tr className="text-center">
                              <th>Title </th>
                              <th>Count</th>
                            </tr>
                            {inputList.map((x, i) => {
                              return (
                                <tr className="text-center" key={i}>
                                  <>
                                    <td>{x.title}</td>
                                    <td>{x.count}</td>
                                  </>
                                </tr>
                              )
                            })}
                          </thead>
                        </Table>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default DigitalBrochure
