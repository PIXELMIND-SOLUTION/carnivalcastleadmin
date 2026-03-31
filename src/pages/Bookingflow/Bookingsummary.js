import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Weburls"
import axios from "axios"
import { useHistory } from "react-router-dom"
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
  console.log(token)

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoading1, setIsLoading1] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)
  const [advancePayment, setAdvancePayment] = useState("")
  const [payType, setPayType] = useState("")

  const GetTheatersData = () => {
    axios
      .post(
        URLS.GetAllTheaters,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setIsLoading(false)
        }
      })
  }

  const history = useHistory()
  const [policys, setpolicys] = useState([])

  const allcakes = JSON.parse(sessionStorage.getItem("cartCakes"))
  const allcakeslength =
    JSON.parse(sessionStorage.getItem("selectedWeights")) || "500"

  // Get all values from sessionStorage
  const finalAmount = parseFloat(sessionStorage.getItem("finalAmount")) || 0
  const adjustedSubtotal = parseFloat(sessionStorage.getItem("adjustedSubtotal")) || 0
  const showGst = sessionStorage.getItem("showGst") === "true"
  const gstPercentage = parseFloat(sessionStorage.getItem("gstPercentage")) || 18
  const gstAmount = parseFloat(sessionStorage.getItem("gstAmount")) || 0
  const cgstAmount = parseFloat(sessionStorage.getItem("cgstAmount")) || 0
  const sgstAmount = parseFloat(sessionStorage.getItem("sgstAmount")) || 0
  const offeredDiscount = parseFloat(sessionStorage.getItem("offeredDiscount")) || 0
  const offeredDiscountAmount = parseFloat(sessionStorage.getItem("offeredDiscountAmount")) || 0

  // Calculate total price
  const totoalbasicprice = finalAmount > 0 ? finalAmount : (
    parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("cakeprice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    (parseFloat(sessionStorage.getItem("addons")) || 0) -
    parseFloat(sessionStorage.getItem("couponAmount") || 0)
  )
  
  console.log("Final Amount from AddOns:", finalAmount)
  console.log("GST Details:", { showGst, gstPercentage, gstAmount, cgstAmount, sgstAmount })
  console.log("Offered Discount:", offeredDiscount)
  console.log("Offered Discount Amount:", offeredDiscountAmount)
  
  const totoalbasicpricesubtotal = adjustedSubtotal > 0 ? adjustedSubtotal : (
    parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("cakeprice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    (parseFloat(sessionStorage.getItem("addons")) || 0)
  )

  const submitcakesall = () => {
    const productMap = allcakes.map((e, i) => {
      return {
        _id: e._id,
        name: e.name,
        type: "cake",
        cakeType: e.cakeType,
        price: e.price,
        quantity: parseFloat(allcakeslength[e._id] == undefined || allcakeslength[e._id] == "500" || allcakeslength[e._id] == null ? "500" : allcakeslength[e._id]),
      }
    })

    const bodyData = {
      products: productMap,
      bookingId: sessionStorage.getItem("bookingid"),
    }
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecakes",
        bodyData
      )
      .then(
        res => {
          if (res.status === 200) {
            history.push("/Confirmedbookings")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            console.log(error.response)
            toast.error(error.response.message)
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.message)
          }
        }
      )
  }

  const handleSubmit = e => {
    e.preventDefault()
    
    if (!advancePayment || advancePayment === "") {
      toast.error("Please enter advance payment amount")
      return
    }
    
    const advance = parseFloat(advancePayment)
    const total = parseFloat(totoalbasicprice)
    
    if (advance <= 0) {
      toast.error("Advance payment must be greater than 0")
      return
    }
    
    if (advance > total) {
      toast.error("Advance payment cannot exceed total amount")
      return
    }
    
    sessionStorage.setItem("advancePayment", advancePayment)
    
    submitcakesall()
    sessionStorage.setItem("userDetails", JSON.stringify(data))
    
    console.log(payType, "payType")
    if (payType === "online") {
      addBooking()
    } else {
      cashBooking()
    }
  }

  useEffect(() => {
    GetTheatersData()
    GetPoliciesData()
    
    const storedAdvance = sessionStorage.getItem("advancePayment")
    if (storedAdvance) {
      setAdvancePayment(storedAdvance)
    }
    
    const paymentType = sessionStorage.getItem("payType") || "cash"
    setPayType(paymentType)
    
    console.log("Booking Settings:", {
      finalAmount: sessionStorage.getItem("finalAmount"),
      showGst: sessionStorage.getItem("showGst"),
      gstPercentage: sessionStorage.getItem("gstPercentage"),
      gstAmount: sessionStorage.getItem("gstAmount"),
      cgstAmount: sessionStorage.getItem("cgstAmount"),
      sgstAmount: sessionStorage.getItem("sgstAmount"),
      offeredDiscount: sessionStorage.getItem("offeredDiscount"),
      offeredDiscountAmount: sessionStorage.getItem("offeredDiscountAmount")
    })
  }, [])

  const handleClick = () => {
    history.push("/addonsthings")
  }

  const GetPoliciesData = () => {
    axios
      .post(
        URLS.GetPolicies,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setpolicys(res.data.policy)
        }
      })
  }

  const addBooking = async () => {
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"))
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"))
    setIsLoading1(true)
    
    const dataArray = {
      totalPrice: totoalbasicprice,
      advancePayment: parseFloat(advancePayment || 0),
      subTotal: totoalbasicpricesubtotal,
      bookingId: sessionStorage.getItem("bookingid"),
      theatrePrice: parseFloat(sessionStorage.getItem("theaterPrice")),
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: parseFloat(sessionStorage.getItem("coupondis") || 0),
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      paymentType: "partialpayment",
      transactionId: "",
      transactionStatus: "completed",
      status: "pending",
      cashType: "online",
      create_type: "admin",
      paymentMode: "online",
      remainingAmount: totoalbasicprice - parseFloat(advancePayment),
      
      // GST info with CGST/SGST
      showGst: showGst,
      gstPercentage: gstPercentage,
      gstAmount: gstAmount,
      cgstAmount: cgstAmount,
      sgstAmount: sgstAmount,
      
      // Discount info
      offeredDiscount: offeredDiscount,
      offeredDiscountAmount: offeredDiscountAmount,
      discountedSubtotal: totoalbasicpricesubtotal,
      
      // Original subtotal
      originalSubtotal: parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
        parseFloat(sessionStorage.getItem("cakeprice") || 0) +
        parseFloat(sessionStorage.getItem("occprice") || 0) +
        (parseFloat(sessionStorage.getItem("addons")) || 0)
    }
    
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("extraPersonperprice")
    }

    console.log("Sending to backend (online) with CGST/SGST:", dataArray)

    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setIsLoading1(false)
        window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url
      }

    } catch (error) {
      setIsLoading1(false)
      if (error.response) {
        if (error.response.status === 403) {
          toast.error(error.response.data.message)
          setTimeout(() => {
            history.push("/theaters")
          }, 2000)
        } else {
          toast.error("An unexpected error occurred.")
        }
      } else {
        toast.error("Network error. Please try again.")
      }
    }
  }

  const cashBooking = async () => {
    setIsLoading1(true)
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"))
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"))
    
    const dataArray = {
      totalPrice: totoalbasicprice,
      advancePayment: parseFloat(advancePayment || 0),
      subTotal: totoalbasicpricesubtotal,
      bookingId: sessionStorage.getItem("bookingid"),
      theatrePrice: parseFloat(sessionStorage.getItem("theaterPrice")),
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: parseFloat(sessionStorage.getItem("coupondis") || 0),
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      paymentType: "partialpayment",
      transactionId: "",
      transactionStatus: "completed",
      status: "confirmed",
      cashType: "cash",
      create_type: "admin",
      paymentMode: "cash",
      remainingAmount: totoalbasicprice - parseFloat(advancePayment),
      
      // GST info with CGST/SGST
      showGst: showGst,
      gstPercentage: gstPercentage,
      gstAmount: gstAmount,
      cgstAmount: cgstAmount,
      sgstAmount: sgstAmount,
      
      // Discount info
      offeredDiscount: offeredDiscount,
      offeredDiscountAmount: offeredDiscountAmount,
      discountedSubtotal: totoalbasicpricesubtotal,
      
      // Original subtotal
      originalSubtotal: parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
        parseFloat(sessionStorage.getItem("cakeprice") || 0) +
        parseFloat(sessionStorage.getItem("occprice") || 0) +
        (parseFloat(sessionStorage.getItem("addons")) || 0)
    }
    
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("extraPersonperprice")
    }

    console.log("Sending to backend (cash) with CGST/SGST:", dataArray)

    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        setIsLoading1(false)
        setTimeout(() => {
          history.push("/Confirmedbookings")
          sessionStorage.setItem("invoicePath", res.data.invoicePath)
          sessionStorage.setItem("orderId", res.data.orderId)
          sessionStorage.removeItem("date")
        }, 2000)
      }

    } catch (error) {
      setIsLoading1(false)
      if (error.response) {
        if (error.response.status === 403) {
          toast.error(error.response.data.message)
          setTimeout(() => {
            history.push("/theaters")
          }, 2000)
        } else {
          toast.error("An unexpected error occurred.")
        }
      } else {
        toast.error("Network error. Please try again.")
      }
    }
  }

  const handleAgree = event => {
    if (event.target.checked) {
      setIsAgreed(true)
    } else {
      setIsAgreed(false)
      toast.error("You must agree to the terms and conditions to proceed.")
    }
  }

  const handleAdvancePaymentChange = (e) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAdvancePayment(value)
    }
  }

  const handlePaymentTypeChange = (type) => {
    setPayType(type)
    sessionStorage.setItem("payType", type)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Terms and Conditions"
          />
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
                    <section className="shop-area p-relative ">
                      <div className="container mx-auto p-4">
                        <button
                          type="button"
                          className="btn btn-primary mb-3 bg-primary"
                          onClick={handleClick}
                          style={{
                            boxShadow: "none",
                            color: "black",
                            border: "none",
                          }}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>

                        <div className="row">
                          <div className="col-12 ">
                            <div
                              className="shadow-lg p-4 d-flex flex-column"
                              style={{ height: "700px" }}
                            >
                              <div
                                className="mt-2 flex-grow-1"
                                style={{
                                  overflowY: "auto",
                                  paddingRight: "10px",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: policys.termsAndCondition,
                                }}
                              ></div>

                              {/* Show discount information */}
                              {offeredDiscount > 0 && (
                                <div className="mb-3">
                                  <div className="alert alert-success">
                                    <i className="fas fa-tag me-2"></i>
                                    <strong>Discount Applied:</strong> ₹{offeredDiscountAmount.toFixed(2)} off
                                  </div>
                                </div>
                              )}

                              {/* Payment Type Selection */}
                              <div className="mb-3">
                                <label className="form-label">
                                  <strong>Select Payment Type:</strong>
                                </label>
                                <div className="d-flex gap-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentType"
                                      id="cashPayment"
                                      value="cash"
                                      checked={payType === "cash"}
                                      onChange={() => handlePaymentTypeChange("cash")}
                                    />
                                    <label className="form-check-label" htmlFor="cashPayment">
                                      Cash Payment
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentType"
                                      id="onlinePayment"
                                      value="online"
                                      checked={payType === "online"}
                                      onChange={() => handlePaymentTypeChange("online")}
                                    />
                                    <label className="form-check-label" htmlFor="onlinePayment">
                                      Online Payment
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Advance Payment Input */}
                              <div className="mb-3">
                                <label htmlFor="advancePayment" className="form-label">
                                  <strong>Advance Payment (₹):</strong>
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <span className="input-group-text">₹</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="advancePayment"
                                    value={advancePayment}
                                    onChange={handleAdvancePaymentChange}
                                    placeholder="Enter advance amount"
                                    required
                                  />
                                </div>
                                <div className="form-text">
                                  <strong>Total Amount: ₹{totoalbasicprice.toFixed(2)}</strong>
                                  {advancePayment && parseFloat(advancePayment) > 0 && (
                                    <span className="ms-2">
                                      | Remaining: ₹{(totoalbasicprice - parseFloat(advancePayment || 0)).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                {offeredDiscount > 0 && (
                                  <div className="form-text text-success">
                                    <small>Discount: ₹{offeredDiscountAmount.toFixed(2)} applied</small>
                                  </div>
                                )}
                                <div className="form-text text-info">
                                  <small>Subtotal after discount: ₹{totoalbasicpricesubtotal.toFixed(2)}</small>
                                </div>
                              </div>

                              {/* GST Information with CGST/SGST breakdown */}
                              <div className="mb-3">
                                <div className="alert alert-info mb-0">
                                  <i className="fas fa-info-circle me-2"></i>
                                  <strong>GST Information:</strong>
                                  {showGst ? (
                                    <div>
                                      <span> {gstPercentage}% GST (₹{gstAmount.toFixed(2)}) is included in the total amount.</span>
                                      <div className="small mt-1">
                                        <span className="badge bg-secondary me-2">CGST (9%): ₹{cgstAmount.toFixed(2)}</span>
                                        <span className="badge bg-secondary">SGST (9%): ₹{sgstAmount.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span> GST is not applied to this booking.</span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-auto text-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  id="agreeCheckbox"
                                  onChange={handleAgree}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="agreeCheckbox"
                                >
                                  I agree to all the above conditions.
                                </label>
                              </div>

                              <div className="d-flex justify-content-end mt-3">
                                {isLoading1 ? (
                                  <button
                                    className="btn bg-primary"
                                    style={{
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    disabled
                                  >
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Your Booking Processing...
                                  </button>
                                ) : (
                                  <button
                                    className="btn bg-primary"
                                    style={{
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    onClick={handleSubmit}
                                    disabled={!isAgreed || !advancePayment}
                                  >
                                    {payType === "online" ? "Confirm & Pay Online" : "Confirm & Pay Cash"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
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