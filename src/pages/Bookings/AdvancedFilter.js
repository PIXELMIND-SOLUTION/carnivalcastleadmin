import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Label,
  Input,
  Table,
  Badge,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Pagination,
  PaginationItem,
  PaginationLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { useHistory, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { URLS } from "../../Weburls";

const AdvancedFilter = () => {
  const history = useHistory();
  const location = useLocation();
  
  // ========== STATE PERSISTENCE: Check if returning from detail page ==========
  const [isReturningFromDetail, setIsReturningFromDetail] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("confirmed");
  
  // Categories from AddOns
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // State management for both confirmed and cake bookings
  const [confirmedFilters, setConfirmedFilters] = useState({
    addressName: "",
    bookingSource: "",
    heardFrom: "",
    theatreName: "",
    occasionName: "",
    status: "",
    eventDate: "",
    eventFromDate: "",
    eventToDate: "",
    bookingDate: "",
    bookingFromDate: "",
    bookingToDate: "",
    searchQuery: ""
  });
  
  const [cakeFilters, setCakeFilters] = useState({
    addressName: "",
    bookingSource: "",
    heardFrom: "",
    theatreName: "",
    occasionName: "",
    status: "",
    eventDate: "",
    eventFromDate: "",
    eventToDate: "",
    bookingDate: "",
    bookingFromDate: "",
    bookingToDate: "",
    searchQuery: "",
    productName: "",
    productType: "",
    categoryName: ""
  });
  
  // Data states for both types
  const [confirmedUsers, setConfirmedUsers] = useState([]);
  const [cakeUsers, setCakeUsers] = useState([]);
  const [allConfirmedBookings, setAllConfirmedBookings] = useState([]);
  const [allCakeBookings, setAllCakeBookings] = useState([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  
  // Unique values for dropdowns
  const [confirmedUniqueValues, setConfirmedUniqueValues] = useState({
    addressNames: [],
    bookingSources: [],
    heardFromOptions: [],
    theatreNames: [],
    occasionNames: [],
    statusOptions: []
  });
  
  const [cakeUniqueValues, setCakeUniqueValues] = useState({
    addressNames: [],
    bookingSources: [],
    heardFromOptions: [],
    theatreNames: [],
    occasionNames: [],
    statusOptions: [],
    productNames: [],
    productTypes: [],
    categoryNames: []
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemsPerPageDropdownOpen, setItemsPerPageDropdownOpen] = useState(false);
  
  // Data limit state
  const [dataLimit, setDataLimit] = useState(100);
  const [dataLimitDropdownOpen, setDataLimitDropdownOpen] = useState(false);
  const [totalRecordsCount, setTotalRecordsCount] = useState({
    confirmed: 0,
    cake: 0
  });
  
  // Modal state for edit
  const [editModal, setEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    cancellReason: ""
  });
  
  // State for export data
  const [exportData, setExportData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  
  // Get token from localStorage
  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const token = data?.token;
  const Roles = data?.rolesAndPermission[0];
  const baseUrl = "https://api.carnivalcastle.com/";

  // ========== STORAGE FUNCTIONS ==========
  // Store current state in sessionStorage
  const storeCurrentState = () => {
    const stateToStore = {
      activeTab,
      confirmedFilters,
      cakeFilters,
      confirmedUsers,
      cakeUsers,
      allConfirmedBookings,
      allCakeBookings,
      currentPage,
      itemsPerPage,
      dataLimit,
      selectedCategory,
      categories,
      confirmedUniqueValues,
      cakeUniqueValues,
      isAnyFilterActive: isAnyFilterActive(),
      lastFetchTime: new Date().getTime()
    };
    
    sessionStorage.setItem("advancedFilterState", JSON.stringify(stateToStore));
  };

  // Restore state from sessionStorage
  const restoreState = () => {
    const savedState = sessionStorage.getItem("advancedFilterState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        
        // Check if state is not too old (e.g., 5 minutes)
        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (parsed.lastFetchTime && (now - parsed.lastFetchTime) < fiveMinutes) {
          setActiveTab(parsed.activeTab || "confirmed");
          setConfirmedFilters(parsed.confirmedFilters || {
            addressName: "",
            bookingSource: "",
            heardFrom: "",
            theatreName: "",
            occasionName: "",
            status: "",
            eventDate: "",
            eventFromDate: "",
            eventToDate: "",
            bookingDate: "",
            bookingFromDate: "",
            bookingToDate: "",
            searchQuery: ""
          });
          setCakeFilters(parsed.cakeFilters || {
            addressName: "",
            bookingSource: "",
            heardFrom: "",
            theatreName: "",
            occasionName: "",
            status: "",
            eventDate: "",
            eventFromDate: "",
            eventToDate: "",
            bookingDate: "",
            bookingFromDate: "",
            bookingToDate: "",
            searchQuery: "",
            productName: "",
            productType: "",
            categoryName: ""
          });
          setConfirmedUsers(parsed.confirmedUsers || []);
          setCakeUsers(parsed.cakeUsers || []);
          setAllConfirmedBookings(parsed.allConfirmedBookings || []);
          setAllCakeBookings(parsed.allCakeBookings || []);
          setCurrentPage(parsed.currentPage || 1);
          setItemsPerPage(parsed.itemsPerPage || 10);
          setDataLimit(parsed.dataLimit || 100);
          setSelectedCategory(parsed.selectedCategory || "");
          setCategories(parsed.categories || []);
          setConfirmedUniqueValues(parsed.confirmedUniqueValues || {
            addressNames: [],
            bookingSources: [],
            heardFromOptions: [],
            theatreNames: [],
            occasionNames: [],
            statusOptions: []
          });
          setCakeUniqueValues(parsed.cakeUniqueValues || {
            addressNames: [],
            bookingSources: [],
            heardFromOptions: [],
            theatreNames: [],
            occasionNames: [],
            statusOptions: [],
            productNames: [],
            productTypes: [],
            categoryNames: []
          });
          
          return true;
        }
      } catch (error) {
        console.error("Error restoring advanced filter state:", error);
      }
    }
    return false;
  };

  // Clear stored state
  const clearStoredState = () => {
    sessionStorage.removeItem("advancedFilterState");
    sessionStorage.removeItem("returnToAdvancedFilter");
  };

  // ========== API FUNCTIONS ==========
  // Fetch categories from AddOns API
  const fetchCategories = async () => {
    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/getalladdonproducts",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (res.status === 200) {
        const categoriesData = res?.data?.products || [];
        setCategories(categoriesData);
        
        // Extract category names for cake bookings
        const categoryNames = categoriesData.map(cat => cat.name).filter(Boolean);
        setCakeUniqueValues(prev => ({
          ...prev,
          categoryNames: categoryNames
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch total count of records for both types
  const fetchTotalCounts = () => {
    // Fetch confirmed bookings count
    axios.post(
      "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
      { limit: 1, getCountOnly: true },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then((res) => {
      if (res.data.success) {
        setTotalRecordsCount(prev => ({
          ...prev,
          confirmed: res.data.totalCount || 0
        }));
      }
    })
    .catch(error => {
      console.error("Error fetching confirmed count:", error);
    });
    
    // Fetch cake bookings count
    axios.post(
      "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getallcakesbookings",
      { limit: 1, getCountOnly: true },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then((res) => {
      if (res.data.success) {
        setTotalRecordsCount(prev => ({
          ...prev,
          cake: res.data.totalCount || 0
        }));
      }
    })
    .catch(error => {
      console.error("Error fetching cake count:", error);
    });
  };

  // Fetch confirmed bookings with dynamic limit
  const fetchConfirmedBookings = (limit = dataLimit, isInitial = false, skipStore = false) => {
    if (isInitial) {
      setIsLoading(true);
      setIsInitialLoad(true);
    }
    
    axios.post(
      "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
      { limit: limit },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then((res) => {
      if (res.data.success) {
        const bookings = res.data.data || [];
        setAllConfirmedBookings(bookings);
        setConfirmedUsers(bookings);
        
        if (activeTab === "confirmed") {
          setExportData(bookings);
        }
        
        setCurrentPage(1);
        
        // Extract unique values from data
        const addressNames = [...new Set(bookings.map(item => item.addressName).filter(Boolean))];
        const bookingSources = [...new Set(bookings.map(item => item.bookingSource).filter(Boolean))];
        const heardFromOptions = [...new Set(bookings.map(item => item.heardFrom).filter(Boolean))];
        const theatreNames = [...new Set(bookings.map(item => item.theatreName).filter(Boolean))];
        const occasionNames = [...new Set(bookings.map(item => item.occasionName).filter(Boolean))];
        const statusOptions = [...new Set(bookings.map(item => item.status).filter(Boolean))];
        
        setConfirmedUniqueValues({
          addressNames,
          bookingSources,
          heardFromOptions,
          theatreNames,
          occasionNames,
          statusOptions
        });
        
        if (isInitial) {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
        
        // Apply prefilled filters if coming from main page
        if (location.state?.filters && !skipStore) {
          setConfirmedFilters(location.state.filters);
        }
        
        // Store state after successful fetch
        if (!skipStore) {
          storeCurrentState();
        }
      }
    })
    .catch(error => {
      console.error("Error fetching confirmed bookings:", error);
      toast.error("Failed to load confirmed bookings");
      if (isInitial) {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    });
  };

  // Fetch cake bookings with dynamic limit
  const fetchCakeBookings = (limit = dataLimit, isInitial = false, skipStore = false) => {
    if (isInitial && activeTab === "cake") {
      setIsLoading(true);
      setIsInitialLoad(true);
    }
    
    axios.post(
      "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getallcakesbookings",
      { limit: limit },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then((res) => {
      if (res.data.success) {
        const bookings = res.data.bookings || [];
        setAllCakeBookings(bookings);
        setCakeUsers(bookings);
        
        if (activeTab === "cake") {
          setExportData(bookings);
        }
        
        setCurrentPage(1);
        
        // Extract unique values from data
        const addressNames = [...new Set(bookings.map(item => item.addressName).filter(Boolean))];
        const bookingSources = [...new Set(bookings.map(item => item.bookingSource).filter(Boolean))];
        const heardFromOptions = [...new Set(bookings.map(item => item.heardFrom).filter(Boolean))];
        const theatreNames = [...new Set(bookings.map(item => item.theatreName).filter(Boolean))];
        const occasionNames = [...new Set(bookings.map(item => item.occasionName).filter(Boolean))];
        const statusOptions = [...new Set(bookings.map(item => item.status).filter(Boolean))];
        
        // Extract product names and types
        const productNames = [];
        const productTypes = [];
        
        bookings.forEach(booking => {
          if (booking.products && Array.isArray(booking.products)) {
            booking.products.forEach(product => {
              if (product.name && !productNames.includes(product.name)) {
                productNames.push(product.name);
              }
              if (product.type && !productTypes.includes(product.type)) {
                productTypes.push(product.type);
              }
            });
          }
        });
        
        setCakeUniqueValues(prev => ({
          ...prev,
          addressNames,
          bookingSources,
          heardFromOptions,
          theatreNames,
          occasionNames,
          statusOptions,
          productNames,
          productTypes
        }));
        
        if (isInitial && activeTab === "cake") {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
        
        // Store state after successful fetch
        if (!skipStore) {
          storeCurrentState();
        }
      }
    })
    .catch(error => {
      console.error("Error fetching cake bookings:", error);
      toast.error("Failed to load cake bookings");
      if (isInitial && activeTab === "cake") {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    });
  };

  // Handle data limit change
  const handleDataLimitChange = (limit) => {
    setDataLimit(limit);
    setDataLimitDropdownOpen(false);
    setCurrentPage(1);
    
    setIsLoading(true);
    
    if (activeTab === "confirmed") {
      axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
        { limit: limit },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((res) => {
        if (res.data.success) {
          const bookings = res.data.data || [];
          setAllConfirmedBookings(bookings);
          setConfirmedUsers(bookings);
          setExportData(bookings);
          
          // Extract unique values from new data
          const addressNames = [...new Set(bookings.map(item => item.addressName).filter(Boolean))];
          const bookingSources = [...new Set(bookings.map(item => item.bookingSource).filter(Boolean))];
          const heardFromOptions = [...new Set(bookings.map(item => item.heardFrom).filter(Boolean))];
          const theatreNames = [...new Set(bookings.map(item => item.theatreName).filter(Boolean))];
          const occasionNames = [...new Set(bookings.map(item => item.occasionName).filter(Boolean))];
          const statusOptions = [...new Set(bookings.map(item => item.status).filter(Boolean))];
          
          setConfirmedUniqueValues({
            addressNames,
            bookingSources,
            heardFromOptions,
            theatreNames,
            occasionNames,
            statusOptions
          });
          
          toast.success(`Loaded ${bookings.length} confirmed records`);
          
          // Store state after data limit change
          storeCurrentState();
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching confirmed data with new limit:", error);
        toast.error("Failed to load confirmed data");
        setIsLoading(false);
      });
    } else {
      axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getallcakesbookings",
        { limit: limit },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((res) => {
        if (res.data.success) {
          const bookings = res.data.bookings || [];
          setAllCakeBookings(bookings);
          setCakeUsers(bookings);
          setExportData(bookings);
          
          // Extract unique values from new data
          const addressNames = [...new Set(bookings.map(item => item.addressName).filter(Boolean))];
          const bookingSources = [...new Set(bookings.map(item => item.bookingSource).filter(Boolean))];
          const heardFromOptions = [...new Set(bookings.map(item => item.heardFrom).filter(Boolean))];
          const theatreNames = [...new Set(bookings.map(item => item.theatreName).filter(Boolean))];
          const occasionNames = [...new Set(bookings.map(item => item.occasionName).filter(Boolean))];
          const statusOptions = [...new Set(bookings.map(item => item.status).filter(Boolean))];
          
          // Extract product names and types
          const productNames = [];
          const productTypes = [];
          
          bookings.forEach(booking => {
            if (booking.products && Array.isArray(booking.products)) {
              booking.products.forEach(product => {
                if (product.name && !productNames.includes(product.name)) {
                  productNames.push(product.name);
                }
                if (product.type && !productTypes.includes(product.type)) {
                  productTypes.push(product.type);
                }
              });
            }
          });
          
          setCakeUniqueValues(prev => ({
            ...prev,
            addressNames,
            bookingSources,
            heardFromOptions,
            theatreNames,
            occasionNames,
            statusOptions,
            productNames,
            productTypes
          }));
          
          toast.success(`Loaded ${bookings.length} cake records`);
          
          // Store state after data limit change
          storeCurrentState();
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching cake data with new limit:", error);
        toast.error("Failed to load cake data");
        setIsLoading(false);
      });
    }
  };

  // ========== FILTER FUNCTIONS ==========
  // Check if any filter is active for current tab
  const isAnyFilterActive = () => {
    const currentFilters = activeTab === "confirmed" ? confirmedFilters : cakeFilters;
    return Object.values(currentFilters).some(value => value !== "");
  };

  // Format date to YYYY-MM-DD for comparison (logCreatedDate से)
  const getBookingDate = (booking) => {
    if (!booking || !booking.logCreatedDate) return null;
    
    // Parse the ISO date string and format to YYYY-MM-DD
    try {
      return moment(booking.logCreatedDate).format('YYYY-MM-DD');
    } catch (error) {
      return null;
    }
  };

  // Client-side filtering function for confirmed bookings
  const applyClientSideFiltersConfirmed = (bookings) => {
    if (!isAnyFilterActive()) {
      return bookings;
    }
    
    const filters = confirmedFilters;
    
    return bookings.filter(booking => {
      let passes = true;
      
      if (filters.addressName && booking.addressName !== filters.addressName) {
        passes = false;
      }
      
      if (passes && filters.bookingSource && booking.bookingSource !== filters.bookingSource) {
        passes = false;
      }
      
      if (passes && filters.heardFrom && booking.heardFrom !== filters.heardFrom) {
        passes = false;
      }
      
      if (passes && filters.theatreName && booking.theatreName !== filters.theatreName) {
        passes = false;
      }
      
      if (passes && filters.occasionName && booking.occasionName !== filters.occasionName) {
        passes = false;
      }
      
      if (passes && filters.status && booking.status !== filters.status) {
        passes = false;
      }
      
      // Event Date filters
      if (passes && filters.eventDate && booking.date !== filters.eventDate) {
        passes = false;
      }
      
      if (passes && filters.eventFromDate && filters.eventToDate) {
        const bookingEventDate = new Date(booking.date);
        const fromDate = new Date(filters.eventFromDate);
        const toDate = new Date(filters.eventToDate);
        
        if (bookingEventDate < fromDate || bookingEventDate > toDate) {
          passes = false;
        }
      }
      
      // Booking Date filters (logCreatedDate पर filter)
      if (passes && filters.bookingDate) {
        const bookingCreationDate = getBookingDate(booking);
        const filterBookingDate = filters.bookingDate;
        
        if (bookingCreationDate !== filterBookingDate) {
          passes = false;
        }
      }
      
      if (passes && filters.bookingFromDate && filters.bookingToDate) {
        const bookingCreationDate = getBookingDate(booking);
        const fromBookingDate = filters.bookingFromDate;
        const toBookingDate = filters.bookingToDate;
        
        if (!bookingCreationDate || bookingCreationDate < fromBookingDate || bookingCreationDate > toBookingDate) {
          passes = false;
        }
      }
      
      if (passes && filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesOrderId = booking.orderId?.toLowerCase().includes(searchLower);
        const matchesUserName = booking.userName?.toLowerCase().includes(searchLower);
        const matchesUserPhone = booking.userPhone?.includes(filters.searchQuery);
        const matchesTheatreName = booking.theatreName?.toLowerCase().includes(searchLower);
        const matchesOccasionName = booking.occasionName?.toLowerCase().includes(searchLower);
        
        if (!matchesOrderId && !matchesUserName && !matchesUserPhone && !matchesTheatreName && !matchesOccasionName) {
          passes = false;
        }
      }
      
      return passes;
    });
  };

  // Client-side filtering function for cake bookings (with category filter)
  const applyClientSideFiltersCake = (bookings) => {
    if (!isAnyFilterActive()) {
      return bookings;
    }
    
    const filters = cakeFilters;
    
    return bookings.filter(booking => {
      let passes = true;
      
      if (filters.addressName && booking.addressName !== filters.addressName) {
        passes = false;
      }
      
      if (passes && filters.bookingSource && booking.bookingSource !== filters.bookingSource) {
        passes = false;
      }
      
      if (passes && filters.heardFrom && booking.heardFrom !== filters.heardFrom) {
        passes = false;
      }
      
      if (passes && filters.theatreName && booking.theatreName !== filters.theatreName) {
        passes = false;
      }
      
      if (passes && filters.occasionName && booking.occasionName !== filters.occasionName) {
        passes = false;
      }
      
      if (passes && filters.status && booking.status !== filters.status) {
        passes = false;
      }
      
      // Event Date filters
      if (passes && filters.eventDate && booking.date !== filters.eventDate) {
        passes = false;
      }
      
      if (passes && filters.eventFromDate && filters.eventToDate) {
        const bookingEventDate = new Date(booking.date);
        const fromDate = new Date(filters.eventFromDate);
        const toDate = new Date(filters.eventToDate);
        
        if (bookingEventDate < fromDate || bookingEventDate > toDate) {
          passes = false;
        }
      }
      
      // Booking Date filters (logCreatedDate पर filter)
      if (passes && filters.bookingDate) {
        const bookingCreationDate = getBookingDate(booking);
        const filterBookingDate = filters.bookingDate;
        
        if (bookingCreationDate !== filterBookingDate) {
          passes = false;
        }
      }
      
      if (passes && filters.bookingFromDate && filters.bookingToDate) {
        const bookingCreationDate = getBookingDate(booking);
        const fromBookingDate = filters.bookingFromDate;
        const toBookingDate = filters.bookingToDate;
        
        if (!bookingCreationDate || bookingCreationDate < fromBookingDate || bookingCreationDate > toBookingDate) {
          passes = false;
        }
      }
      
      // Product filters for cake bookings
      if (passes && filters.productName) {
        const hasProduct = booking.products?.some(product => 
          product.name === filters.productName
        );
        if (!hasProduct) passes = false;
      }
      
      if (passes && filters.productType) {
        const hasProductType = booking.products?.some(product => 
          product.type === filters.productType
        );
        if (!hasProductType) passes = false;
      }
      
      // Category filter based on addon categories
      if (passes && filters.categoryName) {
        const categoryProducts = getProductsByCategory(filters.categoryName);
        const hasCategoryProduct = booking.products?.some(product => 
          categoryProducts.includes(product.name)
        );
        if (!hasCategoryProduct) passes = false;
      }
      
      if (passes && filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesOrderId = booking.orderId?.toLowerCase().includes(searchLower);
        const matchesUserName = booking.userName?.toLowerCase().includes(searchLower);
        const matchesUserPhone = booking.userPhone?.includes(filters.searchQuery);
        const matchesTheatreName = booking.theatreName?.toLowerCase().includes(searchLower);
        const matchesOccasionName = booking.occasionName?.toLowerCase().includes(searchLower);
        
        // Search in products
        const matchesProductName = booking.products?.some(product => 
          product.name?.toLowerCase().includes(searchLower)
        ) || false;
        
        if (!matchesOrderId && !matchesUserName && !matchesUserPhone && !matchesTheatreName && !matchesOccasionName && !matchesProductName) {
          passes = false;
        }
      }
      
      return passes;
    });
  };

  // Helper function to get products by category name
  const getProductsByCategory = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category && category.products) {
      return category.products.map(p => p.name);
    }
    return [];
  };

  // Apply filters for current tab
  const applyFilters = async (e) => {
    e?.preventDefault();
    setIsApplyingFilter(true);
    setCurrentPage(1);
    
    if (!isAnyFilterActive()) {
      if (activeTab === "confirmed") {
        setConfirmedUsers(allConfirmedBookings);
        setExportData(allConfirmedBookings);
      } else {
        setCakeUsers(allCakeBookings);
        setExportData(allCakeBookings);
      }
      toast.info(`Showing all ${activeTab} bookings (no filters applied)`);
      setIsApplyingFilter(false);
      
      // Store state after clearing filters
      storeCurrentState();
      return;
    }
    
    if (activeTab === "confirmed") {
      const filterData = {};
      const filters = confirmedFilters;
      
      if (filters.addressName) filterData.addressName = filters.addressName;
      if (filters.bookingSource) filterData.bookingSource = filters.bookingSource;
      if (filters.heardFrom) filterData.heardFrom = filters.heardFrom;
      if (filters.theatreName) filterData.theatreName = filters.theatreName;
      if (filters.occasionName) filterData.occasionName = filters.occasionName;
      if (filters.status) filterData.status = filters.status;
      if (filters.searchQuery) filterData.searchQuery = filters.searchQuery;
      
      if (filters.eventDate) filterData.singleDate = filters.eventDate;
      if (filters.eventFromDate && filters.eventToDate) {
        filterData.fromDate = filters.eventFromDate;
        filterData.toDate = filters.eventToDate;
      }
      
      // Add limit to filter request
      filterData.limit = dataLimit;

      try {
        const res = await axios.post(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
          filterData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (res.data.success) {
          let filteredData = res.data.data || [];
          
          const backendFilteredCorrectly = checkBackendFiltering(filteredData, filterData);
          
          if (!backendFilteredCorrectly && allConfirmedBookings.length > 0) {
            filteredData = applyClientSideFiltersConfirmed(allConfirmedBookings);
          } else if (backendFilteredCorrectly) {
            // Backend ने event date तो filter कर दिया, लेकिन booking date filter client side करना होगा
            if (filters.bookingDate || (filters.bookingFromDate && filters.bookingToDate)) {
              filteredData = applyClientSideFiltersConfirmed(filteredData);
            }
          }
          
          setConfirmedUsers(filteredData);
          setExportData(filteredData);
          
          if (filteredData.length === 0) {
            toast.info("No confirmed bookings found with the selected filters");
          } else {
            toast.success(`Found ${filteredData.length} confirmed bookings matching your criteria`);
          }
        } else {
          if (allConfirmedBookings.length > 0) {
            const clientFiltered = applyClientSideFiltersConfirmed(allConfirmedBookings);
            setConfirmedUsers(clientFiltered);
            setExportData(clientFiltered);
            toast.warning("Using client-side filtering");
          } else {
            setConfirmedUsers([]);
            setExportData([]);
            toast.error("No confirmed data found with the given filters");
          }
        }
        
        // Store state after applying filters
        storeCurrentState();
        setIsApplyingFilter(false);
      } catch (error) {
        console.error("Error applying confirmed filters:", error);
        
        if (allConfirmedBookings.length > 0) {
          const clientFiltered = applyClientSideFiltersConfirmed(allConfirmedBookings);
          setConfirmedUsers(clientFiltered);
          setExportData(clientFiltered);
          toast.warning("Using client-side filtering (network error)");
        } else {
          toast.error("Failed to apply confirmed filters");
        }
        setIsApplyingFilter(false);
      }
    } else {
      // For cake bookings - we'll use client-side filtering as API might not support all filters
      if (allCakeBookings.length > 0) {
        const clientFiltered = applyClientSideFiltersCake(allCakeBookings);
        setCakeUsers(clientFiltered);
        setExportData(clientFiltered);
        
        if (clientFiltered.length === 0) {
          toast.info("No cake bookings found with the selected filters");
        } else {
          toast.success(`Found ${clientFiltered.length} cake bookings matching your criteria`);
        }
        
        // Store state after applying filters
        storeCurrentState();
      } else {
        toast.error("No cake bookings data available");
      }
      setIsApplyingFilter(false);
    }
  };

  // Helper function to check if backend filtered correctly
  const checkBackendFiltering = (data, filterData) => {
    if (!data || data.length === 0) return true;
    
    if (filterData.bookingSource) {
      const hasWrongSource = data.some(item => 
        item.bookingSource && item.bookingSource !== filterData.bookingSource
      );
      
      if (hasWrongSource) {
        return false;
      }
    }
    
    if (filterData.addressName) {
      const hasWrongAddress = data.some(item => 
        item.addressName && item.addressName !== filterData.addressName
      );
      if (hasWrongAddress) return false;
    }
    
    if (filterData.occasionName) {
      const hasWrongOccasion = data.some(item => 
        item.occasionName && item.occasionName !== filterData.occasionName
      );
      if (hasWrongOccasion) return false;
    }
    
    return true;
  };

  // Clear all filters for current tab
  const clearFilters = () => {
    if (activeTab === "confirmed") {
      setConfirmedFilters({
        addressName: "",
        bookingSource: "",
        heardFrom: "",
        theatreName: "",
        occasionName: "",
        status: "",
        eventDate: "",
        eventFromDate: "",
        eventToDate: "",
        bookingDate: "",
        bookingFromDate: "",
        bookingToDate: "",
        searchQuery: ""
      });
      setConfirmedUsers(allConfirmedBookings);
      setExportData(allConfirmedBookings);
    } else {
      setCakeFilters({
        addressName: "",
        bookingSource: "",
        heardFrom: "",
        theatreName: "",
        occasionName: "",
        status: "",
        eventDate: "",
        eventFromDate: "",
        eventToDate: "",
        bookingDate: "",
        bookingFromDate: "",
        bookingToDate: "",
        searchQuery: "",
        productName: "",
        productType: "",
        categoryName: ""
      });
      setCakeUsers(allCakeBookings);
      setExportData(allCakeBookings);
    }
    setCurrentPage(1);
    toast.info(`Showing all ${activeTab} bookings`);
    
    // Store state after clearing filters
    storeCurrentState();
  };

  // Handle confirmed filter changes
  const handleConfirmedFilterChange = (e) => {
    const { name, value } = e.target;
    setConfirmedFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle cake filter changes
  const handleCakeFilterChange = (e) => {
    const { name, value } = e.target;
    setCakeFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    handleCakeFilterChange(e);
  };

  // Go back to main bookings page
  const goBack = () => {
    // Store state before going back
    storeCurrentState();
    sessionStorage.setItem("returnToFilteredState", "true");
    history.push("/Confirmedbookings");
  };

  // Handle tab change
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);
      
      // Load data for the new tab if not already loaded
      if (tab === "confirmed" && allConfirmedBookings.length === 0) {
        fetchConfirmedBookings(dataLimit, true);
      } else if (tab === "cake" && allCakeBookings.length === 0) {
        fetchCakeBookings(dataLimit, true);
      }
      
      // Update export data for current tab
      if (tab === "confirmed") {
        setExportData(confirmedUsers);
      } else {
        setExportData(cakeUsers);
      }
      
      // Store state after tab change
      storeCurrentState();
    }
  };

  // ========== VIEW/EDIT FUNCTIONS ==========
  // Handle edit booking
  const handleEditBooking = (booking) => {
    // Store current state before navigating
    storeCurrentState();
    
    setSelectedBooking(booking);
    setEditForm({
      status: booking.status || "",
      cancellReason: booking.cancellReason || ""
    });
    setEditModal(true);
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit edit form
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const updateData = {
      status: editForm.status,
      cancellReason: editForm.cancellReason
    };

    const apiUrl = `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatebookingstatus/${selectedBooking._id}`;

    axios.put(apiUrl, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data.message);
        setEditModal(false);
        
        // Refresh data based on current tab
        if (activeTab === "confirmed") {
          fetchConfirmedBookings(dataLimit, false);
        } else {
          fetchCakeBookings(dataLimit, false);
        }
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      }
    });
  };

  // View booking details
  const handleViewBooking = (booking) => {
    // Store current state before navigating
    storeCurrentState();
    
    sessionStorage.setItem("BookingId", booking._id);
    sessionStorage.setItem("returnToAdvancedFilter", "true");
    history.push("/ViewBooking");
  };

  // ========== PAGINATION FUNCTIONS ==========
  const getCurrentUsers = () => {
    return activeTab === "confirmed" ? confirmedUsers : cakeUsers;
  };
  
  const currentUsers = getCurrentUsers();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentUsers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Store state after page change
    storeCurrentState();
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setItemsPerPageDropdownOpen(false);
    
    // Store state after items per page change
    storeCurrentState();
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  // ========== EXPORT FUNCTIONS ==========
  // Function to fetch filtered data for export
  const fetchFilteredDataForExport = async () => {
    setIsExporting(true);
    
    try {
      if (activeTab === "confirmed") {
        const filterData = {};
        const filters = confirmedFilters;
        
        if (filters.addressName) filterData.addressName = filters.addressName;
        if (filters.bookingSource) filterData.bookingSource = filters.bookingSource;
        if (filters.heardFrom) filterData.heardFrom = filters.heardFrom;
        if (filters.theatreName) filterData.theatreName = filters.theatreName;
        if (filters.occasionName) filterData.occasionName = filters.occasionName;
        if (filters.status) filterData.status = filters.status;
        if (filters.searchQuery) filterData.searchQuery = filters.searchQuery;
        
        if (filters.eventDate) filterData.singleDate = filters.eventDate;
        if (filters.eventFromDate && filters.eventToDate) {
          filterData.fromDate = filters.eventFromDate;
          filterData.toDate = filters.eventToDate;
        }
        
        // Always fetch all data for export (no limit)
        filterData.limit = 10000;
        
        const res = await axios.post(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
          filterData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (res.data.success) {
          let exportData = res.data.data || [];
          
          // Apply client-side filtering if backend didn't filter correctly
          const backendFilteredCorrectly = checkBackendFiltering(exportData, filterData);
          if (!backendFilteredCorrectly && allConfirmedBookings.length > 0) {
            exportData = applyClientSideFiltersConfirmed(allConfirmedBookings);
          } else if (backendFilteredCorrectly) {
            // Apply booking date filter client-side
            if (filters.bookingDate || (filters.bookingFromDate && filters.bookingToDate)) {
              exportData = applyClientSideFiltersConfirmed(exportData);
            }
          }
          
          setExportData(exportData);
          toast.success(`Prepared ${exportData.length} confirmed records for export`);
          return exportData;
        }
      } else {
        // For cake bookings, use client-side filtering on all data
        const allData = allCakeBookings.length > 0 ? allCakeBookings : [];
        let filteredData = allData;
        
        if (isAnyFilterActive()) {
          filteredData = applyClientSideFiltersCake(allData);
        }
        
        setExportData(filteredData);
        toast.success(`Prepared ${filteredData.length} cake records for export`);
        return filteredData;
      }
    } catch (error) {
      console.error("Error fetching export data:", error);
      toast.error("Failed to prepare export data");
      // Use current filtered data as fallback
      return currentUsers;
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    setIsPdfExporting(true);
    
    try {
      // Prepare data for export
      let dataToExport = exportData;
      if (dataToExport.length === 0) {
        toast.warning("No data to export");
        setIsPdfExporting(false);
        return;
      }

      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`${activeTab === 'confirmed' ? 'Confirmed' : 'Cake'} Bookings Report`, 14, 15);
      
      // Add filter info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      let filterText = "Filters: ";
      const filters = activeTab === 'confirmed' ? confirmedFilters : cakeFilters;
      const activeFilters = Object.entries(filters)
        .filter(([key, value]) => value && key !== 'searchQuery')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      if (activeFilters) {
        doc.text(filterText + activeFilters, 14, 22);
      } else {
        doc.text("Filters: None (All Data)", 14, 22);
      }

      // Add date
      doc.text(`Generated on: ${moment().format('DD-MM-YYYY HH:mm')}`, 14, 28);
      doc.text(`Total Records: ${dataToExport.length}`, 14, 34);

      // Prepare table columns
      let columns = [];
      let rows = [];

      if (activeTab === 'confirmed') {
        columns = [
          { header: 'S.No', dataKey: 'sno' },
          { header: 'Order ID', dataKey: 'orderId' },
          { header: 'Event Date', dataKey: 'date' },
          { header: 'Event Time', dataKey: 'time' },
          { header: 'Customer', dataKey: 'userName' },
          { header: 'Phone', dataKey: 'userPhone' },
          { header: 'Theater', dataKey: 'theatreName' },
          { header: 'Address', dataKey: 'addressName' },
          { header: 'Source', dataKey: 'bookingSource' },
          { header: 'Heard From', dataKey: 'heardFrom' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Total (₹)', dataKey: 'totalPrice' },
          { header: 'Advance (₹)', dataKey: 'advancePayment' },
          { header: 'Remaining (₹)', dataKey: 'remainingAmount' },
          { header: 'Occasion', dataKey: 'occasionName' },
          { header: 'Booking Date', dataKey: 'bookingDate' }
        ];

        rows = dataToExport.map((item, index) => ({
          sno: index + 1,
          orderId: item.orderId || 'N/A',
          date: item.date || 'N/A',
          time: item.time || 'N/A',
          userName: item.userName || 'N/A',
          userPhone: item.userPhone || 'N/A',
          theatreName: item.theatreName || 'N/A',
          addressName: item.addressName || 'N/A',
          bookingSource: item.bookingSource || 'N/A',
          heardFrom: item.heardFrom || 'N/A',
          status: item.status || 'N/A',
          totalPrice: item.totalPrice || 0,
          advancePayment: item.advancePayment || 0,
          remainingAmount: (parseFloat(item.totalPrice || 0) - parseFloat(item.advancePayment || 0)).toFixed(2),
          occasionName: item.occasionName || 'N/A',
          bookingDate: item.logCreatedDate ? moment(item.logCreatedDate).format('DD-MM-YYYY HH:mm') : 'N/A'
        }));
      } else {
        columns = [
          { header: 'S.No', dataKey: 'sno' },
          { header: 'Order ID', dataKey: 'orderId' },
          { header: 'Event Date', dataKey: 'date' },
          { header: 'Event Time', dataKey: 'time' },
          { header: 'Customer', dataKey: 'userName' },
          { header: 'Phone', dataKey: 'userPhone' },
          { header: 'Theater', dataKey: 'theatreName' },
          { header: 'Address', dataKey: 'addressName' },
          { header: 'Source', dataKey: 'bookingSource' },
          { header: 'Heard From', dataKey: 'heardFrom' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Total (₹)', dataKey: 'totalPrice' },
          { header: 'Advance (₹)', dataKey: 'advancePayment' },
          { header: 'Remaining (₹)', dataKey: 'remainingAmount' },
          { header: 'Occasion', dataKey: 'occasionName' },
          { header: 'Booking Date', dataKey: 'bookingDate' },
          { header: 'Category', dataKey: 'category' },
          { header: 'Cake Products', dataKey: 'cakeProducts' },
          { header: 'Persons', dataKey: 'personCount' },
          { header: 'Decoration', dataKey: 'decoration' }
        ];

        rows = dataToExport.map((item, index) => {
          // Get cake products
          const cakeProducts = item.products
            ?.filter(p => p.type === "cake")
            .map(p => `${p.name} (Qty: ${p.quantity})`)
            .join("\n") || "No cakes";

          // Get custom cake images URLs if any
          let customCakeInfo = "";
          if (item.customCakeImages && item.customCakeImages.length > 0) {
            customCakeInfo = "\n\nCustom Cake Images:\n" + 
              item.customCakeImages.map((img, idx) => 
                `Image ${idx + 1}: ${img.originalName}`
              ).join("\n");
          }

          // Determine category
          let category = "Other";
          if (item.products?.some(p => p.type === "cake")) {
            category = "Cake";
          } else if (item.products?.some(p => categories.some(cat => 
            cat.products?.some(cp => cp.name === p.name)
          ))) {
            category = "Addon";
          }

          return {
            sno: index + 1,
            orderId: item.orderId || 'N/A',
            date: item.date || 'N/A',
            time: item.time || 'N/A',
            userName: item.userName || 'N/A',
            userPhone: item.userPhone || 'N/A',
            theatreName: item.theatreName || 'N/A',
            addressName: item.addressName || 'N/A',
            bookingSource: item.bookingSource || 'N/A',
            heardFrom: item.heardFrom || 'N/A',
            status: item.status || 'N/A',
            totalPrice: item.totalPrice || 0,
            advancePayment: item.advancePayment || 0,
            remainingAmount: (parseFloat(item.totalPrice || 0) - parseFloat(item.advancePayment || 0)).toFixed(2),
            occasionName: item.occasionName || 'N/A',
            bookingDate: item.logCreatedDate ? moment(item.logCreatedDate).format('DD-MM-YYYY HH:mm') : 'N/A',
            category: category,
            cakeProducts: cakeProducts + customCakeInfo,
            personCount: item.noOfPersons || 0,
            decoration: item.decoration || 'N/A'
          };
        });
      }

      // Generate table
      doc.autoTable({
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.dataKey])),
        startY: 40,
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 7 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 40, left: 10, right: 10 },
        didDrawPage: (data) => {
          // Add footer on each page
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });

      // Save PDF
      doc.save(`${activeTab}_bookings_${moment().format('YYYY-MM-DD_HH-mm')}.pdf`);
      
      toast.success(`PDF exported successfully with ${dataToExport.length} records!`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsPdfExporting(false);
    }
  };

  // CSV headers for confirmed bookings
  const confirmedCsvHeaders = [
    { label: "S.No", key: "sno" },
    { label: "Event ID", key: "orderId" },
    { label: "Event Date", key: "date" },
    { label: "Event Time", key: "time" },
    { label: "Customer Name", key: "userName" },
    { label: "Phone", key: "userPhone" },
    { label: "Theater Name", key: "theatreName" },
    { label: "Address Name", key: "addressName" },
    { label: "Booking Source", key: "bookingSource" },
    { label: "Heard From", key: "heardFrom" },
    { label: "Status", key: "status" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Advance Payment", key: "advancePayment" },
    { label: "Remaining Amount", key: "remainingAmount" },
    { label: "Occasion", key: "occasionName" },
    { label: "Booking Date", key: "bookingDate" }
  ];

  // CSV headers for cake bookings
  const cakeCsvHeaders = [
    { label: "S.No", key: "sno" },
    { label: "Event ID", key: "orderId" },
    { label: "Event Date", key: "date" },
    { label: "Event Time", key: "time" },
    { label: "Customer Name", key: "userName" },
    { label: "Phone", key: "userPhone" },
    { label: "Theater Name", key: "theatreName" },
    { label: "Address Name", key: "addressName" },
    { label: "Booking Source", key: "bookingSource" },
    { label: "Heard From", key: "heardFrom" },
    { label: "Status", key: "status" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Advance Payment", key: "advancePayment" },
    { label: "Remaining Amount", key: "remainingAmount" },
    { label: "Occasion", key: "occasionName" },
    { label: "Booking Date", key: "bookingDate" },
    { label: "Category", key: "category" },
    { label: "Cake Products", key: "cakeProducts" },
    { label: "Person Count", key: "personCount" },
    { label: "Decoration", key: "decoration" },
    { label: "Custom Cake Images", key: "customCakeImages" }
  ];

  // Prepare CSV data from exportData state
  const getCsvData = () => {
    if (activeTab === "confirmed") {
      return exportData.map((item, index) => ({
        sno: index + 1,
        orderId: item.orderId || "N/A",
        date: item.date || "N/A",
        time: item.time || "N/A",
        userName: item.userName || "N/A",
        userPhone: item.userPhone || "N/A",
        theatreName: item.theatreName || "N/A",
        addressName: item.addressName || "N/A",
        bookingSource: item.bookingSource || "N/A",
        heardFrom: item.heardFrom || "N/A",
        status: item.status || "N/A",
        totalPrice: item.totalPrice || 0,
        advancePayment: item.advancePayment || 0,
        remainingAmount: (parseFloat(item.totalPrice || 0) - parseFloat(item.advancePayment || 0)).toFixed(2),
        occasionName: item.occasionName || "N/A",
        bookingDate: item.logCreatedDate ? moment(item.logCreatedDate).format('YYYY-MM-DD HH:mm') : "N/A"
      }));
    } else {
      return exportData.map((item, index) => {
        // Only include cake products
        const cakeProducts = item.products
          ?.filter(p => p.type === "cake")
          .map(p => `${p.name} (Qty: ${p.quantity}, Price: ₹${p.amount || p.price || 0})`)
          .join(" | ") || "No cakes";
        
        // Include custom cake images info
        const customCakeImages = item.customCakeImages && item.customCakeImages.length > 0
          ? item.customCakeImages.map(img => img.image).join(" | ")
          : "No custom images";
        
        // Determine category based on products
        let category = "Other";
        if (item.products?.some(p => p.type === "cake")) {
          category = "Cake";
        } else if (item.products?.some(p => categories.some(cat => 
          cat.products?.some(cp => cp.name === p.name)
        ))) {
          category = "Addon";
        }
        
        return {
          sno: index + 1,
          orderId: item.orderId || "N/A",
          date: item.date || "N/A",
          time: item.time || "N/A",
          userName: item.userName || "N/A",
          userPhone: item.userPhone || "N/A",
          theatreName: item.theatreName || "N/A",
          addressName: item.addressName || "N/A",
          bookingSource: item.bookingSource || "N/A",
          heardFrom: item.heardFrom || "N/A",
          status: item.status || "N/A",
          totalPrice: item.totalPrice || 0,
          advancePayment: item.advancePayment || 0,
          remainingAmount: (parseFloat(item.totalPrice || 0) - parseFloat(item.advancePayment || 0)).toFixed(2),
          occasionName: item.occasionName || "N/A",
          bookingDate: item.logCreatedDate ? moment(item.logCreatedDate).format('YYYY-MM-DD HH:mm') : "N/A",
          category: category,
          cakeProducts: cakeProducts,
          personCount: item.noOfPersons || 0,
          decoration: item.decoration || "N/A",
          customCakeImages: customCakeImages
        };
      });
    }
  };

  const csvHeaders = activeTab === "confirmed" ? confirmedCsvHeaders : cakeCsvHeaders;
  const csvData = getCsvData();

  // ========== INITIALIZATION ==========
  // Check if we're returning from detail page on component mount
  useEffect(() => {
    const returnToAdvancedFilter = sessionStorage.getItem("returnToAdvancedFilter");
    
    if (returnToAdvancedFilter === "true") {
      const restored = restoreState();
      if (restored) {
        setIsReturningFromDetail(true);
        sessionStorage.removeItem("returnToAdvancedFilter");
      } else {
        // If restore failed, fetch fresh data
        fetchConfirmedBookings(dataLimit, true);
        fetchCakeBookings(dataLimit, false);
      }
    } else {
      // First time load, check if we have any state to restore
      const restored = restoreState();
      if (!restored) {
        fetchConfirmedBookings(dataLimit, true);
        fetchCakeBookings(dataLimit, false);
      }
    }
    
    fetchTotalCounts();
    fetchCategories();

    // Cleanup function
    return () => {
      // Don't clear state on unmount, we want to keep it
    };
  }, []);

  // Update export data when filters change or tab changes
  useEffect(() => {
    if (activeTab === "confirmed") {
      setExportData(confirmedUsers);
    } else {
      setExportData(cakeUsers);
    }
  }, [confirmedUsers, cakeUsers, activeTab]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Advanced Filter"
          />
          
          {/* Go Back Button */}
          <div className="mb-3">
            <Button color="light" onClick={goBack}>
              <i className="fas fa-arrow-left me-2"></i>
              Back to Bookings
            </Button>
          </div>
          
          {/* Tabs for switching between confirmed and cake bookings */}
          <Card className="mb-3">
            <CardBody>
              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={activeTab === "confirmed" ? "active" : ""}
                    onClick={() => toggleTab("confirmed")}
                  >
                    <i className="fas fa-calendar-check me-2"></i>
                    Confirmed Bookings
                    <Badge color="info" className="ms-2">
                      {totalRecordsCount.confirmed}
                    </Badge>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === "cake" ? "active" : ""}
                    onClick={() => toggleTab("cake")}
                  >
                    <i className="fas fa-birthday-cake me-2"></i>
                    Cake Bookings
                    <Badge color="success" className="ms-2">
                      {totalRecordsCount.cake}
                    </Badge>
                  </NavLink>
                </NavItem>
              </Nav>
              
              <TabContent activeTab={activeTab} className="mt-3">
                {/* Confirmed Bookings Tab */}
                <TabPane tabId="confirmed">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-filter me-2"></i>
                      Advanced Filters - Confirmed Bookings
                    </h5>
                    
                    {/* Data Limit Dropdown */}
                    <div className="d-flex align-items-center">
                      <span className="me-2">Load Data:</span>
                      <Dropdown 
                        isOpen={dataLimitDropdownOpen} 
                        toggle={() => setDataLimitDropdownOpen(!dataLimitDropdownOpen)}
                      >
                        <DropdownToggle caret color="primary">
                          {dataLimit === 10000 ? "All Records" : `${dataLimit} Records`}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleDataLimitChange(100)}>100 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(200)}>200 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(500)}>500 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(1000)}>1000 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(10000)}>All Records</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      <Badge color="info" className="ms-2">
                        Total: {totalRecordsCount.confirmed} records
                      </Badge>
                    </div>
                  </div>
                  
                  <Form onSubmit={applyFilters}>
                    <Row>
                      {/* Search Query */}
                      <Col md={12}>
                        <div className="mb-3">
                          <Label>Search (Order ID, Name, Phone, Theater, Occasion)</Label>
                          <Input
                            type="text"
                            name="searchQuery"
                            value={confirmedFilters.searchQuery}
                            onChange={handleConfirmedFilterChange}
                            placeholder="Search by Order ID, Customer Name, Phone, Theater, Occasion..."
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Address Name Filter */}
                      <Col md={3}>
                        <div className="mb-3">
                          <Label>Address Name</Label>
                          <Input
                            type="select"
                            name="addressName"
                            value={confirmedFilters.addressName}
                            onChange={handleConfirmedFilterChange}
                          >
                            <option value="">All Addresses</option>
                            {confirmedUniqueValues.addressNames.map((address, index) => (
                              <option key={index} value={address}>
                                {address}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Booking Source Filter */}
                      <Col md={3}>
                        <div className="mb-3">
                          <Label>Booking Source</Label>
                          <Input
                            type="select"
                            name="bookingSource"
                            value={confirmedFilters.bookingSource}
                            onChange={handleConfirmedFilterChange}
                          >
                            <option value="">All Sources</option>
                            {confirmedUniqueValues.bookingSources.map((source, index) => (
                              <option key={index} value={source}>
                                {source}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Heard From Filter */}
                      <Col md={3}>
                        <div className="mb-3">
                          <Label>Heard From</Label>
                          <Input
                            type="select"
                            name="heardFrom"
                            value={confirmedFilters.heardFrom}
                            onChange={handleConfirmedFilterChange}
                          >
                            <option value="">All Options</option>
                            {confirmedUniqueValues.heardFromOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Occasion Name Filter */}
                      <Col md={3}>
                        <div className="mb-3">
                          <Label>Occasion Name</Label>
                          <Input
                            type="select"
                            name="occasionName"
                            value={confirmedFilters.occasionName}
                            onChange={handleConfirmedFilterChange}
                          >
                            <option value="">All Occasions</option>
                            {confirmedUniqueValues.occasionNames.map((occasion, index) => (
                              <option key={index} value={occasion}>
                                {occasion}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Theater Name Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Theater Name</Label>
                          <Input
                            type="select"
                            name="theatreName"
                            value={confirmedFilters.theatreName}
                            onChange={handleConfirmedFilterChange}
                          >
                            <option value="">All Theaters</option>
                            {confirmedUniqueValues.theatreNames.map((theatre, index) => (
                              <option key={index} value={theatre}>
                                {theatre}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Status Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Status</Label>
                          <Input
                            type="select"
                            name="status"
                            value={confirmedFilters.status}
                            onChange={handleConfirmedFilterChange}
                          >
                            <option value="">All Status</option>
                            {confirmedUniqueValues.statusOptions.map((status, index) => (
                              <option key={index} value={status}>
                                {status}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={12}>
                        <h6 className="mt-3 mb-2 border-bottom pb-2">
                          <i className="fas fa-calendar-day me-2"></i>
                          Event Date Filters
                        </h6>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Single Event Date Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Event Date</Label>
                          <Input
                            type="date"
                            name="eventDate"
                            value={confirmedFilters.eventDate}
                            onChange={handleConfirmedFilterChange}
                          />
                        </div>
                      </Col>
                      
                      {/* Event Date Range Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Event From Date</Label>
                          <Input
                            type="date"
                            name="eventFromDate"
                            value={confirmedFilters.eventFromDate}
                            onChange={handleConfirmedFilterChange}
                          />
                        </div>
                      </Col>
                      
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Event To Date</Label>
                          <Input
                            type="date"
                            name="eventToDate"
                            value={confirmedFilters.eventToDate}
                            min={confirmedFilters.eventFromDate}
                            onChange={handleConfirmedFilterChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={12}>
                        <h6 className="mt-3 mb-2 border-bottom pb-2">
                          <i className="fas fa-calendar-alt me-2"></i>
                          Booking Date Filters (logCreatedDate)
                        </h6>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Single Booking Date Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking Date</Label>
                          <Input
                            type="date"
                            name="bookingDate"
                            value={confirmedFilters.bookingDate}
                            onChange={handleConfirmedFilterChange}
                          />
                        </div>
                      </Col>
                      
                      {/* Booking Date Range Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking From Date</Label>
                          <Input
                            type="date"
                            name="bookingFromDate"
                            value={confirmedFilters.bookingFromDate}
                            onChange={handleConfirmedFilterChange}
                          />
                        </div>
                      </Col>
                      
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking To Date</Label>
                          <Input
                            type="date"
                            name="bookingToDate"
                            value={confirmedFilters.bookingToDate}
                            min={confirmedFilters.bookingFromDate}
                            onChange={handleConfirmedFilterChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <Button 
                          color="primary" 
                          type="submit"
                          disabled={isApplyingFilter}
                        >
                          {isApplyingFilter ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Applying Filters...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-search me-2"></i>
                              {isAnyFilterActive() ? "Apply Filters" : "Show All"}
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          color="secondary" 
                          className="ms-2"
                          onClick={clearFilters}
                          disabled={isApplyingFilter || isLoading}
                        >
                          <i className="fas fa-times me-2"></i>
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </Form>
                </TabPane>
                
                {/* Cake Bookings Tab */}
                <TabPane tabId="cake">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-filter me-2"></i>
                      Advanced Filters - Cake & Category Bookings
                    </h5>
                    
                    {/* Data Limit Dropdown */}
                    <div className="d-flex align-items-center">
                      <span className="me-2">Load Data:</span>
                      <Dropdown 
                        isOpen={dataLimitDropdownOpen} 
                        toggle={() => setDataLimitDropdownOpen(!dataLimitDropdownOpen)}
                      >
                        <DropdownToggle caret color="success">
                          {dataLimit === 10000 ? "All Records" : `${dataLimit} Records`}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleDataLimitChange(100)}>100 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(200)}>200 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(500)}>500 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(1000)}>1000 Records</DropdownItem>
                          <DropdownItem onClick={() => handleDataLimitChange(10000)}>All Records</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      <Badge color="success" className="ms-2">
                        Total: {totalRecordsCount.cake} records
                      </Badge>
                    </div>
                  </div>
                  
                  <Form onSubmit={applyFilters}>
                    <Row>
                      {/* Search Query */}
                      <Col md={12}>
                        <div className="mb-3">
                          <Label>Search (Order ID, Name, Phone, Theater, Occasion, Products)</Label>
                          <Input
                            type="text"
                            name="searchQuery"
                            value={cakeFilters.searchQuery}
                            onChange={handleCakeFilterChange}
                            placeholder="Search by Order ID, Customer Name, Phone, Theater, Occasion, Product Name..."
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Category Filter - NEW */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Category (from AddOns)</Label>
                          <Input
                            type="select"
                            name="categoryName"
                            value={cakeFilters.categoryName}
                            onChange={handleCategoryChange}
                          >
                            <option value="">All Categories</option>
                            {categories.map((category, index) => (
                              <option key={index} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </Input>
                          {cakeFilters.categoryName && (
                            <small className="text-muted">
                              Showing bookings with products from {cakeFilters.categoryName}
                            </small>
                          )}
                        </div>
                      </Col>
                      
                      {/* Address Name Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Address Name</Label>
                          <Input
                            type="select"
                            name="addressName"
                            value={cakeFilters.addressName}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Addresses</option>
                            {cakeUniqueValues.addressNames.map((address, index) => (
                              <option key={index} value={address}>
                                {address}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Booking Source Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking Source</Label>
                          <Input
                            type="select"
                            name="bookingSource"
                            value={cakeFilters.bookingSource}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Sources</option>
                            {cakeUniqueValues.bookingSources.map((source, index) => (
                              <option key={index} value={source}>
                                {source}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Heard From Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Heard From</Label>
                          <Input
                            type="select"
                            name="heardFrom"
                            value={cakeFilters.heardFrom}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Options</option>
                            {cakeUniqueValues.heardFromOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Occasion Name Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Occasion Name</Label>
                          <Input
                            type="select"
                            name="occasionName"
                            value={cakeFilters.occasionName}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Occasions</option>
                            {cakeUniqueValues.occasionNames.map((occasion, index) => (
                              <option key={index} value={occasion}>
                                {occasion}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Theater Name Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Theater Name</Label>
                          <Input
                            type="select"
                            name="theatreName"
                            value={cakeFilters.theatreName}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Theaters</option>
                            {cakeUniqueValues.theatreNames.map((theatre, index) => (
                              <option key={index} value={theatre}>
                                {theatre}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Status Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Status</Label>
                          <Input
                            type="select"
                            name="status"
                            value={cakeFilters.status}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Status</option>
                            {cakeUniqueValues.statusOptions.map((status, index) => (
                              <option key={index} value={status}>
                                {status}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Product Name Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Product Name</Label>
                          <Input
                            type="select"
                            name="productName"
                            value={cakeFilters.productName}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Products</option>
                            {cakeUniqueValues.productNames.map((product, index) => (
                              <option key={index} value={product}>
                                {product}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      
                      {/* Product Type Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Product Type</Label>
                          <Input
                            type="select"
                            name="productType"
                            value={cakeFilters.productType}
                            onChange={handleCakeFilterChange}
                          >
                            <option value="">All Types</option>
                            {cakeUniqueValues.productTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={12}>
                        <h6 className="mt-3 mb-2 border-bottom pb-2">
                          <i className="fas fa-calendar-day me-2"></i>
                          Event Date Filters
                        </h6>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Single Event Date Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Event Date</Label>
                          <Input
                            type="date"
                            name="eventDate"
                            value={cakeFilters.eventDate}
                            onChange={handleCakeFilterChange}
                          />
                        </div>
                      </Col>
                      
                      {/* Event Date Range Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Event From Date</Label>
                          <Input
                            type="date"
                            name="eventFromDate"
                            value={cakeFilters.eventFromDate}
                            onChange={handleCakeFilterChange}
                          />
                        </div>
                      </Col>
                      
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Event To Date</Label>
                          <Input
                            type="date"
                            name="eventToDate"
                            value={cakeFilters.eventToDate}
                            min={cakeFilters.eventFromDate}
                            onChange={handleCakeFilterChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={12}>
                        <h6 className="mt-3 mb-2 border-bottom pb-2">
                          <i className="fas fa-calendar-alt me-2"></i>
                          Booking Date Filters
                        </h6>
                      </Col>
                    </Row>
                    
                    <Row>
                      {/* Single Booking Date Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking Date</Label>
                          <Input
                            type="date"
                            name="bookingDate"
                            value={cakeFilters.bookingDate}
                            onChange={handleCakeFilterChange}
                          />
                        </div>
                      </Col>
                      
                      {/* Booking Date Range Filter */}
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking From Date</Label>
                          <Input
                            type="date"
                            name="bookingFromDate"
                            value={cakeFilters.bookingFromDate}
                            onChange={handleCakeFilterChange}
                          />
                        </div>
                      </Col>
                      
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Booking To Date</Label>
                          <Input
                            type="date"
                            name="bookingToDate"
                            value={cakeFilters.bookingToDate}
                            min={cakeFilters.bookingFromDate}
                            onChange={handleCakeFilterChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <div>
                        <Button 
                          color="success" 
                          type="submit"
                          disabled={isApplyingFilter}
                        >
                          {isApplyingFilter ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Applying Filters...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-search me-2"></i>
                              {isAnyFilterActive() ? "Apply Filters" : "Show All"}
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          color="secondary" 
                          className="ms-2"
                          onClick={clearFilters}
                          disabled={isApplyingFilter || isLoading}
                        >
                          <i className="fas fa-times me-2"></i>
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </Form>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
          
          {/* Results Section */}
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-list-alt me-2"></i>
                  {isAnyFilterActive() ? "Filtered Results" : "All Bookings"} 
                  <Badge color={activeTab === "confirmed" ? "info" : "success"} className="ms-2">
                    {currentUsers.length} records loaded
                  </Badge>
                  {isAnyFilterActive() && (
                    <Badge color="warning" className="ms-2">
                      Filters Active
                    </Badge>
                  )}
                  {activeTab === "cake" && cakeFilters.categoryName && (
                    <Badge color="primary" className="ms-2">
                      Category: {cakeFilters.categoryName}
                    </Badge>
                  )}
                </h5>
                
                {/* Export and Items per page */}
                <div className="d-flex align-items-center">
                  {exportData.length > 0 && (
                    <>
                      <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={
                          isAnyFilterActive() 
                            ? `Filtered_${activeTab}_Bookings_${moment().format('YYYY-MM-DD_HH-mm')}.csv`
                            : `All_${activeTab}_Bookings_${moment().format('YYYY-MM-DD_HH-mm')}.csv`
                        }
                        className="me-2"
                        asyncOnClick={true}
                        onClick={async (event, done) => {
                          await fetchFilteredDataForExport();
                          done();
                        }}
                      >
                        <Button color="success" disabled={isExporting}>
                          {isExporting ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Preparing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-file-excel me-2"></i>
                              Excel ({exportData.length})
                            </>
                          )}
                        </Button>
                      </CSVLink>

                      <Button
                        color="danger"
                        className="me-3"
                        onClick={exportToPDF}
                        disabled={isPdfExporting}
                      >
                        {isPdfExporting ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-pdf me-2"></i>
                            PDF ({exportData.length})
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  
                  {/* Items per page dropdown */}
                  <div className="d-flex align-items-center">
                    <span className="me-2">Show per page:</span>
                    <Dropdown 
                      isOpen={itemsPerPageDropdownOpen} 
                      toggle={() => setItemsPerPageDropdownOpen(!itemsPerPageDropdownOpen)}
                    >
                      <DropdownToggle caret color="light">
                        {itemsPerPage}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleItemsPerPageChange(10)}>10</DropdownItem>
                        <DropdownItem onClick={() => handleItemsPerPageChange(25)}>25</DropdownItem>
                        <DropdownItem onClick={() => handleItemsPerPageChange(50)}>50</DropdownItem>
                        <DropdownItem onClick={() => handleItemsPerPageChange(100)}>100</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <Alert color="info" className="text-center">
                  <Spinner size="sm" className="me-2" />
                  Loading {activeTab} bookings...
                </Alert>
              ) : currentUsers.length === 0 ? (
                <Alert color="info" className="text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  No {activeTab} bookings found
                </Alert>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover bordered>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Event ID</th>
                          <th>Event Date</th>
                          <th>Booking Date</th>
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Theater</th>
                          <th>Address</th>
                          <th>Source</th>
                          <th>Heard From</th>
                          <th>Occasion</th>
                          {activeTab === "cake" && <th>Category/Products</th>}
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>
                              <Badge color={activeTab === "confirmed" ? "info" : "success"}>
                                {item.orderId}
                              </Badge>
                            </td>
                            <td>
                              <div>{item.date || "N/A"}</div>
                              <small className="text-muted">{item.time || ""}</small>
                            </td>
                            <td>
                              {item.logCreatedDate ? 
                                moment(item.logCreatedDate).format('DD-MM-YYYY') : "N/A"
                              }
                              <br/>
                              <small className="text-muted">
                                {item.logCreatedDate ? 
                                  moment(item.logCreatedDate).format('hh:mm A') : ""
                                }
                              </small>
                            </td>
                            <td>{item.userName || "N/A"}</td>
                            <td>{item.userPhone || "N/A"}</td>
                            <td>{item.theatreName || "N/A"}</td>
                            <td>{item.addressName || "N/A"}</td>
                            <td>
                              <Badge color="primary">
                                {item.bookingSource || "N/A"}
                              </Badge>
                            </td>
                            <td>
                              <Badge color="success">
                                {item.heardFrom || "N/A"}
                              </Badge>
                            </td>
                            <td>
                              <Badge color="info">
                                {item.occasionName || "N/A"}
                              </Badge>
                            </td>
                            {activeTab === "cake" && (
                              <td>
                                {item.products && item.products.length > 0 ? (
                                  <div>
                                    {/* Show category based on products */}
                                    {item.products.some(p => p.type === "cake") ? (
                                      <Badge color="warning" className="mb-1 d-block">Cake Booking</Badge>
                                    ) : (
                                      <Badge color="secondary" className="mb-1 d-block">Addon Booking</Badge>
                                    )}
                                    
                                    {/* Show cake products */}
                                    {item.products
                                      .filter(p => p.type === "cake")
                                      .slice(0, 2)
                                      .map((product, idx) => (
                                        <Badge color="light" className="me-1 mb-1" key={idx}>
                                          {product.name} ({product.quantity})
                                        </Badge>
                                      ))}
                                    {item.products.filter(p => p.type === "cake").length > 2 && (
                                      <Badge color="dark">
                                        +{item.products.filter(p => p.type === "cake").length - 2} more
                                      </Badge>
                                    )}
                                    
                                    {/* Show custom cake images count if any */}
                                    {item.customCakeImages && item.customCakeImages.length > 0 && (
                                      <div className="mt-1">
                                        <Badge color="warning" pill>
                                          <i className="fas fa-camera me-1"></i>
                                          {item.customCakeImages.length} custom image(s)
                                        </Badge>
                                      </div>
                                    )}
                                    
                                    {item.products.filter(p => p.type === "cake").length === 0 && (
                                      <span>No cakes</span>
                                    )}
                                  </div>
                                ) : "No products"}
                              </td>
                            )}
                            <td>
                              <Badge 
                                color={
                                  item.status === 'confirmed' ? 'success' :
                                  item.status === 'completed' ? 'primary' :
                                  item.status === 'cancelled' ? 'danger' : 'warning'
                                }
                              >
                                {item.status || "N/A"}
                              </Badge>
                            </td>
                            <td>
                              <div><strong>₹{item.totalPrice || 0}</strong></div>
                              <small className="text-muted">
                                Remaining: ₹{(parseFloat(item.totalPrice || 0) - parseFloat(item.advancePayment || 0)).toFixed(2)}
                              </small>
                            </td>
                            <td>
                              <div className="d-flex">
                                {(Roles?.pendingView || Roles?.accessAll) && (
                                  <Button
                                    onClick={() => handleViewBooking(item)}
                                    className="btn-sm me-1"
                                    color="info"
                                    size="sm"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Button>
                                )}
                                {(Roles?.pendingEdit || Roles?.accessAll) && (
                                  <Button
                                    onClick={() => handleEditBooking(item)}
                                    className="btn-sm"
                                    color="success"
                                    size="sm"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, currentUsers.length)} of {currentUsers.length} entries
                      </div>
                      <Pagination aria-label="Page navigation">
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink first onClick={() => paginate(1)} />
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                        </PaginationItem>
                        
                        {getPageNumbers().map((pageNumber) => (
                          <PaginationItem key={pageNumber} active={pageNumber === currentPage}>
                            <PaginationLink onClick={() => paginate(pageNumber)}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink last onClick={() => paginate(totalPages)} />
                        </PaginationItem>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(false)}>
          Edit {activeTab === "confirmed" ? "Confirmed" : "Cake"} Booking Status
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <Label>Status</Label>
              <select
                value={editForm.status}
                name="status"
                required
                onChange={handleEditChange}
                className="form-select"
              >
                <option value="">Select Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {editForm.status === "cancelled" && (
              <div className="mb-3">
                <Label>Cancellation Reason</Label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="cancellReason"
                  value={editForm.cancellReason}
                  onChange={handleEditChange}
                  placeholder="Enter cancellation reason"
                  required
                />
              </div>
            )}
            <div className="d-flex justify-content-end">
              <Button color="secondary" onClick={() => setEditModal(false)} className="me-2">
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Update Status
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <ToastContainer />
    </React.Fragment>
  );
};

export default AdvancedFilter;