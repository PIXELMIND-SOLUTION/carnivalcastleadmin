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
  FormGroup,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function AddBlog() {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    author: "",
    date: "",
    excerpt: "",
    content: "",
    featuredImage: null,
    metaTitle: "",
    metaDescription: "",
    tags: "",
    readTime: "5 min read",
    status: "published",
    type: "carnivalcastle" // New field added with default value
  });

  const [blogs, setBlogs] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);

  const history = useHistory();

  const tokenData = localStorage.getItem("authUser");
  const token = tokenData ? JSON.parse(tokenData).token : "";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "featuredImage") {
      setForm((prev) => ({ ...prev, featuredImage: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateBlog();
    } else {
      addBlog();
    }
  };

  const addBlog = () => {
    const formData = new FormData();
    
    // Append all form fields
    formData.append('slug', form.slug);
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('date', form.date);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    formData.append('metaTitle', form.metaTitle || form.title);
    formData.append('metaDescription', form.metaDescription || form.excerpt);
    formData.append('tags', form.tags);
    formData.append('readTime', form.readTime);
    formData.append('status', form.status);
    formData.append('type', form.type); // New field appended
    
    // Append image if exists
    if (form.featuredImage) {
      formData.append('featuredImage', form.featuredImage);
    }

    axios
      .post("https://api.carnivalcastle.com/v1/carnivalApi/admin/createblog", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchBlogs();
          clearForm();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const fetchBlogs = () => {
    axios
      .get("https://api.carnivalcastle.com/v1/carnivalApi/admin/allblogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch blogs");
        console.error("Fetch error:", error);
      });
  };

  const clearForm = () => {
    setForm({
      slug: "",
      title: "",
      author: "",
      date: "",
      excerpt: "",
      content: "",
      featuredImage: null,
      metaTitle: "",
      metaDescription: "",
      tags: "",
      readTime: "5 min read",
      status: "published",
      type: "carnivalcastle" // Reset to default value
    });
    setIsEditMode(false);
    setEditBlogId(null);
  };

  const handleEdit = (blog) => {
    console.log("Editing blog:", blog);
    setForm({
      slug: blog.slug,
      title: blog.title,
      author: blog.author,
      date: blog.date,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: null,
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || "",
      readTime: blog.readTime || "5 min read",
      status: blog.status || "published",
      type: blog.type || "carnivalcastle" // New field added for edit
    });
    setIsEditMode(true);
    setEditBlogId(blog._id);
    
    // Scroll to form section
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show success message
    toast.info(`Editing blog: ${blog.title}`);
  };

  const updateBlog = () => {
    const formData = new FormData();
    
    // Append all form fields
    formData.append('slug', form.slug);
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('date', form.date);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    formData.append('metaTitle', form.metaTitle || form.title);
    formData.append('metaDescription', form.metaDescription || form.excerpt);
    formData.append('tags', form.tags);
    formData.append('readTime', form.readTime);
    formData.append('status', form.status);
    formData.append('type', form.type); // New field appended for update
    
    // Append image if exists
    if (form.featuredImage) {
      formData.append('featuredImage', form.featuredImage);
    }

    axios
      .put(`https://api.carnivalcastle.com/v1/carnivalApi/admin/updateblog/${editBlogId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchBlogs();
          clearForm();
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const handleDelete = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      axios
        .delete(`https://api.carnivalcastle.com/v1/carnivalApi/admin/deleteblog/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            fetchBlogs();
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
    fetchBlogs();
  }, []);

  const BASE_URL = "https://api.carnivalcastle.com/";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Blog Management" />
          
          {/* Form Status Indicator */}
          {isEditMode && (
            <div className="alert alert-info mb-3">
              <i className="fas fa-edit me-2"></i>
              <strong>Edit Mode:</strong> You are editing blog: {form.title}
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
                      <Label>Slug *</Label>
                      <Input
                        type="text"
                        name="slug"
                        placeholder="e.g., ultimate-guide-private-theatres"
                        value={form.slug}
                        onChange={handleChange}
                        required
                      />
                      <small className="text-muted">URL-friendly identifier (no spaces, use hyphens)</small>
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Title *</Label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="Enter blog title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Author *</Label>
                      <Input
                        type="text"
                        name="author"
                        placeholder="Enter author name"
                        value={form.author}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Publish Date *</Label>
                      <Input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Col>
                </Row>

                {/* New Type Field Added Here */}
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Type *</Label>
                      <Input
                        type="select"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="bingenjoy">Bingenjoy</option>
                        <option value="carnivalcastle">Carnival Castle</option>
                      </Input>
                      <small className="text-muted">Select the blog type</small>
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Read Time</Label>
                      <Input
                        type="text"
                        name="readTime"
                        placeholder="e.g., 5 min read"
                        value={form.readTime}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="12">
                    <div className="mb-3">
                      <Label>Excerpt *</Label>
                      <Input
                        type="textarea"
                        name="excerpt"
                        placeholder="Short description of the blog"
                        value={form.excerpt}
                        onChange={handleChange}
                        rows="3"
                        required
                      />
                      <small className="text-muted">Brief summary (50-200 characters)</small>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="12">
                    <div className="mb-3">
                      <Label>Content *</Label>
                      <Input
                        type="textarea"
                        name="content"
                        placeholder="Write your blog content here..."
                        value={form.content}
                        onChange={handleChange}
                        rows="10"
                        required
                      />
                      <small className="text-muted">Full blog content with HTML support</small>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Featured Image *</Label>
                      <Input
                        type="file"
                        name="featuredImage"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <small className="text-muted">Recommended size: 800x400px</small>
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Status</Label>
                      <Input
                        type="select"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </Input>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Meta Title</Label>
                      <Input
                        type="text"
                        name="metaTitle"
                        placeholder="SEO meta title"
                        value={form.metaTitle}
                        onChange={handleChange}
                      />
                      <small className="text-muted">Optional - for SEO</small>
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label>Meta Description</Label>
                      <Input
                        type="textarea"
                        name="metaDescription"
                        placeholder="SEO meta description"
                        value={form.metaDescription}
                        onChange={handleChange}
                        rows="2"
                      />
                      <small className="text-muted">Optional - for SEO</small>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col lg="12">
                    <div className="mb-3">
                      <Label>Tags</Label>
                      <Input
                        type="text"
                        name="tags"
                        placeholder="e.g., movies, theatres, celebration (comma separated)"
                        value={form.tags}
                        onChange={handleChange}
                      />
                      <small className="text-muted">Separate tags with commas</small>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col md={12}>
                <div className="mb-3" style={{ float: "right" }}>
                  <Button type="submit" style={{ width: "120px" }} color="primary" className="m-1">
                    {isEditMode ? "Update Blog" : "Publish Blog"}
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

          {/* Blogs Table */}
          <Card>
            <CardBody>
              <h4>All Blogs ({blogs.length})</h4>
              <div style={{ overflowX: "auto" }}>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Type</th>
                      <th>Slug</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.length > 0 ? (
                      blogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>{index + 1}</td>
                          <td>
                            {blog.featuredImage && (
                              <img
                                src={BASE_URL + blog.featuredImage.replace(/\\/g, "/")}
                                alt={blog.title}
                                style={{ width: "60px", height: "40px", objectFit: "cover" }}
                              />
                            )}
                          </td>
                          <td className="text-truncate" style={{ maxWidth: "200px" }} title={blog.title}>
                            {blog.title}
                          </td>
                          <td>{blog.author}</td>
                          <td>
                            <span className={`badge ${blog.type === 'carnivalcastle' ? 'bg-info' : 'bg-secondary'}`}>
                              {blog.type}
                            </span>
                          </td>
                          <td className="text-truncate" style={{ maxWidth: "150px" }} title={blog.slug}>
                            {blog.slug}
                          </td>
                          <td>{blog.date}</td>
                          <td>
                            <span className={`badge ${blog.status === 'published' ? 'bg-success' : 'bg-warning'}`}>
                              {blog.status}
                            </span>
                          </td>
                          <td>{blog.views || 0}</td>
                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              outline
                              onClick={() => handleEdit(blog)}
                              title="Edit"
                              className="me-2"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            
                            <Button
                              color="danger"
                              size="sm"
                              outline
                              onClick={() => handleDelete(blog._id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">No blogs found</td>
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

export default AddBlog;