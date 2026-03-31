import React, { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { FaEdit, FaTrash } from "react-icons/fa"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

const Staff = () => {
  const [users, setUsers] = useState([])
  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  // Modal state
  const [modal, setModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editForm, setEditForm] = useState({
    subTotal: "",
    advancePayment: "",
    totalPrice: "",
  })

  var token = JSON.parse(localStorage.getItem("authUser"))?.token

  const toggleModal = () => setModal(!modal)

  const Get = () => {
    axios
      .post(
        URLS.GetPayments,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setUsers(res.data.payments)
      })
  }

  useEffect(() => {
    Get()
  }, [])

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)

  const changePage = ({ selected }) => setPageNumber(selected)

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditForm({
      subTotal: user.subTotal,
      advancePayment: user.advancePayment,
      totalPrice: user.totalPrice,
    })
    toggleModal()
  }

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${URLS.UpdatePayment}/${selectedUser._id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success("Payment details updated successfully!")
      toggleModal()
      Get()
    } catch (error) {
      toast.error("Failed to update payment details.")
      console.error(error)
    }
  }

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`${URLS.DeletePayment}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success("Payment record removed.")
        Get()
      } catch (error) {
        toast.error("Failed to remove payment.")
        console.error(error)
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Payments"
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Order Id</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Coupon Code</th>
                          <th>Transaction Id</th>
                          <th>Sub Total</th>
                          <th>Advance Amount</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <th scope="row">
                              {pageNumber * listPerPage + key + 1}
                            </th>
                            <td>{data.orderId}</td>
                            <td>{data.userName}</td>
                            <td>{data.userPhone}</td>
                            <td>{data.couponCode}</td>
                            <td>{data.transactionId}</td>
                            <td>{parseFloat(data.subTotal).toFixed(2)}</td>
                            <td>
                              {parseFloat(data.advancePayment).toFixed(2)}
                            </td>
                            <td>{parseFloat(data.totalPrice).toFixed(2)}</td>
                            <div className="d-flex justify-content-center gap-2">
                            <Button color="info" size="sm" onClick={() => handleEdit(data)}>
                              <FaEdit />
                            </Button>
                            <Button color="danger" size="sm" onClick={() => handleRemove(data)}>
                              <FaTrash />
                            </Button>
                          </div>                          
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Col sm="12">
                      <div
                        className="d-flex mt-3 mb-1"
                        style={{ float: "right" }}
                      >
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
                          total={lists.length}
                        />
                      </div>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Edit Modal */}
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            Edit Payment Details
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="subTotal">Sub Total</Label>
                <Input
                  type="number"
                  name="subTotal"
                  value={editForm.subTotal}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="advancePayment">Advance Amount</Label>
                <Input
                  type="number"
                  name="advancePayment"
                  value={editForm.advancePayment}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="totalPrice">Total Amount</Label>
                <Input
                  type="number"
                  name="totalPrice"
                  value={editForm.totalPrice}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>
              Save
            </Button>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Staff
