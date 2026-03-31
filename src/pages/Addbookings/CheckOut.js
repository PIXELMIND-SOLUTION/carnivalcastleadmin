import React, { useState, useEffect } from "react"
import { Row, Col, Button } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url1"
import axios from "axios"

function CheckOut() {
  const history = useHistory()
  const [form1, setForm1] = useState({})
  const [gst, setGst] = useState(0)
  const [advanceAmount, setAdvanceAmount] = useState(0)
  const [onlines, setOnline] = useState("online")
  console.log(onlines)

  const [cakes2, setCakes2] = useState([])

  useEffect(() => {
    getOneGst()
    PlanCategoriesId()
  }, [])

  const selectedCakeData = JSON.parse(
    sessionStorage.getItem("selectedcakedata")
  )

  const margeaddonsData = [selectedCakeData, ...cakes2]
  console.log(margeaddonsData)

  const PlanCategoriesId = () => {
    const myaddonsdata = sessionStorage.getItem("PlanId")
    axios.post(URLS.GetByPlanIdProducts, { planId: myaddonsdata }).then(
      res => {
        if (res.status === 200) {
          const selectedCaketype = res?.data?.planProducts.filter(
            cake => cake.categoryName !== "cakes"
          )
          setCakes2(selectedCaketype)
        }
      },
      error => {
        if (error.response && error.response.status === 400) {
        }
      }
    )
  }

  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {})
      if (res.status === 200) {
        setGst(Number(res.data.charges.bookingGst))
        setAdvanceAmount(Number(res.data.charges.advancePayment))
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setGst(0)
      }
    }
  }

  const handleChange1 = e => {
    setForm1({
      ...form1,
      [e.target.name]: e.target.value,
    })
  }

  const add1 = async () => {
    const dataArray = {
      couponId: form1.couponCode,
      amount: productsValuePrice,
    }

    try {
      const res = await axios.post(URLS.GetCheckCoupon, dataArray)
      if (res.status === 200) {
        toast(res.data.message)
        sessionStorage.setItem("couponAmount", res.data.couponAmount)
        sessionStorage.setItem("coupon_Id", res.data.coupon_Id)
        const couponAmount = Number(res.data.couponAmount)
        const amount = Number(sessionStorage.getItem("totalprice"))
        const discount = amount - couponAmount
        sessionStorage.setItem("Couponbutton", true)
        sessionStorage.setItem("coupondis", discount)
        window.location.reload()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message)
      }
    }
  }

  const formSubmit1 = e => {
    e.preventDefault()
    add1()
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const productsValue = JSON.parse(sessionStorage.getItem("cart"))
  const userData = JSON.parse(sessionStorage.getItem("form"))
  const productsValuePrice = Number(sessionStorage.getItem("totalprice"))
  const couponButton = sessionStorage.getItem("Couponbutton")
  const couponType = sessionStorage.getItem("coupon_Id")
  const couponDiscount = Number(sessionStorage.getItem("couponAmount"))
  const totalPrices = Number(sessionStorage.getItem("coupondis"))

  const gstAmount = (totalPrices * gst) / 100

  const [totalAmountOption, setTotalAmountOption] = useState("fullpayment")

  // Conditional total amount calculation
  const remainingAmount =
    totalAmountOption === "fullpayment" ? 0 : totalPrices - advanceAmount

  const totalAmount = totalPrices
  const remainingAmountFixed = remainingAmount.toFixed(2)
  const totalAmountFixed = totalAmount.toFixed(2)
  const displayedAdvanceAmount =
    totalAmountOption === "fullpayment" ? 0 : advanceAmount

  const addBooking = async () => {
    const totalInPaise =
      totalAmountOption === "fullpayment"
        ? parseInt(totalAmountFixed) * 100
        : parseInt(advanceAmount) * 100

    const options = {
      key: "rzp_test_HJG5Rtuy8Xh2NB",
      amount: totalInPaise,
      currency: "INR",
      name: "Carnival Castle",
      description: "Carnival Castle Transaction",
      image: "https://carnivalcastle.com/static/images/logo-text.webp",
      handler: async response => {
        var token = datas

        const dataArrays = {
          transactionId: response.razorpay_payment_id,
          paymentType: totalAmountOption,
          cashType: onlines,
          transactionStatus: "completed",
          theatreId: sessionStorage.getItem("Theaterid"),
          couponId: sessionStorage.getItem("coupon_Id"),
          couponAmount: sessionStorage.getItem("couponAmount"),
          planId: sessionStorage.getItem("PlanId"),
          productId: sessionStorage.getItem("cakeunicid"),
          // id: sessionStorage.getItem("Id"),
          occasionId: sessionStorage.getItem("OccationId"),
          userId: sessionStorage.getItem("UserId"),
          personName: userData.personName,
          userName: userData.name,
          userEmail: userData.email,
          userPhone: userData.userPhone,
          date: sessionStorage.getItem("date"),
          // time: userData.time,
          time: convertTo12HourFormat(userData.time),
          type: userData.type,
          couponId: couponType,
          couponDiscount: Number(couponDiscount),
          subTotal: Number(productsValuePrice),
          advancePayment: Number(displayedAdvanceAmount),
          remainingAmount: Number(remainingAmountFixed),
          totalPrice: Number(totalAmount),
          products: productsValue,
          // gst: Number(gst),
          noOfPersons: Number(userData.NoofPersons),
        }

        try {
          const res = await axios.post(URLS.AddBookings, dataArrays, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.status === 200) {
            toast(res.data.message)
            history.push("/PendingBookings")
            sessionStorage.clear()
            // sessionStorage.setItem("Id", res.data.bookingId)
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      },
      prefill: {
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
        contact: sessionStorage.getItem("phone"),
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#015A65",
      },
    }
    const rzp1 = new window.Razorpay(options)
    rzp1.open()
  }
  
  const cashaddBooking = async () => {
    const totalInPaise =
      totalAmountOption === "fullpayment"
        ? parseInt(totalAmountFixed) * 100
        : parseInt(advanceAmount) * 100

    var token = datas

    const dataArrays = {
      transactionId: null,
      paymentType: totalAmountOption,
      cashType: "cash",
      transactionStatus: "completed",
      theatreId: sessionStorage.getItem("Theaterid"),
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: sessionStorage.getItem("couponAmount"),
      planId: sessionStorage.getItem("PlanId"),
      productId: sessionStorage.getItem("cakeunicid"),
      // id: sessionStorage.getItem("Id"),
      occasionId: sessionStorage.getItem("OccationId"),
      userId: sessionStorage.getItem("UserId"),
      personName: userData.personName,
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.userPhone,
      date: sessionStorage.getItem("date"),
      // time: userData.time,
      time: convertTo12HourFormat(userData.time),
      type: userData.type,
      couponId: couponType,
      couponDiscount: Number(couponDiscount),
      subTotal: Number(productsValuePrice),
      advancePayment: Number(displayedAdvanceAmount),
      remainingAmount: Number(remainingAmountFixed),
      totalPrice: Number(totalAmount),
      products: productsValue,
      // gst: Number(gst),
      noOfPersons: Number(userData.NoofPersons),
    }

    try {
      const res = await axios.post(URLS.AddBookings, dataArrays, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 200) {
        toast(res.data.message)
        history.push("/PendingBookings")
        sessionStorage.clear()
        // sessionStorage.setItem("Id", res.data.bookingId)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message)
      }
    }
  }

  const formSubmit3 = e => {
    e.preventDefault()
    if (onlines === "cash") {
      cashaddBooking()
    } else {
      addBooking()
    }
  }

  const handleCashOptionClick = e => {
    setOnline(e.target.value)
    //toast("Payment received via cash.")
    //history.push("/PendingBookings")
  }

  const convertTo12HourFormat = time24 => {
    const [startTime, EndTime] = time24.split("/")

    const [hours, minutes] = startTime.split(":")
    let hours12 = hours % 12 || 12
    const period = hours < 12 ? "AM" : "PM"

    const [ehours, eminutes] = EndTime.split(":")
    let ehours12 = ehours % 12 || 12
    const eperiod = ehours < 12 ? "AM" : "PM"
    return `${hours12}:${minutes} ${period} - ${ehours12}:${eminutes} ${eperiod}`
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Theater list"
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
          <section>
            <div className="content">
              <div className="container-md">
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="">
                      <div className="">
                        <div className="info-widget">
                          <h3
                            className="card-title mb-3"
                            style={{ color: "#A020F0" }}
                          >
                            Booking Information
                          </h3>
                          <div className="row">
                            <div className="col-md-8 col-sm-12">
                              <div className="card">
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                      <div>
                                        <h5 className="mt-4 mb-3">
                                          Information :-
                                        </h5>
                                        <hr></hr>
                                        <div className="row">
                                          <div className="col-md-6">
                                            <div className="profile-info-widget">
                                              <div className="profile-det-info">
                                                <h6 className="pt-2">
                                                  <b>Date:</b>{" "}
                                                  {sessionStorage.getItem(
                                                    "date"
                                                  )}
                                                </h6>
                                                <h6 className="pt-2">
                                                  <b>Time Slot :</b>{" "}
                                                  {convertTo12HourFormat(
                                                    userData.time
                                                  )}
                                                </h6>
                                                <h6 className="pt-2">
                                                  <b>No Of Persons : </b>
                                                  {userData.NoofPersons}
                                                </h6>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-6 ">
                                            <h6 className="pt-2">
                                              <b> Name : </b>
                                              <span>{userData.name}</span>
                                            </h6>
                                            <h6 className="pt-2">
                                              <b>Phone : </b>{" "}
                                              <span>{userData.userPhone}</span>
                                            </h6>
                                            <h6 className="pt-2">
                                              <b> Email : </b>{" "}
                                              <span>{userData.email}</span>
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <hr></hr>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="profile-info-widget">
                                        <div className="profile-det-info">
                                          <h6 className="pt-2">
                                            <b>Theater Name:</b>{" "}
                                            {sessionStorage.getItem(
                                              "theatreName"
                                            )}
                                          </h6>
                                          <h6 className="pt-2">
                                            <b>Occasion Name :</b>{" "}
                                            {sessionStorage.getItem(
                                              "occasionName"
                                            )}
                                          </h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 ">
                                      <h6 className="pt-2">
                                        <b> Theater Price : </b>
                                        {sessionStorage.getItem("theatrePrice")}
                                      </h6>
                                      <h6 className="pt-2">
                                        <b>Occasion Price : </b>{" "}
                                        {sessionStorage.getItem(
                                          "occasionPrice"
                                        )}
                                      </h6>
                                    </div>
                                  </div>
                                  <hr></hr>
                                  <div>
                                    <h5 className="mt-4 mb-3">Add Ons :-</h5>
                                    <div>
                                      <div>
                                        <div className="table-responsive">
                                          <table className="table table-border tm-checkout-ordertable">
                                            <thead>
                                              <tr className="text-center">
                                                <th>S.No</th>
                                                <th>Product Name</th>
                                                {/* <th>Product Quantity</th> */}
                                                <th>Unit Price</th>
                                                {/* <th>Price</th> */}
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {userData.type == "combo" ? (
                                                <>
                                                  {margeaddonsData.map(
                                                    (data, index) => (
                                                      <tr
                                                        key={index}
                                                        className="text-center"
                                                      >
                                                        <td>{index + 1}</td>
                                                        <td>
                                                          <h6 className="text-primary">
                                                            {data.name}
                                                          </h6>
                                                        </td>
                                                        {/* <td>
                                                      {data.quantity}
                                                      {data.type == "cake"
                                                        ? data.quantity == "500"
                                                          ? "Gms"
                                                          : "Kg"
                                                        : ""}
                                                    </td> */}
                                                        <td>
                                                          ₹{data.price}{" "}
                                                          {data.type == "cake"
                                                            ? "/ 500 Gms"
                                                            : ""}
                                                        </td>
                                                        {/* <td>
                                                      {data.type == "cake"
                                                        ? data.quantity == "500"
                                                          ? data.price
                                                          : data.price *
                                                            (2 * data.quantity)
                                                        : data.price *
                                                          data.quantity}
                                                    </td> */}
                                                      </tr>
                                                    )
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {productsValue.map(
                                                    (data, index) => (
                                                      <tr
                                                        key={index}
                                                        className="text-center"
                                                      >
                                                        <td>{index + 1}</td>
                                                        <td>
                                                          <h6 className="text-primary">
                                                            {data.name}
                                                          </h6>
                                                        </td>
                                                        <td>
                                                          {data.quantity}
                                                          {data.type == "cake"
                                                            ? data.quantity ==
                                                              "500"
                                                              ? "Gms"
                                                              : "Kg"
                                                            : ""}
                                                        </td>
                                                        <td>
                                                          ₹{data.price}{" "}
                                                          {data.type == "cake"
                                                            ? "/ 500 Gms"
                                                            : ""}
                                                        </td>
                                                        <td>
                                                          {data.type == "cake"
                                                            ? data.quantity ==
                                                              "500"
                                                              ? data.price
                                                              : data.price *
                                                                (2 *
                                                                  data.quantity)
                                                            : data.price *
                                                              data.quantity}
                                                        </td>
                                                      </tr>
                                                    )
                                                  )}
                                                </>
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>{" "}
                              </div>
                            </div>
                            <div className="col-md-4 col-lg-4 card">
                              <div className=" card-body">
                                <form onSubmit={formSubmit1}>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <h4
                                        className="card-title"
                                        style={{ color: "#A020F0" }}
                                      >
                                        Coupon
                                      </h4>
                                      <div className="payment-widget">
                                        <div className="row m-1">
                                          <div className="col-md-8 pt-3 col-12">
                                            <div
                                              className="card booking-card"
                                              style={{ background: "#fff" }}
                                            >
                                              <input
                                                className="form-control"
                                                type="text"
                                                onChange={handleChange1}
                                                placeholder="Apply Coupon"
                                                name="couponCode"
                                                value={form1.couponCode || ""}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-4 col-12">
                                            {couponButton === "true" ? (
                                              <button
                                                disabled
                                                className="btn btn-secondary submit-btn mt-3"
                                                type="button"
                                              >
                                                Applied
                                              </button>
                                            ) : (
                                              <button
                                                type="submit"
                                                className="btn btn-primary submit-btn mt-3"
                                              >
                                                Apply
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                                <hr></hr>
                                <form onSubmit={formSubmit3}>
                                  <div
                                    style={{ width: "100%", float: "right" }}
                                  >
                                    <h4
                                      className="card-title mt-4"
                                      style={{ color: "#A020F0" }}
                                    >
                                      Payment
                                    </h4>
                                    <div
                                      className="booking-card"
                                      style={{ background: "#fff" }}
                                    >
                                      <div className="">
                                        <div className="booking-summary">
                                          <div className="booking-item-wrap">
                                            <ul className="booking-fee">
                                              <li>
                                                Sub Total (Including GST)
                                                <span>
                                                  ₹ {productsValuePrice} /-
                                                </span>
                                              </li>
                                              {/* <li>
                                            Gst({gst}%){" "}
                                            <span>
                                              {" "}
                                              + ₹{" "}
                                              {(
                                                (gst / 100) *
                                                productsValuePrice
                                              ).toFixed(2)}
                                            </span>
                                          </li> */}
                                              <li>
                                                Coupon Discount{" "}
                                                <span>
                                                  - ₹{" "}
                                                  {couponDiscount == null ? (
                                                    <>0</>
                                                  ) : (
                                                    <>{couponDiscount}</>
                                                  )}{" "}
                                                  /-
                                                </span>
                                              </li>
                                              {totalAmountOption ===
                                              "fullpayment" ? (
                                                <></>
                                              ) : (
                                                <>
                                                  <li>
                                                    Total Amount
                                                    <span>
                                                      ₹ <> {totalAmountFixed}</>{" "}
                                                      /-
                                                    </span>
                                                  </li>
                                                  <li>
                                                    Advance Amount
                                                    <span>
                                                      - ₹{" "}
                                                      {displayedAdvanceAmount}{" "}
                                                      /-
                                                    </span>
                                                  </li>
                                                </>
                                              )}
                                            </ul>
                                            <div className="row">
                                              <div className="col">
                                                <div className="form-check mt-3">
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    style={{ fontSize: "13px" }}
                                                    name="amountOption"
                                                    id="fullpaymentOption"
                                                    value="fullpayment"
                                                    checked={
                                                      totalAmountOption ==
                                                      "fullpayment"
                                                    }
                                                    onClick={e =>
                                                      setTotalAmountOption(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="fullpaymentOption"
                                                  >
                                                    <small
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Full Amount:{" "}
                                                    </small>
                                                  </label>
                                                </div>
                                              </div>{" "}
                                              <div className="col pt-2">
                                                <div className="form-check mt-2">
                                                  <input
                                                    style={{ fontSize: "13px" }}
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="amountOption"
                                                    id="partialpaymentOption"
                                                    value="partialpayment"
                                                    checked={
                                                      totalAmountOption ==
                                                      "partialpayment"
                                                    }
                                                    onClick={e =>
                                                      setTotalAmountOption(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label "
                                                    htmlFor="partialpaymentOption"
                                                  >
                                                    <small
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Advance Amount
                                                    </small>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            {/* cash and onlineex */}

                                            <div className="row">
                                              <div className="col">
                                                <div className="form-check mt-3">
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    style={{ fontSize: "13px" }}
                                                    name="OnlineOption"
                                                    id="cashOption"
                                                    value="cash"
                                                    checked={onlines === "cash"}
                                                    onClick={
                                                      handleCashOptionClick
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="cashOption"
                                                  >
                                                    <small
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Cash:{" "}
                                                    </small>
                                                  </label>
                                                </div>
                                              </div>
                                              <div className="col pt-2">
                                                <div className="form-check mt-2">
                                                  <input
                                                    style={{ fontSize: "13px" }}
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="OnlineOption"
                                                    id="onlineOption"
                                                    value="online"
                                                    checked={
                                                      onlines == "online"
                                                    }
                                                    onClick={e =>
                                                      setOnline(e.target.value)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label "
                                                    htmlFor="onlineOption"
                                                  >
                                                    <small
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Online
                                                    </small>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="booking-total">
                                              <ul className="booking-total-list">
                                                {totalAmountOption ===
                                                "fullpayment" ? (
                                                  <>
                                                    <li>
                                                      <span>Total Amount</span>
                                                      <span className="total-cost">
                                                        ₹{" "}
                                                        {totalAmountFixed ==
                                                        null ? (
                                                          <>0</>
                                                        ) : (
                                                          <>
                                                            {totalAmountFixed}
                                                          </>
                                                        )}{" "}
                                                        /-
                                                      </span>
                                                    </li>
                                                  </>
                                                ) : (
                                                  <>
                                                    <li>
                                                      <span>Final Amount</span>
                                                      <span className="total-cost">
                                                        ₹{" "}
                                                        {totalAmountFixed ==
                                                        null ? (
                                                          <>0</>
                                                        ) : (
                                                          <>
                                                            {
                                                              remainingAmountFixed
                                                            }
                                                          </>
                                                        )}{" "}
                                                        /-
                                                      </span>
                                                    </li>
                                                  </>
                                                )}
                                              </ul>
                                            </div>
                                            <div className="submit-section mt-5">
                                              <button
                                                type="submit"
                                                className="btn btn-primary submit-btn"
                                                style={{ width: "100%" }}
                                              >
                                                Check Out
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>{" "}
      </div>
    </React.Fragment>
  )
}

export default CheckOut
