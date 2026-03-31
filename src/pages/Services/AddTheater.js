import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Dropzone from "react-dropzone";
import axios from "axios";
import { URLS } from "../../Url";

function AddVendors() {
  const [form, setForm] = useState({
    name: "",
    batchType: "",
    maxPeople: "",
    price: "",
    offerPrice: "",
    oneandhalfslotPrice: "",
    extraPersonprice: "",
    description: "",
    extraPerson: "",
    link: "",
    maxSeating: "",
    address: "",
    onehalfanhourExtraPersonPrice: ""
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [inputList, setInputList] = useState([""]);

  const history = useHistory();
  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const token = data.token;

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    setLoadingAddresses(true);
    axios.get("https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress", {
      headers: { Authorization: `Bearer ${token}` }
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

  const handleSubmit = e => {
    e.preventDefault();
    Adddealer();
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...inputList];
    list[index] = value;
    setInputList(list);
  };

  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, ""]);
  };

  const removeFile = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const Adddealer = () => {
    const dataArray = new FormData();
    dataArray.append("link", form.link);
    dataArray.append("name", form.name);
    dataArray.append("price", form.price);
    dataArray.append("batchType", form.batchType);
    dataArray.append("maxPeople", form.maxPeople);
    dataArray.append("offerPrice", form.offerPrice);
    dataArray.append("oneandhalfslotPrice", form.oneandhalfslotPrice);
    dataArray.append("extraPerson", form.extraPerson);
    dataArray.append("description", form.description);
    dataArray.append("features", JSON.stringify(inputList));
    dataArray.append("extraPersonprice", form.extraPersonprice);
    dataArray.append("onehalfanhourExtraPersonPrice", form.onehalfanhourExtraPersonPrice);
    dataArray.append("maxSeating", form.maxSeating);

    if (form.address && form.address._id) {
  dataArray.append("address", form.address._id);
}


    // Append all selected images
    selectedFiles.forEach(file => {
      dataArray.append("image", file);
    });

    axios
      .post(URLS.AddTheater, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            sessionStorage.setItem("tost", "Theater has been Added Successfully");
            history.push("/Theater");
            clearForm();
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
          }
        }
      );
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      link: "",
      name: "",
      price: "",
      batchType: "",
      maxPeople: "",
      offerPrice: "",
      oneandhalfslotPrice: "",
      description: "",
      extraPerson: "",
      extraPersonprice: "",
      maxSeating: "",
      address: "",
      onehalfanhourExtraPersonPrice: ""
    });
    setInputList([""]);
    setSelectedFiles([]);
  };

  function handleAcceptedFiles(files) {
    const newFiles = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Add Theater"
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
                    
                    <div className="mb-3">
                      <Label for="address-select">
                        Address <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="select"
                        className="form-control"
                        id="address-select"
                        required
                        value={form.address?._id || ""}
                        name="address"
                        onChange={(e) => {
                          const selectedAddressId = e.target.value;
                          const selectedAddress = addresses.find(
                            (address) => address._id === selectedAddressId
                          );
                          setForm({
                            ...form,
                            address: selectedAddress || "",
                          });
                        }}
                        disabled={loadingAddresses}
                      >
                        <option value="">Select Address</option>
                        {addresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {address.name} - {address.addressLine1}, {address.city}
                          </option>
                        ))}
                      </Input>
                      {loadingAddresses && (
                        <small className="text-muted">Loading addresses...</small>
                      )}
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
                    </Row>
                    
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label for="oneandhalfslotPrice">
                            One and Half Hour Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="oneandhalfslotPrice"
                            placeholder="Enter One and Half Hour Price"
                            required
                            value={form.oneandhalfslotPrice}
                            name="oneandhalfslotPrice"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-3">
                          <Label for="maxSeating">
                            Max Seating <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="maxSeating"
                            placeholder="Enter Max Seating"
                            required
                            value={form.maxSeating}
                            name="maxSeating"
                            onChange={handleChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label for="extraPerson">
                            Extra Person <span className="text-danger">*</span>
                          </Label>
                          <select
                            className="form-select"
                            id="extraPerson"
                            name="extraPerson"
                            value={form.extraPerson}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </Col>
                      
                      {form.extraPerson === "Yes" && (
                        <>
                          <Col>
                            <div className="mb-3">
                              <Label for="extraPersonprice">
                                Extra Person Price <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="extraPersonprice"
                                placeholder="Enter Extra Person Price"
                                required
                                value={form.extraPersonprice}
                                name="extraPersonprice"
                                onChange={handleChange}
                              />
                            </div>
                          </Col>
                          <Col>
                            <div className="mb-3">
                              <Label for="onehalfanhourExtraPersonPrice">
                                1.5 Hours Extra Person Price <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="onehalfanhourExtraPersonPrice"
                                placeholder="Enter 1.5 Hours Extra Person Price"
                                required
                                value={form.onehalfanhourExtraPersonPrice}
                                name="onehalfanhourExtraPersonPrice"
                                onChange={handleChange}
                              />
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                    
                    <div className="mb-3">
                      <Label for="description">
                        Description <span className="text-danger">*</span>
                      </Label>
                      <textarea
                        rows="3"
                        className="form-control"
                        id="description"
                        placeholder="Enter Description"
                        required
                        value={form.description}
                        name="description"
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <Label for="link">
                        Youtube Link <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="link"
                        placeholder="Enter Youtube Link"
                        required
                        value={form.link}
                        name="link"
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <Label>Features</Label>
                      {inputList.map((feature, index) => (
                        <Row key={index} className="mb-2 align-items-center">
                          <Col md="8">
                            <Input
                              type="text"
                              required
                              placeholder="Enter Feature"
                              value={feature}
                              onChange={e => handleInputChange(e, index)}
                            />
                          </Col>
                          <Col md="4">
                            {inputList.length !== 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm me-2"
                                onClick={() => handleRemoveClick(index)}
                              >
                                Remove
                              </button>
                            )}
                            {inputList.length - 1 === index && (
                              <button
                                type="button"
                                className="btn btn-outline-info btn-sm"
                                onClick={handleAddClick}
                              >
                                Add
                              </button>
                            )}
                          </Col>
                        </Row>
                      ))}
                    </div>
                  </Col>
                  
                  <Col lg="6">
                    <div className="text-center m-4">
                      <h5 style={{ fontWeight: "bold" }}>Theater Images (Multiple)</h5>
                      <div className="w-50 m-auto">
                        <Dropzone
                          multiple
                          accept="image/*"
                          onDrop={handleAcceptedFiles}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              className="dropzone"
                              {...getRootProps()}
                              style={{
                                border: "2px dashed #ddd",
                                padding: "20px",
                                cursor: "pointer",
                              }}
                            >
                              <input {...getInputProps()} />
                              <div className="mb-3">
                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                              </div>
                              <h4>Upload Images</h4>
                              <p className="text-muted">Drag & drop images here or click to browse</p>
                            </div>
                          )}
                        </Dropzone>

                        <div className="dropzone-previews mt-3" id="file-previews">
                          {selectedFiles.map((file, i) => (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="40"
                                      className="avatar-sm rounded bg-light"
                                      alt={file.name}
                                      src={file.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link to="#" className="text-muted font-weight-bold">
                                      {file.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{file.formattedSize}</strong>
                                    </p>
                                  </Col>
                                  <Col className="col-auto">
                                    <i
                                      className="fas fa-times fa-2x"
                                      onClick={() => removeFile(i)}
                                      style={{ cursor: "pointer", color: "red" }}
                                    />
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <Row className="mt-3">
                  <Col className="text-end">
                    <Button type="submit" color="primary" className="me-2">
                      Submit
                    </Button>
                    <Button type="button" color="danger" onClick={clearForm}>
                      Clear
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
}

export default AddVendors;