import React, { useState, useEffect } from "react"
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
  Button,
  Table,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"

const Banner = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [banner, setbanner] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  function tog_small() {
    setmodal_small(!modal_small)
    removeBodyCss()
  }

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

  useEffect(() => {
    getAllbenners()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = banner.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(banner.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const addbenners = () => {
    var token = datas

    const dataArray = {
      question: form.question,
      answer: form.answer,
    }

    axios
      .post(URLS.AddFaqs, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllbenners()
            setform("")
            setFiles("")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const editbenners = () => {
    var token = datas
    var formid = form1._id

    const dataArray = {
      question: form1.question,
      answer: form1.answer,
    }

    axios
      .put(URLS.UpdateFaqs + "/" + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            getAllbenners()
            toast(res.data.message)
            setmodal_small(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const deletebenners = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.InActiveFaqs + "/" + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllbenners()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
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

  const handleSubmit = e => {
    e.preventDefault()
    addbenners()
    clearForm()
  }
  const handleSubmit1 = e => {
    e.preventDefault()
    editbenners()
    clearForm()
  }

  const getAllbenners = () => {
    var token = datas
    axios
      .post(
        URLS.GetFaqs,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          console.log(res.data)
          setbanner(res.data.faqs)
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
      question: "",
      answer: "",
    })
  }
  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="FAQ" />
          <Row>
            <Col md={4}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Add FAQ</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Question <span className="text-danger">*</span>
                      </Label>
                      <input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Question "
                        required
                        name="question"
                        value={form.question}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Answer <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Answer "
                        required
                        name="answer"
                        rows="5"
                        value={form.answer}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>

                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col md={8}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>FAQ List</CardTitle>
                </CardHeader>

                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-2 mt-3">
                        <thead>
                          <tr>
                            <th>S No</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th style={{ width: "100px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key}>
                              <td>{(pageNumber - 1) * 5 + key + 6}</td>
                              <td>{data.question}</td>
                              <td>{data.answer}</td>
                              <td>
                              {Roles?.SettingsEdit == true ||
                            Roles?.accessAll == true ? (
                              <>
                                <Button
                                  onClick={() => {
                                    getpopup(data)
                                  }}
                                  className="mr-2"
                                  style={{
                                    padding: "6px",
                                    margin: "3px",
                                  }}
                                  color="success"
                                  outline
                                >
                                  <i className="bx bx-edit "></i>
                                </Button>    </>
                            ) : (
                              ""
                            )}
                                <Button
                                  onClick={() => {
                                    manageDelete(data)
                                  }}
                                  style={{
                                    padding: "6px",
                                    margin: "3px",
                                  }}
                                  color="danger"
                                  outline
                                >
                                  <i className="bx bx-trash"></i>
                                </Button>{" "}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

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
                          total={lists.length}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal
          size="md"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit FAQ
            </h5>
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
                handleSubmit1(e)
              }}
            >
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Question <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Question"
                  required
                  name="question"
                  value={form1.question}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Answer <span className="text-danger">*</span>
                </Label>
                <textarea
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Answer"
                  required
                  rows="5"
                  name="answer"
                  value={form1.answer}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>

              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-1" color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Banner
