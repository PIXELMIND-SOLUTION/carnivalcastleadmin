import React, { useState, useEffect, useRef } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { URLS } from "../../Weburls"
import axios from "axios"
// import "bootstrap-icons/font/bootstrap-icons.css";
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

var IDSvar = sessionStorage.getItem("IDSvar")
  ? JSON.parse(sessionStorage.getItem("IDSvar"))
  : []

const AddOns = () => {
  const history = useHistory()
  var gets = localStorage.getItem("authUser")
  var data123 = JSON.parse(gets)
  var datas = data123.token
  var token = datas

  const [isLoading, setIsLoading] = useState(true)

  const [addOns, setAddOns] = useState([])
  const [IDS, setIDS] = useState([])
  const [totalAmountOption, setTotalAmountOption] = useState("fullpayment")
  
  // GST toggle states
  const [showGst, setShowGst] = useState(true)
  const [gstPercentage, setGstPercentage] = useState(18)
  
  // Offered Discount state
  const [offeredDiscount, setOfferedDiscount] = useState("")

  const addonsprice = IDS.map(data => data.price)
  const addonsvalue = addonsprice.reduce((acc, curr) => acc + curr, 0)

  console.log(IDS)
  const selectaddonsdata =
    JSON.parse(sessionStorage.getItem("addonsData")) || []
const cahstypestor = sessionStorage.getItem("payType")
  const [onlines, setOnline] = useState(cahstypestor || "cash")
  console.log(onlines)

  const [selectedOccasions, setSelectedOccasions] = useState(
    JSON.parse(sessionStorage.getItem("addonsData")) || []
  )
  // JSON.parse(sessionStorage.getItem("adonsJSON")) ||
  console.log(selectedOccasions)

  const additionalImagesRef = useRef(null)

  console.log(selectaddonsdata.map(data => data._id))

  // Calculate all amounts
  const theaterPrice = parseFloat(sessionStorage.getItem("theaterPrice")) || 0
  const cakePrice = parseFloat(sessionStorage.getItem("cakeprice")) || 0
  const occasionPrice = parseFloat(sessionStorage.getItem("occprice")) || 0
  const totalPrice = selectedOccasions.reduce(
    (total, item) => total + item.price,
    0
  )
  const couponDiscount = parseFloat(sessionStorage.getItem("couponAmount")) || 0
  const couponDis = parseFloat(sessionStorage.getItem("coupondis")) || 0
  
  // Base subtotal (before any discounts)
  const baseSubtotal = theaterPrice + cakePrice + occasionPrice + totalPrice;
  
  // Apply coupon discount first (if any)
  const subtotalAfterCoupon = baseSubtotal - couponDiscount;
  
  // Calculate offered discount amount
  const offeredDiscountAmount = offeredDiscount && offeredDiscount !== "" 
    ? parseFloat(offeredDiscount) 
    : 0;
  
  // FIXED: Subtotal after offered discount (before GST)
  const subtotalAfterDiscount = subtotalAfterCoupon - offeredDiscountAmount;
  
  // GST calculation (18% on subtotal after discount)
  const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
  
  // CGST and SGST (9% each)
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;
  
  // Final total based on GST toggle
  const finalTotal = showGst ? subtotalAfterDiscount + gstAmount : subtotalAfterDiscount;
  
  // Display total
  const displayTotal = finalTotal;

  useEffect(() => {
    GetTheatersData()
    GetAddOns()
    getGstPercentage()
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/bookings/getallbookings",
        { bookingId: sessionStorage.getItem("bookingid") }
      )
      .then(res => {
        console.log(res)
        setIDS(res?.data?.booking?.addons || [])

        const sum = res?.data?.booking?.addons?.reduce(
          (total, obj) => total + Number(obj.price),
          0
        )

        sessionStorage.setItem("paymentkey", "fullpayment")
      })
  }, [])

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then(res => {
      if (res.status === 200) {
        setIsLoading(false)
      }
    })
  }

  const getGstPercentage = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {})
      if (res.status === 200) {
        console.log(res.data.charges, "response")
        setGstPercentage(Number(res.data.charges.bookingGst) || 18)
        setAdvanceAmount(Number(res.data.charges.advancePayment))
        sessionStorage.setItem(
          "advancePayment",
          res.data.charges.advancePayment
        )
        sessionStorage.setItem("gstPercentage", res.data.charges.bookingGst || 18)
      }
    } catch (error) {
      console.error("Error fetching GST:", error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const GetAddOns = () => {
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/getalladdonproducts",
        {}
      )
      .then(
        res => {
          if (res.status === 200) {
            setAddOns(res?.data?.products)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            setAddOns([])
          }
        }
      )
  }

  const [advanceAmount, setAdvanceAmount] = useState(0)

  // Cash/Online handler
  const handleCashOptionClick = (value) => {
    console.log("Payment method selected:", value)
    setOnline(value)
    sessionStorage.setItem("payType", value)
  }

  // GST Toggle handler
  const handleGstToggle = () => {
    const newValue = !showGst
    console.log("GST toggled:", newValue)
    setShowGst(newValue)
  }

  // Offered Discount handler
  const handleOfferedDiscountChange = (e) => {
    const value = e.target.value
    // Allow only numbers and decimal
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setOfferedDiscount(value)
    }
  }

  // Payment option handler (full/advance)
  const handlePaymentOptionClick = (value) => {
    setTotalAmountOption(value)
  }

  // Remaining amount for advance payment
  const remainingAmount = totalAmountOption === "fullpayment" ? 0 : displayTotal - advanceAmount

  const handleImageClick = occasion => {
    console.log(occasion.price)
    var addons = sessionStorage.getItem("addons")
    var TotalPrice = sessionStorage.getItem("TotalPrice")
    var subtotal = sessionStorage.getItem("subtotal")

    setSelectedOccasions(prevSelected => {
      const isSelected = prevSelected.some(
        soccasion => occasion._id === soccasion._id
      )

      if (isSelected) {
        TotalPrice = parseFloat(TotalPrice) - occasion.price
        subtotal = parseFloat(subtotal) - occasion.price
        var CouponData = JSON.parse(sessionStorage.getItem("CouponData"))
        if (CouponData) {
          if (CouponData.couponCodeType === "Percentage") {
            var discount = (subtotal * CouponData.couponAmount) / 100
            sessionStorage.setItem("coupondis", discount)
            TotalPrice = subtotal - discount
          }
        }
        return prevSelected.filter(soccasion => occasion._id !== soccasion._id)
      } else {
        TotalPrice = parseFloat(TotalPrice) + occasion.price
        subtotal = parseFloat(subtotal) + occasion.price
        var CouponData = JSON.parse(sessionStorage.getItem("CouponData"))
        if (CouponData) {
          if (CouponData.couponCodeType === "Percentage") {
            var discount = (subtotal * CouponData.couponAmount) / 100
            sessionStorage.setItem("coupondis", discount)
            TotalPrice = subtotal - discount
          }
        }
        sessionStorage.setItem("subtotal", subtotal)
        return [...prevSelected, occasion]
      }
    })

    if (IDS.length > 0) {
      const index = IDS.findIndex(
        obj => String(obj.id) === String(occasion._id)
      )

      if (index !== -1) {
        const newIDS = [...IDS.slice(0, index), ...IDS.slice(index + 1)]
        setIDS(newIDS)
      } else {
        setIDS([
          ...IDS,
          { id: occasion._id, price: occasion.price, name: occasion.name },
        ])
      }
    } else {
      setIDS([{ id: occasion._id, price: occasion.price, name: occasion.name }])
    }

    setTimeout(() => {
      additionalImagesRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 200)
  }

  // COMPLETE HANDLE SUBMIT WITH ALL GST FIELDS
  const handleSubmit = () => {
    // Validation
    if (!onlines) {
      toast.error("Please select payment method (Cash/Online)")
      return
    }

    if (offeredDiscount && parseFloat(offeredDiscount) < 0) {
      toast.error("Discount cannot be negative")
      return
    }

    const productMap = selectedOccasions.map((e, i) => {
      return {
        _id: e._id,
        name: e.name,
        type: "other",
        price: e.price,
        quantity: 1,
      }
    })
    
    // COMPLETE BODY DATA WITH ALL GST FIELDS
    const bodyData = {
      // Products and booking info
      products: productMap,
      addons: JSON.stringify(IDS),
      bookingId: sessionStorage.getItem("bookingid"),
      
      // Subtotal after discount (before GST)
      subTotal: subtotalAfterDiscount.toFixed(2),
      
      // GST FIELDS - SENDING CGST AND SGST
      showGst: showGst,
      gstPercentage: gstPercentage,
      gstAmount: gstAmount.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      
      // Total price (with or without GST)
      totalPrice: displayTotal.toFixed(2),
      
      // Discount fields
      offeredDiscount: offeredDiscount ? parseFloat(offeredDiscount) : 0,
      offeredDiscountAmount: offeredDiscountAmount,
      couponAmount: couponDiscount,
      
      // Payment info
      paymentType: onlines,
      paymentOption: totalAmountOption,
      advanceAmount: totalAmountOption === "partialpayment" ? advanceAmount : 0,
      remainingAmount: remainingAmount.toFixed(2),
      
      // Theatre info
      theatrePrice: theaterPrice,
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      
      // Other fields
      cashType: onlines,
      create_type: "admin",
      
      // Extra info for reference
      baseSubtotal: baseSubtotal.toFixed(2),
      subtotalAfterDiscount: subtotalAfterDiscount.toFixed(2)
    }

    console.log("Submitting data to updateaddons:", bodyData)

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateaddons",
        bodyData
      )
      .then(
        res => {
          console.log(res.status, "res.status")
          if (res.status === 200) {
            // Save all settings to sessionStorage
            sessionStorage.setItem("addonsData", JSON.stringify(selectedOccasions))
            sessionStorage.setItem("addons", totalPrice)
            
            // Save calculation results to sessionStorage
            sessionStorage.setItem("baseSubtotal", baseSubtotal.toFixed(2))
            sessionStorage.setItem("offeredDiscount", offeredDiscount)
            sessionStorage.setItem("offeredDiscountAmount", offeredDiscountAmount.toFixed(2))
            sessionStorage.setItem("subtotalAfterDiscount", subtotalAfterDiscount.toFixed(2))
            sessionStorage.setItem("showGst", showGst)
            sessionStorage.setItem("gstPercentage", gstPercentage)
            sessionStorage.setItem("gstAmount", gstAmount.toFixed(2))
            sessionStorage.setItem("cgstAmount", cgstAmount.toFixed(2))
            sessionStorage.setItem("sgstAmount", sgstAmount.toFixed(2))
            sessionStorage.setItem("finalAmount", displayTotal.toFixed(2))
            
            toast.success("Addons updated successfully!")
            history.push("/bookingsummary")
          } else if (res.status === 403) {
            toast.error(
              "Access Denied: You do not have permission to view this page."
            )
            history.push("/theaters")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            console.log(error.response)
            toast.error(error.response.data?.message || "Error updating addons")
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.data?.message || "Payment required")
            setTimeout(() => {
              history.push("/theaters")
            }, 2000)
          } else {
            toast.error("Something went wrong. Please try again.")
          }
        }
      )
  }

  const handleClick = () => {
    history.push("/bookingcake")
  }

  const cakecartdata = JSON.parse(sessionStorage.getItem("cartCakes")) || []
  const cakepricedata = cakecartdata.map(data => data.price)
  const cakevalue = cakepricedata.reduce((acc, curr) => acc + curr, 0)

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Addons" />
          <Row>
            <>
              {isLoading ? (
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
                      className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix "
                    >
                      <div className="container"></div>
                    </section>
                    <section className="shop-area p-relative">
                      <div className="container">
                        <button
                          type="button"
                          className="btn bg-primary"
                          onClick={handleClick}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>
                        <div className="container mt-4">
                          <div className="row mb-4">
                            {/* Addons Products */}
                            <div className="col-md-8 shadow-lg">
                              {addOns.map((data, key) => (
                                <div key={key}>
                                  <div className="row">
                                    <h4 className="mt-1">{data.name}</h4>
                                    <div className="d-flex flex-wrap">
                                      {data?.products.map((ele, ind) => (
                                        <div
                                          className="col-6 col-md-3 mb-3 text-center d-flex"
                                          key={ind}
                                          onClick={() => handleImageClick(ele)}
                                          style={{
                                            cursor: "pointer",
                                            borderRadius: "0.5rem",
                                            display: "flex",
                                            padding: "3px",
                                            boxSizing: "border-box",
                                          }}
                                        >
                                          <div
                                            className="d-flex flex-column justify-content-between align-items-center w-100"
                                            style={{
                                              padding: "10px",
                                              border: "2px solid #E9BE5F",
                                              borderRadius: "10px",
                                              background:
                                                selectedOccasions?.some(
                                                  addIds =>
                                                    addIds._id ===
                                                    String(ele._id)
                                                )
                                                  ? "linear-gradient(105deg, rgba(191,149,63,1) 0%, rgba(252,246,186,1) 28%, rgba(195,156,76,1) 66%, rgba(203,165,79,1) 79%, rgba(255,233,144,1) 94%)"
                                                  : "transparent",
                                              color: selectedOccasions?.some(
                                                addIds =>
                                                  addIds._id === String(ele._id)
                                              )
                                                ? "black"
                                                : "inherit",
                                            }}
                                          >
                                            <div>
                                              <img
                                                src={URLS.Base + ele.image}
                                                alt="occasions images"
                                                className="img-fluid"
                                                style={{
                                                  height: "125px",
                                                  width: "130px",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            </div>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {ele.name}
                                            </p>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              ₹ {ele.price}/-
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <span style={{ color: "red" }}>
                                <b>Note:</b> The timing of the photography
                                sessions is subject to the availability of our
                                photographers. We strive to accommodate your
                                preferred schedule and appreciate your
                                understanding and flexibility. For specific
                                booking inquiries, please contact us directly.
                              </span>
                            </div>

                            {/* Booking Summary */}
                            <div className="col-lg-4 col-md-5">
                              <div
                                className="position-sticky"
                                style={{ top: "20px" }}
                              >
                                {/* Total Display */}
                                <div className="shadow-lg mb-3">
                                  <div className="card-body mt-3">
                                    <div className="d-flex justify-content-between align-items-center shadow-none mb-2 rounded ">
                                      <div>Total:</div>
                                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#300843" }}>
                                        ₹ {displayTotal.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="small text-muted text-end">
                                      {showGst 
                                        ? `(+ ${gstPercentage}% GST included)` 
                                        : "(GST not included)"}
                                    </div>
                                  </div>
                                </div>

                                {/* GST Toggle with CGST/SGST breakdown */}
                                <div className="shadow-lg mb-3 p-3">
                                  <div 
                                    className="d-flex justify-content-between align-items-center"
                                    onClick={handleGstToggle}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div>
                                      <span style={{ fontWeight: "bold" }}>GST ({gstPercentage}%)</span>
                                      {showGst && (
                                        <div className="small text-muted">
                                          CGST: ₹{cgstAmount.toFixed(2)} | SGST: ₹{sgstAmount.toFixed(2)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="gstSwitch"
                                        checked={showGst}
                                        onChange={() => {}} // Empty onChange to avoid warning
                                        style={{ 
                                          cursor: "pointer", 
                                          width: "50px", 
                                          height: "25px",
                                          pointerEvents: "none"
                                        }}
                                      />
                                      <label 
                                        className="form-check-label" 
                                        htmlFor="gstSwitch"
                                        style={{ marginLeft: "10px", cursor: "pointer" }}
                                      >
                                        {showGst ? "With GST" : "Without GST"}
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Options (Full/Advance) */}
                                <div className="shadow-lg mb-3 p-3">
                                  <div className="row">
                                    <div className="col-6">
                                      <div 
                                        className="form-check"
                                        onClick={() => handlePaymentOptionClick("fullpayment")}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="paymentOption"
                                          id="fullpaymentOption"
                                          value="fullpayment"
                                          checked={totalAmountOption === "fullpayment"}
                                          onChange={() => {}} // Empty onChange to avoid warning
                                          style={{ cursor: "pointer", pointerEvents: "none" }}
                                        />
                                        <label 
                                          className="form-check-label" 
                                          htmlFor="fullpaymentOption"
                                          style={{ cursor: "pointer" }}
                                        >
                                          Full Payment
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div 
                                        className="form-check"
                                        onClick={() => handlePaymentOptionClick("partialpayment")}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="paymentOption"
                                          id="partialpaymentOption"
                                          value="partialpayment"
                                          checked={totalAmountOption === "partialpayment"}
                                          onChange={() => {}} // Empty onChange to avoid warning
                                          style={{ cursor: "pointer", pointerEvents: "none" }}
                                        />
                                        <label 
                                          className="form-check-label" 
                                          htmlFor="partialpaymentOption"
                                          style={{ cursor: "pointer" }}
                                        >
                                          Advance (₹{advanceAmount})
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {totalAmountOption === "partialpayment" && (
                                    <div className="mt-2 text-muted small">
                                      Remaining: ₹{remainingAmount.toFixed(2)}
                                    </div>
                                  )}
                                </div>

                                {/* Offered Discount Field */}
                                <div className="shadow-lg mb-3 p-3">
                                  <div className="mb-2">
                                    <span style={{ fontWeight: "bold" }}>Offered Discount (₹)</span>
                                  </div>
                                  <div className="input-group">
                                    <span className="input-group-text">₹</span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter discount amount"
                                      value={offeredDiscount}
                                      onChange={handleOfferedDiscountChange}
                                    />
                                  </div>
                                  {offeredDiscount && offeredDiscountAmount > 0 && (
                                    <div className="mt-2 text-success small">
                                      <i className="bx bx-check-circle me-1"></i>
                                      Discount applied: ₹{offeredDiscountAmount.toFixed(2)}
                                    </div>
                                  )}
                                </div>

                                {/* Summary Details Accordion */}
                                <div className="shadow-lg">
                                  <div className="card-body">
                                    <div
                                      className="accordion"
                                      id="accordionExample"
                                    >
                                      <div className="accordion-item">
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
                                              {/* Theatre Price */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                }}
                                              >
                                                <div>
                                                  Theatre Price (
                                                  {sessionStorage.getItem("countPeople")} ppl)
                                                </div>
                                                <div>₹{theaterPrice}</div>
                                              </div>
                                              <hr />
                                              
                                              {/* Addons */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                  marginBottom: "8px",
                                                }}
                                              >
                                                <div>Addons</div>
                                              </div>
                                              {selectedOccasions.map(
                                                (occasion, index) => (
                                                  <div
                                                    key={index}
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      marginBottom: "8px",
                                                    }}
                                                  >
                                                    <div>{occasion.name}</div>
                                                    <div>₹{occasion.price}</div>
                                                  </div>
                                                )
                                              )}

                                              {selectedOccasions.length > 0 && (
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    marginTop: "8px",
                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  ₹ {totalPrice}
                                                </div>
                                              )}

                                              <hr />
                                              
                                              {/* Occasion */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                }}
                                              >
                                                <div>
                                                  Occasions (
                                                  {sessionStorage.getItem("occasionName")})
                                                </div>
                                                <div>₹{occasionPrice}</div>
                                              </div>
                                              <hr />
                                              
                                              {/* Cake */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                }}
                                              >
                                                <div>Cake</div>
                                                <div>₹{cakePrice}</div>
                                              </div>
                                              <hr />
                                              
                                              {/* Base Subtotal */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                }}
                                              >
                                                <div>Base Subtotal</div>
                                                <div>₹{baseSubtotal.toFixed(2)}</div>
                                              </div>
                                              
                                              {/* Coupon Discount */}
                                              {couponDiscount > 0 && (
                                                <>
                                                  <hr />
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      color: "#28a745",
                                                    }}
                                                  >
                                                    <div>Coupon Discount</div>
                                                    <div>- ₹{couponDiscount.toFixed(2)}</div>
                                                  </div>
                                                </>
                                              )}
                                              
                                              {/* Offered Discount - Directly subtract hota hai */}
                                              {offeredDiscountAmount > 0 && (
                                                <>
                                                  <hr />
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      color: "#28a745",
                                                    }}
                                                  >
                                                    <div>Offered Discount</div>
                                                    <div>- ₹{offeredDiscountAmount.toFixed(2)}</div>
                                                  </div>
                                                </>
                                              )}
                                              
                                              <hr />
                                              
                                              {/* Subtotal after discount */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                  fontWeight: "bold",
                                                  backgroundColor: "#e8f5e9",
                                                  padding: "5px",
                                                  borderRadius: "4px"
                                                }}
                                              >
                                                <div>Subtotal after discount</div>
                                                <div>₹{subtotalAfterDiscount.toFixed(2)}</div>
                                              </div>
                                              
                                              {/* GST Breakdown */}
                                              {showGst && (
                                                <>
                                                  <hr />
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      color: "#6c757d",
                                                    }}
                                                  >
                                                    <div>CGST (9%)</div>
                                                    <div>+ ₹{cgstAmount.toFixed(2)}</div>
                                                  </div>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      color: "#6c757d",
                                                    }}
                                                  >
                                                    <div>SGST (9%)</div>
                                                    <div>+ ₹{sgstAmount.toFixed(2)}</div>
                                                  </div>
                                                </>
                                              )}
                                              
                                              <hr />
                                              
                                              {/* Final Total */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                  fontSize: "18px",
                                                  fontWeight: "bold",
                                                  color: "#300843",
                                                  backgroundColor: "#f8f9fa",
                                                  padding: "12px",
                                                  borderRadius: "5px",
                                                  marginTop: "10px",
                                                  border: "2px solid #E9BE5F"
                                                }}
                                              >
                                                <div>Final Total</div>
                                                <div>₹{displayTotal.toFixed(2)}</div>
                                              </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div className="row mt-3">
                                              <div className="col-6">
                                                <div 
                                                  className="form-check"
                                                  onClick={() => handleCashOptionClick("cash")}
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="cashOption"
                                                    value="cash"
                                                    checked={onlines === "cash"}
                                                    onChange={() => {}} // Empty onChange to avoid warning
                                                    style={{ cursor: "pointer", pointerEvents: "none" }}
                                                  />
                                                  <label 
                                                    className="form-check-label" 
                                                    htmlFor="cashOption"
                                                    style={{ cursor: "pointer" }}
                                                  >
                                                    Cash
                                                  </label>
                                                </div>
                                              </div>
                                              <div className="col-6">
                                                <div 
                                                  className="form-check"
                                                  onClick={() => handleCashOptionClick("online")}
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="onlineOption"
                                                    value="online"
                                                    checked={onlines === "online"}
                                                    onChange={() => {}} // Empty onChange to avoid warning
                                                    style={{ cursor: "pointer", pointerEvents: "none" }}
                                                  />
                                                  <label 
                                                    className="form-check-label" 
                                                    htmlFor="onlineOption"
                                                    style={{ cursor: "pointer" }}
                                                  >
                                                    Online
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Proceed Button */}
                                <button
                                  type="submit"
                                  onClick={handleSubmit}
                                  className="btn bg-primary w-100 mt-3"
                                  style={{
                                    boxShadow: "none",
                                    color: "black",
                                    border: "none",
                                    padding: "12px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Proceed to Summary
                                </button>
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

export default AddOns