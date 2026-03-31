import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { URLS } from "../../Weburls"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
} from "reactstrap"

const BookingForm = () => {
  var gets = localStorage.getItem("authUser")
  var data123 = JSON.parse(gets)
  var datas = data123.token
  var token = datas

  const [totalPrice, setTotalPrice] = useState(
    Number(sessionStorage.getItem("TotalPrice")) || 0
  )
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("data")) || {
      bookingSource: "",
      heardFrom: "",
      noOfPersons: "",
      referredCode: "", // Changed from referralCode to referredCode
    }
  )

  console.log(data)
  const [isLoading, setIsLoading] = useState(true)
  const [couponData, setCouponData] = useState([])
  console.log(couponData)
  const [addons, setAddons] = useState(
    JSON.parse(sessionStorage.getItem("adonsJSON")) || []
  )
  console.log(addons)

  const [people, setPeople] = useState(sessionStorage.getItem("maxPeople") || 0)

  const theatermaxseats = Number(sessionStorage.getItem("theatermaxSeating"))

  const [price, setPrice] = useState(0)
  console.log(price)

  // Extra persons calculation
  const [extraPersons, setExtraPersons] = useState(0)
  const [extraPersonAmount, setExtraPersonAmount] = useState(0)

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false)
      }
    })
  }

  const GetUniqueId = () => {
    axios.post(URLS.GetUnicId).then((res) => {
      if (res.status === 200) {
        console.log(res.data)
      }
    })
  }

  const handleCouponChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    // Update the state based on the window width when the component mounts
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768) // Open if width is greater than 768px
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const [discountprice, setdiscountprice] = useState(0)
  const add1 = async () => {
    const dataArray = {
      couponId: couponData.couponCode,
    }

    try {
      const res = await axios.post(URLS.GetCheckCoupon, dataArray)
      if (res.status === 200) {
        toast(res.data.message)
        sessionStorage.setItem("coupon_Id", res.data.coupon_Id)
        const couponAmount = Number(res.data.couponAmount)
        const amount = Number(sessionStorage.getItem("subtotal"))
        const TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice"))
        console.log(TotalPrice, "TotalPrice")
        console.log(res.data.couponAmount, "res.data.couponAmount")
        var discountAmount
        if (res.data.couponCodeType === "Percentage") {
          discountAmount = amount * (res.data.couponAmount / 100)
        } else {
          discountAmount = res.data.couponAmount
        }
        sessionStorage.setItem("couponAmount", discountAmount)
        var tamount = amount - discountAmount
        sessionStorage.setItem("Couponbutton", true)
        sessionStorage.setItem("CouponData", JSON.stringify(res.data))
        setdiscountprice(discountAmount)
        sessionStorage.setItem("coupondis", discountAmount)
        sessionStorage.setItem("TotalPrice", tamount)
        setTotalPrice(tamount) // Update state
        console.log(res.data, "couponData")
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataArray = {
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      noOfPersons: data.noOfPersons,
      bookingSource: data.bookingSource, // Booking source field
      heardFrom: data.heardFrom, // How did you hear about us field
      referredCode: data.referredCode, // Changed from referralCode to referredCode
      subTotal: sessionStorage.getItem("subtotal"),
      theatreId: sessionStorage.getItem("theaterId"),
      bookingId: sessionStorage.getItem("bookingid"),
      time: sessionStorage.getItem("slot"),
      date: sessionStorage.getItem("date"),
      theaterName: sessionStorage.getItem("theaterName"),
      type: sessionStorage.getItem("planType"),
    }

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/newadmin/addbooking",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        GetUniqueId()
        console.log(res.data)
        history.push("/occations")
        sessionStorage.setItem("userDetails", JSON.stringify(data))
        sessionStorage.setItem("bookingid", res.data.bookingId)
        sessionStorage.setItem("countPeople", data.noOfPersons)
        sessionStorage.setItem("adonsJSON", JSON.stringify([]))
        sessionStorage.setItem("data", JSON.stringify(data))
      })
  }

  const handleChange = (e) => {
    let myUser = { ...data }
    myUser[e.target.name] = e.target.value
    console.log(myUser.noOfPersons)

    const enteredPersons = Number(myUser.noOfPersons) || 0
    const maxPeople = Number(people) || 0

    // Calculate extra persons
    if (enteredPersons > maxPeople) {
      const extraPersonsCount = enteredPersons - maxPeople
      setExtraPersons(extraPersonsCount)

      const extraPersonPrice = parseFloat(
        sessionStorage.getItem("extraPersonprice") || 0
      )
      const extraPrice = extraPersonsCount * extraPersonPrice
      setExtraPersonAmount(extraPrice)

      sessionStorage.setItem("extraPersonperprice", parseFloat(extraPrice))
      sessionStorage.setItem("extraPersons", extraPersonsCount)

      // Update total price with extra persons
      const theatrePrice = parseFloat(sessionStorage.getItem("theatrePrices") || 0)
      const occprice = parseFloat(sessionStorage.getItem("occprice") || 0)
      const cakeprice = parseFloat(sessionStorage.getItem("cakeprice") || 0)
      const addonsPrice = parseFloat(sessionStorage.getItem("addons") || 0)
      const couponDiscount = parseFloat(sessionStorage.getItem("coupondis") || 0)

      const newTheatrePrice = theatrePrice + extraPrice
      const subtotal = theatrePrice + extraPrice + occprice + cakeprice + addonsPrice
      const totalPrice = subtotal - couponDiscount

      sessionStorage.setItem("theaterPrice", newTheatrePrice)
      sessionStorage.setItem("subtotal", subtotal)
      sessionStorage.setItem("TotalPrice", totalPrice)

      setPrice(extraPrice)
    } else {
      setExtraPersons(0)
      setExtraPersonAmount(0)
      setPrice(0)
      sessionStorage.setItem("extraPersonperprice", 0)
      sessionStorage.setItem("extraPersons", 0)

      const theatrePrice = parseFloat(sessionStorage.getItem("theatrePrices") || 0)
      const occprice = parseFloat(sessionStorage.getItem("occprice") || 0)
      const cakeprice = parseFloat(sessionStorage.getItem("cakeprice") || 0)
      const addonsPrice = parseFloat(sessionStorage.getItem("addons") || 0)
      const couponDiscount = parseFloat(sessionStorage.getItem("coupondis") || 0)

      const subtotal = theatrePrice + occprice + cakeprice + addonsPrice
      const totalPrice = subtotal - couponDiscount

      sessionStorage.setItem("theaterPrice", theatrePrice)
      sessionStorage.setItem("subtotal", subtotal)
      sessionStorage.setItem("TotalPrice", totalPrice)
    }

    sessionStorage.setItem("extraAddedPersonsForTheatre", myUser.noOfPersons)
    setData(myUser)
  }

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

  useEffect(() => {
    GetTheatersData()
  }, [])

  const history = useHistory()
  const handleClick = () => {
    history.push("/theaters")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Basic" />
          <Row>
            <>
              {isLoading === true ? (
                <div
                  className="text-center"
                  style={{
                    backgroundColor: "var(--charcoal-black)",
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
                    <section className="shop-area p-relative ">
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
                            <div className="p-2 rounded w-100 mx-auto ">
                              <div className="row shadow-sm p-2">
                                <div className="col-12">
                                  <h4>Overview</h4>
                                </div>
                                <div className="col-12 col-md-4 d-flex align-items-center mb-2">
                                  <FaMapMarkerAlt
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
                                  <span className="ms-2">
                                    {sessionStorage.getItem("theaterName")},
                                    Hyderabad
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
                                  <FaClock
                                    style={{ color: "var(--gold-gradient)" }}
                                  />
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
                              handleSubmit(e)
                            }}
                          >
                            <div className="row">
                              {/* Booking Details Form */}
                              <div className="col-md-8 shadow-lg mb-5">
                                <div className=" mb-3 mt-4">
                                  <div className="">
                                    <h5 className="card-title">
                                      Booking Details
                                    </h5>
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
                                            handleChange(e)
                                          }}
                                          required
                                          placeholder="Enter Your Name"
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
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="numPersons"
                                          name="noOfPersons"
                                          value={data.noOfPersons}
                                          onChange={handleChange}
                                          required
                                          min="1"
                                          max={theatermaxseats}
                                          placeholder="Enter number of persons"
                                        />
                                        <small className="text-muted">
                                          Maximum capacity: {theatermaxseats}{" "}
                                          persons
                                        </small>
                                        {extraPersons > 0 && (
                                          <div className="mt-2 text-warning">
                                            <small>
                                              Extra {extraPersons} person(s) added
                                            </small>
                                          </div>
                                        )}
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
                                          type="text"
                                          className="form-control"
                                          maxLength="10"
                                          minLength="10"
                                          pattern="[6789][0-9]{9}"
                                          id="userPhone"
                                          name="userPhone"
                                          value={data.userPhone}
                                          placeholder="Enter your phone number"
                                          onChange={(e) => {
                                            handleChange(e)
                                          }}
                                          required
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label
                                          htmlFor="email"
                                          className="form-label"
                                        >
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
                                            handleChange(e)
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
                                          className="form-control"
                                          id="bookingSource"
                                          name="bookingSource"
                                          value={data.bookingSource}
                                          onChange={handleChange}
                                          required
                                        >
                                          <option value="">
                                            Select booking source
                                          </option>
                                          <option value="BingEnjoy">
                                            BingEnjoy
                                          </option>
                                          <option value="Carnival Castle">
                                            Carnival Castle
                                          </option>
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
                                          className="form-control"
                                          id="heardFrom"
                                          name="heardFrom"
                                          value={data.heardFrom}
                                          onChange={handleChange}
                                          required
                                        >
                                          <option value="">Select an option</option>
                                          <option value="Instagram">
                                            Instagram
                                          </option>
                                             <option value="Google Search">
                                            Google Search
                                          </option>
                                            <option value="Friend/Relative">
                                            Friend/Relative
                                          </option>
                                         <option value="Facebook">Facebook</option>

                                          <option value="YouTube">YouTube</option>
                                          <option value="Others Source">Others Source</option>
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
                                            handleChange(e)
                                          }}
                                          placeholder="Enter referred code (optional)"
                                        />
                                        <small className="text-muted">
                                          Enter referred code if you have one
                                        </small>
                                      </div>
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
                                          value={couponData.couponCode || ""}
                                        />
                                        <button
                                          className="btn btn-primary"
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

                              {/* Booking Summary */}
                              <div className="col-lg-4 col-md-5 mb-5">
                                <div
                                  className="position-sticky "
                                  style={{ top: "20px" }}
                                >
                                  <div className="">
                                    <div className="card-body shadow-lg">
                                      <div className="d-flex justify-content-between align-items-center shadow-none rounded ">
                                        <div>Total:</div>
                                        <div>₹ {Totaluserprice}</div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shadow-lg mt-3">
                                    <div className="card-body">
                                      <div
                                        className="accordion"
                                        id="accordionExample"
                                      >
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
                                                    Theatre Price (
                                                    {data.noOfPersons || 0} ppl)
                                                  </div>
                                                  <div>
                                                    ₹
                                                    {Number(
                                                      sessionStorage.getItem(
                                                        "theaterPrice"
                                                      ) || 0
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Show extra persons details if any */}
                                                {extraPersons > 0 && (
                                                  <>
                                                    <hr />
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                        color: "#ff9800",
                                                      }}
                                                    >
                                                      <div>
                                                        Added Persons (
                                                        {extraPersons} person
                                                        {extraPersons > 1
                                                          ? "s"
                                                          : ""}
                                                        )
                                                      </div>
                                                      <div>₹{extraPersonAmount}</div>
                                                    </div>
                                                  </>
                                                )}

                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>
                                                    Occasions (
                                                    {sessionStorage.getItem(
                                                      "occasionName"
                                                    )}
                                                    )
                                                  </div>
                                                  <div>
                                                    ₹
                                                    {sessionStorage.getItem(
                                                      "occprice"
                                                    ) || 0}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                  }}
                                                >
                                                  <div>Cake</div>
                                                  <div>
                                                    ₹
                                                    {sessionStorage.getItem(
                                                      "cakeprice"
                                                    ) || 0}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginBottom: "8px",
                                                  }}
                                                >
                                                  <div>Addons</div>
                                                  <div>
                                                    ₹
                                                    {sessionStorage.getItem(
                                                      "addons"
                                                    ) || 0}
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
                                                  <div>₹ {SubTotaluserprice}</div>
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
                                                      sessionStorage.getItem(
                                                        "coupondis"
                                                      ) || 0
                                                    ).toFixed(2)}
                                                  </div>
                                                </div>
                                                <hr />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  <div>Total Amount</div>
                                                  <div>₹ {Totaluserprice}</div>
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
                  </main>
                  <ToastContainer />
                </div>
              )}
            </>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default BookingForm