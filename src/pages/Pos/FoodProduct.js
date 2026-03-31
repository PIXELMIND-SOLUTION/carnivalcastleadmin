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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  Spinner
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"

const Banner = () => {
  // ==================== STATE VARIABLES ====================
  // Modal states
  const [modal_small, setmodal_small] = useState(false)
  const [activeTab, setActiveTab] = useState("categories")
  
  // Data states
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  
  // Category form states
  const [categoryForm, setCategoryForm] = useState({
    name: ""
  })
  const [categoryEditForm, setCategoryEditForm] = useState({})
  const [categoryFiles, setCategoryFiles] = useState("")
  const [categoryEditFiles, setCategoryEditFiles] = useState("")
  
  // Product form states
  const [showProductForm, setShowProductForm] = useState(false)
  const [productForm, setProductForm] = useState({
    categoryId: "",
    name: "",
    foodType: ""
  })
  const [productEditForm, setProductEditForm] = useState({})
  const [productFiles, setProductFiles] = useState("")
  const [productEditFiles, setProductEditFiles] = useState("")
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileError, setFileError] = useState("")
  const [fileError1, setFileError1] = useState("")
  
  // Search and pagination states
  const [categorySearch, setCategorySearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [categoryPageNumber, setCategoryPageNumber] = useState(0)
  const [productPageNumber, setProductPageNumber] = useState(0)
  const [listPerPage] = useState(5)
  
  // ==================== CONSTANTS ====================
  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
  
  // ==================== AUTH ====================
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token
  var Roles = data?.rolesAndPermission[0]
  
  // ==================== FILE HANDLERS ====================
  const categoryChangeHandler = e => {
    const file = e.target.files[0];
    setFileError("");
    
    if (!file) {
      e.target.value = null;
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = file.type;
    
    if (!ALLOWED_FILE_TYPES.includes(fileType) || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setFileError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      e.target.value = null;
      toast.error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxSizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
      setFileError(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      e.target.value = null;
      toast.error(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      return;
    }

    setCategoryFiles([file]);
    toast.success("File validated successfully");
  }
  
  const categoryEditChangeHandler = e => {
    const file = e.target.files[0];
    setFileError1("");
    
    if (!file) {
      e.target.value = null;
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = file.type;
    
    if (!ALLOWED_FILE_TYPES.includes(fileType) || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setFileError1(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      e.target.value = null;
      toast.error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxSizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
      setFileError1(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      e.target.value = null;
      toast.error(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      return;
    }

    setCategoryEditFiles([file]);
    toast.success("File validated successfully");
  }

  const productChangeHandler = e => {
    const file = e.target.files[0];
    setFileError("");
    
    if (!file) {
      e.target.value = null;
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = file.type;
    
    if (!ALLOWED_FILE_TYPES.includes(fileType) || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setFileError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      e.target.value = null;
      toast.error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxSizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
      setFileError(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      e.target.value = null;
      toast.error(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      return;
    }

    setProductFiles([file]);
    toast.success("File validated successfully");
  }

  const productEditChangeHandler = e => {
    const file = e.target.files[0];
    setFileError1("");
    
    if (!file) {
      e.target.value = null;
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = file.type;
    
    if (!ALLOWED_FILE_TYPES.includes(fileType) || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setFileError1(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      e.target.value = null;
      toast.error(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxSizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
      setFileError1(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      e.target.value = null;
      toast.error(`File size too large (${sizeInMB}MB). Maximum ${maxSizeInMB}MB allowed`);
      return;
    }

    setProductEditFiles([file]);
    toast.success("File validated successfully");
  }
  
  // ==================== FORM HANDLERS ====================
  const handleCategoryChange = e => {
    let myUser = { ...categoryForm }
    myUser[e.target.name] = e.target.value
    setCategoryForm(myUser)
  }
  
  const handleCategoryEditChange = e => {
    let myUser = { ...categoryEditForm }
    myUser[e.target.name] = e.target.value
    setCategoryEditForm(myUser)
  }

  const handleProductChange = e => {
    let myUser = { ...productForm }
    myUser[e.target.name] = e.target.value
    setProductForm(myUser)
  }
  
  const handleProductEditChange = e => {
    let myUser = { ...productEditForm }
    myUser[e.target.name] = e.target.value
    setProductEditForm(myUser)
  }
  
  // ==================== MODAL TOGGLES ====================
  function tog_small() {
    setmodal_small(!modal_small)
    setFileError1("");
  }
  
  // ==================== API CALLS ====================
  useEffect(() => {
    GetAllCategories()
    GetAllProducts()
  }, [])

  // ==================== CATEGORY CRUD ====================
  const GetAllCategories = () => {
    axios
      .post(
        URLS.GetFoodCategory,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setCategories(res.data.Foodcategories)
      })
      .catch(error => {
        toast.error("Failed to load categories");
      })
  }

  const handleCategorySubmit = e => {
    e.preventDefault()
    
    if (!categoryForm.name || categoryForm.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters long");
      return;
    }
    
    if (!categoryFiles || categoryFiles.length === 0) {
      toast.error("Please select an image");
      return;
    }
    
    AddCategory()
  }

  const AddCategory = () => {
    setIsSubmitting(true);
    
    const dataArray = new FormData()
    dataArray.append("name", categoryForm.name.trim())
    for (let i = 0; i < categoryFiles.length; i++) {
      dataArray.append("image", categoryFiles[i])
    }
    
    toast.info("Adding category...", { autoClose: false, toastId: "addingCategory" });
    
    axios
      .post(URLS.AddFoodCategory, dataArray, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("addingCategory");
          toast.success(res.data.message)
          GetAllCategories()
          clearCategoryForm()
        }
      })
      .catch(error => {
        toast.dismiss("addingCategory");
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  const handleCategoryEditSubmit = e => {
    e.preventDefault()
    
    if (!categoryEditForm.name || categoryEditForm.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters long");
      return;
    }
    
    EditCategory()
  }

  const EditCategory = () => {
    setIsSubmitting(true);
    var formid = categoryEditForm._id;
    
    const dataArray = new FormData()
    dataArray.append("name", categoryEditForm.name.trim())
    
    if (categoryEditFiles && categoryEditFiles.length > 0) {
      for (let i = 0; i < categoryEditFiles.length; i++) {
        dataArray.append("image", categoryEditFiles[i])
      }
    }
    
    toast.info("Updating category...", { autoClose: false, toastId: "updatingCategory" });
    
    axios
      .put(URLS.UpdateFoodCategory + formid, dataArray, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("updatingCategory");
          toast.success(res.data.message)
          GetAllCategories()
          setmodal_small(false)
          clearCategoryEditForm()
        }
      })
      .catch(error => {
        toast.dismiss("updatingCategory");
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  const DeleteCategory = data => {
    var remid = data._id
    axios
      .delete(URLS.DeleteFoodCategory + remid, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          GetAllCategories()
        }
      })
      .catch(error => {
        handleApiError(error);
      })
  }

  const manageCategoryDelete = data => {
    const confirmBox = window.confirm("Do you really want to delete this category?")
    if (confirmBox === true) {
      DeleteCategory(data)
    }
  }

  // ==================== PRODUCT CRUD ====================
  const GetAllProducts = () => {
    axios
      .post(
        URLS.GetFoodProducts,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setProducts(res.data.foodproducts)
      })
      .catch(error => {
        toast.error("Failed to load products");
      })
  }

  const handleProductSubmit = e => {
    e.preventDefault()
    
    if (!productForm.categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    if (!productForm.name || productForm.name.trim().length < 2) {
      toast.error("Product name must be at least 2 characters long");
      return;
    }
    
    if (!productFiles || productFiles.length === 0) {
      toast.error("Please select an image");
      return;
    }
    
    if (!productForm.foodType) {
      toast.error("Please select food type");
      return;
    }
    
    AddProduct()
  }

  const AddProduct = () => {
    setIsSubmitting(true);
    
    const dataArray = new FormData()
    dataArray.append("categoryId", productForm.categoryId)
    dataArray.append("name", productForm.name.trim())
    dataArray.append("foodType", productForm.foodType)
    for (let i = 0; i < productFiles.length; i++) {
      dataArray.append("image", productFiles[i])
    }
    
    toast.info("Adding product...", { autoClose: false, toastId: "addingProduct" });
    
    axios
      .post(URLS.AddFoodProducts, dataArray, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("addingProduct");
          toast.success(res.data.message)
          GetAllProducts()
          clearProductForm()
          setShowProductForm(false)
        }
      })
      .catch(error => {
        toast.dismiss("addingProduct");
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  const handleProductEditSubmit = e => {
    e.preventDefault()
    
    if (!productEditForm.categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    if (!productEditForm.name || productEditForm.name.trim().length < 2) {
      toast.error("Product name must be at least 2 characters long");
      return;
    }
    
    if (!productEditForm.foodType) {
      toast.error("Please select food type");
      return;
    }
    
    EditProduct()
  }

  const EditProduct = () => {
    setIsSubmitting(true);
    var formid = productEditForm._id;
    
    const dataArray = new FormData()
    dataArray.append("categoryId", productEditForm.categoryId)
    dataArray.append("name", productEditForm.name.trim())
    dataArray.append("foodType", productEditForm.foodType)
    
    if (productEditFiles && productEditFiles.length > 0) {
      for (let i = 0; i < productEditFiles.length; i++) {
        dataArray.append("image", productEditFiles[i])
      }
    }
    
    toast.info("Updating product...", { autoClose: false, toastId: "updatingProduct" });
    
    axios
      .put(URLS.UpdateFoodProducts + formid, dataArray, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("updatingProduct");
          toast.success(res.data.message)
          GetAllProducts()
          setmodal_small(false)
          clearProductEditForm()
        }
      })
      .catch(error => {
        toast.dismiss("updatingProduct");
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  const DeleteProduct = data => {
    var remid = data._id
    axios
      .delete(URLS.DeleteFoodProducts + remid, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          GetAllProducts()
        }
      })
      .catch(error => {
        handleApiError(error);
      })
  }

  const manageProductDelete = data => {
    const confirmBox = window.confirm("Do you really want to delete this product?")
    if (confirmBox === true) {
      DeleteProduct(data)
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  const handleApiError = (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message || "Validation error");
      } else if (error.response.status === 401) {
        toast.error("Unauthorized. Please login again");
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(`Error: ${error.response.status}`);
      }
    } else if (error.request) {
      toast.error("No response from server. Check your network connection");
    } else {
      toast.error(error.message || "Something went wrong");
    }
    console.error("API error:", error);
  }

  // ==================== CLEAR FORM FUNCTIONS ====================
  const clearCategoryForm = () => {
    setCategoryForm({ name: "" })
    setCategoryFiles("")
    setFileError("")
  }

  const clearCategoryEditForm = () => {
    setCategoryEditForm({})
    setCategoryEditFiles("")
    setFileError1("")
  }

  const clearProductForm = () => {
    setProductForm({
      categoryId: "",
      name: "",
      foodType: ""
    })
    setProductFiles("")
    setFileError("")
  }

  const clearProductEditForm = () => {
    setProductEditForm({})
    setProductEditFiles("")
    setFileError1("")
  }

  // ==================== POPUP FUNCTIONS ====================
  const getCategoryPopup = data => {
    setCategoryEditForm(data)
    setmodal_small(true)
    setActiveTab("categories")
  }

  const getProductPopup = data => {
    setProductEditForm(data)
    setmodal_small(true)
    setActiveTab("products")
  }

  // ==================== SEARCH FUNCTIONS ====================
  const searchCategories = e => {
    const value = e.target.value
    setCategorySearch(value)

    axios
      .post(
        URLS.GeFoodCategorySearch + `${value}`,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setCategories(res.data.Foodcategories)
      })
      .catch(error => {
        console.error("Search error:", error);
      })
  }
  
  const searchProducts = e => {
    const value = e.target.value
    setProductSearch(value)

    axios
      .post(
        URLS.GetFoodProductsSearch + `${value}`,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setProducts(res.data.foodproducts)
      })
      .catch(error => {
        console.error("Search error:", error);
      })
  }

  // ==================== PAGINATION ====================
  const categoryPagesVisited = categoryPageNumber * listPerPage
  const categoryLists = categories.slice(categoryPagesVisited, categoryPagesVisited + listPerPage)
  const categoryPageCount = Math.ceil(categories.length / listPerPage)
  
  const changeCategoryPage = ({ selected }) => {
    setCategoryPageNumber(selected)
  }

  const productPagesVisited = productPageNumber * listPerPage
  const productLists = products.slice(productPagesVisited, productPagesVisited + listPerPage)
  const productPageCount = Math.ceil(products.length / listPerPage)
  
  const changeProductPage = ({ selected }) => {
    setProductPageNumber(selected)
  }

  // ==================== RENDER ====================
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Food Management"
          />
          
          {/* File size warning alert */}
          <Alert color="info" className="mb-3">
            <i className="fas fa-info-circle me-2"></i>
            Maximum file size: 30MB | Allowed formats: JPG, JPEG, PNG, GIF, BMP, TIFF | Image size: 165*170px
          </Alert>
          
          {/* Tab Navigation */}
          <Nav tabs className="mb-4">
            <NavItem>
              <NavLink
                className={activeTab === 'categories' ? 'active' : ''}
                onClick={() => setActiveTab('categories')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-folder me-2"></i>
                Food Categories
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'products' ? 'active' : ''}
                onClick={() => setActiveTab('products')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-utensils me-2"></i>
                Food Products
              </NavLink>
            </NavItem>
          </Nav>
          
          <TabContent activeTab={activeTab}>
            {/* ==================== FOOD CATEGORIES TAB ==================== */}
            <TabPane tabId="categories">
              <Row>
                {Roles.foodCategoryAdd || Roles?.accessAll === true ? (
                  <Col md={4}>
                    <Card>
                      <CardHeader className="bg-white">
                        <CardTitle>Add Food Category</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Form onSubmit={handleCategorySubmit}>
                          <div className="mb-3">
                            <Label for="category-name">
                              Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="category-name"
                              placeholder="Enter Category Name"
                              required
                              name="name"
                              value={categoryForm.name}
                              onChange={handleCategoryChange}
                              minLength="2"
                              maxLength="50"
                            />
                          </div>
                          <div className="mb-3">
                            <Label for="category-image">
                              Image <span className="text-danger">*</span>
                              <small className="text-muted ms-2">165*170px</small>
                            </Label>
                            <Input
                              type="file"
                              className="form-control"
                              id="category-image"
                              required
                              name="image"
                              onChange={categoryChangeHandler}
                              accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
                            />
                            {fileError && (
                              <div className="text-danger small mt-1">
                                <i className="fas fa-exclamation-triangle"></i> {fileError}
                              </div>
                            )}
                            {categoryFiles && categoryFiles.length > 0 && (
                              <div className="text-success small mt-1">
                                <i className="fas fa-check-circle"></i> File selected: {categoryFiles[0].name} ({(categoryFiles[0].size/(1024*1024)).toFixed(2)}MB)
                              </div>
                            )}
                          </div>
                          <div style={{ float: "right" }}>
                            <Button 
                              color="primary" 
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Adding...
                                </>
                              ) : (
                                <>
                                  Submit <i className="fas fa-check-circle"></i>
                                </>
                              )}
                            </Button>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                ) : (
                  ""
                )}
                
                <Col md={Roles.foodCategoryAdd || Roles?.accessAll === true ? 8 : 12}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Food Category List</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <div className="d-flex justify-content-end mb-3">
                          <div style={{ minWidth: "250px" }}>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Search categories..."
                              value={categorySearch}
                              onChange={searchCategories}
                              name="search"
                            />
                          </div>
                        </div>
                        
                        <div className="table-responsive">
                          <Table className="table table-bordered mb-4">
                            <thead>
                              <tr className="text-center">
                                <th>S.No</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categoryLists.map((data, key) => (
                                <tr key={key} className="text-center align-middle">
                                  <td>{(categoryPageNumber * listPerPage) + key + 1}</td>
                                  <td>
                                    <img
                                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                                      src={URLS.Base + data.image}
                                      alt={data.name}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "";
                                      }}
                                    />
                                  </td>
                                  <td className="fw-bold">{data.name}</td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2">
                                      {Roles.foodCategoryEdit || Roles?.accessAll === true ? (
                                        <Button
                                          onClick={() => getCategoryPopup(data)}
                                          color="success"
                                          outline
                                          size="sm"
                                          title="Edit Category"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {Roles.foodCategoryDelete || Roles?.accessAll === true ? (
                                        <Button
                                          onClick={() => manageCategoryDelete(data)}
                                          color="danger"
                                          outline
                                          size="sm"
                                          title="Delete Category"
                                        >
                                          <i className="bx bx-trash"></i>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          
                          {categoryLists.length === 0 && (
                            <div className="text-center py-4">
                              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                              <h5>No categories found</h5>
                              <p className="text-muted">Add a food category to get started</p>
                            </div>
                          )}
                          
                          {categories.length > listPerPage && (
                            <div className="mt-3 d-flex justify-content-end">
                              <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={categoryPageCount}
                                onPageChange={changeCategoryPage}
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
            </TabPane>
            
            {/* ==================== FOOD PRODUCTS TAB ==================== */}
            <TabPane tabId="products">
              <Row>
                {showProductForm && (
                  <Col md={12}>
                    <Card className="mb-4">
                      <CardHeader className="bg-white">
                        <CardTitle>Add Food Product</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Form onSubmit={handleProductSubmit}>
                          <Row>
                            <Col md="4">
                              <div className="mb-3">
                                <Label>Category <span className="text-danger">*</span></Label>
                                <select
                                  value={productForm.categoryId}
                                  name="categoryId"
                                  required
                                  onChange={handleProductChange}
                                  className="form-select"
                                >
                                  <option value="">Select Category</option>
                                  {categories.map((data, key) => (
                                    <option key={key} value={data._id}>
                                      {data.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="mb-3">
                                <Label>
                                  Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Product Name"
                                  required
                                  name="name"
                                  value={productForm.name}
                                  onChange={handleProductChange}
                                  minLength="2"
                                  maxLength="100"
                                />
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="mb-3">
                                <Label>
                                  Image <span className="text-danger">*</span>
                                </Label>
                                <Input
                                  type="file"
                                  className="form-control"
                                  required
                                  name="image"
                                  onChange={productChangeHandler}
                                  accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
                                />
                                {fileError && (
                                  <div className="text-danger small mt-1">
                                    <i className="fas fa-exclamation-triangle"></i> {fileError}
                                  </div>
                                )}
                              </div>
                            </Col>
                            <Col md="4">
                              <div className="mb-3">
                                <Label>Food Type <span className="text-danger">*</span></Label>
                                <select
                                  value={productForm.foodType}
                                  name="foodType"
                                  required
                                  onChange={handleProductChange}
                                  className="form-select"
                                >
                                  <option value="">Select Type</option>
                                  <option value="Veg">Veg</option>
                                  <option value="Non-veg">Non-Veg</option>
                                </select>
                              </div>
                            </Col>
                            <Col md={12}>
                              <div className="d-flex justify-content-end gap-2">
                                <Button 
                                  color="secondary" 
                                  onClick={() => {
                                    setShowProductForm(false);
                                    clearProductForm();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  color="primary" 
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      Submit <i className="fas fa-check-circle"></i>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                )}
                
                <Col md={12}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Food Product List</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                          {Roles.foodProductAdd || Roles?.accessAll === true ? (
                            <Button
                              onClick={() => {
                                setShowProductForm(!showProductForm)
                                clearProductForm();
                              }}
                              color="primary"
                            >
                              {showProductForm ? "Hide Form" : "Add Product"} <i className="bx bx-plus"></i>
                            </Button>
                          ) : (
                            ""
                          )}
                          
                          <div style={{ minWidth: "250px" }}>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Search products..."
                              value={productSearch}
                              onChange={searchProducts}
                              name="search"
                            />
                          </div>
                        </div>

                        <div className="table-responsive">
                          <Table className="table table-bordered mb-4">
                            <thead>
                              <tr className="text-center">
                                <th>S.No</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category Name</th>
                                <th>Type</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productLists.map((data, key) => (
                                <tr key={key} className="text-center align-middle">
                                  <td>{(productPageNumber * listPerPage) + key + 1}</td>
                                  <td>
                                    <img
                                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                                      src={URLS.Base + data.image}
                                      alt={data.name}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "";
                                      }}
                                    />
                                  </td>
                                  <td className="fw-bold">{data.name}</td>
                                  <td>
                                    <span className="badge bg-info">{data.categoryName}</span>
                                  </td>
                                  <td>
                                    <span className={`badge ${data.foodType === 'Veg' ? 'bg-success' : 'bg-danger'}`}>
                                      {data.foodType}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2">
                                      {Roles.foodProductEdit || Roles?.accessAll === true ? (
                                        <Button
                                          onClick={() => getProductPopup(data)}
                                          color="success"
                                          outline
                                          size="sm"
                                          title="Edit Product"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {Roles.foodProductDelete || Roles?.accessAll === true ? (
                                        <Button
                                          onClick={() => manageProductDelete(data)}
                                          color="danger"
                                          outline
                                          size="sm"
                                          title="Delete Product"
                                        >
                                          <i className="bx bx-trash"></i>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          
                          {productLists.length === 0 && (
                            <div className="text-center py-4">
                              <i className="fas fa-utensils fa-3x text-muted mb-3"></i>
                              <h5>No products found</h5>
                              <p className="text-muted">Add a food product to get started</p>
                            </div>
                          )}
                          
                          {products.length > listPerPage && (
                            <div className="mt-3 d-flex justify-content-end">
                              <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={productPageCount}
                                onPageChange={changeProductPage}
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
            </TabPane>
          </TabContent>
        </Container>

        {/* ==================== EDIT CATEGORY MODAL ==================== */}
        <Modal
          size="md"
          isOpen={modal_small && activeTab === 'categories'}
          toggle={tog_small}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Edit Food Category</h5>
            <button
              onClick={tog_small}
              type="button"
              className="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleCategoryEditSubmit}>
              <div className="mb-3">
                <Label>
                  Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  required
                  name="name"
                  value={categoryEditForm.name || ""}
                  onChange={handleCategoryEditChange}
                  minLength="2"
                  maxLength="50"
                />
              </div>
              <div className="mb-3">
                <Label>
                  Image
                  <small className="text-muted ms-2">(Optional) 165*170px</small>
                </Label>
                <Input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={categoryEditChangeHandler}
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
                />
                {fileError1 && (
                  <div className="text-danger small mt-1">
                    <i className="fas fa-exclamation-triangle"></i> {fileError1}
                  </div>
                )}
                {categoryEditForm.image && (
                  <div className="mt-2 d-flex align-items-center">
                    <small className="text-muted me-2">Current:</small>
                    <img 
                      src={URLS.Base + categoryEditForm.image} 
                      alt="Current" 
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <Button
                  onClick={tog_small}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Update <i className="fas fa-check-circle"></i>
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* ==================== EDIT PRODUCT MODAL ==================== */}
        <Modal
          size="lg"
          isOpen={modal_small && activeTab === 'products'}
          toggle={tog_small}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Edit Food Product</h5>
            <button
              onClick={tog_small}
              type="button"
              className="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleProductEditSubmit}>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>
                      Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      required
                      name="name"
                      value={productEditForm.name || ""}
                      onChange={handleProductEditChange}
                      minLength="2"
                      maxLength="100"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label>
                      Image
                      <small className="text-muted ms-2">(Optional)</small>
                    </Label>
                    <Input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={productEditChangeHandler}
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
                    />
                    {fileError1 && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-triangle"></i> {fileError1}
                      </div>
                    )}
                    {productEditForm.image && (
                      <div className="mt-2 d-flex align-items-center">
                        <small className="text-muted me-2">Current:</small>
                        <img 
                          src={URLS.Base + productEditForm.image} 
                          alt="Current" 
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Category <span className="text-danger">*</span></Label>
                    <select
                      value={productEditForm.categoryId || ""}
                      name="categoryId"
                      required
                      onChange={handleProductEditChange}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      {categories.map((data, key) => (
                        <option key={key} value={data._id}>
                          {data.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Food Type <span className="text-danger">*</span></Label>
                    <select
                      value={productEditForm.foodType || ""}
                      name="foodType"
                      required
                      onChange={handleProductEditChange}
                      className="form-select"
                    >
                      <option value="">Select Type</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-veg">Non-Veg</option>
                    </select>
                  </div>
                </Col>
              </Row>
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <Button
                  onClick={tog_small}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Update <i className="fas fa-check-circle"></i>
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </React.Fragment>
  )
}

export default Banner