import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
  Modal,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Spinner
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import { URLS } from "../../Url";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const Staff = () => {
  const [modal_small, setmodal_small] = useState(false);
  const history = useHistory();

  const [filteredDataForExcel, setFilteredDataForExcel] = useState([]);
  const [cakeBookingsForCsv, setCakeBookingsForCsv] = useState([]);
  const [form1, setform1] = useState([]);

  // Flag to check if we're returning from view/edit
  const [isReturningFromDetail, setIsReturningFromDetail] = useState(false);

  function tog_small() {
    setmodal_small(!modal_small);
  }

  const getpopup = (data) => {
    setform1(data);
    tog_small();
  };

  const [users, setusers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [form, setform] = useState({ search: "" });

  // ========== IMPORTANT: ALL STATE VARIABLES DECLARED FIRST ==========
  const [listPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showPagination, setShowPagination] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

  const [filteredLists, setFilteredLists] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [eventDateFilter, setEventDateFilter] = useState("all");
  const [customBookingDate, setCustomBookingDate] = useState("");
  const [customEventDate, setCustomEventDate] = useState("");
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [showCakeBookings, setShowCakeBookings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [filter, setfilter] = useState(false);
  const [filters, setfilters] = useState({
    fromDate: "",
    toDate: "",
  });
  // ====================================================================

  const Actinid1 = (data) => {
    // Store current filters and data before navigating
    storeCurrentState();
    sessionStorage.setItem("BookingId", data._id);
    sessionStorage.setItem("returnToFilteredState", "true");
    history.push("/ViewBooking");
  };

  const handleAddPos = (data) => {
    // Store current filters and data before navigating
    storeCurrentState();
    sessionStorage.setItem("PosID", data._id);
    sessionStorage.setItem("BookID", data._id);
    sessionStorage.setItem("PosName", data.userName || "POS");
    sessionStorage.setItem("bookingdate", data.date || "");
    sessionStorage.setItem("orderid", data.orderId || "");
    sessionStorage.setItem("theatername", data.theatreName || "");
    sessionStorage.setItem("returnToFilteredState", "true");
    history.push("/Pos");
  };

  // Function to store current state in sessionStorage
  const storeCurrentState = () => {
    const stateToStore = {
      users,
      allUsers,
      filteredDataForExcel,
      cakeBookingsForCsv,
      form,
      dateFilter,
      eventDateFilter,
      customBookingDate,
      customEventDate,
      filters,
      currentPage,
      pageNumber,
      showCakeBookings,
      totalCount,
      totalPages,
      showPagination,
      isFilterApplied: isFilterApplied(),
      lastFetchTime: new Date().getTime()
    };
    
    sessionStorage.setItem("bookingState", JSON.stringify(stateToStore));
  };

  // Function to restore state from sessionStorage
  const restoreState = () => {
    const savedState = sessionStorage.getItem("bookingState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        
        // Check if state is not too old (e.g., 5 minutes)
        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (parsed.lastFetchTime && (now - parsed.lastFetchTime) < fiveMinutes) {
          setusers(parsed.users || []);
          setAllUsers(parsed.allUsers || []);
          setFilteredDataForExcel(parsed.filteredDataForExcel || []);
          setCakeBookingsForCsv(parsed.cakeBookingsForCsv || []);
          setform(parsed.form || { search: "" });
          setDateFilter(parsed.dateFilter || "all");
          setEventDateFilter(parsed.eventDateFilter || "all");
          setCustomBookingDate(parsed.customBookingDate || "");
          setCustomEventDate(parsed.customEventDate || "");
          setfilters(parsed.filters || { fromDate: "", toDate: "" });
          setCurrentPage(parsed.currentPage || 1);
          setPageNumber(parsed.pageNumber || 0);
          setShowCakeBookings(parsed.showCakeBookings || false);
          setTotalCount(parsed.totalCount || 0);
          setTotalPages(parsed.totalPages || 1);
          setShowPagination(parsed.showPagination || true);
          
          return true;
        }
      } catch (error) {
        console.error("Error restoring state:", error);
      }
    }
    return false;
  };

  // Clear stored state when component unmounts or when explicitly needed
  const clearStoredState = () => {
    sessionStorage.removeItem("bookingState");
    sessionStorage.removeItem("returnToFilteredState");
  };

  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const datas = data.token;

  const getCakeBookings = (date = null) => {
    const token = datas;
    let url = "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getallcakesbookings";
    
    if (date) {
      url += `?date=${date}`;
    }

    console.log("Cake Bookings API URL:", url);

    setIsLoading(true);
    axios
      .post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const allBookings = res.data.bookings || [];
          console.log("Total Cake Bookings Received:", allBookings.length);
          
          setAllUsers(allBookings);
          setCakeBookingsForCsv(allBookings);
          setFilteredDataForExcel(allBookings);
          
          const startIndex = 0;
          const endIndex = startIndex + listPerPage;
          const paginatedData = allBookings.slice(startIndex, endIndex);
          setusers(paginatedData);
          
          const totalPages = Math.ceil(allBookings.length / listPerPage);
          setTotalPages(totalPages);
          setTotalCount(allBookings.length);
          setCurrentPage(1);
          setPageNumber(0);
          
          setShowPagination(true);
          setShowCakeBookings(true);
          setDateFilter("all");
          setEventDateFilter("all");
          setCustomBookingDate("");
          setCustomEventDate("");
          setform({ search: "" });
          setIsLoading(false);
          
          // Store state after successful fetch
          storeCurrentState();
          
          toast.success(`Loaded ${allBookings.length} cake bookings (Page 1 of ${totalPages})`);
        }
      })
      .catch((error) => {
        console.error("Error fetching cake bookings:", error);
        toast.error("Failed to fetch cake bookings");
        setIsLoading(false);
      });
  };

  const getConfirmedBookings = (page = 1, filters = {}, skipStore = false) => {
    const token = datas;
    
    let requestData = { ...filters };
    
    if (Object.keys(filters).length === 0 && page) {
      requestData.page = page;
      requestData.limit = listPerPage;
    }

    console.log("Confirmed Bookings Request:", requestData);

    setIsLoading(true);
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.success) {
          sessionStorage.removeItem("date");
          const bookingsData = res.data.data || [];
          console.log("Confirmed Bookings Response:", res.data);
          console.log("Total Bookings Received:", bookingsData.length);
          
          // Debug: Check first few bookings
          if (bookingsData.length > 0) {
            console.log("Sample booking for debugging:", {
              orderId: bookingsData[0].orderId,
              logCreatedDate: bookingsData[0].logCreatedDate,
              formattedDate: bookingsData[0].logCreatedDate ? moment(bookingsData[0].logCreatedDate).format('YYYY-MM-DD') : 'N/A',
              date: bookingsData[0].date,
              filterApplied: filters,
              totalPrice: bookingsData[0].totalPrice
            });
          }
          
          setAllUsers(bookingsData);
          setusers(bookingsData);
          setFilteredDataForExcel(bookingsData);
          
          const isFilterApplied = !res.data.page && !res.data.limit;
          
          if (isFilterApplied || Object.keys(filters).length > 0) {
            setShowPagination(false);
            setTotalCount(bookingsData.length);
            setCurrentPage(1);
            setTotalPages(1);
            setPageNumber(0);
          } else {
            setShowPagination(true);
            setTotalPages(res.data.totalPages || 1);
            setTotalCount(res.data.totalCount || 0);
            setCurrentPage(page);
            setPageNumber(page - 1);
          }
          
          setShowCakeBookings(false);
          setIsLoading(false);
          
          // Store state after successful fetch (unless skipStore is true)
          if (!skipStore) {
            storeCurrentState();
          }
          
          // Show toast message with filter info
          if (filters.logCreatedDate) {
            const filteredCount = bookingsData.filter(booking => 
              booking.logCreatedDate && 
              moment(booking.logCreatedDate).format('YYYY-MM-DD') === filters.logCreatedDate
            ).length;
            toast.success(`Found ${filteredCount} bookings for booking date: ${filters.logCreatedDate}`);
          } else if (filters.singleDate) {
            toast.success(`Found ${bookingsData.length} bookings for event date: ${filters.singleDate}`);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching confirmed bookings:", error);
        toast.error("Failed to fetch confirmed bookings");
        setIsLoading(false);
      });
  };

  // ========== FUNCTION THAT USES STATE VARIABLES (NOW AFTER DECLARATION) ==========
  const isFilterApplied = () => {
    return dateFilter !== "all" || 
           eventDateFilter !== "all" || 
           (form.search && form.search.trim() !== "") ||
           filters.fromDate !== "" ||
           filters.toDate !== "";
  };
  // ===============================================================================

  const applyBackendFilters = (skipStore = false) => {
    const filtersObj = {};

    if (form.search && form.search.trim()) {
      filtersObj.searchQuery = form.search;
    }

    if (dateFilter !== "all") {
      if (dateFilter === "today") {
        const today = moment().format('YYYY-MM-DD');
        filtersObj.logCreatedDate = today;
        console.log("Applying Booking Date filter (Today):", today);
      } else if (dateFilter === "yesterday") {
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
        filtersObj.logCreatedDate = yesterday;
        console.log("Applying Booking Date filter (Yesterday):", yesterday);
      } else if (dateFilter === "custom" && customBookingDate) {
        filtersObj.logCreatedDate = customBookingDate;
        console.log("Applying Booking Date filter (Custom):", customBookingDate);
      }
    }

    if (eventDateFilter !== "all") {
      if (eventDateFilter === "today") {
        filtersObj.filterType = "today";
        console.log("Applying Event Date filter (Today)");
      } else if (eventDateFilter === "yesterday") {
        filtersObj.filterType = "yesterday";
        console.log("Applying Event Date filter (Yesterday)");
      } else if (eventDateFilter === "custom" && customEventDate) {
        filtersObj.singleDate = customEventDate;
        console.log("Applying Event Date filter (Custom):", customEventDate);
      }
    }

    console.log("Applying backend filters:", filtersObj);
    getConfirmedBookings(1, filtersObj, skipStore);
  };

  const custsearch = (e) => {
    const searchValue = e.target.value;
    setform(prev => ({ ...prev, search: searchValue }));
  };

  // Check if we're returning from a detail page on component mount
  useEffect(() => {
    const returnToFilteredState = sessionStorage.getItem("returnToFilteredState");
    
    if (returnToFilteredState === "true") {
      const restored = restoreState();
      if (restored) {
        setIsReturningFromDetail(true);
        sessionStorage.removeItem("returnToFilteredState");
      } else {
        // If restore failed, fetch fresh data
        getConfirmedBookings(1);
      }
    } else {
      // First time load, check if we have any state to restore
      const restored = restoreState();
      if (!restored) {
        getConfirmedBookings(1);
      }
    }

    // Cleanup function
    return () => {
      // Don't clear state on unmount, we want to keep it
    };
  }, []);

  // Handle search debounce
  useEffect(() => {
    if (!showCakeBookings && !isReturningFromDetail) {
      const debounceTimer = setTimeout(() => {
        applyBackendFilters();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
    setIsReturningFromDetail(false);
  }, [dateFilter, customBookingDate, eventDateFilter, customEventDate, form.search]);

  // Handle page change properly
  const handlePageChange = (selectedPage) => {
    const page = selectedPage.selected + 1;
    console.log("Page changed to:", page, "Current page number:", selectedPage.selected);
    setCurrentPage(page);
    setPageNumber(selectedPage.selected);
    
    if (showCakeBookings) {
      const startIndex = (page - 1) * listPerPage;
      const endIndex = startIndex + listPerPage;
      const paginatedData = allUsers.slice(startIndex, endIndex);
      setusers(paginatedData);
      // Store state after page change
      storeCurrentState();
    } else {
      if (!isFilterApplied()) {
        getConfirmedBookings(page, {});
      } else {
        // If filters are applied, we need to handle pagination differently
        const startIndex = (page - 1) * listPerPage;
        const endIndex = startIndex + listPerPage;
        const paginatedData = allUsers.slice(startIndex, endIndex);
        setusers(paginatedData);
        storeCurrentState();
      }
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    Edit();
  };

  const handleChange1 = (e) => {
    let myUser = { ...form1 };
    myUser[e.target.name] = e.target.value;
    setform1(myUser);
  };

  const Edit = () => {
    const token = datas;
    const formid = form1._id;
    const dataArray = {
      status: form1.status,
      cancellReason: form1.cancellReason,
    };
    axios
      .put(URLS.UpdateBookingsStatus + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            setmodal_small(false);
            if (showCakeBookings) {
              getCakeBookings();
            } else {
              const filters = {};
              if (form.search) filters.searchQuery = form.search;
              if (dateFilter !== "all") {
                if (dateFilter === "today") {
                  const today = moment().format('YYYY-MM-DD');
                  filters.logCreatedDate = today;
                } else if (dateFilter === "yesterday") {
                  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
                  filters.logCreatedDate = yesterday;
                } else if (dateFilter === "custom" && customBookingDate) {
                  filters.logCreatedDate = customBookingDate;
                }
              }
              if (eventDateFilter !== "all") {
                if (eventDateFilter === "today") {
                  filters.filterType = "today";
                } else if (eventDateFilter === "yesterday") {
                  filters.filterType = "yesterday";
                } else if (eventDateFilter === "custom" && customEventDate) {
                  filters.singleDate = customEventDate;
                }
              }
              getConfirmedBookings(currentPage, filters);
            }
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
          }
        }
      );
  };

  const handleChangeflt = (e) => {
    let myUser = { ...filters };
    myUser[e.target.name] = e.target.value;
    setfilters(myUser);
  };

  const getfilter = (e) => {
    e.preventDefault();
    GetOrderFiliter();
  };

  const GetOrderFiliter = () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error("Please select both from and to dates");
      return;
    }

    setIsLoading(true);
    const requestData = {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    };

    console.log("Date Range Filter Request:", requestData);

    const token = datas;
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/confirmedbookings",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const bookingsData = res.data.data || [];
        console.log("Date Range Filter Response:", res.data);
        
        setAllUsers(bookingsData);
        setusers(bookingsData);
        setFilteredDataForExcel(bookingsData);
        setFilteredLists(bookingsData);
        
        setShowPagination(false);
        setShowCakeBookings(false);
        setIsLoading(false);
        setTotalCount(bookingsData.length);
        setCurrentPage(1);
        setTotalPages(1);
        setPageNumber(0);
        
        // Store state after filter
        storeCurrentState();
        
        hidefilter();
        toast.success(`Found ${bookingsData.length} bookings from ${filters.fromDate} to ${filters.toDate}`);
      })
      .catch((error) => {
        console.error("Error fetching filtered bookings:", error);
        toast.error("Failed to fetch filtered bookings");
        setIsLoading(false);
      });
  };

  const hidefilter = () => setfilter(false);

  const handleDateFilterChange = (filterType, value) => {
    console.log("Booking Date Filter Changed:", filterType, value);
    setDateFilter(filterType);
    if (filterType === "custom") {
      setCustomBookingDate(value);
    } else {
      setCustomBookingDate("");
    }
    
    // Reset event date filter when booking date filter is applied
    if (filterType !== "all") {
      setEventDateFilter("all");
      setCustomEventDate("");
    }
  };

  const handleEventDateFilterChange = (filterType, value) => {
    console.log("Event Date Filter Changed:", filterType, value);
    setEventDateFilter(filterType);
    if (filterType === "custom") {
      setCustomEventDate(value);
    } else {
      setCustomEventDate("");
    }
    
    // Reset booking date filter when event date filter is applied
    if (filterType !== "all") {
      setDateFilter("all");
      setCustomBookingDate("");
    }
  };

  const navigateToAdvancedFilter = () => {
    // Store current state before navigating
    storeCurrentState();
    
    const currentFilters = {
      addressName: "",
      bookingSource: "",
      heardFrom: "",
      theatreName: "",
      occasionName: "",
      status: "",
      date: customEventDate || "",
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
      searchQuery: form.search || ""
    };
    
    sessionStorage.setItem("returnToFilteredState", "true");
    history.push("/advanced-filter", { 
      filters: currentFilters,
      fromPage: showCakeBookings ? "cake" : "confirmed"
    });
  };

  const calculateGST = (subTotal) => {
    return (parseFloat(subTotal || 0) * 0.18).toFixed(2);
  };

  const calculateTotalWithGST = (subTotal) => {
    const gstAmount = parseFloat(calculateGST(subTotal));
    return (parseFloat(subTotal || 0) + gstAmount).toFixed(2);
  };

  const getSubTotal = (booking) => {
    if (booking?.subTotal) {
      return parseFloat(booking.subTotal);
    }
    if (booking?.totalPrice) {
      return parseFloat(booking.totalPrice);
    }
    return 0;
  };

  // Get starting serial number based on current page
  const getStartingSerialNumber = () => {
    if (!showPagination) {
      return 1;
    }
    return (currentPage - 1) * listPerPage + 1;
  };

  // Get showing range for display
  const getShowingRange = () => {
    const start = getStartingSerialNumber();
    const end = Math.min(start + users.length - 1, totalCount);
    return `${start} to ${end}`;
  };

  // Get serial number for each row
  const getSerialNumber = (index) => {
    if (!showPagination) {
      return index + 1;
    }
    return (currentPage - 1) * listPerPage + index + 1;
  };

  // UPDATED: Removed remaining columns from headers
  const headers2 = [
    { label: "S.No", key: "sno" },
    { label: "Event Id", key: "orderId" },
    { label: "Booking Date", key: "bookingDate" },
    { label: "Event Date", key: "date" },
    { label: "Event Time", key: "time" },
    { label: "Name", key: "userName" },
    { label: "Phone", key: "userPhone" },
    { label: "Theater Name", key: "theatreName" },
    { label: "Address Name", key: "addressName" },
    { label: "Plan Name", key: "planName" },
    { label: "Occasion Name", key: "occasionName" },
    { label: "Referred Code", key: "referredCode" },
    { label: "Sub Total (Without GST)", key: "subTotal" },
    { label: "GST Amount (18%)", key: "gstAmount" },
    { label: "Total Amount (With GST)", key: "totalWithGST" },
    { label: "Total Price (Direct)", key: "totalPrice" },
    { label: "Status", key: "status" },
    { label: "Booking Source", key: "bookingSource" },
    { label: "Heard From", key: "heardFrom" },
    { label: "Queries", key: "queries" },
  ];

  // UPDATED: Removed remaining columns from cake headers
  const cakeHeaders = [
    { label: "S.No", key: "sno" },
    { label: "Event Id", key: "orderId" },
    { label: "Booking Date", key: "bookingDate" },
    { label: "Event Date", key: "date" },
    { label: "Event Time", key: "time" },
    { label: "Name", key: "userName" },
    { label: "Phone", key: "userPhone" },
    { label: "Theater Name", key: "theatreName" },
    { label: "Address Name", key: "addressName" },
    { label: "Plan Name", key: "planName" },
    { label: "Occasion Name", key: "occasionName" },
    { label: "Referred Code", key: "referredCode" },
    { label: "Sub Total (Without GST)", key: "subTotal" },
    { label: "GST Amount (18%)", key: "gstAmount" },
    { label: "Total Amount (With GST)", key: "totalWithGST" },
    { label: "Total Price (Direct)", key: "totalPrice" },
    { label: "Person Name", key: "personName" },
    { label: "No. of Persons", key: "noOfPersons" },
    { label: "Extra Persons", key: "extraAddedPersons" },
    { label: "Theatre Price", key: "theatrePrice" },
    { label: "Occasion Price", key: "occasionPrice" },
    { label: "Coupon Code", key: "couponCode" },
    { label: "Coupon Amount", key: "couponAmount" },
    { label: "Status", key: "status" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Cash Type", key: "cashType" },
    { label: "Transaction Status", key: "transactionStatus" },
    { label: "Decoration", key: "decoration" },
    { label: "Note Description", key: "noteDescription" },
    { label: "Booking Source", key: "bookingSource" },
    { label: "Heard From", key: "heardFrom" },
    { label: "Cake Products", key: "cakeProducts" },
    { label: "Other Products", key: "otherProducts" },
    { label: "Queries", key: "queries" },
  ];

  // UPDATED: Filtered CSV data without remaining columns
  const filteredCsvData = users.map((elt, i) => {
    const subTotal = getSubTotal(elt);
    const gstAmount = calculateGST(subTotal);
    const totalWithGST = calculateTotalWithGST(subTotal);

    return {
      sno: getSerialNumber(i),
      orderId: elt.orderId || "N/A",
      bookingDate: elt.logCreatedDate ? moment(elt.logCreatedDate).format('YYYY-MM-DD') : "N/A",
      date: elt.date || "N/A",
      time: elt.time || "N/A",
      userName: elt.userName || "N/A",
      userPhone: elt.userPhone || "N/A",
      theatreName: elt.theatreName || "N/A",
      addressName: elt.addressName || "N/A",
      planName: elt.planName || "N/A",
      occasionName: elt.occasionName || "N/A",
      referredCode: elt.referredCode || "N/A",
      subTotal: subTotal.toFixed(2),
      gstAmount: gstAmount,
      totalWithGST: totalWithGST,
      totalPrice: elt.totalPrice ? parseFloat(elt.totalPrice).toFixed(2) : subTotal.toFixed(2),
      status: elt.status || "N/A",
      bookingSource: elt.bookingSource || "N/A",
      heardFrom: elt.heardFrom || "N/A",
      queries:
        elt.queries && elt.queries.length > 0
          ? elt.queries.map((q) => q.query).join(" | ")
          : "No queries",
    };
  });

  // UPDATED: Cake CSV data without remaining columns
  const cakeCsvData = cakeBookingsForCsv.map((elt, i) => {
    const subTotal = getSubTotal(elt);
    const gstAmount = calculateGST(subTotal);
    const totalWithGST = calculateTotalWithGST(subTotal);

    const cakeProducts = elt.products
      ? elt.products
          .filter(p => p.type === "cake")
          .map(p => `${p.name} (${p.quantity})`)
          .join(" | ")
      : "No cake products";

    const otherProducts = elt.products
      ? elt.products
          .filter(p => p.type !== "cake")
          .map(p => `${p.name} (${p.quantity})`)
          .join(" | ")
      : "No other products";

    return {
      sno: i + 1,
      orderId: elt.orderId || "N/A",
      bookingDate: elt.logCreatedDate ? moment(elt.logCreatedDate).format('YYYY-MM-DD') : "N/A",
      date: elt.date || "N/A",
      time: elt.time || "N/A",
      userName: elt.userName || "N/A",
      userPhone: elt.userPhone || "N/A",
      theatreName: elt.theatreName || "N/A",
      addressName: elt.addressName || "N/A",
      planName: elt.planName || "N/A",
      occasionName: elt.occasionName || "N/A",
      referredCode: elt.referredCode || "N/A",
      subTotal: subTotal.toFixed(2),
      gstAmount: gstAmount,
      totalWithGST: totalWithGST,
      totalPrice: elt.totalPrice ? parseFloat(elt.totalPrice).toFixed(2) : subTotal.toFixed(2),
      personName: elt.personName || "N/A",
      noOfPersons: elt.noOfPersons || 0,
      extraAddedPersons: elt.extraAddedPersons || 0,
      theatrePrice: elt.theatrePrice || 0,
      occasionPrice: elt.occasionPrice || 0,
      couponCode: elt.couponCode || "N/A",
      couponAmount: elt.couponAmount || 0,
      status: elt.status || "N/A",
      paymentType: elt.paymentType || "N/A",
      cashType: elt.cashType || "N/A",
      transactionStatus: elt.transactionStatus || "N/A",
      decoration: elt.decoration || "N/A",
      noteDescription: elt.noteDescription || "N/A",
      bookingSource: elt.bookingSource || "N/A",
      heardFrom: elt.heardFrom || "N/A",
      cakeProducts: cakeProducts,
      otherProducts: otherProducts,
      queries:
        elt.queries && elt.queries.length > 0
          ? elt.queries.map((q) => q.query).join(" | ")
          : "No queries",
    };
  });

  const filteredCsvReport = {
    filename: "Filtered_Booking_Report.csv",
    headers: headers2,
    data: filteredCsvData,
  };

  const cakeCsvReport = {
    filename: "Cake_Bookings_Report.csv",
    headers: cakeHeaders,
    data: cakeCsvData,
  };

  // UPDATED: Export PDF without remaining columns
  const exportPDF = () => {
    const unit = "pt";
    const size = "A2";
    const orientation = "landscape";
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    
    const headers = showCakeBookings
      ? [
          ["S.No", "Event Id", "Booking Date", "Event Date", "Name", "Phone", "Theater Name", "Address Name", "Plan Name", "Occasion Name", "Referred Code", "Booking Source", "Heard From", "Cake Products", "Total Price", "Status"]
        ]
      : [
          ["S.No", "Event Id", "Booking Date", "Event Date", "Event Time", "Name", "Phone", "Theater Name", "Address Name", "Plan Name", "Occasion Name", "Referred Code", "Booking Source", "Heard From", "Total Price", "Status"]
        ];
    
    const data = users.map((elt, i) => 
      showCakeBookings
        ? [
            getSerialNumber(i),
            elt.orderId || "N/A",
            elt.logCreatedDate ? moment(elt.logCreatedDate).format('YYYY-MM-DD') : 'N/A',
            elt.date || "N/A",
            elt.userName || "N/A",
            elt.userPhone || "N/A",
            elt.theatreName || "N/A",
            elt.addressName || "N/A",
            elt.planName || "N/A",
            elt.occasionName || "N/A",
            elt.referredCode || "N/A",
            elt.bookingSource || "N/A",
            elt.heardFrom || "N/A",
            elt.products?.filter(p => p.type === "cake").map(p => p.name).join(", ") || "No cakes",
            getSubTotal(elt).toFixed(2),
            elt.status || "N/A",
          ]
        : [
            getSerialNumber(i),
            elt.orderId || "N/A",
            elt.logCreatedDate ? moment(elt.logCreatedDate).format('YYYY-MM-DD') : 'N/A',
            elt.date || "N/A",
            elt.time || "N/A",
            elt.userName || "N/A",
            elt.userPhone || "N/A",
            elt.theatreName || "N/A",
            elt.addressName || "N/A",
            elt.planName || "N/A",
            elt.occasionName || "N/A",
            elt.referredCode || "N/A",
            elt.bookingSource || "N/A",
            elt.heardFrom || "N/A",
            getSubTotal(elt).toFixed(2),
            elt.status || "N/A",
          ]
    );
    
    let content = {
      startY: 50,
      head: headers,
      body: data,
      styles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 30 } }
    };
    doc.autoTable(content);
    doc.save(showCakeBookings ? "Cake_Bookings_Report.pdf" : "Booking_Report.pdf");
  };

  const Roles = data?.rolesAndPermission[0];

  const handleCakeBookingsDateFilter = (date) => {
    getCakeBookings(date);
  };

  const showConfirmedBookings = () => {
    getConfirmedBookings(1);
  };

  const clearFilters = () => {
    setDateFilter("all");
    setEventDateFilter("all");
    setCustomBookingDate("");
    setCustomEventDate("");
    setform({ search: "" });
    setfilters({ fromDate: "", toDate: "" });
    
    if (showCakeBookings) {
      getCakeBookings();
    } else {
      getConfirmedBookings(1);
    }
    
    // Clear stored state after clearing filters
    clearStoredState();
  };

  const handleCakeBookingsClick = () => {
    setIsLoading(true);
    getCakeBookings();
  };

  const handleConfirmedBookingsClick = () => {
    setIsLoading(true);
    showConfirmedBookings();
  };

  // Helper function to check if a booking matches the filter
  const matchesBookingDateFilter = (booking) => {
    if (dateFilter === "all") return true;
    
    const bookingDate = booking.logCreatedDate ? moment(booking.logCreatedDate).format('YYYY-MM-DD') : null;
    
    if (dateFilter === "today") {
      const today = moment().format('YYYY-MM-DD');
      return bookingDate === today;
    } else if (dateFilter === "yesterday") {
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      return bookingDate === yesterday;
    } else if (dateFilter === "custom" && customBookingDate) {
      return bookingDate === customBookingDate;
    }
    
    return true;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem={showCakeBookings ? "Cake Bookings" : "Confirmed Bookings"}
          />
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="mt-2 text-muted fs-5">
              Total {showCakeBookings ? "Cake" : "Confirmed"} Bookings: {totalCount}
              {!showCakeBookings && isFilterApplied() && (
                <span className="text-info ms-2">
                  (Filtered: {users.filter(matchesBookingDateFilter).length})
                </span>
              )}
              {showPagination && (
                <span className="text-primary ms-2">
                  (Showing {getShowingRange()} | Page {currentPage} of {totalPages})
                </span>
              )}
              {isLoading && (
                <span className="text-warning ms-2">
                  <Spinner size="sm" className="me-2" /> Loading...
                </span>
              )}
            </div>
            
            <div>
              <Button
                color={showCakeBookings ? "outline-primary" : "primary"}
                className="me-2"
                onClick={handleConfirmedBookingsClick}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Confirmed Bookings"}
              </Button>
              <Button
                color={showCakeBookings ? "primary" : "outline-primary"}
                onClick={handleCakeBookingsClick}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Cake Bookings"}
              </Button>
            </div>
          </div>
          
          {isFilterApplied() && !showCakeBookings && (
            <div className="alert alert-info d-flex justify-content-between align-items-center">
              <span>
                <i className="fas fa-filter me-2"></i>
                Filters applied - Showing {users.filter(matchesBookingDateFilter).length} of {users.length} records: 
                {dateFilter !== "all" && ` Booking Date: ${dateFilter === "custom" ? customBookingDate : dateFilter}`}
                {eventDateFilter !== "all" && ` Event Date: ${eventDateFilter === "custom" ? customEventDate : eventDateFilter}`}
                {form.search && ` Search: ${form.search}`}
                {filters.fromDate && ` Date Range: ${filters.fromDate} to ${filters.toDate}`}
              </span>
              <Button color="link" className="p-0 text-danger" onClick={clearFilters}>
                <i className="fas fa-times-circle me-1"></i> Clear All Filters
              </Button>
            </div>
          )}
          
          {showCakeBookings && (
            <Card className="mb-3">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Filter Cake Bookings</h5>
                  <div className="text-muted">
                    Showing {getShowingRange()} of {totalCount} entries
                  </div>
                </div>
                <Row>
                  <Col md={6}>
                    <Label for="cakeBookingDate">Filter Cake Bookings by Event Date</Label>
                    <Input
                      type="date"
                      id="cakeBookingDate"
                      onChange={(e) => handleCakeBookingsDateFilter(e.target.value)}
                    />
                    <small className="text-muted">Select any date</small>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <Button color="info" onClick={() => getCakeBookings()}>
                      <i className="fas fa-redo me-2"></i> Show All Cake Bookings
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
          
          {filter ? (
            <>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      getfilter(e);
                    }}
                  >
                    <Row>
                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-input10">
                            From Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            required
                            className="form-control"
                            id="basicpill-Declaration-input10"
                            onChange={(e) => {
                              handleChangeflt(e);
                            }}
                            name="fromDate"
                            value={filters.fromDate}
                          />
                        </div>
                      </Col>
                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-input11">
                            To Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            required
                            className="form-control"
                            id="basicpill-Declaration-input11"
                            onChange={(e) => {
                              handleChangeflt(e);
                            }}
                            name="toDate"
                            value={filters.toDate}
                            min={filters.fromDate}
                          />
                        </div>
                      </Col>
                      <Col lg="3">
                        <div className="mt-4">
                          <Button 
                            type="submit" 
                            className="m-1" 
                            color="info"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Spinner size="sm" className="me-2" /> Applying...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check-circle me-2"></i> Apply Filter
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={hidefilter}
                            className="m-1"
                            color="danger"
                            disabled={isLoading}
                          >
                            <i className="fas fa-times-circle me-2"></i> Cancel
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </>
          ) : (
            ""
          )}
          
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col className="d-flex align-items-center">
                      {showCakeBookings ? (
                        <CSVLink {...cakeCsvReport}>
                          <button className="btn btn-success me-2" type="button">
                            <i className="fas fa-file-excel me-2"></i> Cake CSV
                          </button>
                        </CSVLink>
                      ) : (
                        <CSVLink {...filteredCsvReport}>
                          <button className="btn btn-success me-2" type="button">
                            <i className="fas fa-file-excel me-2"></i> Excel
                          </button>
                        </CSVLink>
                      )}

                      <Button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={exportPDF}
                        disabled={users.length === 0}
                      >
                        <i className="fas fa-file-pdf me-2"></i> Pdf
                      </Button>

                      <Button
                        className="btn btn-info me-2"
                        onClick={() => setfilter(!filter)}
                      >
                        <i className="fas fa-filter me-2"></i> Date Range Filter
                      </Button>

                      <Button
                        className="btn btn-warning"
                        onClick={navigateToAdvancedFilter}
                      >
                        <i className="fas fa-sliders-h me-2"></i>
                        Advanced Filter
                      </Button>
                    </Col>

                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={custsearch}
                          type="search"
                          placeholder="Search by Order ID, Name, Phone, Theater..."
                          disabled={isLoading || showCakeBookings}
                        />
                      </div>
                    </Col>
                  </Row>
                  
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Event Id</th>
                          {!showCakeBookings && (
                            <>
                              <th>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    tag="div"
                                    className="d-flex align-items-center"
                                    style={{ cursor: "pointer", userSelect: "none" }}
                                    disabled={isLoading}
                                  >
                                    <span>Booking Date</span>
                                    <i className="bx bx-chevron-down ml-1" />
                                    {dateFilter !== "all" && (
                                      <Badge color="info" pill className="ms-1">
                                        {dateFilter === "custom" ? customBookingDate : dateFilter}
                                      </Badge>
                                    )}
                                  </DropdownToggle>
                                  <DropdownMenu style={{ padding: "10px" }}>
                                    <DropdownItem 
                                      onClick={() => handleDateFilterChange("all", "")}
                                      active={dateFilter === "all"}
                                    >
                                      All Booking Dates
                                    </DropdownItem>
                                    <DropdownItem 
                                      onClick={() => handleDateFilterChange("today", "")}
                                      active={dateFilter === "today"}
                                    >
                                      Today's Bookings
                                    </DropdownItem>
                                    <DropdownItem 
                                      onClick={() => handleDateFilterChange("yesterday", "")}
                                      active={dateFilter === "yesterday"}
                                    >
                                      Yesterday's Bookings
                                    </DropdownItem>
                                    <div className="mt-2">
                                      <label
                                        htmlFor="customBookingDate"
                                        style={{ fontSize: "12px", fontWeight: "bold" }}
                                      >
                                        Or Select Specific Booking Date:
                                      </label>
                                      <input
                                        type="date"
                                        id="customBookingDate"
                                        className="form-control mt-1"
                                        onChange={(e) => handleDateFilterChange("custom", e.target.value)}
                                        value={customBookingDate}
                                      />
                                    </div>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </th>
                              <th>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    tag="div"
                                    className="d-flex align-items-center"
                                    style={{ cursor: "pointer", userSelect: "none" }}
                                    disabled={isLoading}
                                  >
                                    <span>Event Date</span>
                                    <i className="bx bx-chevron-down ml-1" />
                                    {eventDateFilter !== "all" && (
                                      <Badge color="info" pill className="ms-1">
                                        {eventDateFilter === "custom" ? customEventDate : eventDateFilter}
                                      </Badge>
                                    )}
                                  </DropdownToggle>
                                  <DropdownMenu style={{ padding: "10px" }}>
                                    <DropdownItem 
                                      onClick={() => handleEventDateFilterChange("all", "")}
                                      active={eventDateFilter === "all"}
                                    >
                                      All Event Dates
                                    </DropdownItem>
                                    <DropdownItem 
                                      onClick={() => handleEventDateFilterChange("today", "")}
                                      active={eventDateFilter === "today"}
                                    >
                                      Today's Events
                                    </DropdownItem>
                                    <DropdownItem 
                                      onClick={() => handleEventDateFilterChange("yesterday", "")}
                                      active={eventDateFilter === "yesterday"}
                                    >
                                      Yesterday's Events
                                    </DropdownItem>
                                    <div className="mt-2">
                                      <label
                                        htmlFor="customEventDate"
                                        style={{ fontSize: "12px", fontWeight: "bold" }}
                                      >
                                        Or Select Specific Event Date:
                                      </label>
                                      <input
                                        type="date"
                                        id="customEventDate"
                                        className="form-control mt-1"
                                        onChange={(e) => handleEventDateFilterChange("custom", e.target.value)}
                                        value={customEventDate}
                                      />
                                    </div>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </th>
                              <th>Event Time</th>
                            </>
                          )}
                          {showCakeBookings && (
                            <>
                              <th>Booking Date</th>
                              <th>Event Date</th>
                              <th>Event Time</th>
                            </>
                          )}
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Theater Name</th>
                          <th>Address Name</th>
                          <th>Plan Name</th>
                          <th>Occasion Name</th>
                          <th>Referred Code</th>
                          <th>GST (18%)</th>
                          <th>Total Price (Direct)</th>
                          
                          {showCakeBookings && (
                            <>
                              <th>Cake Products</th>
                              <th>Other Products</th>
                            </>
                          )}
                          <th>Booking Source</th>
                          <th>Heard From</th>
                          
                          {/* REMOVED: Remaining columns removed */}
                          
                          <th>Status</th>
                          <th>Action</th>
                          <th>Queries</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users
                            .filter(matchesBookingDateFilter)
                            .map((data, key) => {
                            // GST calculations - only on subTotal
                            const subTotal = getSubTotal(data);
                            const gstAmount = calculateGST(subTotal);
                            const totalWithGST = calculateTotalWithGST(subTotal);

                            return (
                              <tr key={key}>
                                <th scope="row">
                                  {getSerialNumber(key)}
                                </th>
                                <td>{data.orderId}</td>
                                {!showCakeBookings && (
                                  <>
                                    <td>
                                      <div className="fw-bold">
                                        {data.logCreatedDate ? moment(data.logCreatedDate).format('YYYY-MM-DD') : 'N/A'}
                                      </div>
                                      <div className="text-muted small">
                                        Booked on
                                      </div>
                                    </td>
                                    <td>
                                      <div className="fw-bold">
                                        {data.date}
                                      </div>
                                      <div className="text-muted small">
                                        Event on
                                      </div>
                                    </td>
                                    <td>{data.time}</td>
                                  </>
                                )}
                                {showCakeBookings && (
                                  <>
                                    <td>{data.logCreatedDate ? moment(data.logCreatedDate).format('YYYY-MM-DD') : 'N/A'}</td>
                                    <td>{data.date}</td>
                                    <td>{data.time}</td>
                                  </>
                                )}
                                <td>{data.userName}</td>
                                <td>{data.userPhone}</td>
                                <td>{data.theatreName}</td>
                                <td>{data.addressName || "N/A"}</td>
                                <td>{data.planName || "Basic Plan"}</td>
                                <td>{data.occasionName || "N/A"}</td>
                                <td>
                                  <Badge color="secondary">
                                    {data.referredCode || "N/A"}
                                  </Badge>
                                </td>
                                
                                <td>
                                  <Badge color="warning">
                                    {gstAmount}
                                  </Badge>
                                </td>

                                <td>
                                  <Badge color="primary">
                                    ₹{data.totalPrice ? parseFloat(data.totalPrice).toFixed(2) : subTotal.toFixed(2)}
                                  </Badge>
                                </td>
                                
                                {showCakeBookings && (
                                  <>
                                    <td>
                                      {data.products
                                        ?.filter(p => p.type === "cake")
                                        .map(p => `${p.name} (${p.quantity})`)
                                        .join(", ") || "No cakes"}
                                    </td>
                                    <td>
                                      {data.products
                                        ?.filter(p => p.type !== "cake")
                                        .map(p => `${p.name} (${p.quantity})`)
                                        .join(", ") || "No other products"}
                                    </td>
                                  </>
                                )}
                                <td>
                                  <Badge color="info">
                                    {data.bookingSource || "N/A"}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge color="success">
                                    {data.heardFrom || "N/A"}
                                  </Badge>
                                </td>
                                
                                {/* REMOVED: Remaining columns removed */}
                                
                                <td>
                                  <Badge color={
                                    data.status === 'booking-confirmed' ? 'success' :
                                    data.status === 'completed' ? 'primary' :
                                    data.status === 'cancelled' ? 'danger' : 'warning'
                                  }>
                                    {data.status}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="d-flex flex-wrap gap-1">
                                    {(Roles?.pendingView || Roles?.accessAll) && (
                                      <Button
                                        onClick={() => Actinid1(data)}
                                        size="sm"
                                        color="info"
                                      >
                                        <i className="fas fa-eye"></i> View
                                      </Button>
                                    )}
                                    {(Roles?.pendingEdit || Roles?.accessAll) && (
                                      <Button
                                        onClick={() => getpopup(data)}
                                        size="sm"
                                        color="success"
                                      >
                                        <i className="bx bx-edit"></i> Edit
                                      </Button>
                                    )}
                                    {(Roles?.posAccess || Roles?.accessAll) && (
                                      <Button
                                        onClick={() => handleAddPos(data)}
                                        size="sm"
                                        color="warning"
                                      >
                                        <i className="fas fa-cash-register"></i> POS
                                      </Button>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {data.queries && data.queries.length > 0
                                    ? data.queries.map((q, i) => (
                                        <div key={i} style={{ marginBottom: "5px" }}>
                                          <Badge color="secondary" className="me-1">
                                            {i + 1}
                                          </Badge>
                                          {q.query}
                                        </div>
                                      ))
                                    : "No queries"}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={showCakeBookings ? "21" : "20"} className="text-center">
                              {isLoading ? (
                                <div>
                                  <Spinner size="lg" className="mb-2" />
                                  <div>Loading bookings...</div>
                                </div>
                              ) : dateFilter !== "all" ? (
                                <div className="text-warning">
                                  <i className="fas fa-exclamation-triangle me-2"></i>
                                  No bookings found for {dateFilter === "custom" ? customBookingDate : dateFilter}
                                </div>
                              ) : (
                                "No bookings found"
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    
                    {showPagination && totalPages > 1 && (
                      <Col sm="12">
                        <div
                          className="d-flex mt-3 mb-1"
                          style={{ float: "right" }}
                        >
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={totalPages}
                            onPageChange={handlePageChange}
                            containerClassName={"pagination"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"disabled"}
                            activeClassName={"active"}
                            forcePage={pageNumber}
                          />
                        </div>
                      </Col>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        
        <Modal
          size="md"
          isOpen={modal_small}
          toggle={() => {
            tog_small();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Status
            </h5>
            <button
              onClick={() => {
                setmodal_small(false);
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
              onSubmit={(e) => {
                handleSubmit1(e);
              }}
            >
              <div className="mb-3">
                <Label>Status</Label>
                <span className="text-danger">*</span>
                <select
                  value={form1.status}
                  name="status"
                  required
                  onChange={(e) => {
                    handleChange1(e);
                  }}
                  className="form-select"
                >
                  <option value="">Select</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {form1.status == "cancelled" ? (
                <>
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Cancelled Reason <span className="text-danger">*</span>
                    </Label>
                    <textarea
                      type="text"
                      rows="3"
                      required
                      className="form-control "
                      id="basicpill-firstname-input1"
                      placeholder="Enter Cancelled Reason"
                      value={form1.cancellReason}
                      name="cancellReason"
                      onChange={(e) => {
                        handleChange1(e);
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small(false);
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-1" color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default Staff;