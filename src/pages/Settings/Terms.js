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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

function TermsConditions() {
  const [form, setform] = useState([])

  useEffect(() => {
    GetSettings()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const GetSettings = () => {
    var token = datas

    axios
      .post(
        URLS.GetSetting,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data.policy.termsAndCondition)
      })
  }
  const [modal_small, setmodal_small] = useState(false)
  function tog_small() {
    setmodal_small(!modal_small)
    removeBodyCss()
  }

  const [text1, setText1] = useState([])

  const getpopup1 = forms => {
    setText1(forms)
    tog_small()
  }

  const submibooking = e => {
    e.preventDefault()
    changstatus()
  }

  const changstatus = () => {
    var token = datas

    const dataArray = {
      termsAndCondition: text1,
    }
    axios
      .put(URLS.UpdateTERMSANDCONDITION, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setmodal_small(false)
            GetSettings()
            setIsLoading(true)
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

  
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Terms & Conditions"
          />
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white"></CardHeader>

                <CardBody>
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
                      className="mr-5"
                      color="success"
                      outline
                    >
                      <i className="bx bx-edit text-dark "></i>
                      <span>Edit</span>
                    </Button></>
                        ) : (
                          ""
                        )}
                  </div>
                  <div>
                    <div>
                      <h5>TERMS & CONDITIONS</h5>
                      <div
                        className="mt-5"
                        dangerouslySetInnerHTML={{
                          __html: form,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal
            size="lg"
            isOpen={modal_small}
            toggle={() => {
              tog_small()
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="mySmallModalLabel">
                Edit Terms & Conditions
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

            <Form
              onSubmit={e => {
                submibooking(e)
              }}
            >
              <div className="modal-body">
                <CKEditor
                  editor={ClassicEditor}
                  id="header"
                  data={text1}
                  onReady={editor => {
                    console.log("Editor is ready to use!", editor)
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setText1(data)
                  }}
                />
              </div>

              <hr></hr>
              <div style={{ float: "right" }} className="m-2">
                <Button className="m-1" color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
                <Button
                  onClick={() => {
                    setmodal_small(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
              </div>
            </Form>
          </Modal>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default TermsConditions
