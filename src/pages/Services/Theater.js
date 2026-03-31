import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, Button, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { Link, useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

function Ventures() {
  const [Actin, setActin] = useState([])
  const [Searchs, setSearchs] = useState([])
  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)
  const history = useHistory()

  const gets = localStorage.getItem("authUser")
  const data = JSON.parse(gets)
  const datas = data.token
  const Roles = data?.rolesAndPermission[0]

  useEffect(() => {
    GetProducts()
    datass()
  }, [])

  const GetProducts = () => {
    axios
      .post(
        URLS.GetTheater,
        {},
        { headers: { Authorization: `Bearer ${datas}` } }
      )
      .then(res => {
        setActin(res.data.theatres)
      })
  }

  const datass = () => {
    const location = sessionStorage.getItem("tost")
    if (location !== "") {
      toast(location)
      sessionStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }

  const Search = e => {
    let myUser = { ...Searchs }
    myUser[e.target.name] = e.target.value
    setSearchs(myUser)

    axios
      .post(
        URLS.GetTheaterSearch + `${e.target.value}`,
        {},
        { headers: { Authorization: `Bearer ${datas}` } }
      )
      .then(res => {
        setActin(res.data.theatres)
      })
  }

  const manageDelete = data => {
    if (window.confirm("Do you really want to Delete?")) {
      axios
        .delete(URLS.DeleteTheater + data._id, {
          headers: { Authorization: `Bearer ${datas}` },
        })
        .then(
          res => {
            if (res.status === 200) {
              toast(res.data.message)
              GetProducts()
            }
          },
          error => {
            if (error.response?.status === 400) {
              toast(error.response.data.message)
            }
          }
        )
    }
  }

  const Actinid = data => {
    sessionStorage.setItem("Theaterid", data._id)
    history.push("/EditTheater")
  }

  const Actinid1 = data => {
    sessionStorage.setItem("Theaterid", data._id)
    history.push("/ViewTheater")
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = Actin.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Actin.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Theater list" />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    {Roles.theatreListAdd || Roles?.accessAll ? (
                      <Col>
                        <Link to="/AddTheater">
                          <Button color="primary">
                            New Theater <i className="bx bx-plus-circle"></i>
                          </Button>
                        </Link>
                      </Col>
                    ) : null}
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          type="search"
                          name="search"
                          value={Searchs.search}
                          onChange={Search}
                          className="form-control"
                          placeholder="Search.."
                          autoComplete="off"
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4">
                      <thead>
                        <tr className="text-center">
                          <th>SlNo</th>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Batch Type</th>
                          <th>Max People</th>
                          <th>Price</th>
                          <th>Offer Price</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Phone</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <td>{pagesVisited + key + 1}</td>
                            <td>
                              <img
                                src={
                                  Array.isArray(data.image)
                                    ? URLS.Base + data.image[0]
                                    : URLS.Base + data.image
                                }
                                style={{ width: "80px", height: "auto" }}
                                alt="Theater"
                              />
                            </td>
                            <td>{data.name}</td>
                            <td>{data.batchType}</td>
                            <td>{data.maxPeople}</td>
                            <td>{data.price}</td>
                            <td>{data.offerPrice}</td>
                            <td>{data.address?.addressLine1}</td>
                            <td>{data.address?.city}</td>
                            <td>{data.address?.state}</td>
                            <td>{data.address?.phone}</td>
                            <td>
                              {Roles.theatreListEdit || Roles?.accessAll ? (
                                <Button
                                  onClick={() => Actinid(data)}
                                  size="sm"
                                  className="m-1"
                                  outline
                                  color="success"
                                >
                                  <i className="bx bx-edit"></i>
                                </Button>
                              ) : null}
                              {Roles.theatreListView || Roles?.accessAll ? (
                                <Button
                                  onClick={() => Actinid1(data)}
                                  size="sm"
                                  className="m-1"
                                  outline
                                  color="info"
                                >
                                  <i className="fas fa-eye"></i>
                                </Button>
                              ) : null}
                              {Roles.theatreListDelete || Roles?.accessAll ? (
                                <Button
                                  onClick={() => manageDelete(data)}
                                  size="sm"
                                  className="m-1"
                                  color="danger"
                                  outline
                                >
                                  <i className="bx bx-trash"></i>
                                </Button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex mt-3 mb-1" style={{ float: "right" }}>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Ventures
