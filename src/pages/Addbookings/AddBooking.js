import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer } from "react-toastify"
import { URLS } from "../../Url1"
import axios from "axios"
import { useHistory } from 'react-router-dom';


function Ventures() {
  const [Theaters, setTheaters] = useState([])
  const [selectedSlot, setSelectedSlot] = useState({})
  const [selectedPlan, setSelectedPlan] = useState({})
  const [modalPop, setModalPop] = useState(false)
  const [activeSlot, setActiveSlot] = useState(null)                   
  const [isComboBasicActive, setIsComboBasicActive] = useState(true)
  const [isBookNowActive, setIsBookNowActive] = useState(true)

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const today = new Date()

  const ddd = today.getDate().toString().padStart(2, "0")
  const mmm = (today.getMonth() + 1).toString().padStart(2, "0")
  const yyyyy = today.getFullYear()

  const formattedDateStrings = `${yyyyy}-${mmm}-${ddd}`

  const [date, setDate] = useState(formattedDateStrings)

  const dateString = date

  const dateObject = new Date(dateString)

  const dd = dateObject.getDate().toString().padStart(2, "0")
  const mm = (dateObject.getMonth() + 1).toString().padStart(2, "0")
  const yyyy = dateObject.getFullYear()

  const formattedDateString = `${yyyy}-${mm}-${dd}`

  const formatDate = date => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const history = useHistory();

  const databyid = (data) => {
    sessionStorage.clear();
    axios.post(URLS.GetUnicId, {}, {}).then((res) => {
      if (res.status === 200) {
        sessionStorage.setItem("UserId", res.data.userId);
        sessionStorage.setItem("Theaterid", data._id);
        sessionStorage.setItem("theatreName", data.name);
        sessionStorage.setItem("theatrePrice", data.offerPrice);
        sessionStorage.setItem("date", formattedDateString);

        // Histrory based on selectedPlan
        if (selectedPlan === "combo") {
          history.push("/ComboForm");
        } else {
          history.push("/BasicForm");
        }
        // window.location.href = "/ViewBookingSlots";
      }
    });
  }
  

  useEffect(() => {
    GetTheatersData()
  }, [])

  const GetTheatersData = () => {
    axios
      .post(URLS.GetAllTheaters, { slotDate: formattedDateStrings }, {})
      .then(res => {
        if (res.status === 200) {
          setTheaters(res.data.theatres)
        }
      })
  }

  const handleChanges = e => {
    setDate(e.target.value)
    axios
      .post(URLS.GetAllTheaters, { slotDate: e.target.value }, {})
      .then(res => {
        if (res.status === 200) {
          setTheaters(res.data.theatres)
        }
      })
  }

  const convertTo12HourFormat = time24 => {
    const [hoursStr, minutes] = time24.split(":")
    const hours = parseInt(hoursStr, 10)
    const hours12 = hours % 12 === 0 ? 12 : hours % 12
    const period = hours < 12 ? "AM" : "PM"
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`
  }

  const handlePlanSelection = (plan, index) => {
    setSelectedPlan(prevState => ({
      ...prevState,
      [index]: plan,
    }))
  }

  const handleSlot = (e, data, index) => {
    e.preventDefault()

    if (!data.isBooked) {
      setSelectedSlot(prevState => ({
        ...prevState,
        [index]: data,
      }))
    }

    setActiveSlot(data)

    const fromTime12 = convertTo12HourFormat(data.fromTime)
    const toTime12 = convertTo12HourFormat(data.toTime)

    localStorage.setItem("slot", `${fromTime12} - ${toTime12}`)

    const durationInMinutes = calculateSlotDuration(data.fromTime, data.toTime)
    if (durationInMinutes === 90) {
      // Check for 1.5 hours
      setModalPop(true)
    }
  }

  const calculateSlotDuration = (fromTime, toTime) => {
    const fromDate = new Date(`1970-01-01T${fromTime}:00`)
    const toDate = new Date(`1970-01-01T${toTime}:00`)
    const durationInMilliseconds = toDate - fromDate
    return durationInMilliseconds / (1000 * 60) // Convert to minutes
  }

  const handleclose = () => {
    setModalPop(false)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Theater list"
          />
          <Row>
            <Col md={12}>
              <div className="row mb-3 p-2 d-flex justify-content-center">
                <div className="col-md-3 pt-3">
                  <div className="text-center">
                    <label>Check Slot Availability</label>
                    <input
                      required
                      type="date"
                      className="form-control"
                      value={date}
                      name="date"
                      onChange={e => handleChanges(e)}
                      min={formatDate(today)}
                      id="bgshadow"
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col>
              <div
                className="row row-grid"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {Theaters.map((data, i) => {
                  const isComboBasicActive = selectedSlot[i] !== undefined
                  const isBookNowActive =
                    selectedSlot[i] !== undefined &&
                    selectedPlan[i] !== undefined

                  return (
                    <div
                      className="col-md-6 col-lg-4 col-sm-12"
                      key={data._id}
                      style={{ display: "flex", padding: "10px" }}
                    >
                      <Card
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <CardBody
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            className="course-section"
                            style={{ flexGrow: 1 }}
                          >
                            <div className="course-top">
                              <div
                                className="course-img"
                                style={{ position: "relative" }}
                              >
                                <div
                                  onMouseEnter={() => setHoveredIndex(i)}
                                  onMouseLeave={() => setHoveredIndex(null)}
                                >
                                  {hoveredIndex === i && data.video ? (
                                    <video
                                      src={URLS.Base + data.video}
                                      className="img-fluid rounded-top"
                                      style={{
                                        height: "250px",
                                        borderRadius: "10px",
                                        width: "100%",
                                        cursor: "pointer",
                                        display: "block",
                                        objectFit: "cover",
                                      }}
                                      autoPlay
                                      loop
                                      muted
                                    />
                                  ) : (
                                    <img
                                      src={URLS.Base + data.image}
                                      alt={data.name}
                                      className="img-fluid rounded-top"
                                      style={{
                                        height: "250px",
                                        borderRadius: "10px",
                                        width: "100%",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              className="pro-content"
                              style={{
                                padding: "20px",
                                borderRadius: "10px",
                                flexGrow: 1,
                              }}
                            >
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
                                ₹ <del>{data.price}</del> {data.offerPrice} /-
                              </p>

                              <div
                                className="row mb-1 seat-details pt-1 pb-1"
                                style={{ flexGrow: 1 }}
                              >
                                <div className="col-6">
                                  <p
                                    className="card-details mb-1"
                                    style={{ fontSize: "0.70rem" }}
                                  >
                                    <i className="bi bi-currency-exchange"></i>{" "}
                                    Extra Person Price: {data.extraPersonprice}
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p
                                    className="card-details mb-1"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    <i className="bi bi-person"></i> Max People:{" "}
                                    {data.maxPeople}
                                  </p>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-12">
                                  <p
                                    className="card-details"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    <i className="bi bi-tv"></i> Features
                                    <ul style={{ paddingLeft: "1.5rem" }}>
                                      {data.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                      ))}
                                    </ul>
                                  </p>
                                </div>
                              </div>
                              <p
                                className="card-details mb-1"
                                style={{ fontSize: "0.75rem" }}
                              >
                                <i className="bi bi-info-circle"></i>{" "}
                                Description: {data.description}
                              </p>
                            </div>
                          </div>

                          <div className="slot-selection mb-3">
                            <p
                              className="slot-title mb-2"
                              style={{ fontSize: "0.875rem" }}
                            >
                              Choose Your Slot:
                            </p>
                            <div className="row">
                              {data.availableSlots.map((slot, index) => {
                                // Convert times to 12-hour format for display
                                const fromTime12 = convertTo12HourFormat(
                                  slot.fromTime
                                )
                                const toTime12 = convertTo12HourFormat(
                                  slot.toTime
                                )

                                return (
                                  <div className="col-6 mb-2" key={index}>
                                    <button
                                      className={`btn w-100 ${
                                        slot.isBooked
                                          ? "btn-secondary"
                                          : selectedSlot[i] === slot
                                          ? "btn-secondary"
                                          : "btn-primary"
                                      } ${
                                        selectedSlot[i] === slot
                                          ? "selectedbtns"
                                          : "bg-danger"
                                      }`}
                                      onClick={e => handleSlot(e, slot, i)}
                                      style={{
                                        color: "black",
                                        textDecoration: slot.isBooked
                                          ? "line-through"
                                          : "none",
                                        fontSize: "0.8rem",
                                        padding: "5px",
                                      }}
                                      disabled={slot.isBooked}
                                      value={`${fromTime12} / ${toTime12}`}
                                    >
                                      {fromTime12} - {toTime12}
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div className="row mt-2">
                            <div className="col-6">
                              <button
                                onClick={() => handlePlanSelection("combo", i)}
                                className={`btn btn-outline-primary ${
                                  isComboBasicActive ? "" : "disabled"
                                }`}
                                style={{
                                  width: "100%",
                                  color: "black",
                                  backgroundColor:
                                    selectedPlan[i] === "combo"
                                      ? "#E9BE5F"
                                      : "white",
                                  border: "1px solid #E9BE5F",
                                  fontSize: "0.8rem",
                                }}
                                aria-disabled={!isComboBasicActive}
                              >
                                Combo
                              </button>
                            </div>
                            <div className="col-6">
                              <button
                                onClick={() => handlePlanSelection("basic", i)}
                                className={`btn ${
                                  isComboBasicActive ? "" : "disabled"
                                }`}
                                style={{
                                  width: "100%",
                                  color: "black",
                                  backgroundColor:
                                    selectedPlan[i] === "basic"
                                      ? "#E9BE5F"
                                      : "white",
                                  border: "1px solid #E9BE5F",
                                  fontSize: "0.8rem",
                                }}
                                aria-disabled={!isComboBasicActive}
                              >
                                Basic
                              </button>
                            </div>
                          </div>

                          <div className="col-12 mt-3">
                            <Button
                              onClick={() => databyid(data)}
                              className="btn booknow-btn"
                              style={{
                                width: "100%",
                                background: isBookNowActive ? "black" : "gray",
                                border: "1px solid black",
                                color: "white",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                cursor: isBookNowActive
                                  ? "pointer"
                                  : "not-allowed",
                                transition: "background 0.3s ease",
                              }}
                              disabled={!isBookNowActive}
                            >
                              <span className="booknow-text">Book Now</span>
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </Col>
          </Row>
          <ToastContainer />
        </div>
      </div>

      <Modal
        size="md"
        show={modalPop}
        onHide={() => setModalPop(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="gradient-border bg-light-grey">
          <Modal.Title
            id="example-modal-sizes-title-lg gradient-border"
            style={{ textAlign: "center" }}
          >
            <span className="text-gold-gradient"> Note : </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark gradient-border">
          <div className="row justify-content-md-center text-white">
            <div className="col-lg-12 mt-40 gradient-border bg-dark">
              <h6 className="p-4 text-center">
                You have selected a slot with 1.5 hours duration and will be
                charged accordingly. Proceed further if you are okay with it!
              </h6>
              <div className="text-center">
                <button
                  onClick={() => handleclose()}
                  type="button"
                  className="btn course-btn mb-4 text-center btn-outline text-white"
                >
                  Okay!
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default Ventures
