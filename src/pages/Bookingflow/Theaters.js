import React, { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Calendar } from "primereact/calendar"
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

// Import carousel for image slider
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"

const Theaters = () => {
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token
  var token = datas

  const [Theaters, setTheaters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState({})
  const [selectedPlan, setSelectedPlan] = useState({})
  const [modalPop, setModalPop] = useState(false) // this is the modal for the specific 1.5 hours!
  
  // State for image modal
  const [imageModal, setImageModal] = useState(false)
  const [selectedTheaterImages, setSelectedTheaterImages] = useState([])
  const [selectedTheaterName, setSelectedTheaterName] = useState("")

  console.log(modalPop, "MODAL POP")

  const today = new Date().toISOString().split("T")[0]
  console.log(today)

  const [date, setDate] = useState(sessionStorage.getItem("date") || today)
  const [activeshow, setActiveshow] = useState([])
  const [activeSlot, setActiveSlot] = useState(null) // Store the active slot's identifier

  const dateString = date
  const dateObject = new Date(dateString)

  const dd = dateObject.getDate().toString().padStart(2, "0")
  const mm = (dateObject.getMonth() + 1).toString().padStart(2, "0")
  const yyyy = dateObject.getFullYear()

  const formattedDateString = `${yyyy}-${mm}-${dd}`

  const databyid = data => {
    axios
      .post(
        URLS.GetUnicId,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          sessionStorage.setItem("UserId", res.data.userId)
          sessionStorage.setItem("theaterId", data._id)
          sessionStorage.setItem("theatreName", data.name)
          sessionStorage.setItem("theatrePrices", data.offerPrice);
          sessionStorage.setItem("date", formattedDateString)
        }
      })
  }

  useEffect(() => {
    GetTheatersData()
  }, [])

  const GetTheatersData = () => {
    axios
      .post(
        URLS.GetAllTheaters,
        { slotDate: sessionStorage.getItem("date") || formattedDateString },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          console.log("Theaters Data:", res.data.theatres); // Debug log
          setTheaters(res.data.theatres)
          setIsLoading(false)
        }
      })
      .catch(error => {
        console.error("Error fetching theaters:", error);
        setIsLoading(false);
      })
  }

  const [form, setform] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    description: "",
  })

  const [lgShow, setLgShow] = useState(false)

  const modelshow = () => {
    setLgShow(!false)
  }

  const formsubmit = e => {
    e.preventDefault()
    EnquiryNow()
  }

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const today1 = new Date().toISOString().split("T")[0]
  const [isDisabled, setIsDisabled] = useState(false)

  const handleChanges = e => {
    const dateString = e.target.value
    console.log(dateString)
    setDate(dateString)
    const today1 = new Date().toISOString().split("T")[0]

    const isDisabled = dateString < today1

    const dateObject = new Date(dateString)
    const dd = dateObject.getDate().toString().padStart(2, "0")
    const mm = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const yyyy = dateObject.getFullYear()
    const formattedDateString = `${yyyy}-${mm}-${dd}`

    sessionStorage.setItem("date", formattedDateString)

    if (!isDisabled) {
      axios
        .post(
          URLS.GetAllTheaters,
          { slotDate: formattedDateString },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(res => {
          if (res.status === 200) {
            setTheaters(res.data.theatres)
          }
        })
    }
  }

  const EnquiryNow = () => {
    const dataArray = {
      name: form.name,
      email: form.email,
      mobileNumber: form.mobileNumber,
      description: form.description,
    }

    axios
      .post(URLS.AddEnquiry, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setLgShow(false)
            setform({
              name: "",
              email: "",
              mobileNumber: "",
              description: "",
            })
          }
        },
        error => {
          if (error && error.response) {
            if (error.response.status === 400) {
              toast(error.response.data.message);
            } else {
              toast('An error occurred');
            }
          } else {
            toast('Network error or server did not respond');
          }
        }
      )
  }

  const [Contact, setContact] = useState([])

  useEffect(() => {
    setDate(sessionStorage.getItem("date"));
    sessionStorage.removeItem("payType")
    sessionStorage.removeItem("bookingid")
    sessionStorage.removeItem("couponAmount")
    sessionStorage.removeItem("specialPersonName")
    sessionStorage.removeItem("TotalPrice")
    sessionStorage.removeItem("TotalPrice2")
    sessionStorage.removeItem("addons")
    sessionStorage.removeItem("addonsData")
    sessionStorage.removeItem("adonsJSON")
    sessionStorage.removeItem("userDetails")
    sessionStorage.removeItem("theaterName")
    sessionStorage.removeItem("theaterId")
    sessionStorage.removeItem("subtotal")
    sessionStorage.removeItem("slot")
    sessionStorage.removeItem("selectedOccasion")
    sessionStorage.removeItem("planType")
    sessionStorage.removeItem("paymentkey")
    sessionStorage.removeItem("orderId")
    sessionStorage.removeItem("occprice")
    sessionStorage.removeItem("occasionName")
    sessionStorage.removeItem("occasion")
    sessionStorage.removeItem("invoicePath")
    sessionStorage.removeItem("extraPersonprice")
    sessionStorage.removeItem("extraPersonperprice")
    sessionStorage.removeItem("extraAddedPersonsForTheatre")
    sessionStorage.removeItem("date")
    sessionStorage.removeItem("data")
    sessionStorage.removeItem("coupondis")
    sessionStorage.removeItem("cakeprice")
    sessionStorage.removeItem("advancePayment")
    sessionStorage.removeItem("countPeople")
    sessionStorage.removeItem("theaterPrice")
    sessionStorage.removeItem("theatrePrices")
    sessionStorage.removeItem("comboAdvancePayment")
    sessionStorage.removeItem("maxPeople")
    GetFooterData()
    sessionStorage.setItem("date", formattedDateString)
  }, [])

  const GetFooterData = () => {
    axios
      .post(
        URLS.GetFooter,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setContact(res.data.contactus)
        }
      })
  }

  const cardHeaderStyle = {
    position: "relative",
    padding: "10px",
  }

  const history = useHistory()

  const handleBasicPlan = (data, i) => {
    console.log(data, "data")
    sessionStorage.setItem("theaterId", data._id)
    sessionStorage.setItem("maxPeople", data.maxPeople)
    sessionStorage.setItem("extraPersonprice", nintymin == 90 ? data.onehalfanhourExtraPersonPrice || 0 : data.extraPersonprice)
    sessionStorage.setItem("theaterName", data.name)
    sessionStorage.setItem("theatermaxSeating", data.maxSeating);
    sessionStorage.setItem("theaterPrice", nintymin == 90 ? data.oneandhalfslotPrice : data.offerPrice);
    sessionStorage.setItem("theatrePrices", nintymin == 90 ? data.oneandhalfslotPrice : data.offerPrice);
    sessionStorage.setItem("TotalPrice", nintymin == 90 ? data.oneandhalfslotPrice : data.offerPrice);
    sessionStorage.setItem("cartCakes", JSON.stringify([]))
    sessionStorage.setItem("selectedOccasion", JSON.stringify([]))
    sessionStorage.setItem("occprice", "0")
    sessionStorage.setItem("cakeprice", "0")
    sessionStorage.setItem("addons", "0")
    sessionStorage.setItem("subtotal", data.offerPrice)
    sessionStorage.setItem("coupondis", "0")
    sessionStorage.setItem("planType", selectedPlan[i])

    if (selectedPlan[i] == "combo") {
      history.push("/comboform")
    } else {
      history.push("/basicplan")
    }
  }

  const [nintymin, setnintymin] = useState(0)

  const convertTo12HourFormat = (time24) => {
    const [hoursStr, minutes] = time24.split(":");
    const hours = parseInt(hoursStr, 10);
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const period = hours < 12 ? "AM" : "PM";
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`;
  }

  const handleSlot = (e, data, index) => {
    e.preventDefault();

    if (!data.isBooked) {
      setSelectedSlot((prevState) => ({
        ...prevState,
        [index]: data,
      }));
    }

    setActiveshow(data);
    setActiveSlot(data);

    const fromTime12 = convertTo12HourFormat(data.fromTime);
    const toTime12 = convertTo12HourFormat(data.toTime);

    sessionStorage.setItem("slot", `${fromTime12} - ${toTime12}`);

    const selectedValue = (
      e.target.value || `${fromTime12} / ${toTime12}`
    ).trim();
    console.log("Selected Value:", selectedValue);

    const durationInMinutes = calculateSlotDuration(data.fromTime, data.toTime);
    setnintymin(durationInMinutes || 0)
    console.log(durationInMinutes)
    sessionStorage.setItem("nintymin", durationInMinutes || 0)
    if (durationInMinutes == 90) {
      setModalPop(true);
    }
  }

  const calculateSlotDuration = (fromTime, toTime) => {
    const fromDate = new Date(`1970-01-01T${fromTime}:00`)
    const toDate = new Date(`1970-01-01T${toTime}:00`)
    const durationInMilliseconds = toDate - fromDate
    return durationInMilliseconds / (1000 * 60)
  }

  const handleclose = () => {
    setModalPop(false)
  }

  const handlePlanSelection = (plan, index) => {
    setSelectedPlan(plan)
    setSelectedPlan(prevState => ({
      ...prevState,
      [index]: plan,
    }))
  }

  // Function to open image modal
  const openImageModal = (theater) => {
    // Check if theater has images array
    let images = [];
    
    if (theater.image && Array.isArray(theater.image) && theater.image.length > 0) {
      images = theater.image;
    } else {
      // If no images, don't open modal
      return;
    }
    
    setSelectedTheaterImages(images);
    setSelectedTheaterName(theater.name);
    setImageModal(true);
  }

  // Function to get all images of a theater
  const getTheaterImages = (theater) => {
    if (theater.image && Array.isArray(theater.image) && theater.image.length > 0) {
      return theater.image;
    } else {
      return [];
    }
  }

  // Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Check if URL already has http/https
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove any leading slashes
    const cleanPath = imagePath.replace(/^\/+/, '');
    
    // Construct full URL
    return `${URLS.Base}${cleanPath}`;
  }

  // Carousel styles inline
  const carouselStyles = {
    container: {
      position: "relative",
      width: "100%",
      height: "250px",
      overflow: "hidden",
      borderRadius: "10px",
    },
    badge: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      zIndex: 10,
      padding: "5px 10px",
      fontSize: "0.75rem",
      borderRadius: "20px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    },
    modalImage: {
      height: "70vh",
      width: "100%",
      objectFit: "contain",
      backgroundColor: "#000",
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Theaters"
          />
          <Row>
            <>
              {isLoading == true ? (
                <>
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
                      <h6 style={{ color: "gold" }}>Loading...</h6>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="home-page indexsix">
                    <main className="main-wrapper">
                      <section
                        id="parallax"
                        className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
                      >
                        <div className="container">
                          <div className="row">
                            <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                              <div className="breadcrumb-wrap text-center">
                                <div className="breadcrumb-title mb-30">
                                  <h1
                                    style={{
                                      color: "white",
                                      marginTop: "20px",
                                    }}
                                  >
                                  </h1>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <section className="shop-area p-relative ">
                        <div className="container-md">
                          <div className="row mb-3">
                            <div className="col-12">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div className="text-center">
                                  <label className="mb-2 fw-bold">
                                    Check Slot Availability
                                  </label>
                                  <br></br>
                                  <div className="mb-3">
                                    <input
                                      type="date"
                                      id="buttondisplay"
                                      name="theaterdate"
                                      className={`form-control border-primary ${
                                        isDisabled ? "bg-light" : ""
                                      }`}
                                      disabled={isDisabled}
                                      value={date}
                                      defaultValue={new Date().toISOString().split("T")[0]}
                                      onChange={handleChanges}
                                      min={new Date().toISOString().split("T")[0]}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="container">
                            <div className="row">
                              {Theaters.map((data, i) => {
                                const isComboBasicActive = selectedSlot[i] !== undefined
                                const isBookNowActive = selectedSlot[i] !== undefined && selectedPlan[i] !== undefined
                                const theaterImages = getTheaterImages(data);

                                return (
                                  <div
                                    className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
                                    key={i}
                                  >
                                    <div
                                      className="card rounded flex-fill"
                                      style={{
                                        minHeight: "820px",
                                        overflow: "hidden",
                                      }}
                                    >
                                      <div style={cardHeaderStyle}>
                                        <div
                                          className="course-img"
                                          data-label={data.batchType}
                                          id="ort"
                                          style={{ position: "relative" }}
                                        >
                                          {/* Image Slider Implementation */}
                                          {theaterImages.length > 1 ? (
                                            <div 
                                              onClick={() => openImageModal(data)}
                                              style={carouselStyles.container}
                                            >
                                              <Carousel
                                                showThumbs={false}
                                                showStatus={false}
                                                infiniteLoop={true}
                                                autoPlay={true}
                                                interval={3000}
                                                transitionTime={500}
                                                showArrows={true}
                                                dynamicHeight={false}
                                              >
                                                {theaterImages.map((img, idx) => (
                                                  <div key={idx}>
                                                    <img
                                                      src={getImageUrl(img)}
                                                      alt={`${data.name} - ${idx + 1}`}
                                                      style={{
                                                        height: "250px",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                      }}
                                                      onError={(e) => {
                                                        console.error("Image load error:", img);
                                                        e.target.onerror = null;
                                                        // Don't show default image, just hide the broken image
                                                        e.target.style.display = "none";
                                                      }}
                                                    />
                                                  </div>
                                                ))}
                                              </Carousel>
                                              {/* Image counter badge */}
                                              <div style={carouselStyles.badge}>
                                                <span className="badge bg-dark text-white">
                                                  {theaterImages.length} Photos
                                                </span>
                                              </div>
                                            </div>
                                          ) : theaterImages.length === 1 ? (
                                            // Single image
                                            <div
                                              onClick={() => openImageModal(data)}
                                              style={{ 
                                                cursor: "pointer",
                                                position: "relative",
                                                width: "100%",
                                                height: "250px",
                                                overflow: "hidden",
                                                borderRadius: "10px",
                                              }}
                                            >
                                              <img
                                                src={getImageUrl(theaterImages[0])}
                                                alt={data.name}
                                                className="img-fluid rounded-top"
                                                id="theaters"
                                                style={{
                                                  height: "250px",
                                                  borderRadius: "10px",
                                                  width: "100%",
                                                  cursor: "pointer",
                                                  objectFit: "cover",
                                                }}
                                                onError={(e) => {
                                                  console.error("Image load error:", theaterImages[0]);
                                                  e.target.onerror = null;
                                                  e.target.style.display = "none";
                                                }}
                                              />
                                              <div style={carouselStyles.badge}>
                                                <span className="badge bg-dark text-white">
                                                  1 Photo
                                                </span>
                                              </div>
                                            </div>
                                          ) : (
                                            // No images - show nothing
                                            <div
                                              style={{ 
                                                position: "relative",
                                                width: "100%",
                                                height: "250px",
                                                overflow: "hidden",
                                                borderRadius: "10px",
                                                backgroundColor: "#f0f0f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                              }}
                                            >
                                              <span className="text-muted">No Image</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                          <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5
                                              className="card-title m-0"
                                              style={{ fontSize: "1.05rem" }}
                                            >
                                              {data.name}
                                            </h5>
                                            <span
                                              className="badge bg-danger text-white"
                                              style={{ fontSize: "0.75rem" }}
                                            >
                                              {data.availableSlotsCount > 0
                                                ? `${data.availableSlotsCount} slots available`
                                                : "0 slots available"}
                                            </span>
                                          </div>
                                          <p
                                            className="card-price mb-2"
                                            style={{ fontSize: "0.875rem" }}
                                          >
                                            ₹ <del>{data.price}</del>{" "}
                                            {data.offerPrice} /-
                                          </p>
                                          <div className="row mb-2">
                                            <div className="col-6">
                                              <p
                                                className="card-details mb-2"
                                                style={{ fontSize: "0.75rem" }}
                                              >
                                                <i className="bi bi-currency-exchange"></i>{" "}
                                                Extra Person Price:{" "}
                                                {data.extraPersonprice}
                                              </p>
                                            </div>
                                            <div className="col-6">
                                              <p
                                                className="card-details mb-2"
                                                style={{ fontSize: "0.75rem" }}
                                              >
                                                <i className="bi bi-person"></i>{" "}
                                                Max People: {data.maxPeople}
                                              </p>
                                            </div>
                                          </div>
                                          <p
                                            className="card-details mb-2"
                                            style={{ fontSize: "0.75rem" }}
                                          >
                                            <i className="bi bi-tv"></i>{" "}
                                            Features
                                            <ul
                                              style={{ paddingLeft: "1.5rem" }}
                                            >
                                              {data.features
                                                .slice(0, 3)
                                                .map((feature, index) => (
                                                  <li key={index}>{feature}</li>
                                                ))}
                                            </ul>
                                          </p>
                                          <p
                                            className="card-details mb-2"
                                            style={{ fontSize: "0.75rem" }}
                                          >
                                            <i className="bi bi-info-circle"></i>{" "}
                                            Description:{" "}
                                            {data.description
                                              .split(" ")
                                              .slice(0, 15)
                                              .join(" ")}
                                            {data.description.split(" ")
                                              .length > 25 && "..."}
                                          </p>
                                        </div>
                                        <div>
                                          <div className="slot-selection mb-3">
                                            <p
                                              className="slot-title mb-2"
                                              style={{ fontSize: "0.875rem" }}
                                            >
                                              Choose Your Slot:
                                            </p>
                                            <div className="row">
                                              {data.availableSlots.map(
                                                (slot, index) => {
                                                  const fromTime12 =
                                                    convertTo12HourFormat(
                                                      slot.fromTime
                                                    )
                                                  const toTime12 =
                                                    convertTo12HourFormat(
                                                      slot.toTime
                                                    )

                                                  return (
                                                    <div
                                                      className="col-6 mb-2"
                                                      key={index}
                                                    >
                                                      <button
                                                        className={`btn w-100 ${
                                                          slot.isBooked
                                                            ? "btn-secondary"
                                                            : ""
                                                        }`}
                                                        onClick={e =>
                                                          handleSlot(e, slot, i)
                                                        }
                                                        style={{
                                                          backgroundColor:
                                                            slot.isBooked
                                                              ? "#6c757d"
                                                              : selectedSlot[
                                                                  i
                                                                ] === slot
                                                              ? "#E9BE5F"
                                                              : "transparent",
                                                          borderColor:
                                                            slot.isBooked
                                                              ? ""
                                                              : "#E9BE5F",
                                                          color: slot.isBooked
                                                            ? "black"
                                                            : selectedSlot[
                                                                i
                                                              ] === slot
                                                            ? "black"
                                                            : "black",
                                                          textDecoration:
                                                            slot.isBooked
                                                              ? "line-through"
                                                              : "none",
                                                          fontSize: "0.6rem",
                                                        }}
                                                        disabled={slot.isBooked}
                                                        value={`${fromTime12} / ${toTime12}`}
                                                      >
                                                        {fromTime12} -{" "}
                                                        {toTime12}
                                                      </button>
                                                    </div>
                                                  )
                                                }
                                              )}
                                            </div>
                                          </div>
                                          <div className="row mt-2">
                                            <div className="col-6">
                                              <a
                                                onClick={() =>
                                                  handlePlanSelection(
                                                    "combo",
                                                    i
                                                  )
                                                }
                                                className={`btn btn-outline-primary ${
                                                  isComboBasicActive
                                                    ? ""
                                                    : "disabled"
                                                }`}
                                                style={{
                                                  width: "100%",
                                                  color: isComboBasicActive
                                                    ? "black"
                                                    : "black",
                                                  backgroundColor:
                                                    selectedPlan[i] === "combo"
                                                      ? "#E9BE5F"
                                                      : "white",
                                                  border: "1px solid #E9BE5F",
                                                  fontSize: "0.8rem",
                                                }}
                                                aria-disabled={
                                                  !isComboBasicActive
                                                }
                                              >
                                                Combo
                                              </a>
                                            </div>
                                            <div className="col-6">
                                              <a
                                                onClick={() =>
                                                  handlePlanSelection(
                                                    "normal",
                                                    i
                                                  )
                                                }
                                                className={`btn ${
                                                  isComboBasicActive
                                                    ? ""
                                                    : "disabled"
                                                }`}
                                                style={{
                                                  width: "100%",
                                                  color: isComboBasicActive
                                                    ? "black"
                                                    : "black",
                                                  backgroundColor:
                                                    selectedPlan[i] === "normal"
                                                      ? "#E9BE5F"
                                                      : "white",
                                                  border: "1px solid #E9BE5F",
                                                  fontSize: "0.8rem",
                                                }}
                                                aria-disabled={
                                                  !isComboBasicActive
                                                }
                                              >
                                                Basic
                                              </a>
                                            </div>
                                          </div>

                                          <div className="col-12 mt-3">
                                            <button
                                              disabled={!isBookNowActive}
                                              onClick={() =>
                                                handleBasicPlan(data, i)
                                              }
                                              className="btn btn-primary"
                                              style={{
                                                width: "100%",
                                                border: "none",
                                                boxShadow: "none",
                                              }}
                                            >
                                              Book Now
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </section>
                    </main>

                    {/* Image Modal for Fullscreen View */}
                    <Modal
                      size="lg"
                      isOpen={imageModal}
                      toggle={() => setImageModal(false)}
                      centered
                    >
                      <ModalHeader toggle={() => setImageModal(false)}>
                        <h5>
                          {selectedTheaterName} - Gallery
                        </h5>
                      </ModalHeader>
                      <ModalBody>
                        <div className="row justify-content-md-center">
                          <div className="col-lg-12">
                            {selectedTheaterImages.length > 0 ? (
                              <Carousel
                                showThumbs={true}
                                showStatus={true}
                                infiniteLoop={true}
                                autoPlay={true}
                                interval={4000}
                                transitionTime={500}
                                showArrows={true}
                                dynamicHeight={false}
                                thumbWidth={100}
                              >
                                {selectedTheaterImages.map((img, idx) => (
                                  <div key={idx}>
                                    <img
                                      src={getImageUrl(img)}
                                      alt={`${selectedTheaterName} - ${idx + 1}`}
                                      style={carouselStyles.modalImage}
                                      onError={(e) => {
                                        console.error("Modal image load error:", img);
                                        e.target.onerror = null;
                                        e.target.style.display = "none";
                                      }}
                                    />
                                    <p className="legend">
                                      {selectedTheaterName} - Image {idx + 1}
                                    </p>
                                  </div>
                                ))}
                              </Carousel>
                            ) : (
                              <div className="text-center p-5">
                                <h6>No images available for this theater</h6>
                              </div>
                            )}
                          </div>
                        </div>
                      </ModalBody>
                    </Modal>

                    {/* 1.5 hour popup */}
                    <Modal
                      size="md"
                      isOpen={modalPop}
                      toggle={() => setModalPop(false)}
                      centered
                    >
                      <ModalHeader toggle={() => setModalPop(false)}>
                        <span className=""> Note : </span>
                      </ModalHeader>
                      <ModalBody className=" ">
                        <div className="row justify-content-md-center">
                          <div className="col-lg-12 mt-40  ">
                            <h6 className="p-4 text-center">
                              You have selected a slot with 1.5 hours duration
                              and will be charged accordingly. Proceed further
                              if you are okay with it!
                            </h6>
                            <div className="text-center">
                              <button
                                onClick={() => handleclose()}
                                type="button"
                                className="btn course-btn mb-4 text-center btn-outline"
                              >
                                okay !
                              </button>
                            </div>
                          </div>
                        </div>
                      </ModalBody>
                    </Modal>

                    <ToastContainer />
                  </div>
                </>
              )}
            </>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Theaters