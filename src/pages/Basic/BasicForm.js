import React, { useEffect, useState } from "react"
import axios from "axios";
import {Container,} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"
import { useHistory } from 'react-router-dom';


const BasicForm = () => {
  var gets = localStorage.getItem("authUser")
  var datass = JSON.parse(gets)
  var datas = datass.token

  const [openAccordion, setOpenAccordion] = useState(true)

  const handleAccordionToggle = () => {
    setOpenAccordion(!openAccordion)
  }

  const [data, setData] = useState([])
  console.log(data, "Data")

  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataArray = {
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      noOfPersons: data.noOfPersons,
      decoration: data.decoration,
    };
    axios
      .post(
       "https://api.carnivalcastle.com/v1/carnivalApi/newadmin/booking/addbooking",
        dataArray,
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        history.push("/Occassions");                // Occassions
        localStorage.setItem("userDetails", JSON.stringify(data));
        localStorage.setItem("bookingid", res.data.bookingId);
        localStorage.setItem("countPeople", data.noOfPersons);
        localStorage.setItem("adonsJSON", JSON.stringify([]));
        localStorage.setItem("data", JSON.stringify(data));
      });
  };

  const handleChange = (e) => {
    let myUser = { ...data };
    myUser[e.target.name] = e.target.value;
    setData(myUser);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Basic Form"
          />
          <section
            className="shop-area p-relative" >
            <div className="container">
              <button type="button" className="btn btn-primary mb-3" onClick={() => history.push("/AddBooking")}>
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </button>
              <div className="row">
                <div className="col-8">
                  <div className="shadow-sm p-3 rounded mb-3">
                    <div className="row">
                      <div className="col-12">
                        <h4>Overview</h4>
                      </div>
                      <div className="col-12 col-md-4 d-flex align-items-center mb-2">
                        <FaMapMarkerAlt
                          style={{ color: "var(--gold-gradient)" }}
                        />
                        <span className="ms-2">Theater Name, Hyderabad</span>
                      </div>
                      <div className="col-12 col-md-3 d-flex align-items-center mb-2">
                        <FaCalendarAlt
                          style={{ color: "var(--gold-gradient)" }}
                        />
                        <span className="ms-2">Date</span>
                      </div>
                      <div className="col-12 col-md-5 d-flex align-items-center mb-2">
                        <FaClock style={{ color: "var(--gold-gradient)" }} />
                        <span className="ms-2">Slot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <form
                 onSubmit={(e) => {
                  handleSubmit(e);
                }}
                >
                  <div className="row mb-4">
                    {/* Booking Details Form */}
                    <div className="col-md-8 shadow-lg p-3 rounded mb-4">
                      <div className="mb-3 mt-4">
                        <h5 className="card-title">Booking Details</h5>
                        <div className="row mb-3 mt-3">
                          <div className="col-md-6">
                            <label htmlFor="userName" className="form-label">
                              Your Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control shadow-sm"
                              id="userName"
                              name="userName"
                              value={data.userName}
                              placeholder="Enter your name"
                              onChange={e => {
                                handleChange(e)
                              }}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="numPersons" className="form-label">
                              Number of Persons{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="numPersons"
                              name="noOfPersons"
                              value={data.noOfPersons}
                              onChange={e => handleChange(e)}
                              required
                            >
                              <option value="">No. of Persons</option>
                              {Array.from({ length: 10 }, (_, index) => (
                                <option key={index} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label htmlFor="userPhone" className="form-label">
                              Mobile Number{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                                  type="tel"
                                  className="form-control"
                                  maxLength={10}
                                  minLength={10}
                                  pattern="[6789][0-9]{9}"
                                  required
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                  }}
                                  id="userPhone"
                                  name="userPhone"
                                  value={data.userPhone}
                                  placeholder="Enter your phone number"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="userEmail" className="form-label">
                              Email Id <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="userEmail"
                              required
                              value={data.userEmail}
                              name="userEmail"
                              placeholder="Enter your email"
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-12">
                            <label htmlFor="decoration" className="form-label">
                              Do you want decoration?{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="decoration"
                              name="decoration"
                              value={data.decoration}
                              onChange={e => {
                                handleChange(e)
                              }}
                              required
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className="col-md-12 mt-3 mb-5">
                            <label
                              htmlFor="discountCoupon"
                              className="form-label"
                            >
                              Discount Coupon
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                name="couponCode"
                                className="form-control shadow-sm"
                                id="discountCoupon"
                                placeholder="Enter coupon code"
                                readOnly
                              />
                              <button
                                className="btn btn-outline-primary"
                                type="button"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="col-lg-4 col-md-5">
                      <div className="position-sticky" style={{ top: "20px" }}>
                        <div className="mb-3">
                          <div className="card-body shadow-lg">
                            <div className="d-flex justify-content-between align-items-center rounded">
                              <div>Total:</div>
                              <div>₹1100</div>
                            </div>
                          </div>
                        </div>
                        <div className="shadow-lg">
                          <div className="card-body">
                            <div className="accordion" id="accordionExample">
                              <div
                                className="accordion-item"
                                style={{ border: "none" }}
                              >
                                <h2
                                  className="accordion-header"
                                  id="headingOne"
                                >
                                  <button
                                    className="accordion-button"
                                    type="button"
                                    onClick={handleAccordionToggle}
                                    aria-expanded={openAccordion}
                                    aria-controls="collapseOne"
                                    style={{
                                      outline: "none",
                                      boxShadow: "none",
                                      border: "none",
                                      background: "transparent",
                                    }}
                                  >
                                    Summary Details
                                  </button>
                                </h2>
                                <div
                                  id="collapseOne"
                                  className={`accordion-collapse collapse ${
                                    openAccordion ? "show" : ""
                                  }`}
                                  aria-labelledby="headingOne"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body">
                                    <div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Theatre Price (1 ppl)</div>
                                        <div>₹1000</div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Occasions (Birthday)</div>
                                        <div>₹0</div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Cake</div>
                                        <div>-</div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Sub Total</div>
                                        <div>₹1100</div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Coupon Amount</div>
                                        <div>₹100</div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Total Amount</div>
                                        <div>₹1000</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100 mt-2"
                          style={{
                            boxShadow: "none",
                            color: "black",
                            border: "none",
                          }}
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default BasicForm
