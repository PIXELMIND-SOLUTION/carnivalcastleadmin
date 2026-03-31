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
  ModalFooter,
  Badge
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

const RewardPoints = () => {
  const [users, setUsers] = useState([]);
  const [userInCsv, setUserInCsv] = useState([]);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState(false);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [listPerPage] = useState(10);
  const [completedCount, setCompletedCount] = useState(0);
  const [rewardModal, setRewardModal] = useState(false);
  const [selectedRewardHistory, setSelectedRewardHistory] = useState([]);
  const [selectedTotalRewardPoints, setSelectedTotalRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const token = data.token;
  const Roles = data?.rolesAndPermission[0];

  const cancelTokenRef = useRef(null);
  const searchTimeout = useRef(null);

  // Show reward history in modal
  const showRewardHistory = (rewardHistory, totalRewardPoints) => {
    setSelectedRewardHistory(rewardHistory || []);
    setSelectedTotalRewardPoints(totalRewardPoints || 0);
    setRewardModal(true);
  };

  // Close reward modal
  const closeRewardModal = () => {
    setRewardModal(false);
    setSelectedRewardHistory([]);
    setSelectedTotalRewardPoints(0);
  };

  // Fetch completed bookings with pagination & filters
  const Get = async (page = 1, search = "", filtersData = null) => {
    try {
      setLoading(true);
      if (cancelTokenRef.current) cancelTokenRef.current.cancel("Canceled due to new request");
      cancelTokenRef.current = axios.CancelToken.source();

      const body = {
        page,
        limit: listPerPage,
        searchQuery: search,
        ...filtersData,
      };
      const res = await axios.post(URLS.GetCompleatedBookings, body, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelTokenRef.current.token,
      });
      if (res.data.success) {
        setUsers(res.data.data || []);
        setUserInCsv(res.data.completedBookingExcel || []);
        setPageCount(res.data.totalPages || 0);
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
      toast.error("Error fetching completed bookings");
      setUsers([]);
    } finally {
      setLoading(false);
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
        setCompletedCount(response.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching completed booking count:", error);
      setCompletedCount(0);
    }
  };

  // Search handler with debounce
  const custsearch = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, search: value }));
    setPageNumber(1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      Get(1, value, filters.fromDate ? filters : null);
    }, 300);
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
  };

  const hideFilter = () => setFilter(false);

  // Pagination handler
  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPageNumber(newPage);
    Get(newPage, form.search || "", filters.fromDate ? filters : null);
  };

  // CSV and PDF export
  const csvReport = { 
    filename: "Reward_Points_Report.csv", 
    data: userInCsv.map(user => ({
      'Customer Name': user.userName || 'N/A',
      'Phone': user.userPhone || 'N/A',
      'Email': user.userEmail || 'N/A',
      'Order ID': user.orderId || 'N/A',
      'Total Reward Points': user.totalRewardPoints || 0,
      'Status': user.status || 'N/A'
    }))
  };

  const exportPDF = () => {
    if (!users || users.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const unit = "pt";
    const size = "A2";
    const orientation = "portrait";
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    
    // Title
    doc.text("Reward Points Report", 40, 40);
    
    const headers = [
      [
        "S.No",
        "Customer Name",
        "Phone",
        "Email",
        "Order ID",
        "Total Reward Points",
        "Status",
      ],
    ];
    
    const dataPDF = users.map((elt, i) => [
      i + 1 + (pageNumber - 1) * listPerPage,
      elt.userName || "N/A",
      elt.userPhone || "N/A",
      elt.userEmail || "N/A",
      elt.orderId || "N/A",
      elt.totalRewardPoints || 0,
      elt.status || "N/A",
    ]);
    
    doc.autoTable({ 
      startY: 60, 
      head: headers, 
      body: dataPDF,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save("Reward_Points_Report.pdf");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Customer Reward Points" />
          <div className="mt-2 text-muted fs-5">Total Customers: {completedCount}</div>

          {filter && (
            <Card>
              <CardBody>
                <Form onSubmit={getFilter}>
                  <Row>
                    <Col lg="3">
                      <Label>From Date <span className="text-danger">*</span></Label>
                      <Input 
                        type="date" 
                        required 
                        name="fromDate" 
                        value={filters.fromDate} 
                        onChange={handleChangeFlt} 
                      />
                    </Col>
                    <Col lg="3">
                      <Label>To Date <span className="text-danger">*</span></Label>
                      <Input 
                        type="date" 
                        required 
                        name="toDate" 
                        value={filters.toDate} 
                        onChange={handleChangeFlt} 
                      />
                    </Col>
                    <Col lg="3" className="mt-4">
                      <Button type="submit" className="m-1" color="info">
                        Search
                      </Button>
                      <Button onClick={hideFilter} className="m-1" color="danger">
                        Cancel
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
                        placeholder="Search by name, phone, email..."
                        style={{ float: "right" }}
                      />
                    </Col>
                  </Row>

                  <div className="table-responsive mt-3">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-2">Loading customer data...</p>
                      </div>
                    ) : (
                      <>
                        <Table hover bordered responsive>
                          <thead className="bg-light">
                            <tr>
                              <th>S.No</th>
                              <th>Customer Name</th>
                              <th>Phone</th>
                              <th>Email</th>
                              <th>Order ID</th>
                              <th>Total Reward Points</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users && users.length > 0 ? (
                              users.map((data, key) => (
                                <tr key={key}>
                                  <th scope="row">{(pageNumber - 1) * listPerPage + key + 1}</th>
                                  <td>
                                    <strong>{data.userName}</strong>
                                  </td>
                                  <td>{data.userPhone}</td>
                                  <td>{data.userEmail}</td>
                                  <td>
                                    <Badge color="primary">
                                      {data.orderId}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color="warning" className="fs-6">
                                      <i className="fas fa-star me-1"></i>
                                      {data.totalRewardPoints || 0}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge 
                                      color={data.status === 'completed' ? 'success' : 'secondary'}
                                      className="fs-6"
                                    >
                                      {data.status}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex">
                                      <Button 
                                        onClick={() => showRewardHistory(data.rewardHistory, data.totalRewardPoints)} 
                                        size="sm" 
                                        color="warning"
                                      >
                                        <i className="fas fa-gift px-1"></i> View Rewards
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center py-4">
                                  <div className="text-muted">
                                    <i className="fas fa-users fa-2x mb-2"></i>
                                    <p>No customer data found</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>

                        {users && users.length > 0 && (
                          <div className="d-flex justify-content-end mt-3">
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
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>

      {/* Reward History Modal */}
      <Modal isOpen={rewardModal} toggle={closeRewardModal} size="lg">
        <ModalHeader toggle={closeRewardModal}>
          <i className="fas fa-gift me-2 text-warning"></i>
          Reward History - Total Points: {selectedTotalRewardPoints}
        </ModalHeader>
        <ModalBody>
          {selectedRewardHistory && selectedRewardHistory.length > 0 ? (
            <div className="table-responsive">
              <Table bordered striped>
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>Booking No</th>
                    <th>Points Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRewardHistory.map((reward, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{reward.bookingNo || `Booking ${index + 1}`}</td>
                      <td>
                        <Badge color="success" className="fs-6">
                          <i className="fas fa-coins me-1"></i>
                          {reward.points || 0} points
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-gift fa-3x text-muted mb-3"></i>
              <p className="text-muted">No reward history available</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeRewardModal}>
            <i className="fas fa-times me-1"></i> Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default RewardPoints;