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
  Alert,
  Spinner,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"
import Select from "react-select"
import { useHistory } from "react-router-dom"

const Banner = () => {
  const history = useHistory()
  
  // ==================== STATE VARIABLES ====================
  // Modal states
  const [modal_small, setmodal_small] = useState(false)
  const [product_modal, setproduct_modal] = useState(false)
  const [activeTab, setActiveTab] = useState("categories")
  
  // Data states
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [Occasions, setOccasions] = useState([])
  
  // Category form states
  const [categoryForm, setCategoryForm] = useState({
    name: ""
  })
  const [categoryEditForm, setCategoryEditForm] = useState({})
  const [categoryFiles, setCategoryFiles] = useState("")
  const [categoryEditFiles, setCategoryEditFiles] = useState("")
  
  // Product form states
  const [productForm, setProductForm] = useState({
    categoryId: "",
    name: "",
    type: "",
    price: "",
    occasionId: "",
    cakeType: "",
    cakePremiumOrNormal: "",
    cakesFilds: false,
    dropdown: false,
    increment: false
  })
  const [productEditForm, setProductEditForm] = useState({
    categoryId: "",
    name: "",
    type: "",
    price: "",
    occasionId: "",
    cakeType: "",
    cakePremiumOrNormal: "",
    cakesFilds: false,
    dropdown: false,
    increment: false
  })
  
  // File states
  const [productFiles, setProductFiles] = useState("")
  const [productEditFiles, setProductEditFiles] = useState("")
  
  // Selection states
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOptions1, setSelectedOptions1] = useState([])
  const [productCategory, setProductCategory] = useState({})
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [fileError, setFileError] = useState("")
  const [fileError1, setFileError1] = useState("")
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [isAllSelected1, setIsAllSelected1] = useState(false)
  
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
  
  // ==================== OPTIONS FOR SELECT ====================
  const options = [
    { value: 'all', label: '🎉 All Occasions (Select All)' },
    ...Occasions.map(response => ({
      value: response._id,
      label: response.name,
    }))
  ];
  
  // ==================== OCCASION SELECTION HANDLERS ====================
  const multis = selectedOptions => {
    const allOptionSelected = selectedOptions.some(option => option.value === 'all');
    
    if (allOptionSelected) {
      const allOptions = options.filter(option => option.value !== 'all');
      setSelectedOptions(allOptions);
      setIsAllSelected(true);
      toast.success("All occasions selected");
    } else {
      setSelectedOptions(selectedOptions);
      setIsAllSelected(selectedOptions.length === options.filter(opt => opt.value !== 'all').length);
    }
  }

  const multis1 = selectedOptions1 => {
    const allOptionSelected = selectedOptions1.some(option => option.value === 'all');
    
    if (allOptionSelected) {
      const allOptions = options.filter(option => option.value !== 'all');
      setSelectedOptions1(allOptions);
      setIsAllSelected1(true);
      toast.success("All occasions selected");
    } else {
      setSelectedOptions1(selectedOptions1);
      setIsAllSelected1(selectedOptions1.length === options.filter(opt => opt.value !== 'all').length);
    }
  }

  const selectAllOccasions = () => {
    const allOptions = options.filter(option => option.value !== 'all');
    setSelectedOptions(allOptions);
    setIsAllSelected(true);
    toast.success("All occasions selected");
  }

  const clearAllOccasions = () => {
    setSelectedOptions([]);
    setIsAllSelected(false);
    toast.info("All occasions cleared");
  }

  const selectAllOccasions1 = () => {
    const allOptions = options.filter(option => option.value !== 'all');
    setSelectedOptions1(allOptions);
    setIsAllSelected1(true);
    toast.success("All occasions selected");
  }

  const clearAllOccasions1 = () => {
    setSelectedOptions1([]);
    setIsAllSelected1(false);
    toast.info("All occasions cleared");
  }
  
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

  const productFileHandler = e => {
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

  const productEditFileHandler = e => {
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

  const handleCategorySelectChange = e => {
    const selectedCategoryId = e.target.value
    const selectedOption = categories.find(
      option => option._id === selectedCategoryId
    )
    
    if (selectedOption) {
      const isCakeCategory = selectedOption.name === "Cakes" || selectedOption.name === "Customisation Cakes"
      const isRosesOrPhotography = selectedOption.name === "Roses" || selectedOption.name === "Photography"
      
      setProductForm(prevForm => ({
        ...prevForm,
        categoryId: selectedCategoryId,
        cakeType: isCakeCategory ? prevForm.cakeType : "",
        cakePremiumOrNormal: isCakeCategory ? prevForm.cakePremiumOrNormal : "",
        cakesFilds: isCakeCategory,
        dropdown: isCakeCategory,
        increment: !isCakeCategory && !isRosesOrPhotography
      }))
      
      setProductCategory(selectedOption)
    }
  }

  const handleCategoryEditSelectChange = e => {
    const selectedCategoryId = e.target.value
    const selectedOption = categories.find(
      option => option._id === selectedCategoryId
    )
    
    if (selectedOption) {
      const isCakeCategory = selectedOption.name === "Cakes" || selectedOption.name === "Customisation Cakes"
      const isRosesOrPhotography = selectedOption.name === "Roses" || selectedOption.name === "Photography"
      
      setProductEditForm(prevForm => ({
        ...prevForm,
        categoryId: selectedCategoryId,
        cakeType: isCakeCategory ? prevForm.cakeType : "",
        cakePremiumOrNormal: isCakeCategory ? prevForm.cakePremiumOrNormal : "",
        cakesFilds: isCakeCategory,
        dropdown: isCakeCategory,
        increment: !isCakeCategory && !isRosesOrPhotography
      }))
    }
  }
  
  // ==================== MODAL TOGGLES ====================
  function tog_small() {
    setmodal_small(!modal_small)
    setFileError1("");
  }

  function tog_product_modal() {
    setproduct_modal(!product_modal)
    setFileError("");
  }
  
  // ==================== API CALLS ====================
  useEffect(() => {
    GetOcation()
    GetCategories()
    GetAllProducts()
  }, [])

  const GetOcation = () => {
    axios
      .post(
        URLS.GetService,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setOccasions(res.data.occasions)
      })
      .catch(error => {
        toast.error("Failed to load occasions");
      })
  }

  const GetCategories = () => {
    axios
      .post(
        URLS.GetCategory,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setCategories(res.data.categorys)
      })
      .catch(error => {
        toast.error("Failed to load categories");
      })
  }

  const GetAllProducts = () => {
    axios
      .post(
        URLS.GetProducts,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setProducts(res.data.products)
        setAllProducts(res.data.products)
      })
      .catch(error => {
        toast.error("Failed to load products");
      })
  }

  // ==================== CATEGORY CRUD ====================
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
      .post(URLS.AddCategory, dataArray, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("addingCategory");
          toast.success(res.data.message)
          GetCategories()
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
    setIsEditing(true);
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
      .put(URLS.UpdateCategory + formid, dataArray, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("updatingCategory");
          toast.success(res.data.message)
          GetCategories()
          setmodal_small(false)
          clearCategoryEditForm()
        }
      })
      .catch(error => {
        toast.dismiss("updatingCategory");
        handleApiError(error);
      })
      .finally(() => {
        setIsEditing(false);
      })
  }

  const DeleteCategory = data => {
    var remid = data._id
    axios
      .delete(URLS.DeleteCategory + remid, {
        headers: { Authorization: `Bearer ${datas}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          GetCategories()
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
    
    if (!productForm.type) {
      toast.error("Please select product type");
      return;
    }
    
    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if (productForm.cakesFilds) {
      if (!productForm.cakeType) {
        toast.error("Please select cake type");
        return;
      }
      if (!productForm.cakePremiumOrNormal) {
        toast.error("Please select premium type");
        return;
      }
    }
    
    if (selectedOptions.length === 0) {
      toast.error("Please select at least one occasion");
      return;
    }
    
    AddProduct()
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
    
    if (!productEditForm.type) {
      toast.error("Please select product type");
      return;
    }
    
    if (!productEditForm.price || parseFloat(productEditForm.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (productEditForm.cakesFilds) {
      if (!productEditForm.cakeType) {
        toast.error("Please select cake type");
        return;
      }
      if (!productEditForm.cakePremiumOrNormal) {
        toast.error("Please select premium type");
        return;
      }
    }

    if (selectedOptions1.length === 0) {
      toast.error("Please select at least one occasion");
      return;
    }
    
    EditProduct()
  }

  const AddProduct = () => {
    setIsSubmitting(true);
    
    const dataArray = new FormData()
    dataArray.append("categoryId", productForm.categoryId)
    dataArray.append("name", productForm.name.trim())
    dataArray.append("type", productForm.type)
    dataArray.append("price", parseFloat(productForm.price))
    
    if (productForm.cakesFilds) {
      dataArray.append("cakeType", productForm.cakeType)
      dataArray.append("cakePremiumOrNormal", productForm.cakePremiumOrNormal)
    } else {
      dataArray.append("cakeType", "")
      dataArray.append("cakePremiumOrNormal", "")
    }

    const filteredOccasions = selectedOptions.filter(option => option.value !== 'all');
    dataArray.append("occasionId", JSON.stringify(filteredOccasions))
    
    for (let i = 0; i < productFiles.length; i++) {
      dataArray.append("image", productFiles[i])
    }
    
    toast.info("Adding product...", { autoClose: false, toastId: "addingProduct" });
    
    axios
      .post(URLS.AddProducts, dataArray, {
        headers: { 
          Authorization: `Bearer ${datas}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000
      })
      .then(res => {
        if (res.status === 200) {
          toast.dismiss("addingProduct");
          toast.success(res.data.message)
          GetAllProducts()
          setproduct_modal(false)
          clearProductForm()
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

  const EditProduct = () => {
    setIsEditing(true);
    var formid = productEditForm._id;
    
    const dataArray = new FormData()
    dataArray.append("categoryId", productEditForm.categoryId)
    dataArray.append("name", productEditForm.name.trim())
    dataArray.append("type", productEditForm.type)
    dataArray.append("price", parseFloat(productEditForm.price))
    
    if (productEditForm.cakesFilds) {
      dataArray.append("cakeType", productEditForm.cakeType)
      dataArray.append("cakePremiumOrNormal", productEditForm.cakePremiumOrNormal)
    } else {
      dataArray.append("cakeType", "")
      dataArray.append("cakePremiumOrNormal", "")
    }

    const filteredOccasions1 = selectedOptions1.filter(option => option.value !== 'all');
    dataArray.append("occasionId", JSON.stringify(filteredOccasions1))
    
    if (productEditFiles && productEditFiles.length > 0) {
      for (let i = 0; i < productEditFiles.length; i++) {
        dataArray.append("image", productEditFiles[i])
      }
    }

    toast.info("Updating product...", { autoClose: false, toastId: "updatingProduct" });
    
    axios
      .put(URLS.UpdateProducts + formid, dataArray, {
        headers: { 
          Authorization: `Bearer ${datas}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000
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
        setIsEditing(false);
      })
  }

  const DeleteProduct = data => {
    var remid = data._id
    axios
      .delete(URLS.DeleteProducts + remid, {
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
    if (error.code === 'ECONNABORTED') {
      toast.error("Request timeout. File might be too large or network is slow");
    } else if (error.response) {
      if (error.response.status === 413) {
        toast.error("File too large. Maximum 30MB allowed");
      } else if (error.response.status === 400) {
        toast.error(error.response.data.message || "Validation error");
      } else if (error.response.status === 401) {
        toast.error("Unauthorized. Please login again");
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(`Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
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
      type: "",
      price: "",
      occasionId: "",
      cakeType: "",
      cakePremiumOrNormal: "",
      cakesFilds: false,
      dropdown: false,
      increment: false
    })
    setProductFiles("")
    setSelectedOptions([])
    setProductCategory({})
    setFileError("")
    setIsAllSelected(false)
  }

  const clearProductEditForm = () => {
    setProductEditForm({
      categoryId: "",
      name: "",
      type: "",
      price: "",
      occasionId: "",
      cakeType: "",
      cakePremiumOrNormal: "",
      cakesFilds: false,
      dropdown: false,
      increment: false
    })
    setProductEditFiles("")
    setSelectedOptions1([])
    setFileError1("")
    setIsAllSelected1(false)
  }

  // ==================== POPUP FUNCTIONS ====================
  const getCategoryPopup = data => {
    setCategoryEditForm(data)
    tog_small()
  }

  const getProductPopup = data => {
    const isCakeCategory = data.categoryName === "Cakes" || data.categoryName === "Customisation Cakes"
    setProductEditForm({
      ...data,
      cakesFilds: isCakeCategory,
      dropdown: isCakeCategory,
      increment: !isCakeCategory && data.categoryName !== "Roses" && data.categoryName !== "Photography"
    })
    
    if (data.occasionId && Array.isArray(data.occasionId)) {
      const editOptions = data.occasionId.map(occ => {
        const occasion = Occasions.find(o => o._id === occ.value || o._id === occ._id);
        return occasion ? { value: occasion._id, label: occasion.name } : null;
      }).filter(Boolean);
      
      setSelectedOptions1(editOptions);
      setIsAllSelected1(editOptions.length === Occasions.length);
    } else {
      setSelectedOptions1([]);
      setIsAllSelected1(false);
    }
    
    setFileError1("")
    tog_small()
  }

  const openProductModal = (category) => {
    setProductForm(prev => ({
      ...prev,
      categoryId: category._id,
      cakesFilds: category.name === "Cakes" || category.name === "Customisation Cakes"
    }))
    setProductCategory(category)
    setproduct_modal(true)
  }

  // ==================== SEARCH FUNCTIONS ====================
  const searchCategories = e => {
    const value = e.target.value
    setCategorySearch(value)

    axios
      .post(
        URLS.GetCategorySearch + `${value}`,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setCategories(res.data.categorys)
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
        URLS.GetProductsSearch + `${value}`,
        {},
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then(res => {
        setProducts(res.data.products)
      })
      .catch(error => {
        console.error("Search error:", error);
      })
  }

  const handleCategoryFilter = e => {
    const selectedCategoryId = e.target.value
    
    if (selectedCategoryId === "") {
      setProducts(allProducts)
    } else {
      const filteredProducts = allProducts.filter(
        product => product.categoryId === selectedCategoryId
      )
      setProducts(filteredProducts)
    }
    setProductPageNumber(0)
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
            breadcrumbItem="Categories & Products"
          />
          
          {/* File size warning alert */}
          <Alert color="info" className="mb-3">
            <i className="fas fa-info-circle me-2"></i>
            Maximum file size: 30MB | Allowed formats: JPG, JPEG, PNG, GIF, BMP, TIFF
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
                Categories
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'products' ? 'active' : ''}
                onClick={() => setActiveTab('products')}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-box me-2"></i>
                Products
              </NavLink>
            </NavItem>
          </Nav>
          
          <TabContent activeTab={activeTab}>
            {/* ==================== CATEGORIES TAB ==================== */}
            <TabPane tabId="categories">
              <Row>
                {Roles.addOnsAdd || Roles?.accessAll === true ? (
                  <Col md={4}>
                    <Card>
                      <CardHeader className="bg-white">
                        <CardTitle>Add Category</CardTitle>
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
                              <small className="text-muted ms-2">Recommended: 298*180px</small>
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
                
                <Col md={Roles.addOnsAdd || Roles?.accessAll === true ? 8 : 12}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Categories List</CardTitle>
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
                                  <td>{(categoryPageNumber) * listPerPage + key + 1}</td>
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
                                      {/* Add Product Button */}
                                      {Roles.productsAdd || Roles?.accessAll === true ? (
                                        <Button
                                          onClick={() => openProductModal(data)}
                                          color="warning"
                                          outline
                                          size="sm"
                                          title="Add Product to this Category"
                                        >
                                          <i className="bx bx-plus"></i>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      
                                      {/* View Products Button */}
                                      {Roles.productsView || Roles?.accessAll === true ? (
                                        <Button
                                          onClick={() => {
                                            setActiveTab('products');
                                            // Filter products by this category
                                            const filtered = allProducts.filter(p => p.categoryId === data._id);
                                            setProducts(filtered);
                                          }}
                                          color="info"
                                          outline
                                          size="sm"
                                          title="View Products in this Category"
                                        >
                                          <i className="bx bx-show"></i>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      
                                      {/* Edit Category Button */}
                                      {Roles.addOnsEdit || Roles?.accessAll === true ? (
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
                                      
                                      {/* Delete Category Button */}
                                      {Roles.addOnsDelete || Roles?.accessAll === true ? (
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
                              <p className="text-muted">Add a category to get started</p>
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
            
            {/* ==================== PRODUCTS TAB ==================== */}
            <TabPane tabId="products">
              <Row>
                <Col md={12}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Products List</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                            {Roles.productsAdd || Roles?.accessAll === true ? (
                              <Button
                                onClick={() => {
                                  setproduct_modal(true)
                                  clearProductForm();
                                }}
                                color="primary"
                              >
                                Add New Product <i className="bx bx-plus"></i>
                              </Button>
                            ) : (
                              ""
                            )}
                            
                            <div className="d-flex align-items-center gap-2">
                              <Label className="mb-0 fw-bold">Filter by Category:</Label>
                              <select
                                onChange={handleCategoryFilter}
                                className="form-select"
                                style={{ width: "200px" }}
                              >
                                <option value="">All Categories</option>
                                {categories.map((data, key) => (
                                  <option key={key} value={data._id}>
                                    {data.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
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
                                <th>Category</th>
                                <th>Type</th>
                                <th>Cake Type</th>
                                <th>Premium</th>
                                <th>Price</th>
                                <th>Occasions</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productLists.map((data, key) => (
                                <tr key={key} className="text-center align-middle">
                                  <td>{(productPageNumber) * listPerPage + key + 1}</td>
                                  <td>
                                    <img
                                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
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
                                    <Badge color="info" pill>
                                      {data.categoryName}
                                    </Badge>
                                  </td>
                                  <td>{data.type}</td>
                                  <td>{data.cakeType || "N/A"}</td>
                                  <td>
                                    {data.cakePremiumOrNormal ? (
                                      <Badge color={data.cakePremiumOrNormal === "premium" ? "warning" : "secondary"}>
                                        {data.cakePremiumOrNormal}
                                      </Badge>
                                    ) : "N/A"}
                                  </td>
                                  <td>
                                    <Badge color="success" pill>
                                      ₹{data.price} /-
                                    </Badge>
                                  </td>
                                  <td>
                                    {data.occasionId && Array.isArray(data.occasionId) ? 
                                      data.occasionId.length > 0 ? 
                                        data.occasionId.length === Occasions.length ? 
                                          <Badge color="primary">All Occasions</Badge> : 
                                          <Badge color="primary">{data.occasionId.length} occasion(s)</Badge>
                                        : <Badge color="secondary">None</Badge>
                                      : <Badge color="secondary">None</Badge>}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2">
                                      {Roles.productsEdit || Roles?.accessAll === true ? (
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
                                      {Roles.productsDelete || Roles?.accessAll === true ? (
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
                              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                              <h5>No products found</h5>
                              <p className="text-muted">Add a product or change your filter criteria</p>
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
          toggle={() => {
            setmodal_small(false)
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              Edit Category
            </h5>
            <button
              onClick={() => setmodal_small(false)}
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
                <Label for="edit-category-name">
                  Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="edit-category-name"
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
                <Label for="edit-category-image">
                  Image
                  <small className="text-muted ms-2">(Optional) Max 30MB</small>
                </Label>
                <Input
                  type="file"
                  className="form-control"
                  id="edit-category-image"
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
                  <div className="mt-2">
                    <small className="text-muted">Current:</small>
                    <img 
                      src={URLS.Base + categoryEditForm.image} 
                      alt="Current" 
                      style={{ width: "50px", height: "50px", objectFit: "cover", marginLeft: "10px", borderRadius: "5px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
              <hr />
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => setmodal_small(false)}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button 
                  className="m-1" 
                  color="primary" 
                  type="submit"
                  disabled={isEditing}
                >
                  {isEditing ? (
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
          toggle={() => setmodal_small(false)}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Edit Product</h5>
            <button
              onClick={() => setmodal_small(false)}
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
                <Col md="12">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Label>
                        Occasion Name
                        <span className="text-danger">*</span>
                        {isAllSelected1 && (
                          <Badge color="success" className="ms-2">
                            <i className="fas fa-check-circle me-1"></i>
                            All Selected
                          </Badge>
                        )}
                      </Label>
                      <div className="d-flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          color="primary"
                          onClick={selectAllOccasions1}
                          outline
                        >
                          <i className="fas fa-check-double me-1"></i>
                          Select All
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          color="secondary"
                          onClick={clearAllOccasions1}
                          outline
                        >
                          <i className="fas fa-times me-1"></i>
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <Select
                      options={options}
                      placeholder="Select occasions or choose 'All Occasions'"
                      value={selectedOptions1}
                      onChange={multis1}
                      isSearchable={true}
                      isMulti
                      required
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                    />
                    <small className="text-muted">
                      {selectedOptions1.length > 0 ? (
                        <span>
                          <i className="fas fa-check text-success me-1"></i>
                          {selectedOptions1.length} occasion(s) selected
                          {isAllSelected1 && " (All occasions)"}
                        </span>
                      ) : (
                        "Select at least one occasion or choose 'All Occasions'"
                      )}
                    </small>
                  </div>
                </Col>
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>Category</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={productEditForm.categoryId || ""}
                      name="categoryId"
                      required
                      onChange={handleCategoryEditSelectChange}
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
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>
                      Type <span className="text-danger">*</span>
                    </Label>
                    <select
                      value={productEditForm.type || ""}
                      name="type"
                      required
                      onChange={handleProductEditChange}
                      className="form-select"
                    >
                      <option value="">Select Type</option>
                      <option value="quantity">Quantity</option>
                      <option value="grams">Grams</option>
                    </select>
                  </div>
                </Col>
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>
                      Price <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      placeholder={productEditForm.type === "quantity" ? "Price per piece" : "Price per 500 grams"}
                      required
                      name="price"
                      value={productEditForm.price || ""}
                      onChange={handleProductEditChange}
                      min="1"
                      step="0.01"
                    />
                  </div>
                </Col>

                {productEditForm.cakesFilds && (
                  <>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Cake Type <span className="text-danger">*</span></Label>
                        <select
                          value={productEditForm.cakeType || ""}
                          name="cakeType"
                          required
                          onChange={handleProductEditChange}
                          className="form-select"
                        >
                          <option value="">Select Cake Type</option>
                          <option value="egg">Egg</option>
                          <option value="eggless">Egg Less</option>
                        </select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Is Premium <span className="text-danger">*</span></Label>
                        <select
                          value={productEditForm.cakePremiumOrNormal || ""}
                          name="cakePremiumOrNormal"
                          required
                          onChange={handleProductEditChange}
                          className="form-select"
                        >
                          <option value="">Select Premium Type</option>
                          <option value="premium">Premium</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>
                    </Col>
                  </>
                )}
                
                <Col md="12">
                  <div className="mb-3">
                    <Label>
                      Image
                      <small className="text-muted ms-2">(Optional) Max 30MB</small>
                    </Label>
                    <Input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={productEditFileHandler}
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
                    />
                    {fileError1 && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-triangle"></i> {fileError1}
                      </div>
                    )}
                    {productEditForm.image && (
                      <div className="mt-2">
                        <small className="text-muted">Current:</small>
                        <img 
                          src={URLS.Base + productEditForm.image} 
                          alt="Current" 
                          style={{ width: "50px", height: "50px", objectFit: "cover", marginLeft: "10px", borderRadius: "5px" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <hr />
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => setmodal_small(false)}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button 
                  className="m-1" 
                  color="primary" 
                  type="submit"
                  disabled={isEditing}
                >
                  {isEditing ? (
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

        {/* ==================== ADD PRODUCT MODAL ==================== */}
        <Modal
          size="lg"
          isOpen={product_modal}
          toggle={tog_product_modal}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add New Product</h5>
            <button
              onClick={tog_product_modal}
              type="button"
              className="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleProductSubmit}>
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Label>
                        Occasion Name
                        <span className="text-danger">*</span>
                        {isAllSelected && (
                          <Badge color="success" className="ms-2">
                            <i className="fas fa-check-circle me-1"></i>
                            All Selected
                          </Badge>
                        )}
                      </Label>
                      <div className="d-flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          color="primary"
                          onClick={selectAllOccasions}
                          outline
                        >
                          <i className="fas fa-check-double me-1"></i>
                          Select All
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          color="secondary"
                          onClick={clearAllOccasions}
                          outline
                        >
                          <i className="fas fa-times me-1"></i>
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <Select
                      options={options}
                      placeholder="Select occasions or choose 'All Occasions'"
                      value={selectedOptions}
                      onChange={multis}
                      isSearchable={true}
                      isMulti
                      required
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                    />
                    <small className="text-muted">
                      {selectedOptions.length > 0 ? (
                        <span>
                          <i className="fas fa-check text-success me-1"></i>
                          {selectedOptions.length} occasion(s) selected
                          {isAllSelected && " (All occasions)"}
                        </span>
                      ) : (
                        "Select at least one occasion or choose 'All Occasions'"
                      )}
                    </small>
                  </div>
                </Col>
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>Category</Label>
                    <span className="text-danger">*</span>
                    <select
                      value={productForm.categoryId}
                      name="categoryId"
                      required
                      onChange={handleCategorySelectChange}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      {categories.map((data, key) => (
                        <option key={key} value={data._id}>
                          {data.name}
                        </option>
                      ))}
                    </select>
                    {productCategory.name && (
                      <small className="text-muted">
                        Selected: <Badge color="info">{productCategory.name}</Badge>
                      </small>
                    )}
                  </div>
                </Col>
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>
                      Product Name <span className="text-danger">*</span>
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
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>
                      Product Image <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="file"
                      className="form-control"
                      required
                      name="image"
                      onChange={productFileHandler}
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
                    />
                    {fileError && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-triangle"></i> {fileError}
                      </div>
                    )}
                  </div>
                </Col>

                {productForm.cakesFilds && (
                  <>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Cake Type <span className="text-danger">*</span></Label>
                        <select
                          value={productForm.cakeType}
                          name="cakeType"
                          required
                          onChange={handleProductChange}
                          className="form-select"
                        >
                          <option value="">Select Cake Type</option>
                          <option value="egg">Egg</option>
                          <option value="eggless">Egg Less</option>
                        </select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Is Premium <span className="text-danger">*</span></Label>
                        <select
                          value={productForm.cakePremiumOrNormal}
                          name="cakePremiumOrNormal"
                          required
                          onChange={handleProductChange}
                          className="form-select"
                        >
                          <option value="">Select Premium Type</option>
                          <option value="premium">Premium</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>
                    </Col>
                  </>
                )}

                <Col md="6">
                  <div className="mb-3">
                    <Label>Type <span className="text-danger">*</span></Label>
                    <select
                      value={productForm.type}
                      name="type"
                      required
                      onChange={handleProductChange}
                      className="form-select"
                    >
                      <option value="">Select Type</option>
                      <option value="quantity">Quantity</option>
                      <option value="grams">Grams</option>
                    </select>
                  </div>
                </Col>
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>
                      Price <span className="text-danger">*</span>
                      {productForm.type === "quantity" ? (
                        <small className="text-muted"> (Price per piece)</small>
                      ) : (
                        <small className="text-muted"> (Price for 500 grams)</small>
                      )}
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      placeholder="Enter Price"
                      required
                      name="price"
                      value={productForm.price}
                      onChange={handleProductChange}
                      min="1"
                      step="0.01"
                    />
                  </div>
                </Col>
              </Row>
              
              <hr />
              <div style={{ float: "right" }}>
                <Button
                  onClick={tog_product_modal}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button 
                  className="m-1" 
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
                      Add Product <i className="fas fa-check-circle"></i>
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