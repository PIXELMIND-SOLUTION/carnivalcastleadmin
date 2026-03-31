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
  const [form, setform] = useState({
    title: "",
    description: "",
    expiryDate: "",
  })
  const [form1, setform1] = useState([])

  function tog_small() {
    setmodal_small(!modal_small)
    removeBodyCss()
  }

  const handleChange = e => {
    let myUser = { ...form };
    
    if (e.target.name === "expiryDate") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      
      // Reset the time portion of today's date to compare only the date
      today.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
        alert("Please select a valid expiry date (today or future dates only).");
        myUser[e.target.name] = ''; // Reset the input value
      } else {
        myUser[e.target.name] = e.target.value;
      }
    } else {
      myUser[e.target.name] = e.target.value;
    }
    
    setform(myUser);
  };
  

  // const handleChange1 = e => {
  //   let myUser = { ...form1 }
  //   myUser[e.target.name] = e.target.value
  //   setform1(myUser)
  // }

  const handleChange1 = e => {
    let myUser = { ...form1 };
    
    if (e.target.name === "expiryDate") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      
      // Reset the time portion of today's date to compare only the date
      today.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
        alert("Please select a valid expiry date (today or future dates only).");
        myUser[e.target.name] = ''; // Reset the input value
      } else {
        myUser[e.target.name] = e.target.value;
      }
    } else {
      myUser[e.target.name] = e.target.value;
    }
    
    setform1(myUser);
  };
  

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
      title: form.title,
      expiryDate: form.expiryDate,
      description: form.description,
    }

    axios
      .post(URLS.AddOffers, dataArray, {
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
      title: form1.title,
      expiryDate: form1.expiryDate,
      description: form1.description,
    }

    axios
      .put(URLS.UpdateOffers + "/" + formid, dataArray, {
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
      .delete(URLS.DeleteOffers + "/" + remid, {
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
        URLS.GetOffers,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          setbanner(res.data.offers)
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
      title: "",
      description: "",
      expiryDate: "",
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
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Offer Sliders"
          />
          <Row>
          {Roles?.officeSlidersAdd === true || Roles?.accessAll === true ? (
            <Col md={4}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Add Offer Sliders</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Title <span className="text-danger">*</span>
                      </Label>
                      <input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Title"
                        required
                        name="title"
                        value={form.title}
                        onChange={e => {
                          handleChange(e)
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Expiry Date <span className="text-danger">*</span>
                      </Label>
                     <input
        type="date"
        className="form-control"
        id="basicpill-firstname-input1"
        placeholder="Enter Expiry Date"
        required
        name="expiryDate"
        value={form.expiryDate}
        onChange={e => {
          handleChange(e)
        }}
        disabled={form.expiryDate === new Date().toISOString().split('T')[0]} 
      />
                    </div>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Description <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Description "
                        required
                        name="description"
                        rows="5"
                        value={form.description}
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
            </Col>):""}

          <Col md={Roles?.officeSlidersAdd === true || Roles?.accessAll === true ?8:12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Offer Sliders List</CardTitle>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-2 mt-3">
                        <thead>
                          <tr className="text-center">
                            <th>S No</th>
                            <th>Title</th>
                            <th>Expiry Date</th>
                            <th>Description</th>
                            <th style={{ width: "100px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{(pageNumber - 1) * 5 + key + 6}</td>
                              <td>{data.title}</td>
                              <td>{data.expiryDate}</td>
                              <td>{data.description}</td>
                              <td>
                              {Roles.homeSlidersEdit  || Roles?.accessAll === true ?<>
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
                                </Button></>:''}
                                {Roles.officeSlidersDelete  || Roles?.accessAll === true ?<>
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
                                </Button></>:''}
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
              Edit Offer Sliders
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
                  Title <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Title"
                  required
                  name="title"
                  value={form1.title}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Expiry Date <span className="text-danger">*</span>
                </Label>
                <input
                  type="date"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter  Expiry Date"
                  required
                  name="expiryDate"
                  // value={form1.expiryDate}
                  // onChange={e => {
                  //   handleChange1(e)
                  // }}
                  value={form1.expiryDate}
                  onChange={e => {
                    handleChange1(e)
                  }}
                  disabled={form.expiryDate === new Date().toISOString().split('T')[0]} 
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Description <span className="text-danger">*</span>
                </Label>
                <textarea
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Description"
                  required
                  rows="5"
                  name="description"
                  value={form1.description}
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
