import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Form,
  Label,
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

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [userInCsv, setUserInCsv] = useState([]);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState(false);
  const [filters, setFilters] = useState({ 
    fromDate: "", 
    toDate: "",
    year: "",
    month: "" 
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [listPerPage] = useState(10);
  const [completedCount, setCompletedCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0); // New state for filtered count
  
  // Month options
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  // Generate years (current year to 5 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const history = useHistory();
  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const token = data.token;
  const Roles = data?.rolesAndPermission[0];

  const cancelTokenRef = useRef(null);
  const searchTimeout = useRef(null);

  // Navigate to view booking
  const Actinid1 = (data) => {
    sessionStorage.setItem("BookingId", data._id);
    history.push("/ViewBooking");
  };

  // Helper function to get date range from year-month
  const getDateRangeFromYearMonth = (year, month) => {
    if (!year) return null;
    
    if (month) {
      // Both year and month selected
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, parseInt(month), 0).toISOString().split('T')[0];
      return { fromDate: firstDay, toDate: lastDay };
    } else {
      // Only year selected
      const firstDay = `${year}-01-01`;
      const lastDay = `${year}-12-31`;
      return { fromDate: firstDay, toDate: lastDay };
    }
  };

  // Fetch completed bookings with pagination & filters
  const Get = async (page = 1, search = "", filtersData = null) => {
    try {
      if (cancelTokenRef.current) cancelTokenRef.current.cancel("Canceled due to new request");
      cancelTokenRef.current = axios.CancelToken.source();

      const body = {
        page,
        limit: listPerPage,
        searchQuery: search,
        ...filtersData,
      };

      // If year/month filters are present, convert to date range
      if (filtersData?.year) {
        const dateRange = getDateRangeFromYearMonth(filtersData.year, filtersData.month);
        if (dateRange) {
          body.fromDate = dateRange.fromDate;
          body.toDate = dateRange.toDate;
        }
      }
      
      const res = await axios.post(URLS.GetCompleatedBookings, body, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelTokenRef.current.token,
      });
      
      if (res.data.success) {
        setUsers(res.data.data);
        setUserInCsv(Array.isArray(res.data.completedBookingExcel) ? res.data.completedBookingExcel : []);
        setPageCount(res.data.totalPages);
        
        // Update filtered count - either from API or calculate
        if (res.data.totalCount) {
          setFilteredCount(res.data.totalCount);
        } else {
          // If API doesn't return totalCount, estimate from page info
          const estimatedCount = (res.data.totalPages * listPerPage) - (listPerPage - res.data.data.length);
          setFilteredCount(estimatedCount);
        }
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
      toast.error("Error fetching completed bookings");
    }
  };

  // Initial load
  useEffect(() => {
    Get(pageNumber);
    fetchCompletedCount();
  }, []);

  // Fetch completed bookings count
  const fetchCompletedCount = async () => {
    try {
      const response = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getallcompletedbookingscount",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setCompletedCount(response.data.count);
        setFilteredCount(response.data.count); // Initially same as total
      }
    } catch (error) {
      console.error("Error fetching completed booking count:", error);
    }
  };

  // Search handler with debounce
  const custsearch = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, search: value }));
    setPageNumber(1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const activeFilters = getActiveFilters();
      Get(1, value, activeFilters);
    }, 300);
  };

  // Get active filters based on what's selected
  const getActiveFilters = () => {
    // If year/month is selected, use that
    if (filters.year) {
      return { year: filters.year, month: filters.month };
    }
    // If date range is selected, use that
    else if (filters.fromDate && filters.toDate) {
      return { fromDate: filters.fromDate, toDate: filters.toDate };
    }
    return null;
  };

  // Filter handlers
  const handleChangeFlt = (e) => {
    const { name, value } = e.target;
    
    // Clear other filter type when selecting
    if (name === "year") {
      // Clear date range when year is selected
      setFilters({ 
        ...filters, 
        year: value, 
        month: "",
        fromDate: "", 
        toDate: "" 
      });
    } else if (name === "fromDate" || name === "toDate") {
      // Clear year-month when date range is selected
      setFilters({ 
        ...filters, 
        [name]: value,
        year: "", 
        month: "" 
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const getFilter = (e) => {
    e.preventDefault();
    
    // Validate filters
    if (filters.fromDate && !filters.toDate) {
      toast.error("Please select To Date");
      return;
    }
    if (!filters.fromDate && filters.toDate) {
      toast.error("Please select From Date");
      return;
    }
    
    const activeFilters = getActiveFilters();
    setPageNumber(1);
    Get(1, form.search || "", activeFilters);
    setFilter(false);
    
    // Show success message based on filter type
    if (filters.year && filters.month) {
      const monthName = months.find(m => m.value === filters.month)?.label;
      toast.success(`Filtering by ${monthName} ${filters.year}`);
    } else if (filters.year) {
      toast.success(`Filtering by year ${filters.year}`);
    } else if (filters.fromDate && filters.toDate) {
      toast.success(`Filtering from ${filters.fromDate} to ${filters.toDate}`);
    }
  };

  const hideFilter = () => setFilter(false);

  const clearCustomFilter = () => {
    setFilters({ fromDate: "", toDate: "", year: "", month: "" });
    setPageNumber(1);
    Get(1, form.search || "");
    setFilteredCount(completedCount); // Reset to total count
    toast.info("Filters cleared");
  };

  // Pagination handler
  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPageNumber(newPage);
    const activeFilters = getActiveFilters();
    Get(newPage, form.search || "", activeFilters);
  };

  // CSV data using current table data
  const getCSVData = () => {
    if (users.length === 0) return [];
    
    return users.map((elt, i) => ({
      "S.No": i + 1 + (pageNumber - 1) * listPerPage,
      "Event Id": elt.orderId || "",
      "Booking Date": elt.logCreatedDate?.slice(0, 10) || "",
      "Event Date": elt.date || "",
      "Event Time": elt.time || "",
      "Name": elt.userName || "",
      "Phone": elt.userPhone || "",
      "Theater Name": elt.theatreName || "",
      "Plan Name": elt.planName || "Basic Plan",
      "Occasion Name": elt.occasionName || "",
      "Remaining Price": (parseFloat(elt.totalPrice || 0) - parseFloat(elt?.advancePayment || 0)).toFixed(2),
      "Status": elt.status || ""
    }));
  };

  const alternativeCsvReport = {
    filename: `Booking_Report_${new Date().toLocaleDateString()}.csv`,
    data: getCSVData(),
    headers: [
      { label: "S.No", key: "S.No" },
      { label: "Event Id", key: "Event Id" },
      { label: "Booking Date", key: "Booking Date" },
      { label: "Event Date", key: "Event Date" },
      { label: "Event Time", key: "Event Time" },
      { label: "Name", key: "Name" },
      { label: "Phone", key: "Phone" },
      { label: "Theater Name", key: "Theater Name" },
      { label: "Plan Name", key: "Plan Name" },
      { label: "Occasion Name", key: "Occasion Name" },
      { label: "Remaining Price", key: "Remaining Price" },
      { label: "Status", key: "Status" }
    ]
  };

  const exportPDF = () => {
    const unit = "pt";
    const size = "A2";
    const orientation = "landscape";
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    
    let title = "Completed Bookings Report";
    if (filters.year && filters.month) {
      const monthName = months.find(m => m.value === filters.month)?.label;
      title += ` - ${monthName} ${filters.year}`;
    } else if (filters.year) {
      title += ` - Year ${filters.year}`;
    } else if (filters.fromDate && filters.toDate) {
      title += ` - ${filters.fromDate} to ${filters.toDate}`;
    }
    
    doc.text(title, 40, 40);
    
    const headers = [
      ["S.No", "Event Id", "Booking Date", "Event Date", "Event Time", "Name", "Phone", "Theater Name", "Plan Name", "Occasion Name", "Remaining Price", "Status"]
    ];
    
    const dataPDF = users.map((elt, i) => [
      i + 1 + (pageNumber - 1) * listPerPage,
      elt.orderId || "",
      elt.logCreatedDate?.slice(0, 10) || "",
      elt.date || "",
      elt.time || "",
      elt.userName || "",
      elt.userPhone || "",
      elt.theatreName || "",
      elt.planName || "N/A",
      elt.occasionName || "",
      (parseFloat(elt.totalPrice || 0) - parseFloat(elt?.advancePayment || 0)).toFixed(2),
      elt.status || ""
    ]);
    
    doc.autoTable({
      startY: 50,
      head: headers,
      body: dataPDF,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    const filename = `Completed_Bookings_${new Date().toLocaleDateString()}.pdf`;
    doc.save(filename);
  };

  // Get display text for active filters
  const getActiveFilterText = () => {
    if (filters.year && filters.month) {
      const monthName = months.find(m => m.value === filters.month)?.label;
      return `${monthName} ${filters.year}`;
    } else if (filters.year) {
      return `Year ${filters.year}`;
    } else if (filters.fromDate && filters.toDate) {
      return `${filters.fromDate} to ${filters.toDate}`;
    }
    return "";
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Completed Bookings" />
          
          {/* Stats and Filter Info */}
          <Row className="mb-3">
            <Col>
              <div className="mt-2 text-muted fs-5">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span>Total Completed Bookings: <strong>{completedCount}</strong></span>
                    {getActiveFilterText() && (
                      <span className="ms-3">
                        | Filtered: <strong className="text-primary">{filteredCount}</strong> bookings
                      </span>
                    )}
                  </div>
                  {getActiveFilterText() && (
                    <span className="badge bg-info p-2">
                      <i className="fas fa-filter me-1"></i>
                      {getActiveFilterText()}
                      <Button 
                        color="link" 
                        className="text-white ms-2 p-0" 
                        onClick={clearCustomFilter}
                        style={{ textDecoration: 'none' }}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Filter Panel */}
          {filter && (
            <Card>
              <CardBody>
                <Form onSubmit={getFilter}>
                  <Row>
                    <Col lg="12" className="mb-3">
                      <h5 className="text-primary">Filter Bookings</h5>
                      <p className="text-muted small">Choose any one filter option below</p>
                    </Col>
                    
                    {/* Option 1: Year-Month Filter */}
                    <Col lg="12">
                      <h6 className="text-secondary">Option 1: Select Year & Month</h6>
                    </Col>
                    <Col lg="3">
                      <Label>Select Year</Label>
                      <Input 
                        type="select" 
                        name="year" 
                        value={filters.year} 
                        onChange={handleChangeFlt}
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </Input>
                    </Col>
                    
                    <Col lg="3">
                      <Label>Select Month</Label>
                      <Input 
                        type="select" 
                        name="month" 
                        value={filters.month} 
                        onChange={handleChangeFlt}
                        disabled={!filters.year}
                      >
                        <option value="">Select Month</option>
                        {months.map(month => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </Input>
                    </Col>

                    {/* Option 2: Date Range Filter */}
                    <Col lg="12" className="mt-4">
                      <h6 className="text-secondary">Option 2: Select Date Range</h6>
                    </Col>
                    
                    <Col lg="3">
                      <Label>From Date</Label>
                      <Input 
                        type="date" 
                        name="fromDate" 
                        value={filters.fromDate} 
                        onChange={handleChangeFlt} 
                      />
                    </Col>
                    <Col lg="3">
                      <Label>To Date</Label>
                      <Input 
                        type="date" 
                        name="toDate" 
                        value={filters.toDate} 
                        onChange={handleChangeFlt} 
                      />
                    </Col>
                    
                    <Col lg="12" className="mt-4">
                      <Button type="submit" className="me-2" color="info">
                        <i className="fas fa-search me-1"></i> Apply Filter
                      </Button>
                      <Button type="button" onClick={hideFilter} className="me-2" color="danger">
                        <i className="fas fa-times me-1"></i> Cancel
                      </Button>
                      <Button type="button" onClick={clearCustomFilter} color="secondary">
                        <i className="fas fa-undo me-1"></i> Clear All
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          )}

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      {/* Export and Filter Buttons */}
                      <CSVLink {...alternativeCsvReport}>
                        <Button className="me-2" color="success">
                          <i className="fas fa-file-excel me-1"></i> Excel
                        </Button>
                      </CSVLink>
                      <Button className="me-2" color="danger" onClick={exportPDF}>
                        <i className="fas fa-file-pdf me-1"></i> PDF
                      </Button>
                      <Button className="me-2" color="info" onClick={() => setFilter(!filter)}>
                        <i className="fas fa-filter me-1"></i> 
                        {filter ? 'Hide Filter' : 'Show Filter'}
                      </Button>
                    </Col>
                    <Col>
                      <Input
                        name="search"
                        value={form.search || ""}
                        onChange={custsearch}
                        type="search"
                        placeholder="Search by ID, Name, Phone..."
                        style={{ float: "right", width: "300px" }}
                      />
                    </Col>
                  </Row>

                  <div className="table-responsive mt-3">
                    <Table hover bordered responsive>
                      <thead className="bg-light">
                        <tr>
                          <th>S.No</th>
                          <th>Event Id</th>
                          <th>Booking Date</th>
                          <th>Event Date</th>
                          <th>Event Time</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Theater Name</th>
                          <th>Plan Name</th>
                          <th>Occasion Name</th>
                          <th>Remaining Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((data, key) => (
                            <tr key={data._id || key}>
                              <th scope="row">{(pageNumber - 1) * listPerPage + key + 1}</th>
                              <td>{data.orderId}</td>
                              <td>{data.logCreatedDate?.slice(0, 10)}</td>
                              <td>{data.date}</td>
                              <td>{data.time}</td>
                              <td>{data.userName}</td>
                              <td>{data.userPhone}</td>
                              <td>{data.theatreName}</td>
                              <td>{data.planName || "Basic Plan"}</td>
                              <td>{data.occasionName}</td>
                              <td>₹{(parseFloat(data.totalPrice || 0) - parseFloat(data?.advancePayment || 0)).toFixed(2)}</td>
                              <td>
                                <span className="badge bg-success">{data.status}</span>
                              </td>
                              <td>
                                {(Roles?.compeletedBookingsView || Roles?.accessAll) && (
                                  <Button 
                                    onClick={() => Actinid1(data)} 
                                    size="sm" 
                                    color="info"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="13" className="text-center py-4">
                              <i className="fas fa-inbox fa-2x mb-2 text-muted"></i>
                              <p className="mb-0">No completed bookings found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    {/* Pagination and Count Info */}
                    <Row className="mt-3">
                      <Col md="6">
                        <div className="text-muted">
                          <strong>Total Records:</strong> {filteredCount} | 
                          <strong> Showing:</strong> {users.length} on page {pageNumber} of {pageCount}
                        </div>
                      </Col>
                      <Col md="6">
                        {pageCount > 1 && (
                          <div className="d-flex justify-content-end">
                            <ReactPaginate
                              previousLabel={"Previous"}
                              nextLabel={"Next"}
                              pageCount={pageCount}
                              onPageChange={changePage}
                              containerClassName={"pagination"}
                              pageClassName={"page-item"}
                              pageLinkClassName={"page-link"}
                              previousClassName={"page-item"}
                              previousLinkClassName={"page-link"}
                              nextClassName={"page-item"}
                              nextLinkClassName={"page-link"}
                              breakClassName={"page-item"}
                              breakLinkClassName={"page-link"}
                              activeClassName={"active"}
                              forcePage={pageNumber - 1}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={3}
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default Staff;