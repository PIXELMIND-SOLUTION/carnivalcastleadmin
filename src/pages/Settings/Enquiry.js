import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Input, Button, Table } from "reactstrap"
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
        URLS.GetEnquiry,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setusers(res.data.enquiries)
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
        URLS.GetEnquirySearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setusers(res.data.enquiries)
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
      .delete(URLS.DeleteEnquiry + remid, {
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

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Enquiry" />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
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
                          <th>Name</th>
                          <th>Mobile No</th>
                          <th>Email</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key}>
                            <th scope="row">
                              {(pageNumber - 1) * 5 + key + 6}
                            </th>
                            <td>{data.name}</td>
                            <td>{data.mobileNumber}</td>
                            <td>{data.email}</td>
                            <td>{data.description}</td>
                            <td>
                            {Roles.enquiryDelete  || Roles?.accessAll === true ?<>
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
