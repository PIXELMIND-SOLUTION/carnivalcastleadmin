import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Input, Button, Table,Label,Form } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import { URLS } from "../../Url"
import jsPDF from "jspdf"
import "jspdf-autotable"

import axios from "axios"

const Staff = () => {
  const [users, setusers] = useState([])

  const [userInCsv, setuserInCsv] = useState([])

  const [form, setform] = useState([])

  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Get = () => {
    var token = datas
    axios
      .post(
        URLS.GetOrder,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers(res.data.orders)
      })
  }

  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const token = datas
    axios
      .post(
        URLS.GetOrderSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.orders)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  useEffect(() => {
    Get()
  }, [])

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = users.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(users.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const Actinid1 = data => {
    sessionStorage.setItem("BookingposId", data._id)
    history.push("/ViewBookingPos")
  }


  const [filter, setfilter] = useState(false)

  const [filters, setfilters] = useState({
    fromDate: "",
    toDate: "",
  })

  const handleChangeflt = e => {
    let myUser = { ...filters }
    myUser[e.target.name] = e.target.value
    setfilters(myUser)
  }

  const getfilter = e => {
    e.preventDefault()
    GetOrderFiliter()
  }

  const GetOrderFiliter = () => {
    var token = datas
    const data = {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    }

    axios
      .post(URLS.GetOrder, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setusers(res.data.orders)
        hidefilter()
        setfilters({
          fromDate: "",
          toDate: "",
        })
      })
  }

  const hidefilter = () => setfilter(false)

  const csvReport = {
    filename: "Booking Report",
    data: userInCsv,
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A2"
    const orientation = "portrait"
    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(15)
    const headers = [
      [
        "S.No",
        "Event Id",
        "Event Date",
        "Event Time",
        "Name",
        "Phone",
        "Theater Name",
        "Occasion Name",
        "Total Price",
        "Status",
      ],
    ]
    const data = users.map((elt, i) => [
      i + 1,
      elt.orderId,
      elt.date,
      elt.time,
      elt.userName,
      elt.userPhone,
      elt.theatreName,
      elt.occasionName,
      elt.totalPrice,
      elt.status,
    ])
    let content = {
      startY: 50,
      head: headers,
      body: data,
    }
    doc.autoTable(content)
    doc.save("Booking_Report.pdf")
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Pos Bookings"
          />
              {filter ? (
            <>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      getfilter(e)
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
                            onChange={e => {
                              handleChangeflt(e)
                            }}
                            name="fromDate"
                            value={filters.fromDate}
                          />
                        </div>
                      </Col>
                      <Col lg="3">
                        <div className="mb-3">
                          <Label for="basicpill-declaration-input10">
                            To Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            required
                            className="form-control"
                            id="basicpill-Declaration-input10"
                            onChange={e => {
                              handleChangeflt(e)
                            }}
                            name="toDate"
                            value={filters.toDate}
                          />
                        </div>
                      </Col>
                      <Col lg="3">
                        <div className="mt-4">
                          <Button type="submit" className="m-1" color="info">
                            <i className="fas fa-check-circle"></i> search
                          </Button>
                          <Button
                            onClick={hidefilter}
                            className="m-1"
                            color="danger"
                          >
                            <i className="fas fa-times-circle"></i> Cancel
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
                    <Col>
                      <CSVLink {...csvReport}>
                        <button className="btn btn-success me-2" type="submit">
                          <i className="fas fa-file-excel"></i> Excel
                        </button>
                      </CSVLink>
                      <Button
                        type="button"
                        className="btn btn-danger "
                        onClick={exportPDF}
                      >
                        <i className="fas fa-file-pdf"></i> Pdf
                      </Button>
                      <Button
                        className="m-1"
                        onClick={() => {
                          setfilter(!filter)
                        }}
                        color="info"
                      >
                        <i className="fas fa-filter"></i> Filter
                      </Button>
                    </Col>
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={custsearch}
                          type="search"
                          placeholder="Search..."
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
                          <th>Event Date</th>
                          <th>Event Time</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Theater Name</th>
                          <th>Occasion Name </th>
                          <th>Total Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key}>
                            <th scope="row">
                              {(pageNumber - 1) * 5 + key + 6}
                            </th>
                            <td>{data.orderNo}</td>
                            <td>{data.date}</td>
                            <td>{data.time}</td>
                            <td>{data.customerName}</td>
                            <td>{data.customerPhone}</td>
                            <td>{data.theatreName}</td>
                            <td>{data.occasionName}</td>
                            <td>{data.totalAmount}</td>
                            <td>
                            {Roles.posOrdersView  || Roles?.accessAll === true ?<> 
                              <Button
                                onClick={() => {
                                  Actinid1(data)
                                }}
                                size="sm"
                                className="m-1"
                                color="info"
                              >
                                <div className="d-flex ">
                                  <i className="fas fa-eye px-1"></i>
                                  <small>View</small>{" "}
                                </div>
                              </Button></>:""}
                            </td>
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

        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Staff
