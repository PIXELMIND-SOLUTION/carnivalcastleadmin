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
  Input,
  Button,
  Table,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"

const Plans = () => {
  const [show, setshow] = useState(false)
  const [modal_small, setmodal_small] = useState(false)
  const [Plans, setPlans] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])

  const [inputList, setInputList] = useState([{ fromtime: "", totime: "" }])

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
    setInputList([...inputList, { fromtime: "", totime: "" }])
  }

  const [inputList1, setInputList1] = useState([])

  console.log(inputList1)

  const handleInputChange1 = (e, index) => {
    const { name, value } = e.target
    const list = [...inputList1]
    list[index][name] = value
    setInputList1(list)
  }

  const handleRemoveClick1 = index => {
    const list = [...inputList1]
    list.splice(index, 1)
    setInputList1(list)
  }

  const handleAddClick1 = () => {
    setInputList1([...inputList1, { fromtime: "", totime: "" }])
  }

  function tog_small() {
    setmodal_small(!modal_small)
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
    GetAllPlans()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = Plans.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Plans.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const handleSubmit = e => {
    e.preventDefault()
    AddPlans()
  }

  const AddPlans = () => {
    var token = datas
    const dataArray = {
      theatreId: form.theatreId,
      timings: inputList,
    }
    axios
      .post(URLS.AddTheaterTimeSlots, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllPlans()
            clearForm()
            setshow(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const EditPlans = () => {
    var token = datas
    var formid = form1._id
    const dataArray = {
      theatreId: form1.theatreId,
      timings: inputList1,
    }
    axios
      .put(URLS.UpdateTheaterTimeSlots + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllPlans()
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

  const DeletePlans = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteTheaterTimeSlots + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllPlans()
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
      DeletePlans(data)
    }
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    EditPlans()
  }

  const GetAllPlans = () => {
    var token = datas
    axios
      .post(
        URLS.GetTheaterTimeSlots,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setPlans(res.data.slots)
      })
  }

  const [form2, setForm2] = useState({})
  const [form3, setForm3] = useState({})
  console.log(form2)

  const [Apiform, setApiform] = useState({})
  console.log(Apiform)

  // const handleChange2 = e => {
  //   const { name, value } = e.target

  //   setForm2(prevForm => ({
  //     ...prevForm,
  //     [name]: value,
  //   }))

  //   setApiform(prevForm => ({
  //     ...prevForm,
  //     [name]: value,
  //   }))
  // }
  const handleChange2 = e => {
    const { name, value } = e.target;
  
    if (name === "timeRange") {
      const [fromtime, totime] = value.split('-');
      setForm2(prevForm => ({
        ...prevForm,
        fromtime,
        totime,
      }));
  
      setApiform(prevForm => ({
        ...prevForm,
        fromtime,
        totime,
      }));
    } else {
      setForm2(prevForm => ({
        ...prevForm,
        [name]: value,
      }));
  
      setApiform(prevForm => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };


  const clearForm = () => {
    setInputList([{ fromtime: "", totime: "" }])
  }

  const getpopup = data => {
    setform1(data)
    setInputList1(data.timings)
    tog_small()
  }

  const manageBlock = data => {
    setForm2(data)
    // setInputList1(data.timings)
    toggleStatusModal()
    console.log(form2, "Form2")
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GetTheaterTimeSlotsSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setPlans(res.data.slots)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [Theater, setTheater] = useState([])

  useEffect(() => {
    GetProducts()
  }, [])

  const GetProducts = () => {
    var token = datas

    axios
      .post(
        URLS.GetTheater,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setTheater(res.data.theatres)
      })
  }

  const convertTo12HourFormat = time24 => {
    console.log(time24, "time24")
    if (time24) {
      const [hours, minutes] = time24?.split(":")
      let hours12 = hours % 12 || 12
      const period = hours < 12 ? "AM" : "PM"
      return `${hours12}:${minutes} ${period}`
    } else {
      return "-"
    }
  }


  const [modalOpen, setModalOpen] = useState(false)

  const toggleStatusModal = () => setModalOpen(!modalOpen)

  const statusReport = () => {
    const token = datas
    const statusId = form2._id
    const dataArray = {
      theatreId: form2.theatreId,
      // timingId: Apiform.timeRange,
      // _id: form2._id,
      // isActive: Apiform.status == "true",
      date: form2.date,
      isActive: form2.status || "false",
      fromtime: form2.fromtime,
      totime: form2.totime,
    }
    axios
      .put("https://api.carnivalcastle.com/carnivalApi/admin/slotblock/byonlydate", dataArray, {
      // .put(URLS.statusReport, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast(res.data.message)
          setModalOpen(false)
          GetAllPlans()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message)
        }
      })
  }

  const handleSubmit2 = e => {
    e.preventDefault()
    statusReport()
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Theater Time Slots"
          />
          <Row>
            {show == true ? (
              <Col md={12}>
                <Card>
                  <CardHeader className="bg-white">
                    <CardTitle>Add Theater Time Slots</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        handleSubmit(e)
                      }}
                    >
                      <Row>
                        <Col md="4">
                          <div className="mb-3">
                            <Label> Theater</Label>
                            <span className="text-danger">*</span>
                            <select
                              value={form.theatreId}
                              name="theatreId"
                              required
                              onChange={e => {
                                handleChange(e)
                              }}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {Theater.map((data, key) => {
                                return (
                                  <option key={key} value={data._id}>
                                    {data.name}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        </Col>
                        <Col md="8">
                          <div>
                            <Row>
                              {inputList.map((x, i) => {
                                return (
                                  <>
                                    <Row>
                                      <div key={i} className="box row">
                                        <Col md="4" sm="12" className="mb-1">
                                          <Label>From Time</Label>
                                          <Input
                                            type="time"
                                            name="fromtime"
                                            placeholder="Enter From Time"
                                            value={x.fromtime}
                                            id="timeInput"
                                            onChange={e =>
                                              handleInputChange(e, i)
                                            }
                                          />
                                        </Col>
                                        <Col md="4" sm="12" className="mb-1">
                                          <Label>To Time</Label>
                                          <Input
                                            type="time"
                                            name="totime"
                                            placeholder="Enter To Time"
                                            value={x.totime}
                                            id="timeInput"
                                            onChange={e =>
                                              handleInputChange(e, i)
                                            }
                                          />
                                        </Col>
                                        <Col sm="4">
                                          <Label className="mt-1"></Label>
                                          <div className="btn-box">
                                            {inputList.length !== 1 && (
                                              <button
                                                className="mr10 btn btn-outline-danger btn-sm m-1 mt-3"
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveClick(i)
                                                }
                                              >
                                                Remove{" "}
                                                <i className="bx bx-x-circle"></i>
                                              </button>
                                            )}
                                            {inputList.length - 1 === i && (
                                              <button
                                                className="btn btn-sm btn-outline-info m-1 mt-3"
                                                onClick={handleAddClick}
                                              >
                                                Add{" "}
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
                            </Row>
                          </div>{" "}
                        </Col>
                      </Row>
                      <hr></hr>
                      <Row>
                        <Col md="12">
                          <div style={{ float: "right" }}>
                            <Button color="primary" type="submit">
                              Submit <i className="fas fa-check-circle"></i>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <div>
                    <Row>
                      {Roles.theatreTimeAdd || Roles?.accessAll === true ? (
                        <>
                          <Col>
                            <Button
                              onClick={() => {
                                setshow(!show)
                              }}
                              color="primary"
                            >
                              Add Theater Time Slot{" "}
                              <i className="bx bx-plus"></i>
                            </Button>
                          </Col>
                        </>
                      ) : (
                        ""
                      )}
                      <Col>
                        <div style={{ float: "right" }}>
                          <Input
                            type="text"
                            className="form-control"
                            placeholder="Search.."
                            value={search.search}
                            onChange={searchAll}
                            name="search"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-4 mt-5">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Theater Name</th>
                            <th>From Time</th>
                            <th>To Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th>{(pageNumber - 1) * 5 + key + 6}</th>
                              <td>{data.theatreName}</td>
                              <td>
                                {data.timings.map((data, i) => (
                                  <>
                                    <Button
                                      key={key}
                                      size="sm"
                                      className="m-1"
                                      outline
                                      color="primary"
                                      style={{ width: "70px" }}
                                    >
                                      {convertTo12HourFormat(data.fromtime)}
                                    </Button>
                                    <br></br>
                                  </>
                                ))}
                              </td>
                              <td>
                                {data.timings.map((data, i) => (
                                  <>
                                    <Button
                                      key={key}
                                      size="sm"
                                      className="m-1"
                                      outline
                                      color="primary"
                                      style={{ width: "70px" }}
                                    >
                                      {convertTo12HourFormat(data.totime)}
                                    </Button>
                                    <br></br>
                                  </>
                                ))}
                              </td>
                              <td style={{ width: "200px" }}>
                                {Roles.theatreTimeEdit ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        getpopup(data)
                                      }}
                                      className="m-1"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="success"
                                      outline
                                    >
                                      <div className="d-flex">
                                        <i className="bx bx-edit "></i>
                                      </div>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles.theatreTimeDelete ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        manageDelete(data)
                                      }}
                                      className="m-1"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="danger"
                                      outline
                                    >
                                      <div className="d-flex">
                                        <i className="bx bx-trash "></i>
                                      </div>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                <Button
                                  // onClick={toggleStatusModal}
                                  onClick={() => {
                                    manageBlock(data)
                                  }}
                                  className="m-1"
                                  style={{ padding: "6px", margin: "3px" }}
                                  color="info"
                                  outline
                                >
                                  <div className="d-flex ">
                                    <i className="bx bx-lock"></i>
                                  </div>
                                </Button>
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
          size="lg"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Theater Time Slots
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
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label> Theater</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={form1.theatreId}
                      name="theatreId"
                      required
                      onChange={e => {
                        handleChange1(e)
                      }}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      {Theater.map((data, key) => {
                        return (
                          <option key={key} value={data._id}>
                            {data.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </Col>
                <Col md="8">
                  <div>
                    <Row>
                      {inputList1.map((x, i) => {
                        return (
                          <>
                            <Row>
                              <div key={i} className="box row">
                                <Col md="4" sm="12" className="mb-1">
                                  <Label>From Time</Label>
                                  <Input
                                    type="time"
                                    name="fromtime"
                                    placeholder="Enter From Time"
                                    value={x.fromtime}
                                    onChange={e => handleInputChange1(e, i)}
                                  />
                                </Col>

                                <Col md="4" sm="12" className="mb-1">
                                  <Label>To Time</Label>
                                  <Input
                                    type="time"
                                    name="totime"
                                    placeholder="Enter To Time"
                                    value={x.totime}
                                    onChange={e => handleInputChange1(e, i)}
                                  />
                                </Col>
                                <Col sm="4">
                                  <Label className="mt-1"></Label>
                                  <div className="btn-box">
                                    {inputList1.length !== 1 && (
                                      <button
                                        className="mr10 btn btn-outline-danger btn-sm m-1 mt-3"
                                        type="button"
                                        onClick={() => handleRemoveClick1(i)}
                                      >
                                        Remove{" "}
                                        <i className="bx bx-x-circle"></i>
                                      </button>
                                    )}
                                    {inputList1.length - 1 === i && (
                                      <button
                                        className="btn btn-sm btn-outline-info m-1 mt-3"
                                        onClick={handleAddClick1}
                                      >
                                        Add{" "}
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
                    </Row>
                  </div>{" "}
                </Col>
              </Row>
              <hr></hr>
              <div style={{ float: "right" }} className="mt-2">
                <Button color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <Modal size="lg" centered isOpen={modalOpen} toggle={toggleStatusModal}>
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="statusModalLabel">
              Active / InActive
            </h5>
            <button
              onClick={toggleStatusModal}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSubmit2}>
              <Row>
              <Col md="4">
                  <div className="mb-3">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      required
                      name="date"
                      value={form2.date}
                      onChange={e => handleChange2(e)}
                    />
                      
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label>From Time and To Time</Label>
                    <Input
                      type="select"
                      required
                      name="timeRange"
                      onChange={e => handleChange2(e)}
                    >
                      <option value="">Select</option>
                      {form2?.timings?.map((item, key) => {
                        return (
                          <option key={key} value={`${item.fromtime}-${item.totime}`}>
                            {item.fromtime} - {item.totime}
                          </option>
                        )
                      })}
                    </Input>
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label>Status</Label>
                    <Input
                      type="select"
                      name="status"
                      required
                      value={form2.status}
                      onChange={e => handleChange2(e)}
                    >
                      <option value="">Select Status</option>
                      <option value="false">Active</option>
                      <option value="true">InActive</option>
                    </Input>
                  </div>
                </Col>
              </Row>
              <div className="mt-2" style={{ float: "right" }}>
                <Button color="primary" type="submit">
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

export default Plans
