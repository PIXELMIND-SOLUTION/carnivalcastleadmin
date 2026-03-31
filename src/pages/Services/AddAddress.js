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
  Table,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function AddAddress() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    landmark: "",
    image: null,
  });

  const [addresses, setAddresses] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  const history = useHistory();

  const tokenData = localStorage.getItem("authUser");
  const token = tokenData ? JSON.parse(tokenData).token : "";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateAddress();
    } else {
      addAddress();
    }
  };

  const addAddress = () => {
    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }

    axios
      .post("https://api.carnivalcastle.com/v1/carnivalApi/admin/address/add-address", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchAddresses();
          clearForm();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const fetchAddresses = () => {
    axios
      .get("https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setAddresses(res.data.data);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch addresses");
        console.error("Fetch error:", error);
      });
  };

  const clearForm = () => {
    setForm({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      landmark: "",
      image: null,
    });
    setIsEditMode(false);
    setEditAddressId(null);
  };

  const handleEdit = (address) => {
    console.log("Editing address:", address); // Debug log
    setForm({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      landmark: address.landmark,
      image: null,
    });
    setIsEditMode(true);
    setEditAddressId(address._id);
    
    // Scroll to form section
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show success message
    toast.info(`Editing address: ${address.name}`);
  };

  const updateAddress = () => {
    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }

    axios
      .put(`https://api.carnivalcastle.com/v1/carnivalApi/admin/address/update-address/${editAddressId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchAddresses();
          clearForm();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      axios
        .delete(`https://api.carnivalcastle.com/v1/carnivalApi/admin/address/delete-address/${addressId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            fetchAddresses();
          }
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  };

  const handleApiError = (error) => {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    console.error("API Error:", error);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const BASE_URL = "https://api.carnivalcastle.com/";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Add Address" />
          
          {/* Form Status Indicator */}
          {isEditMode && (
            <div className="alert alert-info mb-3">
              <i className="fas fa-edit me-2"></i>
              <strong>Edit Mode:</strong> You are editing address ID: {editAddressId}
              <Button 
                color="link" 
                className="float-end p-0" 
                onClick={clearForm}
                style={{textDecoration: 'none'}}
              >
                Cancel Edit
              </Button>
            </div>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xl="12">
                <Button
                  onClick={history.goBack}
                  className="mb-3"
                  style={{ float: "right" }}
                  color="primary"
                >
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </Button>
              </Col>
            </Row>
            <Card>
              <CardBody>
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Phone</Label>
                      <Input
                        type="text"
                        name="phone"
                        placeholder="Enter phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Address Line 1</Label>
                      <Input
                        type="text"
                        name="addressLine1"
                        placeholder="Enter address line 1"
                        value={form.addressLine1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Address Line 2</Label>
                      <Input
                        type="text"
                        name="addressLine2"
                        placeholder="Enter address line 2"
                        value={form.addressLine2}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg="4">
                    <div className="mb-3">
                      <Label>City</Label>
                      <Input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="mb-3">
                      <Label>State</Label>
                      <Input
                        type="text"
                        name="state"
                        placeholder="Enter state"
                        value={form.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="mb-3">
                      <Label>Postal Code</Label>
                      <Input
                        type="text"
                        name="postalCode"
                        placeholder="Enter postal code"
                        value={form.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Country</Label>
                      <Input
                        type="text"
                        name="country"
                        placeholder="Enter country"
                        value={form.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Landmark</Label>
                      <Input
                        type="text"
                        name="landmark"
                        placeholder="Enter landmark"
                        value={form.landmark}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Image</Label>
                      <Input
                        type="file"
                        name="image"
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col md={12}>
                <div className="mb-3" style={{ float: "right" }}>
                  <Button type="submit" style={{ width: "120px" }} color="primary" className="m-1">
                    {isEditMode ? "Update" : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    style={{ width: "120px" }}
                    color="secondary"
                    className="m-1"
                    onClick={clearForm}
                  >
                    Clear
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>

          {/* Optimized addresses table with horizontal scrolling */}
          <Card>
            <CardBody>
              <h4>All Addresses</h4>
              <div style={{ overflowX: "auto" }}>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address Line 1</th>
                      <th>Address Line 2</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Postal Code</th>
                      <th>Country</th>
                      <th>Landmark</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addresses.length > 0 ? (
                      addresses.map((addr) => (
                        <tr key={addr._id}>
                          <td className="text-truncate" style={{ maxWidth: "100px" }}>{addr._id}</td>
                          <td>{addr.name}</td>
                          <td>{addr.phone}</td>
                          <td className="text-truncate" style={{ maxWidth: "150px" }}>{addr.addressLine1}</td>
                          <td className="text-truncate" style={{ maxWidth: "150px" }}>{addr.addressLine2}</td>
                          <td>{addr.city}</td>
                          <td>{addr.state}</td>
                          <td>{addr.postalCode}</td>
                          <td>{addr.country}</td>
                          <td>{addr.landmark}</td>
                          <td>
                            {addr.image && (
                              <img
                                src={BASE_URL + addr.image.replace(/\\/g, "/")}
                                alt={addr.name || "Address Image"}
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            )}
                          </td>
                          <td>
                            {/* FIXED: Edit Button - Using regular Button with outline */}
                            <Button
                              color="primary"
                              size="sm"
                              outline
                              onClick={() => handleEdit(addr)}
                              title="Edit"
                              className="me-2"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            
                            {/* FIXED: Delete Button - Using regular Button with outline */}
                            <Button
                              color="danger"
                              size="sm"
                              outline
                              onClick={() => handleDelete(addr._id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">No addresses found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Container>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  );
}

export default AddAddress;