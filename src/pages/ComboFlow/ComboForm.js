import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { URLS } from "../../Weburls";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
} from "reactstrap"

const ComboForm = () => {
  var gets = localStorage.getItem("authUser")
  var dataa = JSON.parse(gets)
  var datas = dataa.token
  var token = datas
  
  const [totalPrice, setTotalPrice] = useState(
    Number(sessionStorage.getItem("TotalPrice")) || 0
  );
  const [people, setPeople] = useState(sessionStorage.getItem("maxPeople") || "");
  console.log(people);

  const theatermaxseats = Number(sessionStorage.getItem("theatermaxSeating"))

  // Fix: Include decoration field with default value "Yes"
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("data")) || {
      userName: "",
      userEmail: "",
      userPhone: "",
      noOfPersons: "",
      decoration: "Yes", // Default to "Yes" since that's the only option
      bookingSource: "",
      heardFrom: "",
      referredCode: "",
    }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [couponData, setCouponData] = useState([]);
  console.log(couponData);

  const [price, setPrice] = useState(0);
  console.log(price);

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const GetUniqueId = () => {
    axios.post(URLS.GetUnicId, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      }
    });
  };

  const handleCouponChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  const add1 = async () => {
    const dataArray = {
      couponId: couponData.couponCode,
    };

    try {
      const res = await axios.post(URLS.GetCheckCoupon, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast(res.data.message);
        sessionStorage.setItem("couponAmount", res.data.couponAmount);
        sessionStorage.setItem("coupon_Id", res.data.coupon_Id);
        const couponAmount = Number(res.data.couponAmount);
        const amount = Number(sessionStorage.getItem("subtotal"));
        const TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice"));
        console.log(TotalPrice, "TotalPrice");
        console.log(res.data.couponAmount, "res.data.couponAmount");
        var discountAmount;
        if (res.data.couponCodeType === "Percentage") {
          discountAmount = amount * (res.data.couponAmount / 100);
        } else {
          discountAmount = res.data.couponAmount;
        }
        var tamount = amount - discountAmount;
        sessionStorage.setItem("Couponbutton", true);
        sessionStorage.setItem("CouponData", JSON.stringify(res.data));
        sessionStorage.setItem("coupondis", discountAmount);
        sessionStorage.setItem("TotalPrice", tamount);
        setTotalPrice(tamount); // Update state
        console.log(res.data, "couponData");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fix: Ensure decoration has value, default to "Yes" if empty
    const decorationValue = data.decoration || "Yes";

    const dataArray = {
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      noOfPersons: data.noOfPersons,
      decoration: decorationValue, // Use the ensured value
      bookingSource: data.bookingSource,
      heardFrom: data.heardFrom,
      referredCode: data.referredCode,
      theatreId: sessionStorage.getItem("theaterId"),
      time: sessionStorage.getItem("slot"),
      date: sessionStorage.getItem("date"),
      theaterName: sessionStorage.getItem("theaterName"),
      bookingId: sessionStorage.getItem("bookingid"),
      type: sessionStorage.getItem("planType"),
    };

    console.log("Submitting data:", dataArray); // Debug log

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/newadmin/addbooking",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        GetUniqueId();
        console.log(res.data);
        history.push("/combooccassions");
        sessionStorage.setItem("countPeople", data.noOfPersons);
        sessionStorage.setItem("userDetails", JSON.stringify(data));
        sessionStorage.setItem("bookingid", res.data.bookingId);
        sessionStorage.setItem("countPeople", data.noOfPersons);
        sessionStorage.setItem("data", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error("Error submitting booking. Please try again.");
      });
  };

  const handleChange = (e) => {
    let myUser = { ...data };
    myUser[e.target.name] = e.target.value;
    console.log(`${e.target.name}: ${e.target.value}`); // Better debug log
    
    // Calculate the extra price if the number of persons exceeds 'people'
    if (Number(myUser.noOfPersons) > people) {
      const extraPersonPrice = Number(sessionStorage.getItem("extraPersonprice"));
      const extraPrice =
        (Number(myUser.noOfPersons) - people) * extraPersonPrice;
      sessionStorage.setItem("extraPersonperprice", extraPrice);
      setPrice(extraPrice);
      sessionStorage.setItem("TotalPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + extraPrice);

      sessionStorage.setItem("theaterPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + extraPrice);

      sessionStorage.setItem("subtotal", parseFloat(sessionStorage.getItem("theatrePrices")) + extraPrice);
    } else {
      setPrice(0);
      sessionStorage.setItem(
        "extraPersonperprice",
        sessionStorage.getItem("extraPersonprice")
      );
      sessionStorage.setItem("TotalPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + 0);
      sessionStorage.setItem("theaterPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + 0);
      sessionStorage.setItem("subtotal", parseFloat(sessionStorage.getItem("theatrePrices")) + 0);
    }

    setData(myUser);
  };

  useEffect(() => {
    GetTheatersData();
    
    // Fix: Initialize decoration in sessionStorage if not present
    const storedData = JSON.parse(sessionStorage.getItem("data") || "{}");
    if (!storedData.decoration) {
      storedData.decoration = "Yes";
      sessionStorage.setItem("data", JSON.stringify(storedData));
      setData(prev => ({ ...prev, decoration: "Yes" }));
    }
  }, []);

  const history = useHistory();
  const handleClick = () => {
    history.push("/theaters");
  };

  // Calculate totals
  const SubTotaluserprice = (
    parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    parseFloat(sessionStorage.getItem("addons") || 0) +
    parseFloat(sessionStorage.getItem("cakeprice") || 0)
  ).toFixed(2)

  const Totaluserprice = (
    parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    parseFloat(sessionStorage.getItem("addons") || 0) +
    parseFloat(sessionStorage.getItem("cakeprice") || 0) -
    parseFloat(sessionStorage.getItem("couponAmount") || 0)
  ).toFixed(2)

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Combo" />
          <Row>
            <>
              {isLoading === true ? (
                <div
                  className="text-center"
                  style={{
                    backgroundColor: "var(--charcoal-black)",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <h6 style={{ color: "white" }}>Loading...</h6>
                  </div>
                </div>
              ) : (
                <div className="home-page indexsix">
                  <main className="main-wrapper">
                    <section
                      id="parallax"
                      className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
                    >
                      <div className="container"></div>
                    </section>
                    <section
                      className="shop-area p-relative "
                    >
                      <div className="container">
                        <button
                          type="button"
                          className="btn mb-3 bg-primary"
                          onClick={handleClick}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>
                        <div className="row">
                          <div className="col-8">
                            <div className=" p-2 rounded w-100 mx-auto">
                              <div className="row shadow-sm p-2">
                                <div className="col-12">
                                  <h4>Overview</h4>
                                </div>
                                <div className="col-12 col-md-4 d-flex align-items-center mb-2">
                                  <FaMapMarkerAlt
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("theaterName")}, Hyderabad
                                  </span>
                                </div>
                                <div className="col-12 col-md-3 d-flex align-items-center mb-2">
                                  <FaCalendarAlt
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("date")}
                                  </span>
                                </div>
                                <div className="col-12 col-md-5 d-flex align-items-center mb-2">
                                  <FaClock style={{ color: "var(--gold-gradient)" }} />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("slot")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="container mt-2">
                          <form
                            onSubmit={(e) => {
                              handleSubmit(e);
                            }}
                          >
                            <div className="row mb-4 ">
                              {/* Booking Details Form */}
                              <div className="col-md-8 shadow-lg">
                                <div className=" mb-3 mt-4">
                                  <div className="">
                                    <h5 className="card-title">Booking Details</h5>
                                    <div className="row mb-3 mt-3">
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="userName"
                                          className="form-label"
                                        >
                                          Your Name{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="userName"
                                          name="userName"
                                          value={data.userName}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                          required
                                          placeholder="Enter your Your Name"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="numPersons"
                                          className="form-label"
                                        >
                                          Number of Persons{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          className="form-select"
                                          id="numPersons"
                                          name="noOfPersons"
                                          value={data.noOfPersons}
                                          onChange={(e) => handleChange(e)}
                                          required
                                        >
                                          <option value="">No. of Persons</option>
                                          {Array.from({ length: theatermaxseats }, (_, index) => (
                                            <option key={index} value={index + 1}>
                                              {index + 1}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="row mb-3">
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="whatsAppNumber"
                                          className="form-label"
                                        >
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
                                        <label htmlFor="email" className="form-label">
                                          Email Id{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <input
                                          type="email"
                                          className="form-control"
                                          id="userEmail"
                                          required
                                          value={data.userEmail}
                                          name="userEmail"
                                          placeholder="Enter your email"
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className="row mb-3">
                                      {/* Booking Source Dropdown */}
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="bookingSource"
                                          className="form-label"
                                        >
                                          Booking Source{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          className="form-select"
                                          id="bookingSource"
                                          name="bookingSource"
                                          value={data.bookingSource}
                                          onChange={handleChange}
                                          required
                                        >
                                          <option value="">Select booking source</option>
                                          <option value="BingEnjoy">BingEnjoy</option>
                                          <option value="Carnival Castle">Carnival Castle</option>
                                        </select>
                                      </div>

                                      {/* How did you hear about us? Dropdown */}
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="heardFrom"
                                          className="form-label"
                                        >
                                          How did you hear about us?{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          className="form-select"
                                          id="heardFrom"
                                          name="heardFrom"
                                          value={data.heardFrom}
                                          onChange={handleChange}
                                          required
                                        >
                                          <option value="">Select an option</option>
                                          <option value="Facebook">Facebook</option>
                                          <option value="Instagram">Instagram</option>
                                          <option value="Twitter">Twitter</option>
                                          <option value="YouTube">YouTube</option>
                                          <option value="Google Search">Google Search</option>
                                          <option value="Friend/Relative">Friend/Relative</option>
                                          <option value="Advertisement">Advertisement</option>
                                          <option value="Other">Other</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* Referred Code Field */}
                                    <div className="row mb-3">
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="referredCode"
                                          className="form-label"
                                        >
                                          Referred Code
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="referredCode"
                                          name="referredCode"
                                          value={data.referredCode}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                          placeholder="Enter referred code (optional)"
                                        />
                                        <small className="text-muted">
                                          Enter referred code if you have one
                                        </small>
                                      </div>
                                    </div>

                                    <div className="row mb-3">
                                      <div className="col-md-12">
                                        <label
                                          htmlFor="decoration"
                                          className="form-label"
                                        >
                                          Do you want decoration?{" "}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <select
                                          className="form-select"
                                          id="decoration"
                                          name="decoration"
                                          value={data.decoration}
                                          onChange={(e) => {
                                            handleChange(e);
                                          }}
                                          required
                                        >
                                          <option value="Yes">Yes</option>
                                          {/* Comment out No option since backend expects Yes/No but you only want Yes */}
                                          {/* <option value="No">No</option> */}
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
                                            onChange={handleCouponChange}
                                            className="form-control"
                                            id="discountCoupon"
                                            placeholder="Enter coupon code"
                                          />
                                          <button
                                            className="btn btn-primary"
                                            style={{
                                              background: "var(--gold-gradient)",
                                              border: "none",
                                              color: "black",
                                            }}
                                            type="button"
                                            onClick={add1}
                                          >
                                            Apply
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Booking Summary */}
                              <div className="col-lg-4 col-md-5 mb-5">
                                <div
                                  className="position-sticky"
                                  style={{ top: "20px" }}
                                >
                                  <div className="">
                                    <div className="card-body shadow-lg">
                                      <div className="d-flex justify-content-between align-items-center shadow-none mb-2 rounded ">
                                        <div>Total:</div>
                                        <div>
                                          ₹ {Totaluserprice}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shadow-lg mt-3">
                                    <div className="card-body">
                                      <div className="accordion" id="accordionExample">
                                        <div className="accordion-item" style={{border:"none"}}>
                                          <h2
                                            className="accordion-header"
                                            id="headingOne"
                                          >
                                            <button
                                              className="accordion-button"
                                              type="button"
                                              data-bs-toggle="collapse"
                                              data-bs-target="#collapseOne"
                                              aria-expanded="true"
                                              aria-controls="collapseOne"
                                            >
                                              Summary Details
                                            </button>
                                          </h2>
                                          <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
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
                                                  <div>
                                                    Theatre Price ({data.noOfPersons || 0} ppl)
                                                  </div>
                                                  <div>
                                                    ₹
                                                    {Number(
                                                      sessionStorage.getItem("theaterPrice") || 0
                                                    )}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>
                                                    Occasions (
                                                    {sessionStorage.getItem("occasionName") || "None"}
                                                    )
                                                  </div>
                                                  <div>
                                                    ₹
                                                    {sessionStorage.getItem("occprice") || 0}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>Plan Price</div>
                                                  <div>
                                                    ₹
                                                    {sessionStorage.getItem("cakeprice") || 0}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>Sub Total</div>
                                                  <div>
                                                    ₹ {SubTotaluserprice}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>Coupon Amount</div>
                                                  <div>
                                                    - ₹
                                                    {parseFloat(
                                                      sessionStorage.getItem("coupondis") || 0
                                                    ).toFixed(2)}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>Total</div>
                                                  <div> 
                                                    ₹ {Totaluserprice}
                                                  </div>
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
                                    className="btn btn-success w-100 mt-2 bg-primary"
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
                  </main>
                  <ToastContainer />
                </div>
              )}
            </>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComboForm;