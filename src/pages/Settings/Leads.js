import React, { useEffect, useState } from "react"
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
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

const Staff = () => {
  const [users, setusers] = useState([])

  const [form, setform] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const Get = () => {
    var token = datas
    axios
      .post(
        URLS.GetLead,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers(res.data.leads)
      })
  }

  const custsearch = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)

    const token = datas
    console.log(token)
    axios
      .post(
        URLS.GetLeadSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.leads)
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

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = datau => {
    var token = datas
    var remid = datau._id
    axios
      .delete(URLS.DeleteLead + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
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
      .post(URLS.GetLead, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setusers(res.data.leads)
        hidefilter()
        setfilters({
          fromDate: "",
          toDate: "",
        })
      })
  }

  const hidefilter = () => setfilter(false)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];


  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Lead" />
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
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Theater Name</th>
                          <th>Name</th>
                          <th>Mobile No</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <th scope="row">
                              {(pageNumber - 1) * 5 + key + 6}
                            </th>
                            <td>{data.date}</td>
                            <td>{data.time}</td>
                            <td>{data.theatreName}</td>
                            <td>{data.name}</td>
                            <td>{data.phone}</td>
                            <td>{data.email}</td>
                            <td>
                            {Roles.leadsDelete  || Roles?.accessAll === true ?<>
                              <Button
                                size="sm"
                                className="m-1"
                                outline
                                color="danger"
                                onClick={() => {
                                  manageDelete(data)
                                }}
                              >
                                <i
                                  style={{ fontSize: " 14px" }}
                                  className="bx bx-trash"
                                ></i>
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
