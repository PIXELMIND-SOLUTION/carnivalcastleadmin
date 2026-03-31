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

const Testimonial = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [form, setform] = useState({
    name: "",
    rating: "",
    description: "",
    videoId: "",
    websiteFor: "carnivalcastle",
    occasion: "",
    location: ""
  })
  const [form1, setform1] = useState({
    name: "",
    rating: "",
    description: "",
    videoId: "",
    websiteFor: "carnivalcastle",
    occasion: "",
    location: ""
  })

  const [Files, setFiles] = useState({
    image: null,
    profileImage: null
  })
  const [Files1, setFiles1] = useState({
    image: null,
    profileImage: null
  })

  // Image handler
  const changeHandlerImage = e => {
    const file = e.target.files[0]
    if (file) {
      var ext = file.name.split(".").pop().toLowerCase()
      if (ext === "jpg" || ext === "jpeg" || ext === "png") {
        setFiles({ ...Files, image: e.target.files })
      } else {
        e.target.value = null
        toast.error("File format not supported. Please choose an Image (JPG, JPEG, PNG)")
      }
    }
  }

  // Profile Image handler
  const changeHandlerProfileImage = e => {
    const file = e.target.files[0]
    if (file) {
      var ext = file.name.split(".").pop().toLowerCase()
      if (ext === "jpg" || ext === "jpeg" || ext === "png") {
        setFiles({ ...Files, profileImage: e.target.files })
      } else {
        e.target.value = null
        toast.error("File format not supported. Please choose an Image (JPG, JPEG, PNG)")
      }
    }
  }

  // Edit Image handler
  const changeHandlerImage1 = e => {
    const file = e.target.files[0]
    if (file) {
      var ext = file.name.split(".").pop().toLowerCase()
      if (ext === "jpg" || ext === "jpeg" || ext === "png") {
        setFiles1({ ...Files1, image: e.target.files })
      } else {
        e.target.value = null
        toast.error("File format not supported. Please choose an Image (JPG, JPEG, PNG)")
      }
    }
  }

  // Edit Profile Image handler
  const changeHandlerProfileImage1 = e => {
    const file = e.target.files[0]
    if (file) {
      var ext = file.name.split(".").pop().toLowerCase()
      if (ext === "jpg" || ext === "jpeg" || ext === "png") {
        setFiles1({ ...Files1, profileImage: e.target.files })
      } else {
        e.target.value = null
        toast.error("File format not supported. Please choose an Image (JPG, JPEG, PNG)")
      }
    }
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
    GetAllTestimonials()
  }, [])

  const gets = localStorage.getItem("authUser")
  const data = JSON.parse(gets)
  const datas = data?.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = testimonials.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(testimonials.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const handleSubmit = e => {
    e.preventDefault()
    AddTestimonial()
  }

  const AddTestimonial = () => {
    if (!datas) {
      toast.error("Authentication token not found")
      return
    }

    const dataArray = new FormData()
    dataArray.append("name", form.name)
    dataArray.append("rating", form.rating)
    dataArray.append("description", form.description)
    dataArray.append("videoId", form.videoId)
    dataArray.append("websiteFor", form.websiteFor)
    dataArray.append("occasion", form.occasion)
    dataArray.append("location", form.location)
    
    // Add image if exists
    if (Files.image) {
      for (let i = 0; i < Files.image.length; i++) {
        dataArray.append("image", Files.image[i])
      }
    }
    
    // Add profile image if exists
    if (Files.profileImage) {
      for (let i = 0; i < Files.profileImage.length; i++) {
        dataArray.append("profileImage", Files.profileImage[i])
      }
    }
    
    axios
      .post(URLS.AddTestimonials, dataArray, {
        headers: { 
          Authorization: `Bearer ${datas}`,
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            GetAllTestimonials()
            clearForm()
          }
        },
        error => {
          console.error("Add Error:", error)
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong while adding testimonial")
          }
        }
      )
      .catch(err => {
        console.error("Add Catch Error:", err)
        toast.error("Network error occurred")
      })
  }

  const EditTestimonial = () => {
    if (!datas) {
      toast.error("Authentication token not found")
      return
    }

    const formid = form1._id
    if (!formid) {
      toast.error("Testimonial ID not found")
      return
    }

    const dataArray = new FormData()
    dataArray.append("name", form1.name)
    dataArray.append("rating", form1.rating)
    dataArray.append("description", form1.description)
    dataArray.append("videoId", form1.videoId)
    dataArray.append("websiteFor", form1.websiteFor)
    dataArray.append("occasion", form1.occasion)
    dataArray.append("location", form1.location)
    
    // Add image if exists
    if (Files1.image) {
      for (let i = 0; i < Files1.image.length; i++) {
        dataArray.append("image", Files1.image[i])
      }
    }
    
    // Add profile image if exists
    if (Files1.profileImage) {
      for (let i = 0; i < Files1.profileImage.length; i++) {
        dataArray.append("profileImage", Files1.profileImage[i])
      }
    }
    
    axios
      .put(`${URLS.UpdateTestimonials}${formid}`, dataArray, {
        headers: { 
          Authorization: `Bearer ${datas}`,
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            GetAllTestimonials()
            setmodal_small(false)
            clearForm1()
          }
        },
        error => {
          console.error("Edit Error:", error)
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong while updating testimonial")
          }
        }
      )
      .catch(err => {
        console.error("Edit Catch Error:", err)
        toast.error("Network error occurred")
      })
  }

  const DeleteTestimonial = data => {
    if (!datas) {
      toast.error("Authentication token not found")
      return
    }

    const remid = data._id
    if (!remid) {
      toast.error("Testimonial ID not found")
      return
    }

    axios
      .delete(`${URLS.DeleteTestimonials}${remid}`, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            GetAllTestimonials()
          }
        },
        error => {
          console.error("Delete Error:", error)
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong while deleting testimonial")
          }
        }
      )
      .catch(err => {
        console.error("Delete Catch Error:", err)
        toast.error("Network error occurred")
      })
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      DeleteTestimonial(data)
    }
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    EditTestimonial()
  }

  const GetAllTestimonials = () => {
    if (!datas) {
      toast.error("Authentication token not found")
      return
    }

    axios
      .post(
        URLS.GetTestimonials,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        if (res.data && res.data.testimoni) {
          setTestimonials(res.data.testimoni)
        } else {
          setTestimonials([])
        }
      })
      .catch(err => {
        console.error("Get All Error:", err)
        toast.error("Failed to load testimonials")
        setTestimonials([])
      })
  }

  const clearForm1 = () => {
    setFiles1({
      image: null,
      profileImage: null
    })
  }

  const clearForm = () => {
    setform({
      name: "",
      description: "",
      rating: "",
      videoId: "",
      websiteFor: "carnivalcastle",
      occasion: "",
      location: ""
    })
    setFiles({
      image: null,
      profileImage: null
    })
  }

  const getpopup = data => {
    setform1({
      ...data,
      name: data.name || "",
      rating: data.rating || "",
      description: data.description || "",
      videoId: data.videoId || "",
      websiteFor: data.websiteFor || "carnivalcastle",
      occasion: data.occasion || "",
      location: data.location || ""
    })
    setFiles1({
      image: null,
      profileImage: null
    })
    tog_small()
  }

  const [search, setsearch] = useState({
    search: ""
  })

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    if (!datas) {
      toast.error("Authentication token not found")
      return
    }

    axios
      .post(
        `${URLS.GetTestimonialsSearch}${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        if (res.data && res.data.testimoni) {
          setTestimonials(res.data.testimoni)
        } else {
          setTestimonials([])
        }
      })
      .catch(err => {
        console.error("Search Error:", err)
        toast.error("Search failed")
      })
  }

  const Roles = data?.rolesAndPermission?.[0];

  // Function to render media based on type
  const renderMedia = (testimonial) => {
    if (testimonial.image) {
      return (
        <img
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
          src={`${URLS.Base}${testimonial.image}`}
          alt={testimonial.name}
        />
      )
    }
    return "No Media"
  }

  // Function to render profile image
  const renderProfileImage = (testimonial) => {
    if (testimonial.profileImage) {
      return (
        <img
          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
          src={`${URLS.Base}${testimonial.profileImage}`}
          alt={`${testimonial.name} profile`}
        />
      )
    }
    return "No Profile Image"
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Testimonial"
          />
          <Row>
            {Roles?.testimonialsAdd || Roles?.accessAll === true ? (
              <Col md={4}>
                <Card>
                  <CardHeader className="bg-white">
                    <CardTitle>Add Testimonial</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        handleSubmit(e)
                      }}
                    >
                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Name <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Name"
                          name="name"
                          value={form.name}
                          onChange={e => {
                            handleChange(e)
                          }}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Website For <span className="text-danger">*</span>
                        </Label>
                        <select
                          value={form.websiteFor}
                          name="websiteFor"
                          onChange={e => {
                            handleChange(e)
                          }}
                          className="form-select"
                          required
                        >
                          <option value="carnivalcastle">Carnival Castle</option>
                          <option value="bingenjoy">Bingenjoy</option>
                          <option value="both">Both</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Image
                        </Label>
                        <Input
                          type="file"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          name="image"
                          onChange={changeHandlerImage}
                        />
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Profile Image
                        </Label>
                        <Input
                          type="file"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          name="profileImage"
                          onChange={changeHandlerProfileImage}
                        />
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Video ID (YouTube/Vimeo)
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Video ID"
                          name="videoId"
                          value={form.videoId}
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Rating <span className="text-danger">*</span>
                        </Label>
                        <select
                          value={form.rating}
                          name="rating"
                          onChange={e => {
                            handleChange(e)
                          }}
                          className="form-select"
                          required
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Occasion
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Occasion"
                          name="occasion"
                          value={form.occasion}
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Location
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Location"
                          name="location"
                          value={form.location}
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <Label for="basicpill-firstname-input1">
                          Description <span className="text-danger">*</span>
                        </Label>
                        <textarea
                          type="text"
                          rows="6"
                          className="form-control "
                          id="basicpill-firstname-input1"
                          placeholder="Enter Description"
                          value={form.description}
                          name="description"
                          onChange={e => {
                            handleChange(e)
                          }}
                          required
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
            ) : ''}
            <Col md={Roles?.testimonialsAdd || Roles?.accessAll === true ? 8 : 12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Testimonial List</CardTitle>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <div style={{ float: "right", marginBottom: "20px" }}>
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Search.."
                          value={search.search}
                          onChange={searchAll}
                          name="search"
                          style={{ width: "300px" }}
                        />
                      </div>
                      <Table className="table table-bordered mb-4">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Website For</th>
                            <th>Media</th>
                            <th>Rating</th>
                            <th>Occasion</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.length > 0 ? (
                            lists.map((data, key) => (
                              <tr key={key} className="text-center">
                                <th>{(pageNumber) * listPerPage + key + 1}</th>
                                <td>{renderProfileImage(data)}</td>
                                <td>{data.name}</td>
                                <td>
                                  <span className={`badge ${
                                    data.websiteFor === 'bingenjoy' ? 'bg-primary' : 
                                    data.websiteFor === 'carnivalcastle' ? 'bg-info' : 
                                    'bg-success'
                                  }`}>
                                    {data.websiteFor}
                                  </span>
                                </td>
                                <td>
                                  {renderMedia(data)}
                                </td>
                                <td>{data.rating}</td>
                                <td>{data.occasion || "N/A"}</td>
                                <td>{data.location || "N/A"}</td>
                                <td>{data.description}</td>
                                <td>
                                  {Roles?.testimonialsEdit || Roles?.accessAll === true ? (
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
                                    </Button>
                                  ) : ''}
                                  {Roles?.testimonialsDelete || Roles?.accessAll === true ? (
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
                                    </Button>
                                  ) : ''}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="10" className="text-center">
                                No testimonials found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      {testimonials.length > listPerPage && (
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
              Edit Testimonial
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
                  Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Name"
                  name="name"
                  value={form1.name}
                  onChange={e => {
                    handleChange1(e)
                  }}
                  required
                />
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Website For <span className="text-danger">*</span>
                </Label>
                <select
                  value={form1.websiteFor}
                  name="websiteFor"
                  onChange={e => {
                    handleChange1(e)
                  }}
                  className="form-select"
                  required
                >
                  <option value="carnivalcastle">Carnival Castle</option>
                  <option value="bingenjoy">Bingenjoy</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Image
                </Label>
                <Input
                  type="file"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  name="image"
                  onChange={changeHandlerImage1}
                />
                {form1.image && (
                  <small className="text-muted">
                    Current: {form1.image.split('/').pop()}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Profile Image
                </Label>
                <Input
                  type="file"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  name="profileImage"
                  onChange={changeHandlerProfileImage1}
                />
                {form1.profileImage && (
                  <small className="text-muted">
                    Current: {form1.profileImage.split('/').pop()}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Video ID (YouTube/Vimeo)
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Video ID"
                  name="videoId"
                  value={form1.videoId}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Rating <span className="text-danger">*</span>
                </Label>
                <select
                  value={form1.rating}
                  name="rating"
                  onChange={e => {
                    handleChange1(e)
                  }}
                  className="form-select"
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Occasion
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Occasion"
                  name="occasion"
                  value={form1.occasion}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Location
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Location"
                  name="location"
                  value={form1.location}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>

              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Description <span className="text-danger">*</span>
                </Label>
                <textarea
                  type="text"
                  rows="6"
                  className="form-control "
                  id="basicpill-firstname-input1"
                  placeholder="Enter Description"
                  value={form1.description}
                  name="description"
                  onChange={e => {
                    handleChange1(e)
                  }}
                  required
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
                  Update <i className="fas fa-check-circle"></i>
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

export default Testimonial