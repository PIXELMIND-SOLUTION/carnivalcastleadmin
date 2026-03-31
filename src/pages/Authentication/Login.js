import PropTypes from "prop-types"
import React, { useState } from "react"
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import { loginUser } from "../../store/actions"
import profile from "assets/images/profile-img.png"
import logo from "assets/images/fav.png"
import newLogo from "./carnival_footer_logo-2-removebg-preview.png"

const Login = props => {
  const dispatch = useDispatch()

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "" || "",
      password: "" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      dispatch(loginUser(values, props.history))
    },
  })

  const { error } = useSelector(state => ({
    error: state.Login.error.message,
  }))

  const [passwordType, setPasswordType] = useState("password")

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text")
      return
    }
    setPasswordType("password")
  }

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
                <div className="bg-primary bg-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-black">
                          Welcome Carnival Castle Admin
                        </h5>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-primary">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle">
                          <img
                            src={newLogo}
                            alt=""
                            className="rounded-circle"
                            height="78"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3" style={{width:"112%"}}>
                        <Label className="form-label">Password</Label>
                        <div className="mb-3 input-group">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            // type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                            type={passwordType}
                          />
                          <div className="input-group-btn">
                            <button
                              type="button"
                              // className="btn btn-outline-light"
                              className="btn btn-primary"
                              onClick={() => {
                                togglePassword()
                              }}
                              style={{ boxShadow: "none" }}
                            >
                              {passwordType === "password" ? (
                                <i
                                  className="fa fa-eye-slash"
                                  aria-hidden="true"
                                />
                              ) : (
                                <i className="fa fa-eye" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>

                      <div className="mt-4 text-center"></div>

                      {/* <div className="mt-4 text-center">
                        <Link to="/ForgetPassword" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div> */}
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Carnival Castle Admin .{" "}
                  <a
                    href="https://digitalraiz.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DigitalRaiz
                  </a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
