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

const UserReferrals = () => {
  const [users, setUsers] = useState([]);
  const [usersInCsv, setUsersInCsv] = useState([]);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState(false);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [listPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const gets = localStorage.getItem("authUser");
  const data = JSON.parse(gets);
  const token = data.token;
  const Roles = data?.rolesAndPermission[0];

  const cancelTokenRef = useRef(null);
  const searchTimeout = useRef(null);

  // Fetch all users with referral data
  const getReferralUsers = async (page = 1, search = "", filtersData = null) => {
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
      
      const res = await axios.get("https://api.carnivalcastle.com/v1/carnivalApi/admin/allreffrals", body, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelTokenRef.current.token,
      });
      
      if (res.data.success) {
        setUsers(res.data.data || []);
        setUsersInCsv(res.data.data || []);
        setPageCount(res.data.totalPages || 0);
        setTotalUsers(res.data.totalUsers || 0);
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
      toast.error("Error fetching referral users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Show user referral details modal
  const showUserReferralDetails = (user) => {
    setSelectedUser(user);
    setDetailModal(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setDetailModal(false);
    setSelectedUser(null);
  };

  // Initial load
  useEffect(() => {
    getReferralUsers(pageNumber);
  }, []);

  // Search handler with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, search: value }));
    setPageNumber(1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      getReferralUsers(1, value, filters.fromDate ? filters : null);
    }, 300);
  };

  // Filter handlers
  const handleChangeFlt = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = (e) => {
    e.preventDefault();
    const filterData = { fromDate: filters.fromDate, toDate: filters.toDate };
    setPageNumber(1);
    getReferralUsers(1, form.search || "", filterData);
    setFilter(false);
  };

  const hideFilter = () => setFilter(false);

  // Pagination handler
  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPageNumber(newPage);
    getReferralUsers(newPage, form.search || "", filters.fromDate ? filters : null);
  };

  // CSV and PDF export (simplified)
  const csvReport = { 
    filename: "User_Referrals_Report.csv", 
    data: usersInCsv.map(user => ({
      'User Name': user.name || 'N/A',
      'Email': user.email || 'N/A',
      'Phone': user.phone || 'N/A',
      'Referral Codes': user.referralCodes?.join(', ') || 'N/A'
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
    doc.text("User Referrals Report", 40, 40);
    
    const headers = [
      [
        "S.No",
        "User Name",
        "Email",
        "Phone",
        "Referral Codes"
      ],
    ];
    
    const dataPDF = users.map((user, i) => [
      i + 1 + (pageNumber - 1) * listPerPage,
      user.name || "N/A",
      user.email || "N/A",
      user.phone || "N/A",
      user.referralCodes?.join(', ') || "N/A"
    ]);
    
    doc.autoTable({ 
      startY: 60, 
      head: headers, 
      body: dataPDF,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save("User_Referrals_Report.pdf");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="User Referrals" />
          <div className="mt-2 text-muted fs-5">Total Users with Referrals: {totalUsers}</div>

          {filter && (
            <Card>
              <CardBody>
                <Form onSubmit={applyFilter}>
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
                        onChange={handleSearch}
                        type="search"
                        placeholder="Search by name, email, phone, referral code..."
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
                        <p className="mt-2">Loading referral data...</p>
                      </div>
                    ) : (
                      <>
                        <Table hover bordered responsive>
                          <thead className="bg-light">
                            <tr>
                              <th>S.No</th>
                              <th>User Details</th>
                              <th>Referral Codes</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users && users.length > 0 ? (
                              users.map((user, key) => (
                                <tr key={key}>
                                  <th scope="row">{(pageNumber - 1) * listPerPage + key + 1}</th>
                                  <td>
                                    <div>
                                      <strong>{user.name}</strong>
                                      <br />
                                      <small className="text-muted">{user.email}</small>
                                      <br />
                                      <small>{user.phone}</small>
                                    </div>
                                  </td>
                                  <td>
                                    {user.referralCodes && user.referralCodes.length > 0 ? (
                                      <div>
                                        {user.referralCodes.slice(0, 3).map((code, idx) => (
                                          <Badge key={idx} color="primary" className="me-1 mb-1">
                                            {code}
                                          </Badge>
                                        ))}
                                        {user.referralCodes.length > 3 && (
                                          <Badge color="secondary" className="mb-1">
                                            +{user.referralCodes.length - 3} more
                                          </Badge>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-muted">No referral codes</span>
                                    )}
                                  </td>
                                  <td>
                                    <Button 
                                      onClick={() => showUserReferralDetails(user)} 
                                      size="sm" 
                                      color="primary"
                                    >
                                      <i className="fas fa-eye px-1"></i> View
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center py-4">
                                  <div className="text-muted">
                                    <i className="fas fa-users fa-2x mb-2"></i>
                                    <p>No referral data found</p>
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

      {/* User Referral Details Modal */}
      <Modal isOpen={detailModal} toggle={closeDetailModal} size="lg">
        <ModalHeader toggle={closeDetailModal}>
          <i className="fas fa-user-friends me-2 text-primary"></i>
          Referral Details - {selectedUser?.name}
        </ModalHeader>
        <ModalBody>
          {selectedUser ? (
            <>
              {/* User Info */}
              <Card className="mb-4">
                <CardBody>
                  <Row>
                    <Col md="6">
                      <strong>User Name:</strong> {selectedUser?.name}
                    </Col>
                    <Col md="6">
                      <strong>Email:</strong> {selectedUser?.email}
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md="6">
                      <strong>Phone:</strong> {selectedUser?.phone}
                    </Col>
                    <Col md="6">
                      <strong>Total Referral Codes:</strong> {selectedUser?.referralCodes?.length || 0}
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Referral Codes */}
              <Card>
                <CardBody>
                  <h6 className="mb-3">All Referral Codes:</h6>
                  {selectedUser?.referralCodes && selectedUser.referralCodes.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedUser.referralCodes.map((code, idx) => (
                        <Badge key={idx} color="primary" className="fs-6 p-2">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <i className="fas fa-tags fa-2x text-muted mb-2"></i>
                      <p className="text-muted">No referral codes available</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading user details...</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDetailModal}>
            <i className="fas fa-times me-1"></i> Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default UserReferrals;