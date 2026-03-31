import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, Table,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Input, InputGroup, InputGroupText, Spinner, Button, Badge,
  Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { Link } from "react-router-dom";
import { URLS } from "../../Weburls"

// Inline CSS styles (same as before)
const styles = `
.dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.report-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.badge-soft-primary {
  background-color: rgba(85, 110, 230, 0.1);
  color: #556ee6;
  border: none;
}

.badge-soft-success {
  background-color: rgba(52, 195, 143, 0.1);
  color: #34c38f;
  border: none;
}

.badge-soft-info {
  background-color: rgba(80, 165, 241, 0.1);
  color: #50a5f1;
  border: none;
}

.badge-soft-warning {
  background-color: rgba(241, 180, 76, 0.1);
  color: #f1b44c;
  border: none;
}

.badge-soft-danger {
  background-color: rgba(244, 106, 106, 0.1);
  color: #f46a6a;
  border: none;
}

.badge-soft {
  border: none;
  font-weight: 500;
}

.table-responsive-custom {
  max-height: 400px;
}

.table-responsive-custom::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-responsive-custom::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-responsive-custom::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.table-responsive-custom::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.card-hover {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.card-hover:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-color: #d0d0d0;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.loading-pulse {
  animation: pulse 2s infinite;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.btn-custom {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.table-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333333 !important;
}

.table-header-custom th {
  border: none;
  padding: 12px 16px;
  font-weight: 600;
  color: #333333 !important;
}

.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.gradient-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-pending {
  background: linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%);
}

.gradient-confirmed {
  background: linear-gradient(135deg, #28c76f 0%, #81fbb8 100%);
}

.gradient-completed {
  background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
}

.gradient-cancelled {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);
}

.custom-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.table-hover-custom tbody tr {
  transition: all 0.3s ease;
}

.table-hover-custom tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
  transform: translateX(2px);
}

.icon-container {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.filter-dropdown .dropdown-toggle {
  border-radius: 8px;
  font-weight: 500;
}

.responsive-text {
  font-size: clamp(0.8rem, 2vw, 1rem);
}

.chart-container {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
}

.pagination-custom .page-item.active .page-link {
  background-color: #556ee6;
  border-color: #556ee6;
}

.pagination-custom .page-link {
  color: #556ee6;
  border-radius: 6px;
  margin: 0 2px;
}

.search-input {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #556ee6;
  box-shadow: 0 0 0 0.2rem rgba(85, 110, 230, 0.25);
}

.stats-highlight {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cake-chart-card {
  border: 1px solid #e9ecef;
}

.cake-chart-header {
  padding: 0 10px;
}

.cake-filter-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.custom-date-modal {
  border-radius: 12px;
}

.custom-date-modal .modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.custom-date-modal .modal-header button {
  color: white;
}

.custom-date-range {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.custom-date-range .form-group {
  flex: 1;
}

.custom-date-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
  display: block;
}

.custom-date-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-date-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.custom-date-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.custom-date-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-date-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.custom-date-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.custom-date-btn-secondary {
  background: #e9ecef;
  border: none;
  color: #495057;
}

.custom-date-btn-secondary:hover {
  background: #dee2e6;
}

.active-filter-badge {
  background: #667eea;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.active-filter-badge i {
  cursor: pointer;
  font-size: 1rem;
}

.active-filter-badge i:hover {
  color: #ff6b6b;
}

.profit-positive {
  color: #34c38f;
  font-weight: 600;
}

.profit-negative {
  color: #f46a6a;
  font-weight: 600;
}

.product-image-sm {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
}

.card-title {
  color: #333333 !important;
  font-weight: 600;
}
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Dashboard = props => {
  const [dashboardData, setDashboardData] = useState({
    theatres: 0,
    occasions: 0,
    bookings: 0,
    amount: 0,
    posAmount: 0,
    latestBookings: [],
    staff: 0,
    departments: 0,
    services: 0,
    pendingBookingCount: 0,
    bookingConfirmedCount: 0,
    completedBookingCount: 0,
    cancelledBookingCount: 0
  });
  
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [filterBooking, setFilterBooking] = useState("This Week");
  const [dropdownOpenBooking, setDropdownOpenBooking] = useState(false);
  
  // Custom Date Range States for Bookings
  const [customDateModal, setCustomDateModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });
  
  // Custom Date Range States for Staff Revenue
  const [staffCustomDateModal, setStaffCustomDateModal] = useState(false);
  const [staffFromDate, setStaffFromDate] = useState("");
  const [staffToDate, setStaffToDate] = useState("");
  const [isStaffCustomDateActive, setIsStaffCustomDateActive] = useState(false);
  const [staffCustomDateRange, setStaffCustomDateRange] = useState({ from: "", to: "" });
  
  // Cake filter states
  const [selectedCake, setSelectedCake] = useState("");
  const [selectedCakeMonth, setSelectedCakeMonth] = useState("");
  
  const [cakeRevenueData, setCakeRevenueData] = useState({
    months: [],
    revenues: [],
    cakeNames: []
  });
  
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [staffRevenue, setStaffRevenue] = useState([]);
  const [filteredStaffRevenue, setFilteredStaffRevenue] = useState([]);
  const [staffFilter, setStaffFilter] = useState("This Month");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpenStaff, setDropdownOpenStaff] = useState(false);
  const [profitData, setProfitData] = useState([]);
  const [filteredProfitData, setFilteredProfitData] = useState([]);
  
  // Profit report filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonthProfit, setSelectedMonthProfit] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [profitSearchTerm, setProfitSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Current filter data
  const [currentFilterData, setCurrentFilterData] = useState({
    bookings: 0,
    amount: 0,
    details: []
  });

  // ========== Product Sales Report State ==========
  const [productSales, setProductSales] = useState([]);
  const [filteredProductSales, setFilteredProductSales] = useState([]);
  const [productSalesLoading, setProductSalesLoading] = useState(false);
  const [productSalesSearchTerm, setProductSalesSearchTerm] = useState("");
  const [productSalesMonth, setProductSalesMonth] = useState("");
  const [productSalesYear, setProductSalesYear] = useState("");
  const [productSalesCustomModal, setProductSalesCustomModal] = useState(false);
  const [productSalesFromDate, setProductSalesFromDate] = useState("");
  const [productSalesToDate, setProductSalesToDate] = useState("");
  const [productSalesFilterType, setProductSalesFilterType] = useState("all");
  const [productSalesPage, setProductSalesPage] = useState(1);
  const productSalesPerPage = 10;

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  // ========== BOOKINGS & REVENUE FUNCTIONS ==========
  const toggleCustomDateModal = () => {
    setCustomDateModal(!customDateModal);
  };

  const applyCustomDateFilter = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates");
      return;
    }

    setIsCustomDateActive(true);
    setCustomDateRange({ from: fromDate, to: toDate });
    setFilterBooking(`Custom (${formatDate(fromDate)} - ${formatDate(toDate)})`);
    
    await fetchCustomDateData(fromDate, toDate);
    toggleCustomDateModal();
  };

  const clearCustomDateFilter = () => {
    setIsCustomDateActive(false);
    setFromDate("");
    setToDate("");
    setCustomDateRange({ from: "", to: "" });
    setFilterBooking("This Week");
    fetchDashboardData("This Week");
  };

  const fetchCustomDateData = async (from, to) => {
    try {
      const response = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/dashbaord",
        { 
          type: "custom",
          fromDate: from,
          toDate: to 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          bookings: response.data.bookings || prev.bookings,
          amount: response.data.amount || prev.amount,
          posAmount: response.data.posAmount || prev.posAmount,
          latestBookings: response.data.latestBookings || prev.latestBookings,
          pendingBookingCount: response.data.pendingBookingCount || prev.pendingBookingCount,
          bookingConfirmedCount: response.data.bookingConfirmedCount || prev.bookingConfirmedCount,
          completedBookingCount: response.data.completedBookingCount || prev.completedBookingCount,
          cancelledBookingCount: response.data.cancelledBookingCount || prev.cancelledBookingCount
        }));
        
        setCurrentFilterData({
          bookings: response.data.bookings || 0,
          amount: response.data.amount || 0,
          details: response.data.customDetails || []
        });
      }
    } catch (error) {
      console.error("Error fetching custom date data:", error);
      alert("Failed to fetch data for selected date range. Please try again.");
    }
  };

  const fetchDashboardData = async (filter) => {
    try {
      const response = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/dashbaord",
        { type: filter },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setDashboardData({
          theatres: response.data.theatres || 0,
          occasions: response.data.occasions || 0,
          bookings: response.data.bookings || 0,
          amount: response.data.amount || 0,
          posAmount: response.data.posAmount || 0,
          latestBookings: response.data.latestBookings || [],
          staff: response.data.staff || 0,
          departments: response.data.departments || 0,
          services: response.data.services || 0,
          pendingBookingCount: response.data.pendingBookingCount || 0,
          bookingConfirmedCount: response.data.bookingConfirmedCount || 0,
          completedBookingCount: response.data.completedBookingCount || 0,
          cancelledBookingCount: response.data.cancelledBookingCount || 0
        });
        
        const filterKeys = {
          'today': 'today',
          'this week': 'thisWeek',
          'last week': 'lastWeek',
          'this month': 'thisMonth',
          'last month': 'lastMonth'
        };
        
        const lowercaseFilter = filter.toLowerCase();
        const responseKey = filterKeys[lowercaseFilter];
        
        if (responseKey && response.data[responseKey]) {
          setCurrentFilterData(response.data[responseKey]);
        } else {
          setCurrentFilterData({
            bookings: 0,
            amount: 0,
            details: []
          });
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // ========== STAFF REVENUE FUNCTIONS - UPDATED FOR BACKEND ==========
  const toggleStaffCustomDateModal = () => {
    setStaffCustomDateModal(!staffCustomDateModal);
  };

  const fetchStaffRevenue = async (filterType = "This Month", fromDate = null, toDate = null) => {
    try {
      let payload = {};
      
      if (fromDate && toDate) {
        // Custom date range
        payload = {
          fromDate: fromDate,
          toDate: toDate
        };
      } else {
        // Predefined filter
        payload = {
          filterType: filterType
        };
      }

      console.log("📡 Fetching staff revenue with payload:", payload);

      const response = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/staffrevenue",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStaffRevenue(response.data.data);
        // Apply search filter after receiving data
        const filtered = response.data.data.filter(staff =>
          staff.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.staffEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.staffPhone?.includes(searchTerm)
        );
        setFilteredStaffRevenue(filtered);
      }
    } catch (error) {
      console.error("Error fetching staff revenue:", error);
    }
  };

  const handleStaffFilterChange = async (filter) => {
    if (filter === "Custom Date") {
      toggleStaffCustomDateModal();
    } else {
      setIsStaffCustomDateActive(false);
      setStaffFilter(filter);
      await fetchStaffRevenue(filter);
    }
  };

  const applyStaffCustomDateFilter = async () => {
    if (!staffFromDate || !staffToDate) {
      alert("Please select both from and to dates");
      return;
    }

    const fromFormatted = formatDate(staffFromDate);
    const toFormatted = formatDate(staffToDate);
    
    console.log(`📅 Applying custom filter: ${staffFromDate} to ${staffToDate}`);
    
    setIsStaffCustomDateActive(true);
    setStaffCustomDateRange({ from: staffFromDate, to: staffToDate });
    setStaffFilter(`Custom (${fromFormatted} - ${toFormatted})`);
    
    // Fetch data with custom date range
    await fetchStaffRevenue("Custom", staffFromDate, staffToDate);
    
    toggleStaffCustomDateModal();
  };

  const clearStaffCustomDateFilter = async () => {
    setIsStaffCustomDateActive(false);
    setStaffFromDate("");
    setStaffToDate("");
    setStaffCustomDateRange({ from: "", to: "" });
    setStaffFilter("This Month");
    await fetchStaffRevenue("This Month");
  };

  // ========== OTHER FETCH FUNCTIONS ==========
  const fetchTheaters = async () => {
    try {
      const response = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getmostbookedtheatre", 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setTheaters(response.data.data);
        setFilteredTheaters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const fetchCakes = async () => {
    try {
      const response = await axios.post(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getmostdemandedcakes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const data = response.data.data;
        setCakes(data);
        setFilteredCakes(data);
        
        processCakeChartData(data);
      }
    } catch (error) {
      console.error("Error fetching cakes:", error);
    }
  };

  const processCakeChartData = (cakeData) => {
    if (!cakeData || cakeData.length === 0) {
      setCakeRevenueData({
        months: [],
        revenues: [],
        cakeNames: []
      });
      return;
    }

    const chartData = {};
    
    cakeData.forEach(item => {
      const key = `${item.monthName} ${item.year}`;
      if (!chartData[key]) {
        chartData[key] = {
          month: key,
          revenue: 0,
          cakes: []
        };
      }
      chartData[key].revenue += item.totalRevenue;
      chartData[key].cakes.push({
        name: item.cakeName,
        revenue: item.totalRevenue
      });
    });

    const months = Object.keys(chartData);
    const revenues = Object.values(chartData).map(item => item.revenue);
    
    setCakeRevenueData({
      months,
      revenues,
      cakeNames: months.map(month => chartData[month].cakes[0]?.name || 'Multiple Cakes')
    });
  };

  const fetchProfitData = async (category = "", month = "", year = "") => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (month) params.append("month", month);
      if (year) params.append("year", year);

      const response = await axios.post(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getprofitbycat?${params.toString()}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setProfitData(response.data.data);
        setFilteredProfitData(response.data.data);
      } else {
        setProfitData([]);
        setFilteredProfitData([]);
      }
    } catch (error) {
      console.error("Error fetching profit data:", error);
      setProfitData([]);
      setFilteredProfitData([]);
    }
  };

  const fetchProductSales = async (month = "", year = "", fromDate = "", toDate = "") => {
    setProductSalesLoading(true);
    try {
      let url = "https://api.carnivalcastle.com/v1/carnivalApi/admin/orderadmin/getallproductsales";
      
      const params = new URLSearchParams();
      if (month && year) {
        params.append("month", month);
        params.append("year", year);
      }
      if (fromDate && toDate) {
        params.append("startDate", fromDate);
        params.append("endDate", toDate);
      }
      
      if (params.toString()) {
        url = url + "?" + params.toString();
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProductSales(response.data.data);
        setFilteredProductSales(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product sales:", error);
    } finally {
      setProductSalesLoading(false);
    }
  };

  // ========== FILTER EFFECTS ==========
  useEffect(() => {
    if (!isCustomDateActive) {
      fetchDashboardData(filterBooking);
    }
  }, [filterBooking, isCustomDateActive]);

  useEffect(() => {
    const fetchAllData = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          fetchDashboardData(filterBooking),
          fetchTheaters(),
          fetchCakes(),
          fetchStaffRevenue("This Month"),
          fetchProfitData(),
          fetchProductSales()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter theaters
  useEffect(() => {
    let filtered = theaters;

    if (selectedMonth) {
      filtered = filtered.filter(theater => 
        theater.monthName && 
        theater.monthName.toLowerCase() === selectedMonth.toLowerCase()
      );
    }

    if (selectedAddress) {
      filtered = filtered.filter(theater => {
        const addressName = theater.address?.name || theater.theatre?.address?.name;
        return addressName && addressName.toLowerCase().includes(selectedAddress.toLowerCase());
      });
    }

    setFilteredTheaters(filtered);
  }, [selectedMonth, selectedAddress, theaters]);

  // Filter cakes
  const filterCakesData = () => {
    let filtered = cakes;

    if (selectedCake) {
      filtered = filtered.filter(cake => cake.cakeName === selectedCake);
    }

    if (selectedCakeMonth) {
      filtered = filtered.filter(cake => `${cake.monthName} ${cake.year}` === selectedCakeMonth);
    }

    setFilteredCakes(filtered);
    processCakeChartData(filtered);
  };

  const getUniqueCakes = () => {
    const uniqueCakes = [...new Set(cakes.map(cake => cake.cakeName))];
    return uniqueCakes.filter(Boolean);
  };

  const getUniqueMonths = () => {
    const uniqueMonths = [...new Set(cakes.map(cake => `${cake.monthName} ${cake.year}`))];
    return uniqueMonths.filter(Boolean);
  };

  const getUniqueTheaterMonths = () => {
    const uniqueMonths = [...new Set(theaters.map(theater => theater.monthName))];
    return uniqueMonths.filter(Boolean);
  };

  const getUniqueAddresses = () => {
    const uniqueAddresses = [...new Set(theaters
      .map(theater => {
        return theater.address?.name || theater.theatre?.address?.name;
      })
      .filter(Boolean)
    )];
    return uniqueAddresses;
  };

  const applyCakeFilters = () => {
    filterCakesData();
  };

  const resetCakeFilters = () => {
    setSelectedCake("");
    setSelectedCakeMonth("");
    setFilteredCakes(cakes);
    processCakeChartData(cakes);
  };

  const resetTheaterFilters = () => {
    setSelectedMonth("");
    setSelectedAddress("");
    setFilteredTheaters(theaters);
  };

  // Filter profit data
  useEffect(() => {
    const filtered = profitData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(profitSearchTerm.toLowerCase())
    );
    setFilteredProfitData(filtered);
    setCurrentPage(1);
  }, [profitSearchTerm, profitData]);

  // Filter product sales based on search
  useEffect(() => {
    const filtered = productSales.filter(item =>
      item.productName?.toLowerCase().includes(productSalesSearchTerm.toLowerCase())
    );
    setFilteredProductSales(filtered);
    setProductSalesPage(1);
  }, [productSalesSearchTerm, productSales]);

  // 🔥 Staff revenue search filter only - date filtering on backend
  useEffect(() => {
    if (!staffRevenue.length) return;
    
    const filtered = staffRevenue.filter(staff =>
      staff.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staffEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staffPhone?.includes(searchTerm)
    );
    
    setFilteredStaffRevenue(filtered);
  }, [searchTerm, staffRevenue]);

  // ========== PRODUCT SALES FUNCTIONS ==========
  const applyProductSalesFilter = () => {
    if (productSalesFilterType === "month") {
      fetchProductSales(productSalesMonth, productSalesYear);
    } else if (productSalesFilterType === "custom") {
      fetchProductSales("", "", productSalesFromDate, productSalesToDate);
      toggleProductSalesCustomModal();
    } else {
      fetchProductSales();
    }
  };

  const resetProductSalesFilter = () => {
    setProductSalesFilterType("all");
    setProductSalesMonth("");
    setProductSalesYear("");
    setProductSalesFromDate("");
    setProductSalesToDate("");
    fetchProductSales();
  };

  const toggleProductSalesCustomModal = () => {
    setProductSalesCustomModal(!productSalesCustomModal);
  };

  const applyProductSalesCustomDate = () => {
    if (!productSalesFromDate || !productSalesToDate) {
      alert("Please select both from and to dates");
      return;
    }
    setProductSalesFilterType("custom");
    fetchProductSales("", "", productSalesFromDate, productSalesToDate);
    toggleProductSalesCustomModal();
  };

  // ========== PAGINATION ==========
  const totalPages = Math.ceil(filteredProfitData.length / itemsPerPage);
  const currentProfitData = filteredProfitData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const productSalesTotalPages = Math.ceil(filteredProductSales.length / productSalesPerPage);
  const productSalesCurrentData = filteredProductSales.slice(
    (productSalesPage - 1) * productSalesPerPage,
    productSalesPage * productSalesPerPage
  );

  const goToProductSalesPage = (page) => {
    if (page < 1 || page > productSalesTotalPages) return;
    setProductSalesPage(page);
  };

  // ========== DROPDOWN HANDLERS ==========
  const handleBookingDropdownToggle = () => setDropdownOpenBooking(!dropdownOpenBooking);
  const handleStaffDropdownToggle = () => setDropdownOpenStaff(!dropdownOpenStaff);

  const handleBookingFilterChange = async (filter) => {
    if (filter === "Custom Date") {
      toggleCustomDateModal();
    } else {
      setIsCustomDateActive(false);
      setFilterBooking(filter);
      await fetchDashboardData(filter);
    }
  };

  const applyProfitFilters = () => {
    fetchProfitData(selectedCategory, selectedMonthProfit, selectedYear);
  };

  const resetProfitFilters = () => {
    setSelectedCategory("");
    setSelectedMonthProfit("");
    setSelectedYear("");
    setProfitSearchTerm("");
    fetchProfitData();
  };

  // ========== REPORTS CARDS ==========
  const reports = [
    { 
      title: "Theaters", 
      iconClass: "bx-building", 
      description: dashboardData.theatres, 
      bgColor: "bg-warning", 
      link: "/Theater",
      textColor: "text-white"
    },
    { 
      title: "Services", 
      iconClass: "bx-cube", 
      description: dashboardData.services, 
      bgColor: "gradient-info", 
      link: "/Services",
      textColor: "text-white"
    },
    { 
      title: "Total Bookings", 
      iconClass: "bx-receipt", 
      description: formatNumber(dashboardData.bookings), 
      bgColor: "gradient-success", 
      link: "/PendingBookings",
      textColor: "text-white"
    },
    { 
      title: "Revenue", 
      iconClass: "bx-rupee", 
      description: formatCurrency(dashboardData.amount), 
      bgColor: "bg-warning", 
      link: "/Payments",
      textColor: "text-white"
    },
    { 
      title: "Food Sales", 
      iconClass: "bx-restaurant", 
      description: formatCurrency(dashboardData.posAmount), 
      bgColor: "gradient-danger", 
      link: "/FoodProduct",
      textColor: "text-white"
    },
    { 
      title: "Staff", 
      iconClass: "bx-group", 
      description: dashboardData.staff, 
      bgColor: "gradient-success", 
      link: "/Staff",
      textColor: "text-white"
    },
    { 
      title: "Departments", 
      iconClass: "bx-briefcase", 
      description: dashboardData.departments, 
      bgColor: "bg-dark", 
      link: "/Departments",
      textColor: "text-white"
    },
    { 
      title: "Occasions", 
      iconClass: "bx-party", 
      description: dashboardData.occasions, 
      bgColor: "bg-light", 
      link: "/Occasions",
      textColor: "text-blue"
    },
  ];

  const bookingStatusCards = [
    { 
      title: "Pending Bookings", 
      iconClass: "bx-time", 
      value: dashboardData.pendingBookingCount,
      bgColor: "gradient-pending",
      link: "/PendingBookings?status=pending",
      textColor: "text-white",
      icon: "bx-time"
    },
    { 
      title: "Confirmed Bookings", 
      iconClass: "bx-check-circle", 
      value: dashboardData.bookingConfirmedCount,
      bgColor: "gradient-confirmed",
      link: "/PendingBookings?status=confirmed",
      textColor: "text-white",
      icon: "bx-check-circle"
    },
    { 
      title: "Completed Bookings", 
      iconClass: "bx-badge-check", 
      value: dashboardData.completedBookingCount,
      bgColor: "gradient-completed",
      link: "/PendingBookings?status=completed",
      textColor: "text-white",
      icon: "bx-badge-check"
    },
    { 
      title: "Cancelled Bookings", 
      iconClass: "bx-x-circle", 
      value: dashboardData.cancelledBookingCount,
      bgColor: "gradient-cancelled",
      link: "/PendingBookings?status=cancelled",
      textColor: "text-white",
      icon: "bx-x-circle"
    },
  ];

  // ========== CHART OPTIONS ==========
  const monthlyChartSeries = [
    { 
      name: "Bookings", 
      data: [currentFilterData.bookings || 0], 
      color: "#300843" 
    },
    { 
      name: "Revenue", 
      data: [currentFilterData.amount || 0], 
      color: "#f1b44c" 
    },
  ];

  const monthlyChartOptions = {
    chart: { 
      toolbar: { show: false },
      type: 'bar',
      height: 350
    },
    plotOptions: { 
      bar: { 
        horizontal: false, 
        columnWidth: "50%", 
        borderRadius: 4
      } 
    },
    dataLabels: { 
      enabled: true,
      formatter: function(val) {
        return val.toLocaleString('en-IN');
      }
    },
    stroke: { 
      show: true, 
      width: 2, 
      colors: ["transparent"] 
    },
    colors: ["#300843", "#f1b44c"],
    xaxis: { 
      categories: [filterBooking],
      labels: { 
        style: { 
          colors: '#6c757d', 
          fontSize: '14px',
          fontWeight: 'bold'
        } 
      }
    },
    yaxis: {
      labels: { 
        formatter: function(val) {
          return val.toLocaleString('en-IN');
        }
      }
    },
    grid: { 
      borderColor: "#f1f1f1",
      strokeDashArray: 4
    },
    fill: { opacity: 1 },
    tooltip: { 
      y: {
        formatter: function(val, { seriesIndex }) {
          if (seriesIndex === 0) {
            return val + ' bookings';
          } else {
            return '₹' + val.toLocaleString('en-IN');
          }
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const cakeRevenueOptions = {
    chart: {
      type: 'bar',
      height: 350,
      background: '#fff',
      toolbar: { show: true }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 6
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: cakeRevenueData.months || [],
      labels: {
        style: {
          colors: '#6c757d',
          fontSize: '11px'
        },
        rotate: -45
      }
    },
    yaxis: {
      title: {
        text: 'Revenue (₹)',
        style: { 
          color: '#6c757d'
        }
      },
      labels: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    },
    title: {
      text: selectedCake || selectedCakeMonth 
        ? `Cake Revenue - ${selectedCake || 'All Cakes'} ${selectedCakeMonth ? `- ${selectedCakeMonth}` : ''}`
        : 'Cake Revenue - All Cakes & Months',
      align: 'center',
      style: { 
        color: '#495057', 
        fontSize: '16px', 
        fontWeight: 'bold'
      }
    },
    colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E90FF'],
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    }
  };

  const cakeRevenueSeries = [
    {
      name: 'Revenue',
      data: cakeRevenueData.revenues || []
    }
  ];

  if (initialLoading) {
    return (
      <div className="page-content dashboard-container">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="text-center">
              <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
              <p className="mt-3 text-muted responsive-text">Loading Dashboard Data...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content dashboard-container">
        <Container fluid>
          <Breadcrumbs 
            title="Carnival Castle Admin" 
            breadcrumbItem={props.t("Dashboard")} 
          />

          {/* Report Cards */}
          <Row className="mb-4">
            {reports.map((report, idx) => (
              <Col xl="3" md="6" key={idx}>
                <Link to={report.link} className="text-decoration-none">
                  <Card className={`report-card ${report.bgColor} ${report.textColor} mb-4 shadow-sm hover-lift card-hover`}>
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium responsive-text">{report.title}</p>
                          <h3 className="mb-0 stats-highlight">{report.description}</h3>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="icon-container">
                            <i className={`bx ${report.iconClass} font-size-24 ${report.textColor}`} />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Booking Status Cards */}
          <Row className="mb-4">
            {bookingStatusCards.map((card, idx) => (
              <Col xl="3" md="6" key={idx}>
                <Link to={card.link} className="text-decoration-none">
                  <Card className={`report-card ${card.bgColor} ${card.textColor} mb-4 shadow-sm hover-lift card-hover`}>
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium responsive-text">{card.title}</p>
                          <h3 className="mb-0 text-white">{formatNumber(card.value)}</h3>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="icon-container">
                            <i className={`bx ${card.icon} font-size-24 ${card.textColor}`} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <small className="text-white-50">
                          <i className="bx bx-trending-up me-1"></i>
                          View Details
                        </small>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Bookings & Revenue Chart with Custom Date */}
          <Row className="mb-4">
            <Col lg="12">
              <Card className="shadow-sm border-0 card-hover">
                <CardBody className="chart-container">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                      <h5 className="card-title mb-0 fw-bold text-dark">Bookings & Revenue Analytics</h5>
                      {isCustomDateActive && (
                        <span className="active-filter-badge">
                          {filterBooking}
                          <i className="bx bx-x" onClick={clearCustomDateFilter}></i>
                        </span>
                      )}
                    </div>
                    <Dropdown isOpen={dropdownOpenBooking} toggle={handleBookingDropdownToggle} className="filter-dropdown">
                      <DropdownToggle caret color="outline-primary" size="sm" className="btn-custom">
                        <i className="bx bx-filter-alt me-1"></i>
                        {filterBooking}
                      </DropdownToggle>
                      <DropdownMenu>
                        {["Today", "This Week", "Last Week", "This Month", "Last Month", "Custom Date"].map(item => (
                          <DropdownItem 
                            key={item} 
                            onClick={() => handleBookingFilterChange(item)} 
                            className="responsive-text"
                          >
                            {item}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  
                  {/* Stats Summary */}
                  <Row className="mb-3">
                    <Col md="6">
                      <Card className="border-0 bg-light">
                        <CardBody className="py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bx bx-receipt text-primary fs-4 me-2"></i>
                              <span className="fw-medium responsive-text">Bookings:</span>
                            </div>
                            <span className="fw-bold text-primary fs-5">
                              {formatNumber(currentFilterData.bookings || 0)}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card className="border-0 bg-light">
                        <CardBody className="py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bx bx-rupee text-success fs-4 me-2"></i>
                              <span className="fw-medium responsive-text">Revenue:</span>
                            </div>
                            <span className="fw-bold text-success fs-5">
                              {formatCurrency(currentFilterData.amount || 0)}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Simple Bar Chart */}
                  <div style={{ height: '300px' }}>
                    <ReactApexChart 
                      options={monthlyChartOptions} 
                      series={monthlyChartSeries} 
                      type="bar" 
                      height="100%" 
                    />
                  </div>
                  
                  {/* Details Table */}
                  {currentFilterData.details && currentFilterData.details.length > 0 && (
                    <div className="mt-4">
                      <h6 className="mb-3 fw-bold">Booking Details {isCustomDateActive ? '(Custom Range)' : `(${filterBooking})`}</h6>
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead>
                            <tr className="bg-light">
                              <th>#</th>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Theater</th>
                              <th className="text-end">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentFilterData.details.map((detail, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <Badge color="primary" className="badge-soft-primary">
                                    {detail.orderId}
                                  </Badge>
                                </td>
                                <td>{detail.date}</td>
                                <td>{detail.theatreName}</td>
                                <td className="text-end fw-bold text-success">
                                  {formatCurrency(detail.totalPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  )}
                  
                  {currentFilterData.details && currentFilterData.details.length === 0 && (
                    <div className="text-center py-4 text-muted">
                      <i className="bx bx-data display-4 d-block mb-2"></i>
                      <p>No booking details available {isCustomDateActive ? 'for selected date range' : `for ${filterBooking}`}</p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-center text-muted small">
                    <i className="bx bx-info-circle me-1"></i>
                    {isCustomDateActive ? (
                      <>
                        Showing data from: <strong>{formatDate(customDateRange.from)}</strong> to <strong>{formatDate(customDateRange.to)}</strong> | 
                        Total Bookings: <strong>{formatNumber(currentFilterData.bookings || 0)}</strong> | 
                        Total Revenue: <strong>{formatCurrency(currentFilterData.amount || 0)}</strong>
                      </>
                    ) : (
                      <>
                        Showing data for: <strong>{filterBooking}</strong> | 
                        Total Bookings: <strong>{formatNumber(currentFilterData.bookings || 0)}</strong> | 
                        Total Revenue: <strong>{formatCurrency(currentFilterData.amount || 0)}</strong>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Custom Date Modal for Bookings */}
          <Modal isOpen={customDateModal} toggle={toggleCustomDateModal} className="custom-date-modal">
            <ModalHeader toggle={toggleCustomDateModal}>
              <i className="bx bx-calendar me-2"></i>
              Select Custom Date Range
            </ModalHeader>
            <ModalBody>
              <div className="custom-date-range">
                <div className="form-group">
                  <label className="custom-date-label">From Date</label>
                  <input
                    type="date"
                    className="custom-date-input"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    max={toDate || undefined}
                  />
                </div>
                <div className="form-group">
                  <label className="custom-date-label">To Date</label>
                  <input
                    type="date"
                    className="custom-date-input"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate || undefined}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="custom-date-buttons">
                <Button color="secondary" onClick={toggleCustomDateModal} className="custom-date-btn">
                  Cancel
                </Button>
                <Button color="primary" onClick={applyCustomDateFilter} className="custom-date-btn custom-date-btn-primary">
                  Apply Filter
                </Button>
              </div>
            </ModalFooter>
          </Modal>

          {/* Revenue by Category Section */}
          <Row className="mb-4">
            <Col lg="12">
              <Card className="shadow-sm border-0 card-hover">
                <CardBody>
                  <h5 className="card-title mb-4 fw-bold text-dark">Revenue by Category</h5>
                  
                  <Row className="mb-3 g-2">
                    <Col md={3}>
                      <Input
                        type="text"
                        placeholder="Search by name..."
                        value={profitSearchTerm}
                        onChange={(e) => setProfitSearchTerm(e.target.value)}
                        className="search-input border-0 shadow-sm"
                      />
                    </Col>
                    <Col md={2}>
                      <Input
                        type="select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="search-input border-0 shadow-sm"
                      >
                        <option value="">All Categories</option>
                        <option value="cakes">Cakes</option>
                        <option value="decorations">Decorations</option>
                        <option value="roses">Roses</option>
                        <option value="photography">Photography</option>
                      </Input>
                    </Col>
                    <Col md={2}>
                      <Input
                        type="select"
                        value={selectedMonthProfit}
                        onChange={(e) => setSelectedMonthProfit(e.target.value)}
                        className="search-input border-0 shadow-sm"
                      >
                        <option value="">All Months</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, "0")}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md={2}>
                      <Input
                        type="select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="search-input border-0 shadow-sm"
                      >
                        <option value="">All Years</option>
                        {[2024, 2025, 2026].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col md={1}>
                      <Button color="primary" onClick={applyProfitFilters} className="w-100 shadow-sm btn-custom">
                        <i className="bx bx-check me-1"></i>
                        Apply
                      </Button>
                    </Col>
                    <Col md={1}>
                      <Button color="outline-secondary" onClick={resetProfitFilters} className="w-100 shadow-sm btn-custom">
                        <i className="bx bx-reset me-1"></i>
                        Reset
                      </Button>
                    </Col>
                  </Row>

                  <div className="table-responsive table-responsive-custom">
                    <Table hover className="mb-0 table-hover-custom">
                      <thead className="table-header-custom">
                        <tr>
                          <th className="text-dark">Name</th>
                          <th className="text-dark">Category</th>
                          <th className="text-dark">Price</th>
                          <th className="text-dark">Total Quantity</th>
                          <th className="text-dark">Total Revenue</th>
                          <th className="text-dark">Booking Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentProfitData.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              <i className="bx bx-data display-4 d-block mb-2"></i>
                              <span className="responsive-text">No revenue data found</span>
                            </td>
                          </tr>
                        ) : (
                          currentProfitData.map((item, index) => (
                            <tr key={item._id || index}>
                              <td className="fw-medium responsive-text">{item.name}</td>
                              <td>
                                <Badge color="info" className="badge-soft-info status-badge">
                                  {item.categoryName}
                                </Badge>
                              </td>
                              <td className="responsive-text">{formatCurrency(item.price)}</td>
                              <td className="responsive-text">{formatNumber(item.totalBookingQuantity)}</td>
                              <td className="fw-bold text-success responsive-text">{formatCurrency(item.totalRevenue)}</td>
                              <td>
                                <Badge color="primary" className="badge-soft-primary status-badge">
                                  {item.bookingCount}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {filteredProfitData.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted responsive-text">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProfitData.length)} of {filteredProfitData.length} entries
                      </div>
                      <div className="d-flex gap-2 pagination-custom">
                        <Button
                          color="outline-primary"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => goToPage(currentPage - 1)}
                          className="btn-custom"
                        >
                          <i className="bx bx-chevron-left"></i> Previous
                        </Button>
                        <div className="d-flex align-items-center mx-2 responsive-text">
                          Page {currentPage} of {totalPages}
                        </div>
                        <Button
                          color="outline-primary"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => goToPage(currentPage + 1)}
                          className="btn-custom"
                        >
                          Next <i className="bx bx-chevron-right"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Cake Revenue Chart */}
          <Row className="mb-4">
            <Col lg="12">
              <Card className="shadow-sm border-0 card-hover cake-chart-card">
                <CardBody className="chart-container">
                  <div className="d-flex justify-content-between align-items-center mb-4 cake-chart-header">
                    <h5 className="card-title mb-0 fw-bold text-dark">
                      Cake Revenue Analytics
                    </h5>
                  </div>

                  <div className="cake-filter-section">
                    <Row className="g-3">
                      <Col md={4}>
                        <label className="form-label fw-medium">Filter by Cake</label>
                        <Input
                          type="select"
                          value={selectedCake}
                          onChange={(e) => setSelectedCake(e.target.value)}
                          className="search-input border-0 shadow-sm"
                        >
                          <option value="">All Cakes</option>
                          {getUniqueCakes().map((cake, index) => (
                            <option key={index} value={cake}>
                              {cake}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col md={4}>
                        <label className="form-label fw-medium">Filter by Month</label>
                        <Input
                          type="select"
                          value={selectedCakeMonth}
                          onChange={(e) => setSelectedCakeMonth(e.target.value)}
                          className="search-input border-0 shadow-sm"
                        >
                          <option value="">All Months</option>
                          {getUniqueMonths().map((month, index) => (
                            <option key={index} value={month}>
                              {month}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col md={2}>
                        <label className="form-label">&nbsp;</label>
                        <Button 
                          color="primary" 
                          onClick={applyCakeFilters} 
                          className="w-100 shadow-sm btn-custom"
                        >
                          <i className="bx bx-filter-alt me-1"></i>
                          Apply
                        </Button>
                      </Col>
                      <Col md={2}>
                        <label className="form-label">&nbsp;</label>
                        <Button 
                          color="outline-secondary" 
                          onClick={resetCakeFilters} 
                          className="w-100 shadow-sm btn-custom"
                        >
                          <i className="bx bx-reset me-1"></i>
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  {cakeRevenueData.months.length > 0 ? (
                    <ReactApexChart
                      options={cakeRevenueOptions}
                      series={cakeRevenueSeries}
                      type="bar"
                      height={350}
                    />
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="bx bx-data display-4 d-block mb-2"></i>
                      <span className="responsive-text">No cake data available</span>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Staff Performance - Updated for backend compatibility */}
          <Row className="mb-4">
            <Col lg="12">
              <Card className="shadow-sm border-0 card-hover">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fw-bold text-dark">Staff & Admin Performance</h5>
                    <div className="d-flex gap-2 align-items-center">
                      <Input
                        type="text"
                        placeholder="Search staff/admin..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input border-0 shadow-sm"
                        style={{ width: '250px' }}
                      />
                      <Dropdown isOpen={dropdownOpenStaff} toggle={handleStaffDropdownToggle} className="filter-dropdown">
                        <DropdownToggle caret color="outline-primary" size="sm" className="btn-custom">
                          <i className="bx bx-filter-alt me-1"></i>
                          {staffFilter}
                        </DropdownToggle>
                        <DropdownMenu>
                          {["Today", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "Custom Date"].map(item => (
                            <DropdownItem key={item} onClick={() => handleStaffFilterChange(item)} className="responsive-text">
                              {item}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                      {isStaffCustomDateActive && (
                        <span className="active-filter-badge">
                          {staffFilter}
                          <i className="bx bx-x" onClick={clearStaffCustomDateFilter}></i>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-responsive">
                    <Table hover className="mb-0 table-hover-custom">
                      <thead className="table-header-custom">
                        <tr>
                          <th className="text-dark">Name</th>
                          <th className="text-dark">Email</th>
                          <th className="text-dark">Phone</th>
                          <th className="text-dark">Total Revenue</th>
                          <th className="text-dark">Total Bookings</th>
                          <th className="text-dark">Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaffRevenue.length > 0 ? (
                          filteredStaffRevenue.map((staff, index) => (
                            <tr key={staff.staffId || index}>
                              <td className="fw-medium responsive-text">
                                {staff.staffName}
                                {staff.staffName === "admin" && (
                                  <Badge color="danger" className="ms-2" pill>Admin</Badge>
                                )}
                              </td>
                              <td className="responsive-text">{staff.staffEmail || "-"}</td>
                              <td className="responsive-text">{staff.staffPhone || "-"}</td>
                              <td className="fw-bold text-success responsive-text">
                                {formatCurrency(staff.totalRevenue || 0)}
                              </td>
                              <td>
                                <Badge color="primary" className="badge-soft-primary status-badge">
                                  {staff.totalBookings || 0}
                                </Badge>
                              </td>
                              <td>
                                <Badge color="success" className="badge-soft-success status-badge">
                                  {staff.completedBookings || 0}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              <span className="responsive-text">No staff/admin data found for selected filter</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  
                  {filteredStaffRevenue.length > 0 && (
                    <div className="mt-3">
                      <Card className="border-0 bg-light">
                        <CardBody className="py-2">
                          <Row>
                            <Col md="4">
                              <div className="d-flex justify-content-between">
                                <span className="fw-medium">Total Staff/Admin:</span>
                                <Badge color="primary" pill>{filteredStaffRevenue.length}</Badge>
                              </div>
                            </Col>
                            <Col md="4">
                              <div className="d-flex justify-content-between">
                                <span className="fw-medium">Total Revenue:</span>
                                <span className="fw-bold text-success">
                                  {formatCurrency(filteredStaffRevenue.reduce((acc, staff) => acc + (staff.totalRevenue || 0), 0))}
                                </span>
                              </div>
                            </Col>
                            <Col md="4">
                              <div className="d-flex justify-content-between">
                                <span className="fw-medium">Total Bookings:</span>
                                <Badge color="info" pill>
                                  {filteredStaffRevenue.reduce((acc, staff) => acc + (staff.totalBookings || 0), 0)}
                                </Badge>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Custom Date Modal for Staff Revenue */}
          <Modal isOpen={staffCustomDateModal} toggle={toggleStaffCustomDateModal} className="custom-date-modal">
            <ModalHeader toggle={toggleStaffCustomDateModal}>
              <i className="bx bx-calendar me-2"></i>
              Select Custom Date Range for Staff Revenue
            </ModalHeader>
            <ModalBody>
              <div className="custom-date-range">
                <div className="form-group">
                  <label className="custom-date-label">From Date</label>
                  <input
                    type="date"
                    className="custom-date-input"
                    value={staffFromDate}
                    onChange={(e) => setStaffFromDate(e.target.value)}
                    max={staffToDate || undefined}
                  />
                </div>
                <div className="form-group">
                  <label className="custom-date-label">To Date</label>
                  <input
                    type="date"
                    className="custom-date-input"
                    value={staffToDate}
                    onChange={(e) => setStaffToDate(e.target.value)}
                    min={staffFromDate || undefined}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="custom-date-buttons">
                <Button color="secondary" onClick={toggleStaffCustomDateModal} className="custom-date-btn">
                  Cancel
                </Button>
                <Button color="primary" onClick={applyStaffCustomDateFilter} className="custom-date-btn custom-date-btn-primary">
                  Apply Filter
                </Button>
              </div>
            </ModalFooter>
          </Modal>

          {/* MOST BOOKED THEATERS */}
          <Row className="mb-4">
            <Col lg="12">
              <Card className="shadow-sm border-0 card-hover h-100">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 fw-bold text-dark">Most Booked Theaters</h5>
                    <div className="d-flex gap-2 align-items-center">
                      <div className="d-flex gap-2">
                        <Input
                          type="select"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          size="sm"
                          className="search-input border-0 shadow-sm"
                          style={{ minWidth: '140px' }}
                        >
                          <option value="">All Months</option>
                          {getUniqueTheaterMonths().map((month, index) => (
                            <option key={index} value={month}>
                              {month}
                            </option>
                          ))}
                        </Input>
                        <Input
                          type="select"
                          value={selectedAddress}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          size="sm"
                          className="search-input border-0 shadow-sm"
                          style={{ minWidth: '160px' }}
                        >
                          <option value="">All Addresses</option>
                          {getUniqueAddresses().map((address, index) => (
                            <option key={index} value={address}>
                              {address}
                            </option>
                          ))}
                        </Input>
                      </div>
                      <Button 
                        color="outline-secondary" 
                        onClick={resetTheaterFilters} 
                        size="sm"
                        className="btn-custom"
                      >
                        <i className="bx bx-reset me-1"></i>
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  <div className="table-responsive">
                    <Table hover className="mb-0 table-hover-custom">
                      <thead className="table-header-custom">
                        <tr>
                          <th className="text-dark">#</th>
                          <th className="text-dark">Theater</th>
                          <th className="text-dark">Address</th>
                          <th className="text-dark">Month</th>
                          <th className="text-dark">Bookings</th>
                          <th className="text-dark">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTheaters.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              <span className="responsive-text">No theater data found</span>
                            </td>
                          </tr>
                        ) : (
                          filteredTheaters.map((theater, index) => {
                            const theaterName = theater.theatreName || "N/A";
                            const addressName = theater.addressName || "N/A";
                            const monthName = theater.monthName || "N/A";
                            const totalBookings = theater.totalBookings || 0;
                            const totalRevenue = theater.totalRevenue || 0;
                            
                            return (
                              <tr key={theater.theatreId || index}>
                                <td className="fw-medium responsive-text">{index + 1}</td>
                                <td className="fw-medium responsive-text">{theaterName}</td>
                                <td className="responsive-text">{addressName}</td>
                                <td className="responsive-text">{monthName}</td>
                                <td>
                                  <Badge color="primary" className="badge-soft-primary status-badge">
                                    {totalBookings}
                                  </Badge>
                                </td>
                                <td className="fw-bold text-success responsive-text">
                                  {formatCurrency(totalRevenue)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* PRODUCT SALES REPORT */}
          <Row className="mb-4">
            <Col lg="12">
              <Card className="shadow-sm border-0 card-hover">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0 fw-bold text-dark">📊 Product Sales Report</h5>
                    <div className="d-flex gap-2 align-items-center">
                      <div className="d-flex gap-2">
                        <Input
                          type="select"
                          value={productSalesFilterType}
                          onChange={(e) => setProductSalesFilterType(e.target.value)}
                          size="sm"
                          className="search-input border-0 shadow-sm"
                          style={{ minWidth: '120px' }}
                        >
                          <option value="all">All Data</option>
                          <option value="month">By Month</option>
                          <option value="custom">Custom Date</option>
                        </Input>
                        
                        {productSalesFilterType === "month" && (
                          <>
                            <Input
                              type="select"
                              value={productSalesMonth}
                              onChange={(e) => setProductSalesMonth(e.target.value)}
                              size="sm"
                              className="search-input border-0 shadow-sm"
                              style={{ minWidth: '120px' }}
                            >
                              <option value="">Select Month</option>
                              {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                              ))}
                            </Input>
                            <Input
                              type="select"
                              value={productSalesYear}
                              onChange={(e) => setProductSalesYear(e.target.value)}
                              size="sm"
                              className="search-input border-0 shadow-sm"
                              style={{ minWidth: '100px' }}
                            >
                              <option value="">Year</option>
                              {[2024, 2025, 2026].map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </Input>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        color="primary" 
                        size="sm"
                        onClick={applyProductSalesFilter}
                        className="btn-custom"
                        disabled={productSalesFilterType === "month" && (!productSalesMonth || !productSalesYear)}
                      >
                        <i className="bx bx-filter-alt me-1"></i>
                        Apply
                      </Button>
                      
                      <Button 
                        color="outline-secondary" 
                        size="sm"
                        onClick={resetProductSalesFilter}
                        className="btn-custom"
                      >
                        <i className="bx bx-reset me-1"></i>
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="search-input">
                        <i className="bx bx-search"></i>
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={productSalesSearchTerm}
                        onChange={(e) => setProductSalesSearchTerm(e.target.value)}
                        className="search-input border-0 shadow-sm"
                      />
                    </InputGroup>
                  </div>

                  {/* Stats Summary */}
                  {filteredProductSales.length > 0 && (
                    <Row className="mb-3">
                      <Col md="3">
                        <Card className="border-0 bg-light">
                          <CardBody className="py-2">
                            <div className="d-flex justify-content-between">
                              <span>Total Products:</span>
                              <Badge color="primary" pill>{filteredProductSales.length}</Badge>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="3">
                        <Card className="border-0 bg-light">
                          <CardBody className="py-2">
                            <div className="d-flex justify-content-between">
                              <span>Total Quantity:</span>
                              <Badge color="info" pill>
                                {filteredProductSales.reduce((acc, item) => acc + (item.totalQuantitySold || 0), 0)}
                              </Badge>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="3">
                        <Card className="border-0 bg-light">
                          <CardBody className="py-2">
                            <div className="d-flex justify-content-between">
                              <span>Total Revenue:</span>
                              <span className="fw-bold text-success">
                                {formatCurrency(filteredProductSales.reduce((acc, item) => acc + (item.totalRevenue || 0), 0))}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="3">
                        <Card className="border-0 bg-light">
                          <CardBody className="py-2">
                            <div className="d-flex justify-content-between">
                              <span>Total Profit:</span>
                              <span className="fw-bold text-success">
                                {formatCurrency(filteredProductSales.reduce((acc, item) => acc + (item.profit || 0), 0))}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  )}

                  {/* Product Sales Table */}
                  <div className="table-responsive">
                    <Table hover className="mb-0 table-hover-custom">
                      <thead className="table-header-custom">
                        <tr>
                          <th className="text-dark">#</th>
                          <th className="text-dark">Product</th>
                          <th className="text-dark">Product Name</th>
                          <th className="text-dark">Purchase Price</th>
                          <th className="text-dark">Qty Sold</th>
                          <th className="text-dark">Total Revenue</th>
                          <th className="text-dark">Total Cost</th>
                          <th className="text-dark">Profit/Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productSalesLoading ? (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              <Spinner size="sm" className="me-2" />
                              <span className="responsive-text">Loading product sales...</span>
                            </td>
                          </tr>
                        ) : productSalesCurrentData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center py-4 text-muted">
                              <i className="bx bx-data display-4 d-block mb-2"></i>
                              <span className="responsive-text">No product sales data found</span>
                            </td>
                          </tr>
                        ) : (
                          productSalesCurrentData.map((item, index) => (
                            <tr key={item.productId || index}>
                              <td className="fw-medium responsive-text">
                                {(productSalesPage - 1) * productSalesPerPage + index + 1}
                              </td>
                              <td>
                                <img 
                                  src={item.productImage ? URLS.Base + item.productImage : "/default-product.png"} 
                                  alt={item.productName}
                                  className="product-image-sm"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/default-product.png";
                                  }}
                                />
                              </td>
                              <td className="fw-medium responsive-text">{item.productName || "N/A"}</td>
                              <td className="responsive-text">{formatCurrency(item.purchasePrice || 0)}</td>
                              <td className="responsive-text">
                                <Badge color="primary" pill>{item.totalQuantitySold || 0}</Badge>
                              </td>
                              <td className="fw-bold text-success responsive-text">
                                {formatCurrency(item.totalRevenue || 0)}
                              </td>
                              <td className="responsive-text">{formatCurrency(item.totalCost || 0)}</td>
                              <td>
                                <span className={item.profit >= 0 ? "profit-positive" : "profit-negative"}>
                                  {formatCurrency(item.profit || 0)}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {filteredProductSales.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted responsive-text">
                        Showing {((productSalesPage - 1) * productSalesPerPage) + 1} to {Math.min(productSalesPage * productSalesPerPage, filteredProductSales.length)} of {filteredProductSales.length} entries
                      </div>
                      <div className="d-flex gap-2 pagination-custom">
                        <Button
                          color="outline-primary"
                          size="sm"
                          disabled={productSalesPage === 1}
                          onClick={() => goToProductSalesPage(productSalesPage - 1)}
                          className="btn-custom"
                        >
                          <i className="bx bx-chevron-left"></i> Previous
                        </Button>
                        <div className="d-flex align-items-center mx-2 responsive-text">
                          Page {productSalesPage} of {productSalesTotalPages}
                        </div>
                        <Button
                          color="outline-primary"
                          size="sm"
                          disabled={productSalesPage === productSalesTotalPages}
                          onClick={() => goToProductSalesPage(productSalesPage + 1)}
                          className="btn-custom"
                        >
                          Next <i className="bx bx-chevron-right"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Product Sales Custom Date Modal */}
          <Modal isOpen={productSalesCustomModal} toggle={toggleProductSalesCustomModal} className="custom-date-modal">
            <ModalHeader toggle={toggleProductSalesCustomModal}>
              <i className="bx bx-calendar me-2"></i>
              Select Custom Date Range for Product Sales
            </ModalHeader>
            <ModalBody>
              <div className="custom-date-range">
                <div className="form-group">
                  <label className="custom-date-label">From Date</label>
                  <input
                    type="date"
                    className="custom-date-input"
                    value={productSalesFromDate}
                    onChange={(e) => setProductSalesFromDate(e.target.value)}
                    max={productSalesToDate || undefined}
                  />
                </div>
                <div className="form-group">
                  <label className="custom-date-label">To Date</label>
                  <input
                    type="date"
                    className="custom-date-input"
                    value={productSalesToDate}
                    onChange={(e) => setProductSalesToDate(e.target.value)}
                    min={productSalesFromDate || undefined}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="custom-date-buttons">
                <Button color="secondary" onClick={toggleProductSalesCustomModal} className="custom-date-btn">
                  Cancel
                </Button>
                <Button color="primary" onClick={applyProductSalesCustomDate} className="custom-date-btn custom-date-btn-primary">
                  Apply Filter
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Dashboard);