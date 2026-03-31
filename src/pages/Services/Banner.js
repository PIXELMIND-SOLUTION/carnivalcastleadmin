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

function AddBanner() {
  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    desktopImages: [],
    mobileImages: [],
  });

  const [existingImages, setExistingImages] = useState({
    desktopImages: [],
    mobileImages: [],
  });

  const [banners, setBanners] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);

  const history = useHistory();
  const tokenData = localStorage.getItem("authUser");
  const token = tokenData ? JSON.parse(tokenData).token : "";

  const BASE_URL = "https://api.carnivalcastle.com/";

  // Handle input changes
  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "desktopImages" || name === "mobileImages") {
      setForm((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) updateBanner();
    else createBanner();
  };

  // Create Banner - FIXED: Only send fields that have values
  const createBanner = () => {
    const formData = new FormData();
    formData.append("type", form.type);
    
    // ✅ Sirf title hai to bhejo
    if (form.title && form.title.trim()) {
      formData.append("title", form.title);
    }
    
    // ✅ Sirf description hai to bhejo
    if (form.description && form.description.trim()) {
      formData.append("description", form.description);
    }
    // ❌ Agar nahi hai to kuch mat bhejo

    form.desktopImages.forEach((file) => formData.append("desktopImages", file));
    form.mobileImages.forEach((file) => formData.append("mobileImages", file));

    axios
      .post(`${BASE_URL}v1/carnivalApi/admin/create-banner`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchBanners();
          clearForm();
        }
      })
      .catch(handleApiError);
  };

  // Update Banner - FIXED: Only send fields that have values
  const updateBanner = () => {
    const formData = new FormData();
    formData.append("type", form.type);
    
    // ✅ Sirf title hai to bhejo
    if (form.title && form.title.trim()) {
      formData.append("title", form.title);
    }
    
    // ✅ Sirf description hai to bhejo
    if (form.description && form.description.trim()) {
      formData.append("description", form.description);
    }
    // ❌ Agar nahi hai to kuch mat bhejo

    // Only append files if new files are selected
    if (form.desktopImages.length > 0) {
      form.desktopImages.forEach((file) => formData.append("desktopImages", file));
    }

    if (form.mobileImages.length > 0) {
      form.mobileImages.forEach((file) => formData.append("mobileImages", file));
    }

    axios
      .put(`${BASE_URL}v1/carnivalApi/admin/update-banner/${editBannerId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchBanners();
          clearForm();
        }
      })
      .catch(handleApiError);
  };

  // Fetch all banners
  const fetchBanners = () => {
    axios
      .get(`${BASE_URL}v1/carnivalApi/admin/get-banners`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setBanners(res.data.banners || []);
      })
      .catch(() => toast.error("Failed to fetch banners"));
  };

  // Delete banner
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      axios
        .delete(`${BASE_URL}v1/carnivalApi/admin/delete-banner/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            fetchBanners();
          }
        })
        .catch(handleApiError);
    }
  };

  // Edit banner
  const handleEdit = (banner) => {
    setForm({
      type: banner.type,
      title: banner.title || "",
      description: banner.description || "",
      desktopImages: [],
      mobileImages: [],
    });
    
    // Store existing images separately
    setExistingImages({
      desktopImages: banner.desktopImages || [],
      mobileImages: banner.mobileImages || [],
    });
    
    setIsEditMode(true);
    setEditBannerId(banner._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(`Editing banner: ${banner.type}`);
  };

  // Clear form
  const clearForm = () => {
    setForm({
      type: "",
      title: "",
      description: "",
      desktopImages: [],
      mobileImages: [],
    });
    setExistingImages({
      desktopImages: [],
      mobileImages: [],
    });
    setIsEditMode(false);
    setEditBannerId(null);
  };

  // Handle API errors
  const handleApiError = (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong!");
    }
    console.error("API Error:", error);
  };

  // Fetch banners on mount
  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Banner Management" />

          {isEditMode && (
            <div className="alert alert-info mb-3">
              <i className="fas fa-edit me-2"></i>
              <strong>Edit Mode:</strong> Editing banner type: {form.type}
              <Button
                color="link"
                className="float-end p-0"
                onClick={clearForm}
                style={{ textDecoration: "none" }}
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
                      <Label>Banner Type *</Label>
                      <Input
                        type="select"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="carnivalcastle">Carnival Castle</option>
                        <option value="bingenjoy">Bingenjoy</option>
                      </Input>
                    </div>
                  </Col>

                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Title (Optional)</Label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="Banner title (optional)"
                        value={form.title}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg="12">
                    <div className="mb-3">
                      <Label>Description (Optional)</Label>
                      <Input
                        type="textarea"
                        name="description"
                        placeholder="Short description (optional)"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                      />
                      <small className="text-muted">Leave empty to not include description</small>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>
                        {isEditMode ? "New Desktop Images (Leave empty to keep existing)" : "Desktop Images *"}
                      </Label>
                      <Input
                        type="file"
                        name="desktopImages"
                        multiple
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <small className="text-muted">Recommended size: 1200x500px</small>
                      
                      {/* Show existing images in edit mode */}
                      {isEditMode && existingImages.desktopImages.length > 0 && (
                        <div className="mt-2">
                          <Label className="text-muted">Current Desktop Images:</Label>
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            {existingImages.desktopImages.map((img, i) => (
                              <img
                                key={i}
                                src={BASE_URL + img.replace(/\\/g, "/")}
                                alt="desktop"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col lg="6">
                    <div className="mb-3">
                      <Label>
                        {isEditMode ? "New Mobile Images (Leave empty to keep existing)" : "Mobile Images *"}
                      </Label>
                      <Input
                        type="file"
                        name="mobileImages"
                        multiple
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <small className="text-muted">Recommended size: 600x400px</small>
                      
                      {/* Show existing images in edit mode */}
                      {isEditMode && existingImages.mobileImages.length > 0 && (
                        <div className="mt-2">
                          <Label className="text-muted">Current Mobile Images:</Label>
                          <div className="d-flex flex-wrap gap-2 mt-1">
                            {existingImages.mobileImages.map((img, i) => (
                              <img
                                key={i}
                                src={BASE_URL + img.replace(/\\/g, "/")}
                                alt="mobile"
                                style={{
                                  width: "80px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col md={12}>
                <div className="mb-3" style={{ float: "right" }}>
                  <Button
                    type="submit"
                    style={{ width: "150px" }}
                    color="primary"
                    className="m-1"
                  >
                    {isEditMode ? "Update Banner" : "Add Banner"}
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

          {/* Banners Table */}
          <Card>
            <CardBody>
              <h4>All Banners ({banners.length})</h4>
              <div style={{ overflowX: "auto" }}>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Desktop Images</th>
                      <th>Mobile Images</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.length > 0 ? (
                      banners.map((banner, index) => (
                        <tr key={banner._id}>
                          <td>{index + 1}</td>

                          <td>
                            {banner.desktopImages?.map((img, i) => (
                              <img
                                key={i}
                                src={BASE_URL + img.replace(/\\/g, "/")}
                                alt="desktop"
                                style={{
                                  width: "60px",
                                  height: "40px",
                                  objectFit: "cover",
                                  marginRight: "5px",
                                  borderRadius: "4px",
                                }}
                              />
                            ))}
                          </td>

                          <td>
                            {banner.mobileImages?.map((img, i) => (
                              <img
                                key={i}
                                src={BASE_URL + img.replace(/\\/g, "/")}
                                alt="mobile"
                                style={{
                                  width: "60px",
                                  height: "40px",
                                  objectFit: "cover",
                                  marginRight: "5px",
                                  borderRadius: "4px",
                                }}
                              />
                            ))}
                          </td>

                          <td>{banner.type}</td>
                          <td>{banner.title}</td>
                          
                          {/* FIXED: Sirf tab dikhao jab description ho */}
                          <td className="text-truncate" style={{ maxWidth: "250px" }}>
                            {banner.description && banner.description.trim() !== "" 
                              ? banner.description 
                              : ""}
                          </td>

                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              outline
                              onClick={() => handleEdit(banner)}
                              className="me-2"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>

                            <Button
                              color="danger"
                              size="sm"
                              outline
                              onClick={() => handleDelete(banner._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No banners found
                        </td>
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

export default AddBanner;