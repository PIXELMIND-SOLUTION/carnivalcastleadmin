import React, { useEffect, useState } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Table,
  Label,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

function DigitalBrochure() {
  const [form, setform] = useState([])

  const [forms, setforms] = useState([])

  const handlechange = e => {
    const myform = { ...forms }
    myform[e.target.name] = e.target.value
    setforms(myform)
  }

  useEffect(() => {
    GetAllBroucher()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetAllBroucher = () => {
    var token = datas
    axios
      .post(
        URLS.GetPriceSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.charges)
        setforms(res.data.charges)
      })
  }

  const [modal_small, setmodal_small] = useState(false)
  function tog_small() {
    setmodal_small(!modal_small)
  }

  const getpopup1 = () => {
    tog_small()
  }

  const submibooking = e => {
    e.preventDefault()

    changstatus()
  }

  const changstatus = () => {
    var token = datas

    const dataArray = {
      transactionCharges: forms.transactionCharges,
      advancePayment: forms.advancePayment,
      comboAdvancePayment: forms.comboAdvancePayment,
      bookingGst: forms.bookingGst,
      foodGst: forms.foodGst,
    }

    axios
      .put(URLS.UpdatPriceSettings, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small(false)
            GetAllBroucher()
            setIsLoading(true)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
            setIsLoading(false)
          }
        }
      )
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Price Settings"
          />
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row>
                    <Col>
                      <div style={{ float: "right" }}>
                      {Roles?.SettingsEdit == true ||
                        Roles?.accessAll == true ? (
                          <>
                        <Button
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit Booking"
                          onClick={() => {
                            getpopup1(form)
                          }}
                          className="mr-5 mb-1 m-1 mt-3"
                          color="success"
                          outline
                        >
                          <i className="bx bx-edit text-dark "></i>
                          <span>Edit Price Settings</span>
                        </Button>  </>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                  </Row>
                      <hr></hr>
                </CardHeader>
                <CardBody>
                  <Row className="d-flex justify-content-center">
                    <Col md={8}>
                      <div>
                        <div className="table-rep-plugin  table-responsive">
                          <Table hover className="table table-bordered mb-4">
                            <thead>
                              <tr className="text-center">
                                <th className="w-50">Transaction Charges</th>
                                <td className="w-50">
                                  {form.transactionCharges}%
                                </td>
                              </tr>
                              <tr className="text-center">
                                <th className="w-50">Advance Amount</th>
                                <td className="w-50">{form.advancePayment}</td>
                              </tr>
                              <tr className="text-center">
                                <th className="w-50">Combo Amount</th>
                                <td className="w-50">{form.comboAdvancePayment}</td>
                              </tr>
                              <tr className="text-center">
                                <th className="w-50">Booking Gst</th>
                                <td className="w-50">{form.bookingGst}%</td>
                              </tr>
                              <tr className="text-center">
                                <th className="w-50">Food Gst</th>
                                <td className="w-50"> {form.foodGst}%</td>
                              </tr>
                            </thead>
                          </Table>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            size="md"
            isOpen={modal_small}
            toggle={() => {
              tog_small()
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="mySmallModalLabel">
                Edit Price Settings
              </h5>
              <button
                onClick={() => {
                  setmodal_small(false)
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                onSubmit={e => {
                  submibooking(e)
                }}
              >
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Transaction Charges %{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Transaction Charges %"
                        value={forms.transactionCharges}
                        name="transactionCharges"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Advance Amount  <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Advance Amount"
                        value={forms.advancePayment}
                        name="advancePayment"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Combo Amount  <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Advance Amount"
                        value={forms.comboAdvancePayment}
                        name="comboAdvancePayment"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Booking Gst %<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Booking Gst %"
                        value={forms.bookingGst}
                        name="bookingGst"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="basicpill-firstname-input1">
                        Food Gst %<span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="number"
                        className="form-control"
                        id="basicpill-firstname-input1"
                        placeholder="Enter Food Gst %"
                        value={forms.foodGst}
                        name="foodGst"
                        onChange={e => {
                          handlechange(e)
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                <hr></hr>
                <div style={{ float: "right" }} className="m-2">
                  <Button className="m-1" color="primary" type="submit">
                    Submit <i className="fas fa-check-circle"></i>
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default DigitalBrochure
