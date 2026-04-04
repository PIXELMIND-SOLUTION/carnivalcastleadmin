import React, { useState, useEffect, useRef } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { ToastContainer } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { URLS } from "../../Weburls"
import axios from "axios"
// import "bootstrap-icons/font/bootstrap-icons.css";
import { useHistory } from "react-router-dom"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import "./cakes.css"
import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap"

const CakesComponent = () => {
  var gets = localStorage.getItem("authUser")
  var data123 = JSON.parse(gets)
  var datas = data123.token
  var token = datas

  const [selectedCakes, setSelectedCakes] = useState(
    JSON.parse(sessionStorage.getItem("cartCakes")) || []
  )
  console.log(selectedCakes, "selectedCakes")
  const [isLoading, setIsLoading] = useState(true)
  const [normalCakes, setNormalCakes] = useState([]) // EGG
  const [premiumCakes, setPremiumCakes] = useState([]) // EGGLESS
  const [isEggless, setIsEggless] = useState(false) // Toggleeeee
  const [cakeCategory, setCakeCategory] = useState("all") // New state for premium/normal filter: "all", "normal", "premium"

  const [selectedCakesupdate, setSelectedCakesupdate] = useState([]) //  Select Cakes
  console.log(selectedCakes)
  console.log(selectedCakesupdate)
  const [addons, setAddons] = useState(
    JSON.parse(sessionStorage.getItem("adonsJSON")) || []
  )
  console.log(addons)

  const [newCakes, setNewCakes] = useState([])
  console.log(newCakes)

  const additionalImagesRef = useRef(null)

  const history = useHistory()

  useEffect(() => {
    GetAllCakes()
  }, [])

  const GetAllCakes = () => {
    axios.post(URLS.GetGetAllCakes).then(res => {
      if (res.status === 200) {
        const eggCakes = [
          ...(res?.data?.normalCakes?.filter(cake => cake.cakeType === "egg") ||
            []),
          ...(res?.data?.premiumCakes?.filter(
            cake => cake.cakeType === "egg"
          ) || []),
        ]
        const egglessCakes = [
          ...(res?.data?.normalCakes?.filter(
            cake => cake.cakeType === "eggless"
          ) || []),
          ...(res?.data?.premiumCakes?.filter(
            cake => cake.cakeType === "eggless"
          ) || []),
        ]
        setNormalCakes(eggCakes)
        setPremiumCakes(egglessCakes)
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768) // Open if width is greater than 768px
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Filter cakes based on premium/normal selection
  const getFilteredCakes = () => {
    let baseCakes = isEggless ? premiumCakes : normalCakes
    
    if (cakeCategory === "normal") {
      return baseCakes.filter(cake => cake.cakePremiumOrNormal === "normal")
    } else if (cakeCategory === "premium") {
      return baseCakes.filter(cake => cake.cakePremiumOrNormal === "premium")
    }
    return baseCakes // "all" - return all cakes
  }

  const combineCakes = getFilteredCakes()

  // Initialize CartCakes as an empty array by default
  const [CartCakes, setCartCakes] = useState(() => {
    const savedCartCakes = sessionStorage.getItem("cartCakes")
    return savedCartCakes ? JSON.parse(savedCartCakes) : []
  })

  const [selectedWeights, setSelectedWeights] = useState(
    JSON.parse(sessionStorage.getItem("selectedWeights")) || {}
  )
  console.log(selectedWeights)

  const handleImageClick = (cake, index) => {
    setSelectedWeights(prevWeights => {
      const updatedWeights = {
        ...prevWeights,
        [cake._id]: "500",
      }

      // Store the updated weights in sessionStorage
      sessionStorage.setItem(
        "selectedWeights",
        JSON.stringify(updatedWeights || "500")
      )
      return updatedWeights
    })

    // Update selected cakes
    setSelectedCakes(prevSelectedCakes => {
      console.log(prevSelectedCakes, "prevSelectedCakes")

      // Check if the cake is already selected based on _id
      const isSelected = prevSelectedCakes.some(
        selectedCake => selectedCake._id === cake._id
      )

      // If the cake is already selected, remove it; otherwise, add it
      const newSelectedCakes = isSelected
        ? prevSelectedCakes.filter(
            selectedCake => selectedCake._id !== cake._id
          )
        : [...prevSelectedCakes, cake]

      // Log the new selection
      console.log(newSelectedCakes, "newSelectedCakes")

      return newSelectedCakes
    })
  }

  const handleClick = () => {
    history.push("/occations")
  }

  const handleChange = async (event, index, cake) => {
    setCartCakes(JSON.parse(sessionStorage.getItem("cartCakes")))
    const { value } = event.target
    const weightMultiplier = {
      500: 1,
      1: 2,
      2: 4,
      3: 6,
    }

    const selectedWeight = value || "500" // Default to "500 gms" if no weight is selected
    const weightPriceMultiplier = weightMultiplier[selectedWeight] || 1

    // Update the selected weight
    setSelectedWeights(prevWeights => {
      const updatedWeights = {
        ...prevWeights,
        [cake._id]: selectedWeight,
      }

      // Store the updated weights in sessionStorage
      sessionStorage.setItem(
        "selectedWeights",
        JSON.stringify(updatedWeights || "500")
      )
      return updatedWeights
    })

    // Calculate the new price for the selected weight
    const newPrice = parseFloat(cake.price) * parseFloat(weightPriceMultiplier)

    // Retrieve the previous prices from local storage
    let cakeprice = parseFloat(sessionStorage.getItem("cakeprice") || 0)
    let TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice") || 0)
    let subtotal = parseFloat(sessionStorage.getItem("subtotal") || 0)

    // Retrieve the previously selected weight for the current cake
    const prevWeight = selectedWeights[index] || "500"
    const prevMultiplier = weightMultiplier[prevWeight] || 1
    const prevPrice = parseFloat(cake.price) * parseFloat(prevMultiplier)

    // Update the prices in local storage by subtracting the previous price and adding the new price
    cakeprice = cakeprice - parseFloat(prevPrice) + parseFloat(newPrice)
    TotalPrice = TotalPrice - prevPrice + newPrice
    subtotal = subtotal - prevPrice + newPrice

    var CouponData = JSON.parse(sessionStorage.getItem("CouponData"))
    if (CouponData) {
      if (CouponData.couponCodeType === "Percentage") {
        var discount = (subtotal * CouponData.couponAmount) / 100
        sessionStorage.setItem("coupondis", discount)
        console.log("coupondis", discount)
        TotalPrice = subtotal - discount
      }
    }

    var cakes = JSON.parse(sessionStorage.getItem("cartCakes"))
    // Update the selected cake in the cart with the new weight and price
    setCartCakes(cakes =>
      cakes.map(item =>
        item.id === cake._id.toString()
          ? { ...item, quantity: selectedWeight, price: newPrice }
          : item
      )
    )
    const updatedCakes = await cakes.map(item =>
      item.id === cake._id.toString()
        ? { ...item, quantity: selectedWeight, price: newPrice }
        : item
    )
    // Ensure the cart is updated in local storage
    setSelectedCakesupdate(updatedCakes)
    // sessionStorage.setItem("cartCakes", JSON.stringify(updatedCakes));
  }

  useEffect(() => {
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/bookings/getallbookings",
        { bookingId: sessionStorage.getItem("bookingid") }
      )
      .then(res => {
        console.log(res)
        // var subTotal=res.data.booking.subTotal;

        // console.log(subTotal,"subTotal");
        // var totalPrice=res.data.booking.totalPrice;
        // sessionStorage.setItem("subtotal",subTotal);
        // sessionStorage.setItem("TotalPrice",totalPrice);

        setNewCakes(res.data.booking.products)
        // setSelectedCakes(res.data.booking.products);
        setIDS(res?.data?.booking?.cakes || []) // NewOne
      })
  }, [])

  const totalPrice = selectedCakes.reduce((total, cake) => {
    const weight = selectedWeights[cake._id]
    const priceFactor =
      weight === "500"
        ? 1
        : weight === "1"
        ? 2
        : weight === "2"
        ? 4
        : weight === "3"
        ? 6
        : 1
    return total + cake.price * priceFactor
  }, 0)

  const handleSubmit = async () => {
    sessionStorage.setItem("cartCakes", JSON.stringify(selectedCakes))
    sessionStorage.setItem(
      "cartcakeslength",
      JSON.stringify(
        selectedWeights[selectedCakes.map(data => data)._id || "500"]
      )
    )
    sessionStorage.setItem("cakeprice", totalPrice)
    history.push("/addonsthings")
  }

  // Button styles for claymorphism
  const buttonStyles = {
    allButton: {
      background: cakeCategory === "all" 
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
        : "rgba(255, 255, 255, 0.25)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 28px",
      fontSize: "16px",
      fontWeight: "600",
      color: cakeCategory === "all" ? "white" : "#333",
      boxShadow: cakeCategory === "all" 
        ? "0 8px 20px rgba(102, 126, 234, 0.3)" 
        : "0 4px 15px rgba(0, 0, 0, 0.1)",
      backdropFilter: cakeCategory === "all" ? "none" : "blur(10px)",
      transition: "all 0.3s ease",
      marginRight: "15px",
      cursor: "pointer",
    },
    normalButton: {
      background: cakeCategory === "normal" 
        ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
        : "rgba(255, 255, 255, 0.25)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 28px",
      fontSize: "16px",
      fontWeight: "600",
      color: cakeCategory === "normal" ? "white" : "#333",
      boxShadow: cakeCategory === "normal" 
        ? "0 8px 20px rgba(240, 147, 251, 0.3)" 
        : "0 4px 15px rgba(0, 0, 0, 0.1)",
      backdropFilter: cakeCategory === "normal" ? "none" : "blur(10px)",
      transition: "all 0.3s ease",
      marginRight: "15px",
      cursor: "pointer",
    },
    premiumButton: {
      background: cakeCategory === "premium" 
        ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" 
        : "rgba(255, 255, 255, 0.25)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 28px",
      fontSize: "16px",
      fontWeight: "600",
      color: cakeCategory === "premium" ? "white" : "#333",
      boxShadow: cakeCategory === "premium" 
        ? "0 8px 20px rgba(250, 112, 154, 0.3)" 
        : "0 4px 15px rgba(0, 0, 0, 0.1)",
      backdropFilter: cakeCategory === "premium" ? "none" : "blur(10px)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Cakes" />
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
                      className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
                    >
                      <div className="container"></div>
                    </section>
                    <section className="shop-area p-relative">
                      <div className="container">
                        <button
                          type="button"
                          className="btn bg-primary"
                          onClick={handleClick}
                          style={{
                            marginBottom: "20px",
                            borderRadius: "10px",
                            padding: "10px 24px",
                            fontWeight: "500",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                          }}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i> Back
                        </button>
                        <div className="row mb-4">
                          {/* Cakes Selection */}
                          <div className="col-md-12">
                            <div className="d-flex align-items-center justify-content-between flex-wrap m-3">
                              <div className="d-flex align-items-center mb-3 mb-md-0">
                                <h5 style={{ marginRight: "20px", marginBottom: "0", fontWeight: "600" }}>
                                  Select Cake
                                </h5>
                                <FormGroup switch style={{ marginBottom: "0" }}>
                                  <Input
                                    type="switch"
                                    role="switch"
                                    id="egglessSwitch"
                                    onChange={() => setIsEggless(!isEggless)}
                                    style={{ cursor: "pointer" }}
                                  />
                                  <Label check htmlFor="egglessSwitch" style={{ cursor: "pointer", fontWeight: "500" }}>
                                    {isEggless ? "🥚 Eggless" : "🥚 Egg"}
                                  </Label>
                                </FormGroup>
                              </div>
                              
                              {/* Premium/Normal Buttons with Claymorphism */}
                              <div className="d-flex align-items-center" style={{ gap: "15px" }}>
                                <button
                                  type="button"
                                  style={buttonStyles.allButton}
                                  onClick={() => setCakeCategory("all")}
                                  onMouseEnter={(e) => {
                                    if (cakeCategory !== "all") {
                                      e.currentTarget.style.transform = "translateY(-2px)"
                                      e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)"
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (cakeCategory !== "all") {
                                      e.currentTarget.style.transform = "translateY(0)"
                                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
                                    }
                                  }}
                                >
                                  🎂 All Cakes
                                </button>
                                <button
                                  type="button"
                                  style={buttonStyles.normalButton}
                                  onClick={() => setCakeCategory("normal")}
                                  onMouseEnter={(e) => {
                                    if (cakeCategory !== "normal") {
                                      e.currentTarget.style.transform = "translateY(-2px)"
                                      e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)"
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (cakeCategory !== "normal") {
                                      e.currentTarget.style.transform = "translateY(0)"
                                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
                                    }
                                  }}
                                >
                                  🍰 Normal Cakes
                                </button>
                                <button
                                  type="button"
                                  style={buttonStyles.premiumButton}
                                  onClick={() => setCakeCategory("premium")}
                                  onMouseEnter={(e) => {
                                    if (cakeCategory !== "premium") {
                                      e.currentTarget.style.transform = "translateY(-2px)"
                                      e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)"
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (cakeCategory !== "premium") {
                                      e.currentTarget.style.transform = "translateY(0)"
                                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
                                    }
                                  }}
                                >
                                  👑 Premium Cakes
                                </button>
                              </div>
                            </div>
                            
                            <div className="alert alert-warning m-3" style={{ borderRadius: "10px", border: "1px solid #ffc107", backgroundColor: "#fff3cd" }}>
                              <i className="fa fa-exclamation-triangle me-2" style={{ color: '#856404' }}></i>
                              <span style={{ color: "#856404", fontSize: "14px" }}>
                                <b>ATTENTION:</b> The images presented are solely for display purposes. The actual cake may vary in appearance.
                              </span>
                            </div>
                          </div>

                          {/* Cakes Display */}
                          <div className="col-lg-8 col-md-6 mx-auto ">
                            <div className="row justify-content-center">
                              {combineCakes.map((cake, index) => (
                                <div
                                  className="col-lg-4 col-sm-6 col-6 mb-4 mt-2"
                                  key={index}
                                >
                                  <div
                                    className="card shadow-lg mx-auto"
                                    style={{
                                      height: "auto",
                                      cursor: "pointer",
                                      width: "95%",
                                      position: "relative",
                                      marginBottom: "12px",
                                      border: selectedCakes.some(cake2 => String(cake2._id) === String(cake._id)) 
                                        ? "3px solid #ff6b6b" 
                                        : "2px solid #F5E7B6",
                                      borderRadius: "15px",
                                      overflow: "hidden",
                                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                    }}
                                    onClick={() => handleImageClick(cake, index)}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = "translateY(-5px)"
                                      e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)"
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = "translateY(0)"
                                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"
                                    }}
                                  >
                                    <img
                                      src={URLS.Base + cake.image}
                                      className="card-img-top"
                                      alt={cake.name}
                                      style={{
                                        height: "180px",
                                        objectFit: "cover",
                                      }}
                                    />

                                    <div
                                      className={
                                        selectedCakes.some(
                                          cake2 =>
                                            String(cake2._id) ===
                                            String(cake._id)
                                        )
                                          ? "card-body text-white cakebackground"
                                          : "card-body text-white"
                                      }
                                      style={{
                                        background: selectedCakes.some(cake2 => String(cake2._id) === String(cake._id))
                                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        borderRadius: "0 0 15px 15px",
                                      }}
                                    >
                                      <h6 className="card-title d-flex align-items-center justify-content-between">
                                        <span style={{ fontSize: "14px", fontWeight: "600" }}>
                                          {cake.name}
                                        </span>
                                        <div>
                                          {isEggless && (
                                            <span
                                              className="badge"
                                              style={{
                                                backgroundColor: "#28a745",
                                                marginRight: "5px",
                                                fontSize: "10px",
                                                padding: "5px 8px",
                                                borderRadius: "20px",
                                              }}
                                            >
                                              🥚 Eggless
                                            </span>
                                          )}
                                          {cake.cakePremiumOrNormal === "premium" && (
                                            <span
                                              className="badge"
                                              style={{
                                                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                                                color: "#000",
                                                fontSize: "10px",
                                                padding: "5px 8px",
                                                borderRadius: "20px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              👑 Premium
                                            </span>
                                          )}
                                          {cake.cakePremiumOrNormal === "normal" && (
                                            <span
                                              className="badge"
                                              style={{
                                                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                                color: "#fff",
                                                fontSize: "10px",
                                                padding: "5px 8px",
                                                borderRadius: "20px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              🍰 Normal
                                            </span>
                                          )}
                                        </div>
                                      </h6>
                                      <div className="mt-2">
                                        <small style={{ fontSize: "12px", opacity: "0.9" }}>
                                          ₹{cake.price} (500g)
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ padding: "0px 15px 15px 15px" }}>
                                    <select
                                      className="form-select form-select-sm"
                                      style={{
                                        borderRadius: "10px",
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        background: selectedCakes.some(cake2 => String(cake2._id) === String(cake._id))
                                          ? "#fff"
                                          : "#f8f9fa",
                                      }}
                                      disabled={
                                        !selectedCakes.some(
                                          cake2 =>
                                            String(cake2._id) ===
                                            String(cake._id)
                                        )
                                      }
                                      value={selectedWeights[cake._id] || "500"}
                                      onChange={event =>
                                        handleChange(event, index, cake)
                                      }
                                    >
                                      <option value="500">🍰 500 gm</option>
                                      <option value="1">🎂 1 kg</option>
                                      <option value="2">🍰 2 kg</option>
                                      <option value="3">🎂 3 kg</option>
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="alert alert-warning mt-3" style={{ borderRadius: "10px", border: "1px solid #ffc107", backgroundColor: "#fff3cd" }}>
                              <i className="fa fa-exclamation-triangle me-2" style={{ color: '#856404' }}></i>
                              <span style={{ color: "#856404", fontSize: "14px" }}>
                                <b>ATTENTION :</b> The images presented are solely for display purposes. The actual cake may vary in appearance.
                              </span>
                            </div>
                          </div>

                          {/* Summary Section */}
                          <div className="col-lg-4 col-md-5 mb-3">
                            <div
                              className="position-sticky"
                              style={{ top: "20px" }}
                            >
                              <div className="shadow-lg mt-3" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <div className="card-body mt-3" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: "15px" }}>
                                  <div className="d-flex justify-content-between align-items-center shadow-none mb-2 rounded ">
                                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>Total:</div>
                                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                                      ₹
                                      {parseFloat(
                                        sessionStorage.getItem(
                                          "theaterPrice"
                                        ) || 0
                                      ) +
                                        parseFloat(
                                          sessionStorage.getItem("occprice") ||
                                            0
                                        ) +
                                        parseFloat(
                                          sessionStorage.getItem("addons") || 0
                                        ) +
                                        parseFloat(totalPrice || 0) -
                                        parseFloat(
                                          sessionStorage.getItem(
                                            "couponAmount"
                                          ) || 0
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="shadow-lg mt-3" style={{ borderRadius: "15px", overflow: "hidden" }}>
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
                                          style={{
                                            fontWeight: "bold",
                                            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                                          }}
                                        >
                                          📋 Summary Details
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
                                                marginBottom: "10px",
                                              }}
                                            >
                                              <div>
                                                🎭 Theatre Price (
                                                {sessionStorage.getItem(
                                                  "countPeople"
                                                )}{" "}
                                                ppl)
                                              </div>
                                              <div>
                                                ₹
                                                {sessionStorage.getItem(
                                                  "theaterPrice"
                                                )}
                                              </div>
                                            </div>
                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                              }}
                                            >
                                              <div>
                                                🎉 Occasions (
                                                {sessionStorage.getItem(
                                                  "occasionName"
                                                )}
                                                )
                                              </div>
                                              <div>
                                                ₹
                                                {sessionStorage.getItem(
                                                  "occprice"
                                                )}
                                              </div>
                                            </div>
                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              <div>🍰 Cakes:</div>
                                            </div>
                                            {selectedCakes.length === 0 ? (
                                              <div
                                                style={{ marginBottom: "8px", color: "#999" }}
                                              >
                                                No cakes in the cart
                                              </div>
                                            ) : (
                                              selectedCakes.map(
                                                (cake, index) => (
                                                  <div
                                                    key={index}
                                                    style={{
                                                      display: "flex",
                                                      justifyContent:
                                                        "space-between",
                                                      marginBottom: "8px",
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    <div>
                                                      {cake.name} (x{" "}
                                                      {selectedWeights[
                                                        cake._id
                                                      ] == "500"
                                                        ? selectedWeights[
                                                            cake._id
                                                          ] + "Gm"
                                                        : selectedWeights[
                                                            cake._id
                                                          ] + "Kg"}
                                                      )
                                                    </div>
                                                    <div>
                                                      ₹{" "}
                                                      {selectedWeights[
                                                        cake._id
                                                      ] == "500"
                                                        ? cake.price
                                                        : selectedWeights[
                                                            cake._id
                                                          ] == 1
                                                        ? cake.price * 2
                                                        : selectedWeights[
                                                            cake._id
                                                          ] == 2
                                                        ? cake.price * 4
                                                        : selectedWeights[
                                                            cake._id
                                                          ] == 3
                                                        ? cake.price * 6
                                                        : 1 || 1}
                                                    </div>
                                                  </div>
                                                )
                                              )
                                            )}
                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "8px",
                                              }}
                                            >
                                              <div>🎁 Addons</div>
                                              <div>
                                                ₹{sessionStorage.getItem(
                                                  "addons"
                                                ) || 0}
                                              </div>
                                            </div>

                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              <div>Sub Total</div>
                                              <div>
                                                ₹
                                                {parseFloat(
                                                  sessionStorage.getItem(
                                                    "theaterPrice"
                                                  ) || 0
                                                ) +
                                                  parseFloat(
                                                    sessionStorage.getItem(
                                                      "occprice"
                                                    ) || 0
                                                  ) +
                                                  parseFloat(
                                                    sessionStorage.getItem(
                                                      "addons"
                                                    ) || 0
                                                  ) +
                                                  parseFloat(totalPrice || 0)}
                                              </div>
                                            </div>
                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                              }}
                                            >
                                              <div>🏷️ Coupon Amount</div>
                                              <div>
                                                ₹
                                                {parseFloat(
                                                  sessionStorage.getItem(
                                                    "coupondis"
                                                  )
                                                ).toFixed(2)}
                                              </div>
                                            </div>
                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px",
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                color: "#667eea",
                                              }}
                                            >
                                              <div>Total Amount</div>
                                              <div>
                                                ₹
                                                {parseFloat(
                                                  sessionStorage.getItem(
                                                    "theaterPrice"
                                                  ) || 0
                                                ) +
                                                  parseFloat(
                                                    sessionStorage.getItem(
                                                      "occprice"
                                                    ) || 0
                                                  ) +
                                                  parseFloat(
                                                    sessionStorage.getItem(
                                                      "addons"
                                                    ) || 0
                                                  ) +
                                                  parseFloat(totalPrice || 0) -
                                                  parseFloat(
                                                    sessionStorage.getItem(
                                                      "couponAmount"
                                                    ) || 0
                                                  )}
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
                                onClick={handleSubmit}
                                className="btn w-100 mt-3"
                                style={{
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "12px",
                                  padding: "12px",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = "translateY(-2px)"
                                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(102, 126, 234, 0.4)"
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "translateY(0)"
                                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3)"
                                }}
                              >
                                Continue → 
                              </button>
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

export default CakesComponent