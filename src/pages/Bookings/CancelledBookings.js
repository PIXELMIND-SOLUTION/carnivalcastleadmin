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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
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
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [listPerPage] = useState(10);
  const [cancelledCount, setCancelledCount] = useState(0);
  
  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const history = useHistory();
  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const token = data.token;
  const Roles = data?.rolesAndPermission[0];

  const cancelTokenRef = useRef(null); // Cancel previous request

  const Actinid1 = (data) => {
    sessionStorage.setItem("BookingId", data._id);
    history.push("/ViewBooking");
  };

  // Open delete confirmation modal
  const confirmDelete = (booking) => {
    setBookingToDelete(booking);
    setDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setBookingToDelete(null);
  };

  // Delete booking function - FIXED API URL
  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    setDeleting(true);
    try {
      // Using the exact URL you provided
      const deleteUrl = `https://api.carnivalcastle.com/v1/carnivalApi/admin/deletebooking/${bookingToDelete._id}`;
      
      console.log("Deleting booking at:", deleteUrl);
      
      const response = await axios.delete(
        deleteUrl,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Delete response:", response.data);
      
      if (response.data.success) {
        toast.success("Booking deleted successfully");
        // Refresh the list
        Get(pageNumber, form.search || "", filters.fromDate ? filters : null);
        closeDeleteModal();
      } else {
        toast.error(response.data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Delete error:", error);
      
      // Better error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data?.message || `Error ${error.response.status}: Failed to delete booking`);
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(error.message || "Error deleting booking");
      }
    } finally {
      setDeleting(false);
    }
  };

  // Fetch cancelled bookings
  const Get = async (page = 1, search = "", filtersData = null) => {
    try {
      if (cancelTokenRef.current) cancelTokenRef.current.cancel("Canceled due to new request");
      cancelTokenRef.current = axios.CancelToken.source();

      const body = { page, limit: listPerPage, searchQuery: search, ...filtersData };
      const res = await axios.post(URLS.GetCancelledBookings, body, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelTokenRef.current.token,
      });

      if (res.data.success) {
        setUsers(res.data.data);
        setUserInCsv(res.data.cancelledBookingExcel);
        setPageCount(res.data.totalPages);
        setCancelledCount(res.data.totalCount);
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
      toast.error("Error fetching cancelled bookings");
    }
  };

  useEffect(() => {
    Get(pageNumber);
  }, []);

  // Search handler (instant)
  const custsearch = (e) => {
    const value = e.target.value;
    setForm({ ...form, search: value });
    setPageNumber(1);
    Get(1, value);
  };

  // Filter handlers
  const handleChangeFlt = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getFilter = (e) => {
    e.preventDefault();
    const filterData = { fromDate: filters.fromDate, toDate: filters.toDate };
    setPageNumber(1);
    Get(1, form.search || "", filterData);
    setFilter(false);
    setFilters({ fromDate: "", toDate: "" });
  };

  const hideFilter = () => setFilter(false);

  // Pagination
  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPageNumber(newPage);
    Get(newPage, form.search || "", filters.fromDate ? filters : null);
  };

  // CSV and PDF export
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
      "Total Price": parseFloat(elt.totalPrice || 0).toFixed(2),
      "Cancelled Reason": elt.cancellReason || "",
      "Status": elt.status || ""
    }));
  };

  const csvReport = {
    filename: "Cancelled_Booking_Report.csv",
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
      { label: "Total Price", key: "Total Price" },
      { label: "Cancelled Reason", key: "Cancelled Reason" },
      { label: "Status", key: "Status" }
    ]
  };

  const exportPDF = () => {
    const unit = "pt";
    const size = "A2";
    const orientation = "portrait";
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    
    const title = "Cancelled Bookings Report";
    doc.text(title, 40, 40);
    
    const headers = [
      ["S.No","Event Id","Event Date","Event Time","Name","Phone","Theater Name","Plan Name","Occasion Name","Total Price","Cancelled Reason","Status"]
    ];
    
    const dataPDF = users.map((elt, i) => [
      i + 1 + (pageNumber - 1) * listPerPage,
      elt.orderId || "",
      elt.date || "",
      elt.time || "",
      elt.userName || "",
      elt.userPhone || "",
      elt.theatreName || "",
      elt.planName || "N/A",
      elt.occasionName || "",
      parseFloat(elt.totalPrice || 0).toFixed(2),
      elt.cancellReason || "",
      elt.status || ""
    ]);
    
    doc.autoTable({ 
      startY: 50, 
      head: headers, 
      body: dataPDF,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save("Cancelled_Booking_Report.pdf");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Cancelled Bookings" />
          <div className="mt-2 text-muted fs-5">Total Cancelled Bookings: {cancelledCount}</div>

          {filter && (
            <Card>
              <CardBody>
                <Form onSubmit={getFilter}>
                  <Row>
                    <Col lg="3">
                      <Label>From Date <span className="text-danger">*</span></Label>
                      <Input type="date" required name="fromDate" value={filters.fromDate} onChange={handleChangeFlt} />
                    </Col>
                    <Col lg="3">
                      <Label>To Date <span className="text-danger">*</span></Label>
                      <Input type="date" required name="toDate" value={filters.toDate} onChange={handleChangeFlt} />
                    </Col>
                    <Col lg="3" className="mt-4">
                      <Button type="submit" className="m-1" color="info">Search</Button>
                      <Button onClick={hideFilter} className="m-1" color="danger">Cancel</Button>
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
                  <Row>
                    <Col>
                      <CSVLink {...csvReport}>
                        <Button className="me-2" color="success">
                          <i className="fas fa-file-excel"></i> Excel
                        </Button>
                      </CSVLink>
                      <Button className="me-2" color="danger" onClick={exportPDF}>
                        <i className="fas fa-file-pdf"></i> PDF
                      </Button>
                      <Button className="me-2" color="info" onClick={() => setFilter(!filter)}>
                        <i className="fas fa-filter"></i> Filter
                      </Button>
                    </Col>
                    <Col>
                      <Input 
                        name="search" 
                        value={form.search || ""} 
                        onChange={custsearch} 
                        type="search" 
                        placeholder="Search..." 
                        style={{ float: "right" }} 
                      />
                    </Col>
                  </Row>

                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
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
                          <th>Total Price</th>
                          <th>Cancelled Reason</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((data, key) => (
                            <tr key={key}>
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
                              <td>{parseFloat(data.totalPrice || 0).toFixed(2)}</td>
                              <td>{data.cancellReason || "N/A"}</td>
                              <td>{data.status}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  {(Roles.cancelledBookingsView || Roles?.accessAll) && (
                                    <Button 
                                      onClick={() => Actinid1(data)} 
                                      size="sm" 
                                      color="info"
                                      className="btn-sm"
                                      title="View Details"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </Button>
                                  )}
                                  
                                  {/* Delete Button */}
                                  <Button 
                                    onClick={() => confirmDelete(data)} 
                                    size="sm" 
                                    color="danger"
                                    className="btn-sm"
                                    title="Delete Booking"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="14" className="text-center">
                              No cancelled bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-end mt-3">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>
          <i className="fas fa-trash text-danger me-2"></i>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          {bookingToDelete && (
            <div>
              <p className="mb-3">Are you sure you want to delete this booking?</p>
              <div className="bg-light p-3 rounded">
                <p><strong>Order ID:</strong> {bookingToDelete.orderId}</p>
                <p><strong>Name:</strong> {bookingToDelete.userName}</p>
                <p><strong>Theater:</strong> {bookingToDelete.theatreName}</p>
                <p><strong>Date:</strong> {bookingToDelete.date}</p>
                <p><strong>Time:</strong> {bookingToDelete.time}</p>
                <p><strong>Total Price:</strong> ₹{parseFloat(bookingToDelete.totalPrice || 0).toFixed(2)}</p>
              </div>
              <p className="text-danger mt-3 mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                This action cannot be undone!
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal} disabled={deleting}>
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteBooking} disabled={deleting}>
            {deleting ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-2"></i>
                Delete Booking
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Staff;