import React, { useState, useEffect } from "react"
import { CardBody, Container, Row, Col, Card, Button, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { Link, useHistory } from "react-router-dom"
import { URLS } from "../../Url"

function City() {
  const [Actin, setActin] = useState([])
  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(20)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    GetHospitals()
    datass()
  }, [])

  const GetHospitals = () => {
    var token = datas
    axios
      .post(
        URLS.GetRole,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setActin(res.data.roles)
        // setIsLoading(false)
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = Actin.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Actin.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const datass = () => {
    const location = sessionStorage.getItem("tost")
    if (location != "") {
      toast(location)
      sessionStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to InActive?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteRole + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetHospitals()
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

  const RoleId = data => {
    sessionStorage.setItem("Roleids", data._id)
    history.push("/EditRoles")
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Roles" />
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  {/* <Col>
                    <Link to="/AddRoles">
                      <Button color="primary">
                        Add Role <i className="bx bx-plus-circle"></i>
                      </Button>
                    </Link>
                  </Col> */}
                   <Col>
                    {Roles?.rolesAndPermissionAdd == true ||
                    Roles?.accessAll == true ? (
                      <>
                        <Link to="/AddRoles">
                          <Button color="primary">
                            Add Role <i className="bx bx-plus-circle"></i>
                          </Button>
                        </Link>
                      </>
                    ) : (
                      ""
                    )}
                  </Col>
                  <div>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-2 mt-3">
                        <thead>
                          <tr className="text-center">
                            <th>S No</th>
                            <th>Role Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{(pageNumber - 1) * 20 + key + 21}</td>
                              <td>{data.roleName}</td>
                              <td>
                              {Roles?.rolesAndPermissionEdit == true ||
                                Roles?.accessAll == true ? (
                                  <>
                                <Button
                                  onClick={() => {
                                    RoleId(data)
                                  }}
                                  className="m-1 btn-sm"
                                  color="success"
                                  outline
                                >
                                  <i className="bx bx-edit "></i> 
                                </Button>
                                </>
                                ) : (
                                  ""
                                )}
                                      {Roles?.rolesAndPermissionDelete == true ||
                                Roles?.accessAll == true ? (
                                  <>
                                <Button
                                  onClick={() => {
                                    manageDelete(data)
                                  }}
                                  className="m-1 btn-sm"
                                  color="danger"
                                  outline
                                >
                                  <i className="bx bx-trash"></i> 
                                </Button>
                                </>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
                          total={lists.length}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default City
