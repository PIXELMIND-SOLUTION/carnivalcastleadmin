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
  Modal,
  Badge,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

function DigitalBrochure() {
  const [files, setFiles] = useState([])
  const [modal_small, setmodal_small] = useState(false)
  const [show, setshow] = useState(false)
  const [show1, setshow1] = useState(false)
  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [viewImageUrl, setViewImageUrl] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)
  const [popupToDelete, setPopupToDelete] = useState(null)
  
  const [popups, setPopups] = useState([]) // Array of all popups
  const [selectedPopup, setSelectedPopup] = useState(null) // For editing
  const [forms, setforms] = useState({}) // For edit form
  const [createForm, setCreateForm] = useState({
    modalEnabled: false,
    type: "CarnivalCastle",
    title: "",
    description: "",
    popupBoolean: false
  })

  const changeHandler = e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      var ext = file.name.split(".").pop()
      var type = ext
      if (
        type == "jpg" ||
        type == "jpeg" ||
        type == "png" ||
        type == "JPG" ||
        type == "JPEG" ||
        type == "PNG" ||
        type == "WEBP" ||
        type == "webp"
      ) {
        setFiles(e.target.files)
      } else {
        e.target.value = null
        toast("file format not supported.Pls choose Image")
      }
    }
  }

  const handlechange = e => {
    const myUser = { ...forms }
    myUser[e.target.name] = e.target.checked
    setforms(myUser)
  }

  const handleCreateChange = e => {
    const myUser = { ...createForm }
    myUser[e.target.name] = e.target.checked
    setCreateForm(myUser)
  }

  const handlechanges = e => {
    const myUser = { ...forms }
    myUser[e.target.name] = e.target.value
    setforms(myUser)
  }

  const handleCreateChanges = e => {
    const myUser = { ...createForm }
    myUser[e.target.name] = e.target.value
    setCreateForm(myUser)
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
        URLS.GetPopup,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.data && res.data.popups) {
          setPopups(res.data.popups)
          // Set first popup as selected for display
          if (res.data.popups.length > 0) {
            setforms(res.data.popups[0])
          }
        }
      })
  }

  function tog_small() {
    setshow(!show)
  }

  const getpopup1 = (popup) => {
    setSelectedPopup(popup)
    setforms(popup)
    tog_small()
  }

  const submibooking = e => {
    e.preventDefault()
    changstatus()
  }

  const changstatus = () => {
    if (!selectedPopup) return
    
    var token = datas

    const dataArray = new FormData()
    dataArray.append("popupBoolean", forms.popupBoolean)
    dataArray.append("modalEnabled", forms.modalEnabled)
    dataArray.append("type", forms.type || "CarnivalCastle")
    dataArray.append("title", forms.title || "")
    dataArray.append("description", forms.description || "")

    for (let i = 0; i < files.length; i++) {
      dataArray.append("image", files[i])
    }

    axios
      .put(URLS.UpdatePopup, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setshow(false)
            setFiles([])
            setSelectedPopup(null)
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  function tog_small2() {
    setshow1(!show1)
  }

  const getpopup2 = () => {
    tog_small2()
  }

  const submibooking1 = e => {
    e.preventDefault()
    changstatus1()
  }

  const changstatus1 = () => {
    var token = datas
    const dataArray = {
      title: forms.title,
      modalEnabled: forms.modalEnabled,
      description: forms.description || "",
      type: forms.type || "CarnivalCastle" // Type field add kiya
    }

    axios
      .put(URLS.UpdatePopup1, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setshow1(false)
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  // Direct API call for creating popup
  const handleCreateSubmit = (e) => {
    e.preventDefault()
    
    if (files.length === 0) {
      toast.error("Please select an image")
      return
    }

    if (!createForm.title.trim()) {
      toast.error("Please enter title")
      return
    }

    var token = datas

    const dataArray = new FormData()
    dataArray.append("modalEnabled", createForm.modalEnabled)
    dataArray.append("popupBoolean", createForm.popupBoolean || createForm.modalEnabled)
    dataArray.append("type", createForm.type)
    dataArray.append("title", createForm.title)
    dataArray.append("description", createForm.description)

    for (let i = 0; i < files.length; i++) {
      dataArray.append("image", files[i])
    }

    // Direct API call
    axios
      .post("https://api.carnivalcastle.com/v1/carnivalApi/admin/popup/createpopupimage", dataArray, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      })
      .then(
        res => {
          if (res.status === 201) {
            toast.success(res.data.message)
            setShowCreatePopup(false)
            setFiles([])
            setCreateForm({
              modalEnabled: false,
              type: "CarnivalCastle",
              title: "",
              description: "",
              popupBoolean: false
            })
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong")
            console.error(error)
          }
        }
      )
  }

  // Delete Popup Function
  const handleDeletePopup = (popup) => {
    setPopupToDelete(popup)
    setDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!popupToDelete) return
    
    var token = datas

    // Direct API call for delete
    axios
      .delete(`https://api.carnivalcastle.com/v1/carnivalApi/admin/popup/deletepopupimage/${popupToDelete._id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setDeleteModal(false)
            setPopupToDelete(null)
            GetAllBroucher()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong")
            console.error(error)
          }
        }
      )
  }

  const toggleImageModal = (imageUrl) => {
    setViewImageUrl(imageUrl)
    setmodal_small(!modal_small)
  }

  const getpopup = (imageUrl) => {
    setViewImageUrl(imageUrl)
    setmodal_small(true)
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
            breadcrumbItem="Home Popup"
          />
          
          {/* Create New Popup Button */}
          <Row className="mb-3">
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <h5 className="mb-0">Popup Management</h5>
                  <div style={{ float: "right" }}>
                    {Roles?.homePopUpEdit === true || Roles?.accessAll === true ? (
                      <Button
                        onClick={() => setShowCreatePopup(!showCreatePopup)}
                        className="mr-5 mb-1 m-1 mt-3"
                        color="primary"
                      >
                        <i className="bx bx-plus"></i>
                        <span>Create New Popup</span>
                      </Button>
                    ) : ""}
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          {/* Create Popup Form */}
          {showCreatePopup && (
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleCreateSubmit(e)
                    }}
                  >
                    <Row>
                      <CardTitle className="mb-3">Create New Popup</CardTitle>
                      
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="create-image">
                            Image <span className="text-danger">*</span>
                            <span className="text-danger">400*600</span>
                          </Label>
                          <Input
                            type="file"
                            className="form-control"
                            id="create-image"
                            name="image"
                            onChange={changeHandler}
                            required
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="create-type">
                            Popup Type <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            className="form-control"
                            id="create-type"
                            name="type"
                            value={createForm.type}
                            onChange={e => {
                              handleCreateChanges(e)
                            }}
                            required
                          >
                            <option value="CarnivalCastle">Carnival Castle</option>
                            <option value="Bingenjoy">Bingenjoy</option>
                          </Input>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="create-title">
                            Title <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="create-title"
                            name="title"
                            placeholder="Enter popup title"
                            value={createForm.title}
                            onChange={e => {
                              handleCreateChanges(e)
                            }}
                            required
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="create-description">
                            Description
                          </Label>
                          <Input
                            type="textarea"
                            className="form-control"
                            id="create-description"
                            name="description"
                            placeholder="Enter popup description"
                            value={createForm.description}
                            onChange={e => {
                              handleCreateChanges(e)
                            }}
                            rows="3"
                          />
                        </div>
                      </Col>

                      <Col md="6">
                        <div className="mb-3">
                          <Label
                            onClick={e => {
                              handleCreateChange(e)
                            }}
                            className="form-check-label"
                            for="create-modalEnabled"
                          >
                            Is Show (Modal Enabled) <span className="text-danger">*</span>
                          </Label>
                          <Input
                            className="form-check-input m-1"
                            type="checkbox"
                            name="modalEnabled"
                            defaultChecked={createForm.modalEnabled}
                            value={createForm.modalEnabled}
                            onClick={e => {
                              handleCreateChange(e)
                            }}
                            id="create-modalEnabled"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit" className="me-2">
                        Create <i className="fas fa-plus-circle"></i>
                      </Button>
                      <Button color="secondary" onClick={() => setShowCreatePopup(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          )}

          {/* Edit Existing Popup */}
          {show == true && forms && (
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      submibooking(e)
                    }}
                  >
                    <Row>
                      <CardTitle className="mb-3">Edit Home Popup</CardTitle>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Image
                            <span className="text-danger">
                              {forms.image && (
                                <Button
                                  onClick={() => getpopup(URLS.Base + forms.image)}
                                  size="sm"
                                  className="m-1"
                                  outline
                                  color="info"
                                >
                                  <i className="fas fa-eye"></i>
                                </Button>
                              )}
                              400*600
                            </span>
                          </Label>
                          <Input
                            type="file"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            name="image"
                            onChange={changeHandler}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="edit-type">
                            Popup Type
                          </Label>
                          <Input
                            type="select"
                            className="form-control"
                            id="edit-type"
                            name="type"
                            value={forms.type || "CarnivalCastle"}
                            onChange={e => {
                              handlechanges(e)
                            }}
                          >
                            <option value="CarnivalCastle">Carnival Castle</option>
                            <option value="Bingenjoy">Bingenjoy</option>
                          </Input>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3 mt-5">
                          <Label
                            onClick={e => {
                              handlechange(e)
                            }}
                            className="form-check-label"
                            for="popupBoolean"
                          >
                            Is Show
                          </Label>
                          <Input
                            className="form-check-input m-1"
                            type="checkbox"
                            name="popupBoolean"
                            defaultChecked={forms.popupBoolean}
                            value={forms.popupBoolean}
                            onClick={e => {
                              handlechange(e)
                            }}
                            id="read"
                          />
                        </div>
                      </Col>
                      
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="edit-title">
                            Title
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="edit-title"
                            name="title"
                            value={forms.title || ""}
                            onChange={e => {
                              handlechanges(e)
                            }}
                          />
                        </div>
                      </Col>
                      
                      <Col md={6}>
                        <div className="mb-3">
                          <Label for="edit-description">
                            Description
                          </Label>
                          <textarea
                            className="form-control"
                            id="edit-description"
                            name="description"
                            rows="3"
                            value={forms.description || ""}
                            onChange={e => {
                              handlechanges(e)
                            }}
                          />
                        </div>
                      </Col>
                      
                      <Col md="6">
                        <div className="mb-3">
                          <Label
                            onClick={e => {
                              handlechange(e)
                            }}
                            className="form-check-label"
                            for="modalEnabled"
                          >
                            Modal Enabled
                          </Label>
                          <Input
                            className="form-check-input m-1"
                            type="checkbox"
                            name="modalEnabled"
                            defaultChecked={forms.modalEnabled}
                            value={forms.modalEnabled}
                            onClick={e => {
                              handlechange(e)
                            }}
                            id="modalEnabled"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Update <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          )}
          
          {/* Title Popup Section */}
          {show1 == true && forms && (
            <Col md={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      submibooking1(e)
                    }}
                  >
                    <Row>
                      <CardTitle className="mb-3">Edit Title Popup</CardTitle>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="title-type">
                            Popup Type
                          </Label>
                          <Input
                            type="select"
                            className="form-control"
                            id="title-type"
                            name="type"
                            value={forms.type || "CarnivalCastle"}
                            onChange={e => {
                              handlechanges(e)
                            }}
                          >
                            <option value="CarnivalCastle">Carnival Castle</option>
                            <option value="Bingenjoy">Bingenjoy</option>
                          </Input>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Title <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="2"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Title"
                            required
                            value={forms.title || ""}
                            name="title"
                            onChange={e => {
                              handlechanges(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label for="title-description">
                            Description
                          </Label>
                          <textarea
                            className="form-control"
                            id="title-description"
                            name="description"
                            rows="2"
                            value={forms.description || ""}
                            onChange={e => {
                              handlechanges(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3 mt-5">
                          <Label
                            onClick={e => {
                              handlechange(e)
                            }}
                            className="form-check-label"
                            for="modalEnabled"
                          >
                            Is Show
                          </Label>
                          <Input
                            className="form-check-input m-1"
                            type="checkbox"
                            name="modalEnabled"
                            defaultChecked={forms.modalEnabled}
                            value={forms.modalEnabled}
                            onClick={e => {
                              handlechange(e)
                            }}
                            id="read"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          )}

          {/* All Popups Display */}
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row>
                    <Col>
                      <h5>All Popups ({popups.length})</h5>
                      <div style={{ float: "right" }}>
                        {Roles?.homePopUpEdit === true || Roles?.accessAll === true ? (
                          <Button
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Edit Title Popup"
                            onClick={() => {
                              getpopup2()
                            }}
                            className="mr-5 mb-1 m-1 mt-3"
                            color="success"
                            outline
                          >
                            <i className="bx bx-edit text-dark "></i>
                            <span>Edit Title Popup</span>
                          </Button>
                        ) : ""}
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div>
                      <div className="table-rep-plugin mt-2 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>#</th>
                              <th>Popup Image</th>
                              <th>Popup Type</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Modal Enabled</th>
                              <th>Popup Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {popups.map((popup, index) => (
                              <tr key={popup._id} className="text-center">
                                <td>{index + 1}</td>
                                <td>
                                  {popup.image ? (
                                    <>
                                      <img
                                        src={URLS.Base + popup.image}
                                        width="100px"
                                        alt="Popup"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => getpopup(URLS.Base + popup.image)}
                                      />
                                      <br/>
                                      <Button
                                        size="sm"
                                        outline
                                        color="info"
                                        onClick={() => getpopup(URLS.Base + popup.image)}
                                        className="mt-1"
                                      >
                                        <i className="fas fa-eye"></i> View
                                      </Button>
                                    </>
                                  ) : (
                                    <span>No Image</span>
                                  )}
                                </td>
                                <td>
                                  {popup.type === "CarnivalCastle" || popup.type === "Carnivalcastle" ? "Carnival Castle" : 
                                   popup.type === "Bingenjoy" ? "Bingenjoy" : 
                                   popup.type ? popup.type : "Carnival Castle"}
                                </td>
                                <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                                  {popup.title || "No Title"}
                                </td>
                                <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                                  {popup.description ? (
                                    popup.description.length > 100 
                                      ? popup.description.substring(0, 100) + '...' 
                                      : popup.description
                                  ) : "No Description"}
                                </td>
                                <td>
                                  {popup.modalEnabled ? (
                                    <Badge color="success">Yes</Badge>
                                  ) : (
                                    <Badge color="danger">No</Badge>
                                  )}
                                </td>
                                <td>
                                  {popup.popupBoolean ? (
                                    <Badge color="success">Show</Badge>
                                  ) : (
                                    <Badge color="danger">Hide</Badge>
                                  )}
                                </td>
                                <td>
                                  {Roles?.homePopUpEdit === true || Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Edit Popup"
                                        onClick={() => getpopup1(popup)}
                                        className="mr-2"
                                        color="success"
                                        outline
                                        size="sm"
                                      >
                                        <i className="bx bx-edit"></i> Edit
                                      </Button>
                                      <Button
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Delete Popup"
                                        onClick={() => handleDeletePopup(popup)}
                                        className="mr-2"
                                        color="danger"
                                        outline
                                        size="sm"
                                      >
                                        <i className="bx bx-trash"></i> Delete
                                      </Button>
                                    </>
                                  ) : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Current Popup Display Section */}
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <h5>Current Active Popup</h5>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin mt-2 table-responsive">
                    <Table hover className="table table-bordered mb-4">
                      <thead>
                        <tr className="text-center">
                          <th>Popup Image</th>
                          <th>Popup Type</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Modal Enabled</th>
                          <th>Popup Status</th>
                        </tr>
                        {popups.length > 0 && (
                          <tr className="text-center">
                            <td>
                              {popups[0].image ? (
                                <>
                                  <img
                                    src={URLS.Base + popups[0].image}
                                    width="100px"
                                    alt="Popup"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => getpopup(URLS.Base + popups[0].image)}
                                  />
                                  <br/>
                                  <Button
                                    size="sm"
                                    outline
                                    color="info"
                                    onClick={() => getpopup(URLS.Base + popups[0].image)}
                                    className="mt-1"
                                  >
                                    <i className="fas fa-eye"></i> View
                                  </Button>
                                </>
                              ) : (
                                <span>No Image</span>
                              )}
                            </td>
                            <td>
                              {popups[0].type === "CarnivalCastle" || popups[0].type === "Carnivalcastle" ? "Carnival Castle" : 
                               popups[0].type === "Bingenjoy" ? "Bingenjoy" : 
                               popups[0].type ? popups[0].type : "Carnival Castle"}
                            </td>
                            <td>{popups[0].title || "No Title"}</td>
                            <td>{popups[0].description || "No Description"}</td>
                            <td>
                              {popups[0].modalEnabled ? (
                                <Badge color="success">Yes</Badge>
                              ) : (
                                <Badge color="danger">No</Badge>
                              )}
                            </td>
                            <td>
                              {popups[0].popupBoolean ? (
                                <Badge color="success">Show</Badge>
                              ) : (
                                <Badge color="danger">Hide</Badge>
                              )}
                            </td>
                          </tr>
                        )}
                      </thead>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
      
      {/* Image View Modal */}
      <Modal
        size="md"
        isOpen={modal_small}
        toggle={toggleImageModal}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="mySmallModalLabel">
            View Image
          </h5>
          <button
            onClick={toggleImageModal}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {viewImageUrl ? (
            <img src={viewImageUrl} width="100%" alt="Popup Preview" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        size="md"
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="deleteModalLabel">
            Confirm Delete
          </h5>
          <button
            onClick={() => setDeleteModal(false)}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this popup?</p>
          {popupToDelete && (
            <div className="mt-3">
              <p><strong>Type:</strong> {popupToDelete.type === "CarnivalCastle" ? "Carnival Castle" : "Bingenjoy"}</p>
              <p><strong>Title:</strong> {popupToDelete.title || "No Title"}</p>
              <p><strong>Status:</strong> {popupToDelete.popupBoolean ? "Show" : "Hide"}</p>
              <div className="alert alert-warning mt-3">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                This action cannot be undone!
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            <i className="bx bx-trash mr-1"></i> Delete
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default DigitalBrochure