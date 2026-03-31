import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap"

import { withRouter, Link } from "react-router-dom"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// action
import { userForgetPassword } from "../../store/actions"

// import images
import profile from "../../assets/images/profile-img.png"
import logo from "../../assets/images/favicon.png"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { useHistory } from "react-router-dom"

const Compareotp = () => {
  //meta title
  document.title = "Compare OTP "

  const [form, setform] = useState([])
  let history = useHistory()

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
    sessionStorage.setItem("userotp", e.target.value)
  }

  const emaildid = sessionStorage.getItem("eamilid")
  const CompareOtp = () => {
    const emaildata = {
      emailId: emaildid,
      emailOtp: form.emailOtp,
    }

    const dataArray = new FormData()
    dataArray.append("emailOtp", form.emailOtp)
    dataArray.append("_id", emaildid)

    // 885267
    axios
      .post(
        "https://api.paperboys.co.in/v1/paperapi/admin/auth/compareotp",
        dataArray
      )
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            console.log(res.data)
            setform("")
            history.push(
              "/Resetpsw",
              localStorage.setItem(
                "tost",
                "OTP has been verified successfully."
              )
            )
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const formsubmit = e => {
    e.preventDefault()
    CompareOtp()
  }

  const datass = () => {
    const location = localStorage.getItem("tost")
    if (location != "") {
      toast(location)
      localStorage.clear()
    } else {
      localStorage.clear()
    }
  }

  useEffect(() => {
    datass()
  }, [])

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}></Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            style={{ width: "70px" }}
                            src={logo}
                            alt=""
                            className="rounded-circle"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        formsubmit(e)
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">OTP</Label>
                        <Input
                          name="emailOtp"
                          className="form-control"
                          placeholder="Enter OTP"
                          type="number"
                          onChange={e => {
                            handleChange(e)
                          }}
                          value={form.emailOtp}
                          required
                        />
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            OTP
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Carnival Castle Admin. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Digitalraiz
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(Compareotp)
