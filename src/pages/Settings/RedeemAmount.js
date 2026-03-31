import React, { useEffect, useState } from "react"
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
  Badge,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"

const RedeemAmount = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [redeemAmounts, setRedeemAmounts] = useState([])
  const [form, setform] = useState({
    amount: "",
    redeemablePoints: "",
    pointsToRupees: "",
    rupeeValue: "",
    status: "active"
  })
  const [form1, setform1] = useState({
    amount: "",
    redeemablePoints: "",
    pointsToRupees: "",
    rupeeValue: "",
    status: "active"
  })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Direct API URLs
  const API_BASE_URL = "https://api.carnivalcastle.com/v1/carnivalApi/admin/coupon"
  
  const API_URLS = {
    GET_ALL: `${API_BASE_URL}/allredeem`,
    ADD: `${API_BASE_URL}/addredeem`,
    UPDATE: `${API_BASE_URL}/updateredeem`,
    DELETE: `${API_BASE_URL}/deleteredeem`,
  }

  // Get user token from localStorage
  const getUserToken = () => {
    const authUser = localStorage.getItem("authUser")
    if (authUser) {
      try {
        const data = JSON.parse(authUser)
        return data.token
      } catch (error) {
        console.error("Error parsing authUser:", error)
        return null
      }
    }
    return null
  }

  const token = getUserToken()

  // Fetch all redeem amounts
  const fetchRedeemAmounts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        API_BASE_URL + "/allredeem",
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      )
      
      console.log("Fetch Response:", response.data)
      
      if (response.data.success) {
        const data = response.data.data || response.data.redeemAmounts || response.data.redeemamounts || []
        setRedeemAmounts(Array.isArray(data) ? data : [])
      } else {
        toast.error(response.data.message || "Failed to fetch redeem amounts")
        setRedeemAmounts([])
      }
    } catch (error) {
      console.error("Error fetching redeem amounts:", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to fetch redeem amounts")
      }
      setRedeemAmounts([])
    } finally {
      setLoading(false)
    }
  }

  // Add new redeem amount
  const addRedeemAmount = async () => {
    if (!form.amount || !form.redeemablePoints || !form.pointsToRupees || !form.rupeeValue) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      const dataToSend = {
        amount: parseFloat(form.amount),
        redeemablePoints: parseInt(form.redeemablePoints),
        pointsToRupees: parseInt(form.pointsToRupees),
        rupeeValue: parseFloat(form.rupeeValue),
        status: form.status
      }

      console.log("Sending data:", dataToSend)

      const response = await axios.post(
        API_BASE_URL + "/addredeem",
        dataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      )

      console.log("Add Response:", response.data)

      if (response.data.success) {
        toast.success(response.data.message || "Redeem amount added successfully")
        fetchRedeemAmounts()
        clearForm()
      } else {
        toast.error(response.data.message || "Failed to add redeem amount")
      }
    } catch (error) {
      console.error("Error adding redeem amount:", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  // Update redeem amount
  const updateRedeemAmount = async () => {
    console.log("updateRedeemAmount called")
    console.log("editId:", editId)
    console.log("form1:", form1)

    if (!editId || editId === "Not selected") {
      toast.error("No redeem amount selected for update. Please select an item to edit.")
      return
    }

    if (!form1.amount || !form1.redeemablePoints || !form1.pointsToRupees || !form1.rupeeValue) {
      toast.error("Please fill all fields")
      return
    }

    try {
      const dataToSend = {
        amount: parseFloat(form1.amount),
        redeemablePoints: parseInt(form1.redeemablePoints),
        pointsToRupees: parseInt(form1.pointsToRupees),
        rupeeValue: parseFloat(form1.rupeeValue),
        status: form1.status
      }

      console.log("Updating ID:", editId)
      console.log("Update data:", dataToSend)
      console.log("Full URL:", API_BASE_URL + `/updateredeem/${editId}`)

      const response = await axios.put(
        API_BASE_URL + `/updateredeem/${editId}`,
        dataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      )

      console.log("Update Response:", response.data)

      if (response.data.success) {
        toast.success(response.data.message || "Redeem amount updated successfully")
        fetchRedeemAmounts()
        setmodal_small(false)
        setEditId(null)
        // Reset edit form
        setform1({
          amount: "",
          redeemablePoints: "",
          pointsToRupees: "",
          rupeeValue: "",
          status: "active"
        })
      } else {
        toast.error(response.data.message || "Failed to update redeem amount")
      }
    } catch (error) {
      console.error("Error updating redeem amount:", error)
      console.error("Error details:", error.response?.data || error.message)
      
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        } else if (error.response.data.error) {
          toast.error(error.response.data.error)
        } else {
          toast.error("Update failed. Please check console for details.")
        }
      } else {
        toast.error("Network error or server not responding")
      }
    }
  }

  // Delete redeem amount
  const deleteRedeemAmount = async (id) => {
    try {
      console.log("Deleting ID:", id)
      
      const response = await axios.delete(
        API_BASE_URL + `/deleteredeem/${id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      )

      console.log("Delete Response:", response.data)

      if (response.data.success) {
        toast.success(response.data.message || "Redeem amount deleted successfully")
        fetchRedeemAmounts()
      } else {
        toast.error(response.data.message || "Failed to delete redeem amount")
      }
    } catch (error) {
      console.error("Error deleting redeem amount:", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  const handleChange = e => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleChange1 = e => {
    setform1({
      ...form1,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    addRedeemAmount()
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    console.log("Edit form submitted")
    updateRedeemAmount()
  }

  const handleEdit = (data) => {
    console.log("=== handleEdit called ===")
    console.log("Data received:", data)
    
    // Get actual values from data (check multiple possible field names)
    const amount = data.amount || data.Amount || data.AMOUNT || "";
    const redeemablePoints = data.redeemablePoints || data.redeemablepoints || data.RedeemablePoints || "";
    const pointsToRupees = data.pointsToRupees || data.pointstorupees || data.PointsToRupees || "";
    const rupeeValue = data.rupeeValue || data.rupeevalue || data.RupeeValue || "";
    const status = data.status || data.Status || "active";
    const itemId = data._id || data.id;
    
    console.log("Extracted values:", { amount, redeemablePoints, pointsToRupees, rupeeValue, status, itemId })
    
    if (!itemId) {
      console.error("No ID found in data!")
      toast.error("Cannot edit: No ID found for this item")
      return
    }
    
    // Set form with existing data
    setform1({
      amount: amount ? amount.toString() : "",
      redeemablePoints: redeemablePoints ? redeemablePoints.toString() : "",
      pointsToRupees: pointsToRupees ? pointsToRupees.toString() : "",
      rupeeValue: rupeeValue ? rupeeValue.toString() : "",
      status: status
    })
    
    // Set the ID for update
    setEditId(itemId)
    
    console.log("Edit ID set to:", itemId)
    console.log("Form1 set to:", form1)
    
    // Open modal
    tog_small()
  }

  const handleDelete = (data) => {
    const confirmBox = window.confirm("Do you really want to delete this redeem amount?")
    if (confirmBox === true) {
      deleteRedeemAmount(data._id || data.id)
    }
  }

  const clearForm = () => {
    setform({
      amount: "",
      redeemablePoints: "",
      pointsToRupees: "",
      rupeeValue: "",
      status: "active"
    })
  }

  function tog_small() {
    setmodal_small(!modal_small)
    if (!modal_small) {
      // Reset edit form when closing modal
      setform1({
        amount: "",
        redeemablePoints: "",
        pointsToRupees: "",
        rupeeValue: "",
        status: "active"
      })
      setEditId(null)
    }
  }

  const [search, setsearch] = useState("")

  const handleSearch = e => {
    const value = e.target.value
    setsearch(value)

    if (value === "") {
      fetchRedeemAmounts()
    } else {
      const filtered = redeemAmounts.filter(item => {
        const amount = item.amount || item.Amount || item.AMOUNT || "";
        const redeemablePoints = item.redeemablePoints || item.redeemablepoints || item.RedeemablePoints || "";
        const pointsToRupees = item.pointsToRupees || item.pointstorupees || item.PointsToRupees || "";
        const rupeeValue = item.rupeeValue || item.rupeevalue || item.RupeeValue || "";
        
        return (
          amount.toString().includes(value) ||
          redeemablePoints.toString().includes(value) ||
          pointsToRupees.toString().includes(value) ||
          rupeeValue.toString().includes(value)
        )
      })
      setRedeemAmounts(filtered)
    }
  }

  // Pagination
  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = redeemAmounts.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(redeemAmounts.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  useEffect(() => {
    fetchRedeemAmounts()
  }, [])

  // Get user roles
  const getRoles = () => {
    try {
      const authUser = localStorage.getItem("authUser")
      const userData = authUser ? JSON.parse(authUser) : {}
      return userData?.rolesAndPermission?.[0] || {}
    } catch (error) {
      console.error("Error getting roles:", error)
      return {}
    }
  }

  const Roles = getRoles()

  // Status badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'warning'
      case 'expired':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Redeem Amount Management" />
          
          <Row>
            {Roles.RedeemAmountAdd || Roles?.accessAll === true ? (
              <Col md={4}>
                <Card>
                  <CardHeader className="bg-white">
                    <CardTitle>Add Redeem Amount</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <Label for="amount">
                          Booking Amount (₹) <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="amount"
                          placeholder="Enter minimum booking amount"
                          required
                          name="amount"
                          value={form.amount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                        <small className="text-muted">Minimum booking amount to earn points</small>
                      </div>

                      <div className="mb-3">
                        <Label for="redeemablePoints">
                          Redeemable Points <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="redeemablePoints"
                          placeholder="Enter redeemable points"
                          required
                          name="redeemablePoints"
                          value={form.redeemablePoints}
                          onChange={handleChange}
                          min="0"
                          step="1"
                        />
                        <small className="text-muted">Points earned on this booking amount</small>
                      </div>

                      <div className="mb-3">
                        <Label for="pointsToRupees">
                          Points for Rupees <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="pointsToRupees"
                          placeholder="Enter points required"
                          required
                          name="pointsToRupees"
                          value={form.pointsToRupees}
                          onChange={handleChange}
                          min="0"
                          step="1"
                        />
                        <small className="text-muted">e.g., 50 points required for redemption</small>
                      </div>

                      <div className="mb-3">
                        <Label for="rupeeValue">
                          Rupee Value (₹) <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="number"
                          className="form-control"
                          id="rupeeValue"
                          placeholder="Enter rupee value"
                          required
                          name="rupeeValue"
                          value={form.rupeeValue}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                        <small className="text-muted">e.g., 50 points = ₹10</small>
                      </div>

                      <div className="mb-3">
                        <Label for="status">
                          Status <span className="text-danger">*</span>
                        </Label>
                        <select
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          required
                          className="form-select"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>

                      <div style={{ float: "right" }}>
                        <Button className="m-1" color="primary" type="submit" disabled={loading}>
                          {loading ? "Submitting..." : "Submit"} <i className="fas fa-check-circle"></i>
                        </Button>
                        <Button className="m-1" color="secondary" type="button" onClick={clearForm}>
                          Clear <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            ) : null}

            <Col md={Roles.RedeemAmountAdd || Roles?.accessAll === true ? 8 : 12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Redeem Amount List</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      {loading && <span className="text-muted">Loading...</span>}
                    </div>
                    <div>
                      <Input
                        type="search"
                        className="form-control"
                        placeholder="Search by amount, points or rupees..."
                        value={search}
                        onChange={handleSearch}
                        style={{ width: "300px" }}
                      />
                    </div>
                  </div>

                  <div className="table-responsive mt-4">
                    <Table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Booking Amount (₹)</th>
                          <th>Redeemable Points</th>
                          <th>Points for Rupees</th>
                          <th>Rupee Value (₹)</th>
                          <th>Conversion</th>
                          <th>Status</th>
                          <th style={{ width: "100px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : lists.length > 0 ? (
                          lists.map((data, index) => {
                            const amount = data.amount || data.Amount || data.AMOUNT || "";
                            const redeemablePoints = data.redeemablePoints || data.redeemablepoints || data.RedeemablePoints || "";
                            const pointsToRupees = data.pointsToRupees || data.pointstorupees || data.PointsToRupees || "";
                            const rupeeValue = data.rupeeValue || data.rupeevalue || data.RupeeValue || "";
                            const status = data.status || data.Status || 'active';
                            const createdAt = data.createdAt || data.createdat || data.CreatedAt || "";
                            const itemId = data._id || data.id || `item-${index}`;
                            
                            // Calculate conversion rate
                            const conversionRate = pointsToRupees && rupeeValue ? 
                              `₹${parseFloat(rupeeValue).toFixed(2)} = ${parseInt(pointsToRupees)} points` : 
                              "N/A";
                            
                            return (
                              <tr key={itemId}>
                                <td>{pagesVisited + index + 1}</td>
                                <td>₹{amount ? parseFloat(amount).toFixed(2) : "0.00"}</td>
                                <td>{redeemablePoints ? parseInt(redeemablePoints).toLocaleString() : "0"} points</td>
                                <td>{pointsToRupees ? parseInt(pointsToRupees).toLocaleString() : "0"} points</td>
                                <td>₹{rupeeValue ? parseFloat(rupeeValue).toFixed(2) : "0.00"}</td>
                                <td>
                                  <small>{conversionRate}</small>
                                </td>
                                <td>
                                  <Badge color={getStatusBadge(status)}>
                                    {status ? status.toUpperCase() : 'ACTIVE'}
                                  </Badge>
                                </td>
                                <td>
                                  {Roles.RedeemAmountEdit || Roles?.accessAll === true ? (
                                    <Button
                                      onClick={() => handleEdit(data)}
                                      className="mr-2"
                                      style={{ padding: "6px", margin: "3px" }}
                                      color="success"
                                      outline
                                      size="sm"
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                  ) : null}
                                  {Roles.RedeemAmountDelete || Roles?.accessAll === true ? (
                                    <Button
                                      onClick={() => handleDelete(data)}
                                      style={{ padding: "6px", margin: "3px" }}
                                      color="danger"
                                      outline
                                      size="sm"
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  ) : null}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No redeem amounts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    {redeemAmounts.length > listPerPage && (
                      <div className="mt-3" style={{ float: "right" }}>
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"pagination"}
                          previousLinkClassName={"previousBttn"}
                          nextLinkClassName={"nextBttn"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Edit Modal */}
        <Modal
          size="md"
          isOpen={modal_small}
          toggle={tog_small}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              Edit Redeem Amount {editId && `(ID: ${editId})`}
            </h5>
            <button
              onClick={tog_small}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSubmit1}>
              <div className="mb-3">
                <Label for="amount1">
                  Booking Amount (₹) <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="amount1"
                  placeholder="Enter minimum booking amount"
                  name="amount"
                  value={form1.amount}
                  onChange={handleChange1}
                  min="0"
                  step="0.01"
                  required
                />
                <small className="text-muted">Minimum booking amount to earn points</small>
              </div>

              <div className="mb-3">
                <Label for="redeemablePoints1">
                  Redeemable Points <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="redeemablePoints1"
                  placeholder="Enter redeemable points"
                  name="redeemablePoints"
                  value={form1.redeemablePoints}
                  onChange={handleChange1}
                  min="0"
                  step="1"
                  required
                />
                <small className="text-muted">Points earned on this booking amount</small>
              </div>

              <div className="mb-3">
                <Label for="pointsToRupees1">
                  Points for Rupees <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="pointsToRupees1"
                  placeholder="Enter points required"
                  name="pointsToRupees"
                  value={form1.pointsToRupees}
                  onChange={handleChange1}
                  min="0"
                  step="1"
                  required
                />
                <small className="text-muted">e.g., 50 points required for redemption</small>
              </div>

              <div className="mb-3">
                <Label for="rupeeValue1">
                  Rupee Value (₹) <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  className="form-control"
                  id="rupeeValue1"
                  placeholder="Enter rupee value"
                  name="rupeeValue"
                  value={form1.rupeeValue}
                  onChange={handleChange1}
                  min="0"
                  step="0.01"
                  required
                />
                <small className="text-muted">e.g., 50 points = ₹10</small>
              </div>

              <div className="mb-3">
                <Label for="status1">
                  Status <span className="text-danger">*</span>
                </Label>
                <select
                  name="status"
                  value={form1.status}
                  onChange={handleChange1}
                  className="form-select"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {editId && (
                <div className="mb-3 alert alert-info">
                  <small>
                    <strong>Editing ID:</strong> {editId}
                    <br />
                    <strong>Note:</strong> Make your changes and click Update.
                  </small>
                </div>
              )}

              {!editId && (
                <div className="mb-3 alert alert-warning">
                  <small>
                    <strong>Warning:</strong> No item selected for editing. 
                    Please close this modal and click Edit on an item first.
                  </small>
                </div>
              )}

              <div style={{ float: "right" }}>
                <Button
                  onClick={tog_small}
                  color="danger"
                  type="button"
                  className="me-2"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button 
                  color="primary" 
                  type="submit" 
                  disabled={loading || !editId}
                >
                  {loading ? "Updating..." : "Update"} <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default RedeemAmount