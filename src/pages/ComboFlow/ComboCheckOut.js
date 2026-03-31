import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Weburls"
import axios from "axios"
import { useHistory } from "react-router-dom"
// import "bootstrap-icons/font/bootstrap-icons.css";
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
} from "reactstrap"

const ComboBooking = () => {
  var gets = localStorage.getItem("authUser")
  var dataa = JSON.parse(gets)
  var datas = dataa.token
  var token = datas
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoading1, setIsLoading1] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false) // agree
  const [advancePayment, setAdvancePayment] = useState("")
  const [payType, setPayType] = useState("")

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then(res => {
      if (res.status === 200) {
        setIsLoading(false)
      }
    })
  }

  const history = useHistory()
  const [policys, setpolicys] = useState([])

  // Get all values from sessionStorage that were saved in ComboPlans
  const comboSubtotal = parseFloat(sessionStorage.getItem("comboSubtotal")) || 0
  const comboDiscountedSubtotal = parseFloat(sessionStorage.getItem("comboDiscountedSubtotal")) || 0
  const comboOfferedDiscount = parseFloat(sessionStorage.getItem("comboOfferedDiscount")) || 0
  const comboOfferedDiscountAmount = parseFloat(sessionStorage.getItem("comboOfferedDiscountAmount")) || 0
  const comboShowGst = sessionStorage.getItem("comboShowGst") === "true"
  const comboGstPercentage = parseFloat(sessionStorage.getItem("comboGstPercentage")) || 18
  const comboGstAmount = parseFloat(sessionStorage.getItem("comboGstAmount")) || 0
  const comboCgstAmount = parseFloat(sessionStorage.getItem("comboCgstAmount")) || 0
  const comboSgstAmount = parseFloat(sessionStorage.getItem("comboSgstAmount")) || 0
  const comboFinalAmount = parseFloat(sessionStorage.getItem("comboFinalAmount")) || 0
  
  // Get payment option from sessionStorage
  const paymentOption = sessionStorage.getItem("paymentkey") || "fullpayment"
  const comboAdvancePayment = parseFloat(sessionStorage.getItem("comboAdvancePayment")) || 0
  
  // Calculate remaining amount if advance payment
  const remainingAmount = paymentOption === "partialpayment" 
    ? comboFinalAmount - comboAdvancePayment 
    : 0

  console.log("Combo Booking Details:", {
    comboSubtotal,
    comboDiscountedSubtotal,
    comboOfferedDiscount,
    comboOfferedDiscountAmount,
    comboShowGst,
    comboGstPercentage,
    comboGstAmount,
    comboCgstAmount,
    comboSgstAmount,
    comboFinalAmount,
    paymentOption,
    comboAdvancePayment,
    remainingAmount
  })

  const handleSubmit = e => {
    e.preventDefault()
    
    if (!advancePayment && paymentOption === "partialpayment") {
      toast.error("Please enter advance payment amount")
      return
    }
    
    if (paymentOption === "partialpayment") {
      const advance = parseFloat(advancePayment)
      if (advance <= 0) {
        toast.error("Advance payment must be greater than 0")
        return
      }
      if (advance > comboFinalAmount) {
        toast.error("Advance payment cannot exceed total amount")
        return
      }
    }
    
    sessionStorage.setItem("userDetails", JSON.stringify(data))
    sessionStorage.setItem("advancePayment", advancePayment)
    
    var payType = sessionStorage.getItem("payType") || "cash"
    if (payType === "online") {
      addBooking()
    } else {
      cashBooking()
    }
  }

  useEffect(() => {
    GetTheatersData()
    GetPoliciesData() // this is the terms and conditions
    
    const storedAdvance = sessionStorage.getItem("advancePayment")
    if (storedAdvance) {
      setAdvancePayment(storedAdvance)
    }
    
    const paymentType = sessionStorage.getItem("payType") || "cash"
    setPayType(paymentType)
  }, [])

  const handleClick = () => {
    history.push("/ComboPlans")
  }

  const GetPoliciesData = () => {
    axios.post(URLS.GetPolicies, {}, {}).then(res => {
      if (res.status === 200) {
        setpolicys(res.data.policy)
      }
    })
  }

  const addBooking = async () => {
    setIsLoading1(true)
    const token = localStorage.getItem("token")
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"))
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"))
    
    const dataArray = {
      // Basic booking info
      bookingId: sessionStorage.getItem("bookingid"),
      
      // Price details from ComboPlans
      planOfferPrice: sessionStorage.getItem("planpricesss"),
      originalSubtotal: comboSubtotal,
      discountedSubtotal: comboDiscountedSubtotal,
      totalPrice: comboFinalAmount,
      
      // GST fields with CGST/SGST
      showGst: comboShowGst,
      gstPercentage: comboGstPercentage,
      gstAmount: comboGstAmount,
      cgstAmount: comboCgstAmount,
      sgstAmount: comboSgstAmount,
      
      // Discount fields
      offeredDiscount: comboOfferedDiscount,
      offeredDiscountAmount: comboOfferedDiscountAmount,
      
      // Advance payment
      advancePayment: paymentOption === "partialpayment" 
        ? parseFloat(advancePayment || comboAdvancePayment) 
        : 0,
      remainingAmount: paymentOption === "partialpayment" 
        ? comboFinalAmount - parseFloat(advancePayment || comboAdvancePayment)
        : 0,
      paymentOption: paymentOption,
      
      // Coupon info
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: parseFloat(sessionStorage.getItem("coupondis") || 0),
      
      // Extra persons
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      
      // Transaction info
      transactionId: "",
      transactionStatus: "completed",
      status: paymentOption === "partialpayment" ? "pending" : "completed",
      
      // Payment type
      cashType: "online",
      paymentType: paymentOption,
      create_type: "admin",
    }
    
    // Add extra person price if applicable
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = parseFloat(sessionStorage.getItem("planextrapersoncharge") || 0)
      dataArray.extraPersonCount = extrapersiontheater - maxPeopletheater
    }
    
    console.log("Sending to backend (online) with GST fields:", dataArray)

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
        
        // Save invoice info
        if (res.data.invoicePath) {
          sessionStorage.setItem("invoicePath", res.data.invoicePath)
        }
        if (res.data.orderId) {
          sessionStorage.setItem("orderId", res.data.orderId)
        }
        
        // Redirect to payment gateway or success page
        if (res?.data?.data?.instrumentResponse?.redirectInfo?.url) {
          window.location.href = res.data.data.instrumentResponse.redirectInfo.url
        } else {
          setIsLoading1(false)
          history.push("/Confirmedbookings")
        }
      } else if (res.status === 403) {
        toast.error("Access Denied: You do not have permission to view this page.")
        history.push("/theaters")
      }
    } catch (error) {
      setIsLoading1(false)
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Error processing payment")
      } else if (error.response && error.response.status === 406) {
        toast.error(error.response.data.message || "Booking expired")
        setTimeout(() => {
          history.push("/theaters")
        }, 2000)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }
  
  const cashBooking = async () => {
    setIsLoading1(true)
    const token = localStorage.getItem("token")
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"))
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"))
    
    const dataArray = {
      // Basic booking info
      bookingId: sessionStorage.getItem("bookingid"),
      
      // Price details from ComboPlans
      planOfferPrice: sessionStorage.getItem("planpricesss"),
      originalSubtotal: comboSubtotal,
      discountedSubtotal: comboDiscountedSubtotal,
      totalPrice: comboFinalAmount,
      
      // GST fields with CGST/SGST
      showGst: comboShowGst,
      gstPercentage: comboGstPercentage,
      gstAmount: comboGstAmount,
      cgstAmount: comboCgstAmount,
      sgstAmount: comboSgstAmount,
      
      // Discount fields
      offeredDiscount: comboOfferedDiscount,
      offeredDiscountAmount: comboOfferedDiscountAmount,
      
      // Advance payment
      advancePayment: paymentOption === "partialpayment" 
        ? parseFloat(advancePayment || comboAdvancePayment) 
        : 0,
      remainingAmount: paymentOption === "partialpayment" 
        ? comboFinalAmount - parseFloat(advancePayment || comboAdvancePayment)
        : 0,
      paymentOption: paymentOption,
      
      // Coupon info
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: parseFloat(sessionStorage.getItem("coupondis") || 0),
      
      // Extra persons
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      
      // Transaction info
      transactionId: "",
      transactionStatus: "completed",
      status: paymentOption === "partialpayment" ? "pending" : "confirmed",
      
      // Payment type
      cashType: "cash",
      paymentType: paymentOption,
      create_type: "admin",
    }
    
    // Add extra person price if applicable
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = parseFloat(sessionStorage.getItem("planextrapersoncharge") || 0)
      dataArray.extraPersonCount = extrapersiontheater - maxPeopletheater
    }
    
    console.log("Sending to backend (cash) with GST fields:", dataArray)

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
        
        // Save invoice info
        if (res.data.invoicePath) {
          sessionStorage.setItem("invoicePath", res.data.invoicePath)
        }
        if (res.data.orderId) {
          sessionStorage.setItem("orderId", res.data.orderId)
        }
        
        setIsLoading1(false)
        history.push("/Confirmedbookings")
      } else if (res.status === 403) {
        toast.error("Access Denied: You do not have permission to view this page.")
        history.push("/theaters")
      }
    } catch (error) {
      setIsLoading1(false)
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Error processing payment")
      } else if (error.response && error.response.status === 406) {
        toast.error(error.response.data.message || "Booking expired")
        setTimeout(() => {
          history.push("/theaters")
        }, 2000)
      } else {
        toast.error("Something went wrong. Please try again.")
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
                          className="btn mb-3 bg-primary"
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

                              {/* Booking Summary Section */}
                              <div className="mt-3 p-3 bg-light rounded">
                                <h5 className="mb-3">Booking Summary</h5>
                                
                                {/* Base Subtotal */}
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Base Subtotal:</span>
                                  <span className="fw-bold">₹{comboSubtotal.toFixed(2)}</span>
                                </div>
                                
                                {/* Offered Discount */}
                                {comboOfferedDiscountAmount > 0 && (
                                  <div className="d-flex justify-content-between mb-2 text-success">
                                    <span>Offered Discount:</span>
                                    <span>- ₹{comboOfferedDiscountAmount.toFixed(2)}</span>
                                  </div>
                                )}
                                
                                {/* Subtotal after discount */}
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Subtotal after discount:</span>
                                  <span className="fw-bold">₹{comboDiscountedSubtotal.toFixed(2)}</span>
                                </div>
                                
                                {/* GST Breakdown */}
                                {comboShowGst && (
                                  <>
                                    <div className="d-flex justify-content-between mb-2 text-muted small">
                                      <span>CGST (9%):</span>
                                      <span>+ ₹{comboCgstAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 text-muted small">
                                      <span>SGST (9%):</span>
                                      <span>+ ₹{comboSgstAmount.toFixed(2)}</span>
                                    </div>
                                  </>
                                )}
                                
                                {/* Final Total */}
                                <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                                  <span className="fw-bold">Final Total:</span>
                                  <span className="fw-bold text-primary" style={{ fontSize: "18px" }}>
                                    ₹{comboFinalAmount.toFixed(2)}
                                  </span>
                                </div>
                                
                                {/* Payment Option Info */}
                                {paymentOption === "partialpayment" && (
                                  <div className="mt-2 text-info">
                                    <small>
                                      <i className="fas fa-info-circle me-1"></i>
                                      Advance Payment: ₹{comboAdvancePayment.toFixed(2)} | 
                                      Remaining: ₹{remainingAmount.toFixed(2)}
                                    </small>
                                  </div>
                                )}
                              </div>

                              {/* Payment Type Selection */}
                              <div className="mb-3 mt-3">
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

                              {/* Advance Payment Input - Only for partial payment */}
                              {paymentOption === "partialpayment" && (
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
                                      placeholder={`Enter advance amount (min: ₹${comboAdvancePayment})`}
                                      required
                                    />
                                  </div>
                                  <div className="form-text">
                                    <strong>Required Advance: ₹{comboAdvancePayment.toFixed(2)}</strong>
                                    {advancePayment && parseFloat(advancePayment) > 0 && (
                                      <span className="ms-2">
                                        | Remaining: ₹{(comboFinalAmount - parseFloat(advancePayment || 0)).toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Terms Agreement */}
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

                              {/* Submit Button */}
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
                                      padding: "10px 20px",
                                      fontWeight: "bold",
                                    }}
                                    onClick={handleSubmit}
                                    disabled={
                                      !isAgreed || 
                                      (paymentOption === "partialpayment" && !advancePayment)
                                    }
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

export default ComboBooking