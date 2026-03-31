import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormGroup,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import Dropzone from "react-dropzone"
import { URLS } from "../../Url"
import axios from "axios"

function EditTheater() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    maxPeople: "",
    features: [],
    batchType: "",
    extraPersonprice: "",
    extraPerson: "",
    link: "",
    maxSeating: "",
    oneandhalfslotPrice: "",
    onehalfanhourExtraPersonPrice: "",
    address: "",
    image: [],
    availableSlots: []
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [inputList, setInputList] = useState([""])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const handleSubmit = e => {
    e.preventDefault()
    updateTheater()
  }

  const handleInputChange = (e, index) => {
    const { value } = e.target
    const list = [...inputList]
    list[index] = value
    setInputList(list)
  }

  const handleRemoveClick = index => {
    const list = [...inputList]
    list.splice(index, 1)
    setInputList(list)
  }

  const handleAddClick = () => {
    setInputList([...inputList, ""])
  }

  const history = useHistory()
  
  const updateTheater = () => {
    var token = datas
    const dataArray = new FormData()
    
    // Append all form fields
    dataArray.append("name", form.name)
    dataArray.append("price", form.price)
    dataArray.append("batchType", form.batchType)
    dataArray.append("maxPeople", form.maxPeople)
    dataArray.append("offerPrice", form.offerPrice)
    dataArray.append("oneandhalfslotPrice", form.oneandhalfslotPrice)
    dataArray.append("extraPerson", form.extraPerson)
    dataArray.append("description", form.description)
    dataArray.append("features", JSON.stringify(inputList))
    dataArray.append("extraPersonprice", form.extraPersonprice)
    dataArray.append("onehalfanhourExtraPersonPrice", form.onehalfanhourExtraPersonPrice)
    dataArray.append("maxSeating", form.maxSeating)
    dataArray.append("link", form.link)
    dataArray.append("address", form.address)
    dataArray.append("availableSlots", JSON.stringify(form.availableSlots))

    // Append new images if any
    for (let i = 0; i < selectedFiles.length; i++) {
      dataArray.append("image", selectedFiles[i])
    }

    axios
      .put(URLS.UpdateTheater + form._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            sessionStorage.setItem(
              "tost",
              "Theater has been Updated Successfully"
            )
            history.push("/Theater")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...form.availableSlots]
    updatedSlots[index][field] = value
    setForm(prev => ({
      ...prev,
      availableSlots: updatedSlots
    }))
  }

  const toggleSlotActive = (index) => {
    const updatedSlots = [...form.availableSlots]
    updatedSlots[index].isActive = !updatedSlots[index].isActive
    setForm(prev => ({
      ...prev,
      availableSlots: updatedSlots
    }))
  }

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setSelectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  // Fetch all addresses
  const fetchAddresses = () => {
    setLoadingAddresses(true);
    axios.get("https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress", {
      headers: { Authorization: `Bearer ${datas}` }
    })
    .then(res => {
      if (res.status === 200 && res.data.success) {
        setAddresses(res.data.data);
      } else {
        toast.error("Failed to fetch addresses");
      }
    })
    .catch(error => {
      toast.error("Failed to fetch addresses");
      console.error("Error fetching addresses:", error);
    })
    .finally(() => {
      setLoadingAddresses(false);
    });
  };

  useEffect(() => {
    getTheater()
    fetchAddresses()
  }, [])

  const Theaterid = sessionStorage.getItem("Theaterid")

  const getTheater = () => {
    const data = {
      id: Theaterid,
    }

    var token = datas
    axios
      .post(URLS.GetOneTheater, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setForm(res.data.theatre)
        setInputList(res.data.theatre.features || [])
        setExistingImages(res.data.theatre.image || [])
      })
  }

  const removeImage = (index) => {
    const newImages = [...existingImages]
    newImages.splice(index, 1)
    setExistingImages(newImages)
    // You might want to also update the form state or make an API call to remove from backend
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Edit Theater"
          />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xl="12">
                <Button
                  onClick={history.goBack}
                  className="mb-3"
                  style={{ float: "right" }}
                  color="primary"
                >
                  <i className="far fa-arrow-alt-circle-left"></i>
                  Back
                </Button>
              </Col>
            </Row>
            <Card>
              <CardBody>
                <Row className="mt-2">
                  <Col lg="6" className="mt-4">
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Theater Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Theater Name"
                        required
                        value={form.name}
                        name="name"
                        onChange={handleChange}
                      />
                    </div>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Badge Type 
                          </Label>
                          <select
                            value={form.batchType}
                            name="batchType"
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Most Booked">Most Booked</option>
                            <option value="Cheapest">Cheapest</option>
                            <option value="Family Recalled">
                              Family Recalled
                            </option>
                            <option value="Couples Recalled">
                              Couples Recalled
                            </option>
                          </select>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Max People <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Max People"
                            required
                            value={form.maxPeople}
                            name="maxPeople"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Price"
                            required
                            value={form.price}
                            name="price"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Offer Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Offer Price"
                            required
                            value={form.offerPrice}
                            name="offerPrice"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            One and Half Hour Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter One and Half Hour Price"
                            required
                            value={form.oneandhalfslotPrice}
                            name="oneandhalfslotPrice"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Max Seating <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Max Seating"
                            required
                            value={form.maxSeating}
                            name="maxSeating"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      <Col className="col-6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Extra Person <span className="text-danger">*</span>
                          </Label>
                          <select
                            value={form.extraPerson}
                            name="extraPerson"
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </Col>
                      {form.extraPerson === "Yes" && (
                        <>
                          <Col className="col-6">
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                Extra Person Price{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Extra Person Price"
                                required
                                value={form.extraPersonprice}
                                name="extraPersonprice"
                                onChange={handleChange}
                              />
                            </div>
                          </Col>
                          <Col className="col-6">
                            <div className="mb-3">
                              <Label for="basicpill-firstname-input1">
                                1.5 hour Extra Person Price{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="basicpill-firstname-input1"
                                placeholder="Enter Extra Person Price"
                                required
                                value={form.onehalfanhourExtraPersonPrice}
                                name="onehalfanhourExtraPersonPrice"
                                onChange={handleChange}
                              />
                            </div>
                          </Col>
                        </>
                      )}
                      <Col md="6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Description <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="3"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Description"
                            required
                            value={form.description}
                            name="description"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Youtube Link <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            type="text"
                            rows="3"
                            className="form-control "
                            id="basicpill-firstname-input1"
                            placeholder="Enter Link"
                            required
                            value={form.link}
                            name="link"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      {/* Address Dropdown */}
                      <Col md="12">
                        <div className="mb-3">
                          <Label for="address-select">
                            Address <span className="text-danger">*</span>
                          </Label>
                          {loadingAddresses ? (
                            <div className="text-center">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              <p>Loading addresses...</p>
                            </div>
                          ) : (
                            <select
                              id="address-select"
                              value={form.address}
                              name="address"
                              onChange={handleChange}
                              className="form-select"
                              required
                            >
                              <option value="">Select Address</option>
                              {addresses.map(address => (
                                <option key={address._id} value={address._id}>
                                  {address.name} - {address.addressLine1}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </Col>
                      <Col md="10">
                        <Label>Features</Label>
                        {inputList.map((x, i) => {
                          return (
                            <Row key={i}>
                              <div className="box row">
                                <Col md="8" className="mb-3">
                                  <Input
                                    type="text"
                                    required
                                    name="features"
                                    placeholder="Enter Features"
                                    value={x}
                                    onChange={e => handleInputChange(e, i)}
                                  />
                                </Col>
                                <Col md="4">
                                  <div className="btn-box">
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
                          )
                        })}
                      </Col>
                    </Row>
                  </Col>
                  <Col lg="6">
                    <div className="text-center m-4">
                      <h5 style={{ fontWeight: "bold" }}>Theater Images</h5>
                      <div className="w-50 m-auto">
                        <Dropzone
                          onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles)
                          }}
                          accept="image/*"
                          multiple
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick mt-2"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h4>Upload Images</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div className="dropzone-previews mt-3">
                          
                          {/* Newly uploaded images */}
                          {selectedFiles.map((f, i) => (
                            <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete" key={i}>
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="40"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <span className="text-muted font-weight-bold">
                                      {f.name}
                                    </span>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>

                  {/* Available Slots Section */}
<div className="mt-4">
  <h5 style={{ fontWeight: "bold" }}>Available Time Slots</h5>
  {form.availableSlots && form.availableSlots.length > 0 ? (
    form.availableSlots.map((slot, index) => (
      <Card key={index} className="mb-2">
        <CardBody>
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>From Time</Label>
                <Input
                  type="time"
                  value={slot.fromTime}
                  onChange={(e) =>
                    handleSlotChange(index, "fromTime", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>To Time</Label>
                <Input
                  type="time"
                  value={slot.toTime}
                  onChange={(e) =>
                    handleSlotChange(index, "toTime", e.target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup className="d-flex flex-column align-items-center h-100">
                <Label className="mb-2">
                  {slot.isActive ? "Active" : "Blocked"}
                </Label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="1"
                  value={slot.isActive ? 1 : 0}
                  onChange={(e) =>
                    handleSlotChange(index, "isActive", e.target.value === "1")
                  }
                  style={{ width: "100%" }}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    ))
  ) : (
    <p>No available slots found.</p>
  )}
</div>

                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Row>
              <Col md={12}>
                <div className="mb-2" style={{ float: "right" }}>
                  <button
                    type="submit"
                    style={{ width: "120px" }}
                    className="btn btn-info m-1"
                  >
                    Submit <i className="fas fa-check-circle"></i>
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
          <ToastContainer />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EditTheater