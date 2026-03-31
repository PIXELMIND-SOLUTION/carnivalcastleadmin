import React, { useState, useEffect } from "react"
import { CardBody, Container, Row, Col, Card, Button, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"

function RecruitView() {
  const history = useHistory()
  const [form, setform] = useState([])
  const [Products, setProducts] = useState([])
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  useEffect(() => {
    GetTheater()
  }, [])

  const BookingId = sessionStorage.getItem("BookingposId")

  const GetTheater = () => {
    const data = {
      id: BookingId,
    }
    var token = datas
    axios
      .post(URLS.GetByPosId, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setform(res?.data?.orderResult)
        setProducts(res?.data?.orderResult?.products)
      })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="View Pos"
          />

          <Row>
            <Col>
              <Button
                onClick={() => history.goBack()}
                className="mb-3  m-1 "
                style={{ float: "right" }}
                color="primary"
              >
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row>
                    <h5 className="mb-3 text-primary">User Details :</h5>
                    <Row>
                      <Col md={4} className="mt-2 mb-3">
                        <div className="d-flex">
                          <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">User Name</h6>
                            <p className="text-muted fs-14 mb-0">
                              <p className="text-muted fs-14 mb-0">
                                {form?.customerName}
                              </p>
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="mt-2 mb-3">
                        <div className="d-flex">
                          <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">User Phone</h6>
                            <p className="text-muted fs-14 mb-0">
                              {form?.customerPhone}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="mt-2 mb-3">
                        <div className="d-flex">
                          <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">PosName</h6>
                            <p className="text-muted fs-14 mb-0">
                              {form?.adminName || form?.staffName}
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </CardBody>
              </Card>
            </Col>{" "}
          </Row>
          <Row>
            <Col md={6}>
              <Card>
                <CardBody>
                  <h5 className="mb-3 text-primary">Pos Details : </h5>
                  <ul className="list-unstyled mt-4">
                    <li>
                      <div className="d-flex pt-2">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Date - Time</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.date} - {form?.time}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Order No</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.orderNo}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Theater Name</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.theatreName}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Occasion Name</h6>
                          <p className="text-muted fs-14 mb-0">
                            {form?.occasionName}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardBody>
                  <h5 className="text-primary pb-2 "> Payments :</h5>
                  <Table hover className="table table-bordered ">
                    <tbody>
                      <tr className="text-center">
                        <th>Cash Price</th>
                        <td>{form?.cashPrice}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Online Price</th>
                        <td>{form?.onlinePrice}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Payment Type</th>
                        <td>{form?.moneyType}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Gst </th>
                        <td>{form?.gst}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Sub Amount</th>
                        <td>{form?.subAmount}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Total Amount</th>
                        <td>{form?.totalAmount}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <h5 className="text-primary">Pos Details :</h5>
                    <div className="table-rep-plugin mt-3 table-responsive">
                      <Table hover className="table table-bordered mb-4 ">
                        <thead>
                          <tr className="text-center">
                            <th>Sl.No</th>
                            <th>Date/Time</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Products?.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{key + 1}</td>
                              <td>
                                {data?.date} / {data?.time}
                              </td>
                              <td>
                                <a
                                  href={URLS.Base + data?.stockImage}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={URLS.Base + data?.stockImage}
                                    style={{ width: "40px" }}
                                  />
                                </a>
                              </td>
                              <td>{data?.stockName}</td>
                              <td>{data?.quantity}</td>
                              <td>{data?.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default RecruitView
