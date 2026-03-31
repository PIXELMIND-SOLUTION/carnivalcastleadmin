import React, { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer, toast } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
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

const ComboPlans = () => {
  var gets = localStorage.getItem("authUser")
  var dataa = JSON.parse(gets)
  var datas = dataa.token
  var token = datas
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
  const [showImages, setShowImages] = useState(null)
  console.log(showImages)
  const [cakesFlavour, setCakesFlavour] = useState(null)
  console.log(cakesFlavour)
  const [itemkey, setItemkey] = useState("")
  const [plans, setPlans] = useState([])
  console.log(plans)
  const [planProducts, setPlanProducts] = useState([])
  console.log(planProducts)
  const [cakes, setCakes] = useState([]) // egg and eglees
  const [otherProducts, setotherProducts] = useState([]) // other PLAN PRODUCTS
  console.log(otherProducts)

  const [totalAmountOption, setTotalAmountOption] = useState({
    amountOption: "partialpayment", // Set this to "partialpayment" by default
  })

  // GST toggle states
  const [showGst, setShowGst] = useState(true)
  const [gstPercentage, setGstPercentage] = useState(18)
  
  // Offered Discount state
  const [offeredDiscount, setOfferedDiscount] = useState("")
  
  // CGST and SGST amounts
  const [cgstAmount, setCgstAmount] = useState(0)
  const [sgstAmount, setSgstAmount] = useState(0)
  const [gstAmount, setGstAmount] = useState(0)

  // const navigate = useNavigate();
  useEffect(() => {
    axios.post(URLS.GetAllTheaters, {}).then(res => {
      if (res.status === 200) {
        setIsLoading(false)
      }
    })
    sessionStorage.setItem("paymentkey", "partialpayment")
    getGstPercentage()
  }, [])

  const getGstPercentage = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {})
      if (res.status === 200) {
        console.log(res.data.charges, "response")
        setGstPercentage(Number(res.data.charges.bookingGst) || 18)
        setAdvanceAmount(Number(res.data.charges.comboAdvancePayment))
        sessionStorage.setItem(
          "comboAdvancePayment",
          res.data.charges.comboAdvancePayment
        )
        sessionStorage.setItem("gstPercentage", res.data.charges.bookingGst || 18)
      }
    } catch (error) {
      console.error("Error fetching GST:", error)
    }
  }

  useEffect(() => {
    const getid = sessionStorage.getItem("theaterId")
    const occasiondata = sessionStorage.getItem("occasion")
    const datas = JSON.parse(occasiondata)

    if (datas && getid) {
      axios
        .post(URLS.GetOccationById, { occasionId: datas._id, theatreId: getid })
        .then(res => {
          console.log(res.data)
          setPlans(res.data?.plans || [])
        })
    }
  }, [])

  const handleBack = () => {
    history.push("/combooccassions")
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

  // const handleFlavourChange = (e, i) => {
  //   const updatedFlavours = [...cakesFlavour];
  //   updatedFlavours[i] = {
  //     ...updatedFlavours[i],
  //     [e.target.name]: e.target.value,
  //   };
  //   setCakesFlavour(updatedFlavours);
  // };

  const [advanceAmount, setAdvanceAmount] = useState(0)
  console.log(advanceAmount)

  const [totalAmountOption1, setTotalAmountOption1] = useState("")

  const slecthandleChange = e => {
    const myChange = { ...totalAmountOption }
    myChange[e.target.name] = e.target.value
    console.log(e.target.value)
    sessionStorage.setItem("paymentkey", e.target.value)
    setTotalAmountOption(myChange)
    if (e.target.value == "partialpayment") {
      const advanceamountkey =
        parseFloat(sessionStorage.getItem("TotalPrice")) -
        parseFloat(advanceAmount)
      setTotalAmountOption1(advanceamountkey)
      sessionStorage.setItem("TotalPrice2", advanceamountkey)
      sessionStorage.setItem("advancePayment", parseFloat(advanceAmount))
    } else {
      const advanceamountkey = parseFloat(sessionStorage.getItem("TotalPrice"))
      setTotalAmountOption1(advanceamountkey)
      sessionStorage.setItem("TotalPrice2", advanceamountkey)
    }
  }

  // Conditional total amount calculation
  const remainingAmount =
    totalAmountOption === "fullpayment"
      ? 0
      : sessionStorage.getItem("TotalPrice") - advanceAmount

  const totalAmount = Number(sessionStorage.getItem("TotalPrice"))
  const remainingAmountFixed = remainingAmount.toFixed(2)
  const totalAmountFixed = totalAmount.toFixed(2)
  const displayedAdvanceAmount =
    totalAmountOption === "fullpayment" ? 0 : advanceAmount

  const [extrapersionschanges, setextrapersionschanges] = useState(0)
  const [extrapersionschanges1, setextrapersionschanges1] = useState(0)

  const nintymin = Number(sessionStorage.getItem("nintymin"))

  const [plansdata, setplansdata] = useState([])
  console.log(plansdata)

  // const handleChoose = (item) => {
  //   setplansdata(item)
  //   setShowImages((prevVisibleImages) => ({
  //     ...prevVisibleImages,
  //     [item._id]: !prevVisibleImages[item._id]
  //   }));

  // }

  const [theaterplanstate, settheaterplanstate] = useState(0)
  const [totalplanprice, settotalplanprice] = useState(0)
  const [subtotalplanprice, setsubtotalplanprice] = useState(0)
  
  // Calculate GST amounts whenever subtotal changes
  useEffect(() => {
    if (subtotalplanprice > 0) {
      const calculatedGstAmount = (subtotalplanprice * gstPercentage) / 100;
      setGstAmount(calculatedGstAmount);
      setCgstAmount(calculatedGstAmount / 2);
      setSgstAmount(calculatedGstAmount / 2);
    } else {
      setGstAmount(0);
      setCgstAmount(0);
      setSgstAmount(0);
    }
  }, [subtotalplanprice, gstPercentage]);
  
  // Final total based on GST toggle
  const finalTotal = showGst ? subtotalplanprice + gstAmount : subtotalplanprice;
  
  // Apply offered discount to subtotal
  const offeredDiscountAmount = offeredDiscount && offeredDiscount !== "" 
    ? parseFloat(offeredDiscount) 
    : 0;
  
  // Calculate discounted subtotal
  const discountedSubtotal = subtotalplanprice - offeredDiscountAmount;
  
  // Calculate GST on discounted subtotal
  const discountedGstAmount = (discountedSubtotal * gstPercentage) / 100;
  const discountedCgstAmount = discountedGstAmount / 2;
  const discountedSgstAmount = discountedGstAmount / 2;
  
  // Final total after discount (with or without GST)
  const finalTotalAfterDiscount = showGst 
    ? discountedSubtotal + discountedGstAmount 
    : discountedSubtotal;

  const handleChoose = (item, index) => {
    setplansdata(item)
    if (showImages === index) {
      setShowImages(null)
    } else {
      setShowImages(index)
    }
    axios.post(URLS.GetByPlanIdProducts, { planId: item._id }).then(res => {
      const selectedCaketype = res?.data?.planProducts.filter(
        cake => cake.categoryName === "cakes"
      )
      setPlanProducts(selectedCaketype[0])
      setCakes(selectedCaketype)
      const selectedCaketype1 = res?.data?.planProducts.filter(
        cake => cake.categoryName !== "cakes"
      )
      setotherProducts(selectedCaketype1)
    })
    const theaterPrice =
      parseFloat(
        nintymin == 90
          ? sessionStorage.getItem("theatrePrices")
          : sessionStorage.getItem("theatrePrices")
      ) || 0
    // settheaterPriceplan(theaterPrice)
    const theaterplanprice =
      nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice
    settheaterplanstate(theaterplanprice)
    sessionStorage.setItem("planpricesss", theaterplanprice)
    const extrapersions = sessionStorage.getItem("countPeople")
    if (Number(extrapersions) > item.noOfPersons) {
      const extrapersons = extrapersions - item.noOfPersons
      setextrapersionschanges1(extrapersons)
      const extrapersonscharge = extrapersons * item.extraPersonPrice
      setextrapersionschanges(extrapersonscharge)
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge)
      const totalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0) -
        parseFloat(sessionStorage.getItem("coupondis") || 0)
      const subtotalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0)
      settotalplanprice(totalallprice)
      setsubtotalplanprice(subtotalallprice)
      sessionStorage.setItem("totalallprice", totalallprice)
      sessionStorage.setItem("subtotalallprice", subtotalallprice)
    } else {
      const extrapersonscharge = 0
      const totalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0) -
        parseFloat(sessionStorage.getItem("coupondis") || 0)
      const subtotalallprice =
        parseFloat(theaterplanprice) +
        parseFloat(extrapersonscharge) +
        parseFloat(item.theatrePriceIncluded === "No" ? theaterPrice : 0)
      settotalplanprice(totalallprice)
      setsubtotalplanprice(subtotalallprice)
      sessionStorage.setItem("totalallprice", totalallprice)
      sessionStorage.setItem("subtotalallprice", subtotalallprice)
      setextrapersionschanges1(0)
      setextrapersionschanges(extrapersonscharge)
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge)
    }
  }

  const handleFlavourChange = e => {
    const selectedId = e.target.value
    const selectedCake = cakes.find(cake => cake._id === selectedId)
    console.log(selectedCake)
    setPlanProducts(selectedCake || null) // Handle case where no cake is selected
  }
  const singleCake = data => {
    setPlanProducts(data)
    console.log(data)
  }

  const handleGoToBookingSummary = () => {
    history.push("/theaters")
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
    setTotalAmountOption({ amountOption: value })
    sessionStorage.setItem("paymentkey", value)
  }

  // Cash/Online handler
  const [onlines, setOnline] = useState(sessionStorage.getItem("payType") || "cash")
  console.log(onlines)

  const handleCashOptionClick = (value) => {
    console.log("Payment method selected:", value)
    setOnline(value)
    sessionStorage.setItem("payType", value)
  }

  const handleSubmit = () => {
    // Validate discount
    if (offeredDiscount && parseFloat(offeredDiscount) < 0) {
      toast.error("Discount cannot be negative")
      return
    }
    
    if (offeredDiscount && parseFloat(offeredDiscount) > subtotalplanprice) {
      toast.error("Discount cannot exceed subtotal amount")
      return
    }

    const bodyData = {
      bookingId: sessionStorage.getItem("bookingid"),
      totalPrice: finalTotalAfterDiscount.toFixed(2),
      subTotal: discountedSubtotal.toFixed(2),
      originalSubtotal: subtotalplanprice.toFixed(2),
      planId: plansdata._id,
      flavour: planProducts?.name,
      productId: planProducts?._id,
      
      // GST FIELDS
      showGst: showGst,
      gstPercentage: gstPercentage,
      gstAmount: discountedGstAmount.toFixed(2),
      cgstAmount: discountedCgstAmount.toFixed(2),
      sgstAmount: discountedSgstAmount.toFixed(2),
      
      // Discount fields
      offeredDiscount: offeredDiscount ? parseFloat(offeredDiscount) : 0,
      offeredDiscountAmount: offeredDiscountAmount,
      
      // Extra person charges
      extraPersonCharge: extrapersionschanges,
      extraPersonCount: extrapersionschanges1,
      
      // Plan details
      planPrice: theaterplanstate,
      theatrePriceIncluded: plansdata.theatrePriceIncluded,
      theatrePrice: plansdata.theatrePriceIncluded === "No" ? sessionStorage.getItem("theatrePrices") : 0,
      
      // Payment info
      paymentType: onlines,
      paymentOption: totalAmountOption.amountOption,
      advanceAmount: totalAmountOption.amountOption === "partialpayment" ? advanceAmount : 0,
      remainingAmount: totalAmountOption.amountOption === "partialpayment" 
        ? (finalTotalAfterDiscount - advanceAmount).toFixed(2) 
        : 0,
      
      // Coupon info
      couponAmount: parseFloat(sessionStorage.getItem("coupondis") || 0),
    }

    console.log("Submitting combo plan with GST:", bodyData)

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecombo",
        bodyData
      )
      .then(
        res => {
          if (res.status === 200) {
            console.log(res.data)
            
            // Save all settings to sessionStorage
            sessionStorage.setItem("comboSubtotal", subtotalplanprice.toFixed(2))
            sessionStorage.setItem("comboDiscountedSubtotal", discountedSubtotal.toFixed(2))
            sessionStorage.setItem("comboOfferedDiscount", offeredDiscount)
            sessionStorage.setItem("comboOfferedDiscountAmount", offeredDiscountAmount.toFixed(2))
            sessionStorage.setItem("comboShowGst", showGst)
            sessionStorage.setItem("comboGstPercentage", gstPercentage)
            sessionStorage.setItem("comboGstAmount", discountedGstAmount.toFixed(2))
            sessionStorage.setItem("comboCgstAmount", discountedCgstAmount.toFixed(2))
            sessionStorage.setItem("comboSgstAmount", discountedSgstAmount.toFixed(2))
            sessionStorage.setItem("comboFinalAmount", finalTotalAfterDiscount.toFixed(2))
            
            toast.success("Plan selected successfully!")
            history.push("/combocheckout")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            console.log(error.response)
            toast.error(error.response.data?.message || "Error updating plan")
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

  const advanceAmount1 =
    totalAmountOption.amountOption === "partialpayment"
      ? displayedAdvanceAmount
      : 0
  const totalPrice1 = parseFloat(sessionStorage.getItem("TotalPrice")) || 0
  const remainingAmount1 = totalPrice1 - advanceAmount1

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Combo Plans"
          />
          <Row>
            <>
              {isLoading ? (
                <div
                  className="text-center"
                  style={{
                    // background:
                    //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
                    backgroundColor: "var(--charcoal-black)",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    {/* <img
                      src="assets/img/gipss.gif"
                      style={{ height: "300px" }}
                      alt="Loading"
                    /> */}
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
                    <section className="shop-area p-relative">
                      <div className="container">
                        <button
                          type="button"
                          className="btn mb-2 bg-primary"
                          onClick={handleBack}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>
                        <div className="container mt-4">
                          <div className="row">
                            {plans.length === 0 ? (
                              <div className="col-md-12 shadow-lg p-4 text-center">
                                <div className="text-center">
                                  <h3>
                                    There are no plans available for this
                                    theater. Please choose another theater.
                                  </h3>
                                  <button
                                    type="button"
                                    className="btn mb-2 ms-2 bg-primary"
                                    style={{
                                      // backgroundColor: "#a020f0",
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    onClick={handleGoToBookingSummary}
                                  >
                                    Click Now
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="col-md-8 shadow-lg p-4 gradient-border bg-light-grey">
                                  <div className="row">
                                    {plans.map((item, index) => (
                                      <div key={index}>
                                        <div className="col-lg-4 mb-2">
                                          <div
                                            className="card bg-dark"
                                            style={{
                                              color: "#fff",
                                              borderRadius: "10px",
                                              padding: "20px",
                                              marginTop: "20px",
                                              width: "300px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleChoose(item, index)
                                            }
                                          >
                                            <h2 className="fw-bold text-gold-gradient">
                                              {item.name}
                                            </h2>
                                            <p>({item.noOfPersons}) Members</p>
                                            <ul className="pt-4 opls">
                                              {item?.benefits?.map(
                                                (datas, is) => (
                                                  <li className="pb-2" key={is}>
                                                    <img
                                                      draggable="false"
                                                      role="img"
                                                      className="emoji m-1"
                                                      alt="🌟"
                                                      style={{ height: "15px" }}
                                                      src="https://s.w.org/images/core/emoji/15.0.3/svg/1f31f.svg"
                                                    />
                                                    {datas}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                            <p>
                                              <del className="text-center">
                                                <small>₹ </small>
                                                {item.price}
                                              </del>
                                            </p>
                                            <h3>
                                              <small> ₹</small>
                                              {nintymin == 90
                                                ? item.oneandhalfslotPrice
                                                : item.offerPrice}
                                              /-
                                              {/* {item.offerPrice}/- */}
                                            </h3>
                                            <button
                                              className="btn btn-success  mt-3 main-booknow"
                                              style={{
                                                boxShadow: "none",
                                                color: "black",
                                                border: "none",
                                              }}
                                              onClick={() =>
                                                handleChoose(item, index)
                                              }
                                            >
                                              {showImages === index
                                                ? "Hide"
                                                : "Choose"}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="row d-flex">
                                      {Object.keys(plansdata).length > 0 ? (
                                        <div
                                          className="col-md-4 col-sm-6 mb-4 d-flex flex-column"
                                          style={{ cursor: "pointer" }}
                                        >
                                          {/* Card */}
                                          <div
                                            className="card flex-fill"
                                            style={{
                                              border: "none",
                                              boxShadow:
                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            }}
                                          >
                                            <div
                                              style={{ position: "relative" }}
                                            >
                                              {/* Conditionally render the badge if the cake is eggless */}
                                              {planProducts?.cakeType ===
                                                "eggless" && (
                                                <span
                                                  className="badge bg-success"
                                                  style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    left: "10px",
                                                    zIndex: "1",
                                                  }}
                                                >
                                                  Eggless
                                                </span>
                                              )}
                                              <img
                                                src={
                                                  URLS.Base + planProducts?.image
                                                }
                                                className="card-img-top"
                                                alt="Combo Image"
                                                style={{
                                                  height: "200px",
                                                  width: "100%",
                                                  objectFit: "cover",
                                                  borderBottom:
                                                    "1px solid #ddd",
                                                }}
                                              />
                                            </div>

                                            <div className="card-body bg-dark text-white gradient-border">
                                              {/* Cake name and egg/eggless images in one row */}
                                              <div className="d-flex justify-content-between align-items-center">
                                                <h5
                                                  className="card-title"
                                                  style={{
                                                    fontSize: "15px",
                                                    margin: "0",
                                                  }}
                                                >
                                                  {planProducts?.name}
                                                </h5>

                                                {/* Conditionally render the base64 image for egg or eggless cake */}
                                                {planProducts?.cakeType ===
                                                "egg" ? (
                                                  <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABW0lEQVR4nN2VP0sDQRDF01gIgoWFYGGhCBaCxRWGS/LeXXKFihK/kljoF/FT+LcRLFIIFoKgaDTZPRUVEy0sjOSYO84YzWruQBzYZvYxP+bNsJvJ/JvwyXkNXGmy9dujyDcNVHzXnfwE0GS1n+L6I2izGyC47MuFQsEWwEEqAOU4c0Ed4DAVQN11LQFUfgTQjlPWwJ4GmsEhdxW51KnzXXc2sAg4MgZocuPLYQJrca0iZ6SDYyOAJld6bUwdWAz1NXJaACdmAGC/50oC26H+BpiSLTo17eDZAPAY6fP5Ccmfm3bQNAA8RBblcuOSv0zSoq1Qf2vbY2JRzQzgOGWDIS9E+mJxVPK+EUC6WP/mzVmNa69LpRHZojtjQDsUsKzJHQU0FPnU3pz4eoZx73nDnYNP9rEjhwTQSAVQzWYHpc5LKoCWZQ3IbF7T/nDOun+ZSUCAC016/Tjxt+IdjFUzfH0mcf4AAAAASUVORK5CYII="
                                                    alt="Egg Cake"
                                                    style={{
                                                      width: "20px",
                                                      marginLeft: "10px",
                                                    }}
                                                  />
                                                ) : planProducts?.cakeType ===
                                                  "eggless" ? (
                                                  <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nGNgGDZAdH6Fh9iCisfiCyv+k40XVPwTW1hxRnRBiTKGBWILyx9RZPhCFIuWYlgAk6QoFBaVWUEtOEoTC8QXVZiDzBBbUH6CJhZILqgwBluwsOIMSRaILSz3F1tYsV9sQcUXMF5Yvk98YYUPujrRReX60CC6QLQFYgsrOvBEaDOKGYsqdaBBdJkoC8QWVQYQSjESCyu84EE0v1IDEkTl14mzYEH5AcLJsnwPTL3IvFJVqPgt4ixYWP6ViHT/Aa5+boUSNIjuEemDii9E+OA9PIgWlstBLKh4SL0gWlCxG6ZeeE6pFFT8KbFB5E8wkheUecLVL6sUh/rgJVEWQIOpHY/rG5HVSi2sEIbGwRuiLQAB8UXlvmILKvaKLyj/LL6w4hMo5SAnTxgQnFnOjx7x1C3sVtXzQHxW/pkmFsisKuSExsE3mljAMDONFWrOL9pWOAsr7mKvMqlgidiC8gdiCytcKAqJQQUAHGz+5dhaYC0AAAAASUVORK5CYII="
                                                    alt="Eggless Cake"
                                                    style={{
                                                      width: "20px",
                                                      marginLeft: "10px",
                                                    }}
                                                  />
                                                ) : null}
                                              </div>
                                            </div>
                                            {planProducts?.categoryName ===
                                            "cakes" ? (
                                              <select
                                                className="form-select"
                                                aria-label="Cake size selection"
                                                value={cakesFlavour?._id || ""}
                                                name="flavour"
                                                required
                                                onChange={handleFlavourChange}
                                                style={{ marginTop: "0px" }}
                                              >
                                                <option value="">
                                                  Select Flavour
                                                </option>
                                                {cakes.map((flavour, index) => (
                                                  <option
                                                    key={index}
                                                    value={flavour._id}
                                                  >
                                                    {flavour.name}
                                                  </option>
                                                ))}
                                              </select>
                                            ) : null}
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>

                                    <div className="row d-flex">
                                      {Object.keys(plansdata).length > 0 ? (
                                        <>
                                          {otherProducts.map((data, index) => (
                                            <div
                                              key={index}
                                              // className="col-md-4 col-sm-6 mb-4 d-flex flex-column"
                                              className="col-6 col-sm-4 col-md-4 mb-4 d-flex flex-column"
                                              style={{ cursor: "pointer" }}
                                            >
                                              {/* Card */}
                                              <div
                                                className="card flex-fill"
                                                style={{
                                                  border: "none",
                                                  boxShadow:
                                                    "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                }}
                                              >
                                                <div>
                                                  <img
                                                    src={URLS.Base + data.image}
                                                    className="card-img-top"
                                                    alt="Combo Image"
                                                    style={{
                                                      height: "120px",
                                                      width: "100%",
                                                      objectFit: "cover",
                                                      borderBottom:
                                                        "1px solid #ddd",
                                                    }}
                                                  />
                                                </div>

                                                <div className="card-body bg-dark text-white gradient-border">
                                                  <div className="d-flex justify-content-between align-items-center">
                                                    <h6
                                                      className=""
                                                      style={{
                                                        fontSize: "12px",
                                                        margin: "0",
                                                      }}
                                                    >
                                                      {data.name}
                                                    </h6>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {Object.keys(plansdata).length > 0 && (
                                  <div className="col-lg-4 col-md-5 mb-5">
                                    <div
                                      className="position-sticky"
                                      style={{ top: "20px" }}
                                    >
                                      <div className="">
                                        <div className="card-body shadow-lg">
                                          <div className="d-flex justify-content-between align-items-center shadow-none mb-2 rounded ">
                                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Total:</div>
                                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#300843" }}>
                                              ₹ {finalTotalAfterDiscount.toFixed(2)}
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
                                      <div className="shadow-lg mb-3 p-3 mt-3">
                                        <div 
                                          className="d-flex justify-content-between align-items-center"
                                          onClick={handleGstToggle}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <div>
                                            <span style={{ fontWeight: "bold" }}>GST ({gstPercentage}%)</span>
                                            {showGst && (
                                              <div className="small text-muted">
                                                CGST: ₹{discountedCgstAmount.toFixed(2)} | SGST: ₹{discountedSgstAmount.toFixed(2)}
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
                                                checked={totalAmountOption.amountOption === "fullpayment"}
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
                                                checked={totalAmountOption.amountOption === "partialpayment"}
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
                                        
                                        {totalAmountOption.amountOption === "partialpayment" && (
                                          <div className="mt-2 text-muted small">
                                            Remaining: ₹{(finalTotalAfterDiscount - advanceAmount).toFixed(2)}
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

                                      <div className="shadow-lg mt-3">
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
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>Plan Price</div>
                                                      <div>
                                                        ₹ {theaterplanstate}
                                                      </div>
                                                    </div>

                                                    <hr />
                                                    
                                                    {/* theatrePriceIncluded yes or no*/}
                                                    {plansdata.theatrePriceIncluded ===
                                                      "No" && (
                                                      <>
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                          }}
                                                        >
                                                          <div>Theater Price</div>
                                                          <div>
                                                            ₹
                                                            {sessionStorage.getItem(
                                                              "theatrePrices"
                                                            )}
                                                          </div>
                                                        </div>
                                                        <hr />
                                                      </>
                                                    )}

                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>
                                                        Extra Person Price(
                                                        {extrapersionschanges1})
                                                      </div>
                                                      <div>
                                                        ₹{extrapersionschanges}
                                                      </div>
                                                    </div>
                                                    <hr />

                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <div>Base Subtotal</div>
                                                      <div>
                                                        ₹{subtotalplanprice.toFixed(2)}
                                                      </div>
                                                    </div>
                                                    
                                                    {/* Offered Discount - Directly subtract */}
                                                    {offeredDiscountAmount > 0 && (
                                                      <>
                                                        <hr />
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
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
                                                        justifyContent:
                                                          "space-between",
                                                        fontWeight: "bold",
                                                        backgroundColor: "#e8f5e9",
                                                        padding: "5px",
                                                        borderRadius: "4px"
                                                      }}
                                                    >
                                                      <div>Subtotal after discount</div>
                                                      <div>₹{discountedSubtotal.toFixed(2)}</div>
                                                    </div>
                                                    
                                                    {/* Coupon Amount */}
                                                    {parseFloat(sessionStorage.getItem("coupondis")) > 0 && (
                                                      <>
                                                        <hr />
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                          }}
                                                        >
                                                          <div>Coupon Amount</div>
                                                          <div>
                                                            - ₹
                                                            {parseFloat(
                                                              sessionStorage.getItem(
                                                                "coupondis"
                                                              )
                                                            ).toFixed(2)}
                                                          </div>
                                                        </div>
                                                      </>
                                                    )}

                                                    {/* GST Breakdown */}
                                                    {showGst && (
                                                      <>
                                                        <hr />
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                            color: "#6c757d",
                                                          }}
                                                        >
                                                          <div>CGST (9%)</div>
                                                          <div>+ ₹{discountedCgstAmount.toFixed(2)}</div>
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            justifyContent:
                                                              "space-between",
                                                            color: "#6c757d",
                                                          }}
                                                        >
                                                          <div>SGST (9%)</div>
                                                          <div>+ ₹{discountedSgstAmount.toFixed(2)}</div>
                                                        </div>
                                                      </>
                                                    )}
                                                    
                                                    <hr />
                                                    
                                                    {/* Final Total */}
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
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
                                                      <div>₹{finalTotalAfterDiscount.toFixed(2)}</div>
                                                    </div>
                                                    <hr />

                                                    {/* Payment Method */}
                                                    <div className="row">
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
                                      </div>

                                      <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="btn w-100 mt-2 bg-primary"
                                        style={{
                                          // backgroundColor: "#a020f0",
                                          boxShadow: "none",
                                          color: "black",
                                          border: "none",
                                          padding: "12px",
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Proceed to Checkout
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
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

export default ComboPlans