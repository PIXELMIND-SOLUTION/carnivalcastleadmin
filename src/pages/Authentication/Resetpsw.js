import PropTypes from "prop-types";
import React, { useState ,useEffect} from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";
import logo from "../../assets/images/favicon.png"
// import images
import profile from "../../assets/images/profile-img.png";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

const Resetpsw = () => {

  //meta title
  document.title = "Reset Password ";

  const [form, setform] = useState([])
  let history = useHistory();

  const handleChange = (e) => {
    let myUser = { ...form };
    myUser[e.target.name] = e.target.value;
    setform(myUser);
  };
  const emaildid = sessionStorage.getItem("eamilid")
  const userotp = sessionStorage.getItem("userotp")

  const CompareOtp = () => {
    const emaildata = {
      email: emaildid,
      newpassword: form.newpassword,
      confirmpassword: form.confirmpassword,
      otp: userotp,
    }

    const dataArray = new FormData()
    dataArray.append("newpassword", form.newpassword)
    dataArray.append("confirmpassword", form.confirmpassword)
    dataArray.append("userId", emaildid)


    axios.post("https://api.paperboys.co.in/v1/paperapi/admin/auth/resetpass", dataArray).then((res) => {
      if (res.status === 200) {
        toast(res.data.message);
        console.log(res.data)
        setform("")
        history.push("/login" ,localStorage.setItem("tost", "The password has been reset successfully. Please login with your new password."))
      }
    },
      (error) => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message);
        }
      }
    )
  }

  const formsubmit = (e) => {
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
                    <Col xs={7}>
                    </Col>
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
                      onSubmit={(e) => { formsubmit(e) }}
                    >
                      {/* <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={(e) => { handleChange(e) }}
                          value={emaildid}
                      
                        />
                      </div> */}
                      <div className="mb-3">
                        <Label className="form-label">New Password</Label>
                        <Input
                          name="newpassword"
                          className="form-control"
                          placeholder="Enter New Password"
                          type="text"
                          required
                          onChange={(e) => { handleChange(e) }}
                          value={form.newpassword}
                        />
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmpassword"
                          className="form-control"
                          placeholder="Enter Confirm Password"
                          type="text"required
                          onChange={(e) => { handleChange(e) }}
                          value={form.confirmpassword}
                        />
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Reset
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
  );
};

export default withRouter(Resetpsw);
