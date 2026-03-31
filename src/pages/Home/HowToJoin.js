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
  const [inputList, setInputList] = useState([{ title: "", description: "" }])

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
        URLS.GetHowToJoin,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.howtojoin)
        setforms(res.data.howtojoin)
        setInputList(res.data.howtojoin.benefits)
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
      description: forms.description,
      benefits: inputList,
    }

    axios
      .put(URLS.UpdatHowToJoin, dataArray, {
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
    setInputList([...inputList, { title: "", description: "" }])
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
            breadcrumbItem="How to join"
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
                      <CardTitle className="mb-3">Edit How to join</CardTitle>
                      <Col md={6}>
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
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Description <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="4"
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
                                    <Label>Question</Label>
                                    <Input
                                      type="text"
                                      required
                                      name="title"
                                      placeholder="Enter Question"
                                      value={x.title}
                                      onChange={e => handleInputChange(e, i)}
                                    />
                                  </Col>
                                  <Col md="5">
                                    <Label>Answer</Label>
                                    <textarea
                                      type="text"
                                      rows="3"
                                      className="form-control "
                                      id="basicpill-firstname-input1"
                                      placeholder="Enter Answer"
                                      required
                                      value={x.description}
                                      name="description"
                                      onChange={e => {
                                        handleInputChange(e, i)
                                      }}
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
                      {Roles?.howJoinEdit === true || Roles?.accessAll === true ? (
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
                          <span>Edit How to join</span>
                        </Button>):""}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <h4>How to join</h4>
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
                          </thead>
                        </Table>
                      </div>
                    </div>
                    <div>
                      <div className="table-rep-plugin mt-4 table-responsive">
                        <h4>Points</h4>
                        <Table hover className="table table-bordered mb-4 mt-3">
                          <thead>
                            <tr className="text-center">
                              <th>Question </th>
                              <th>Answer</th>
                            </tr>
                            {inputList.map((x, i) => {
                              return (
                                <tr className="text-center" key={i}>
                                  <>
                                    <td>{x.title}</td>
                                    <td>{x.description}</td>
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
