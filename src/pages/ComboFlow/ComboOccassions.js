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

const ComboOccassions = () => {
  var gets = localStorage.getItem("authUser")
  var dataa = JSON.parse(gets)
  var datas = dataa.token
  var token = datas

  const [isLoading, setIsLoading] = useState(true)
  const [Occation, setOccation] = useState([])
  console.log(Occation)
  const [selectedOccasion, setSelectedOccasion] = useState(
    JSON.parse(sessionStorage.getItem("occasion"))
  )
  // console.log(selectedOccasion);
  const additionalImagesRef = useRef(null)
  const [textFieldValue, setTextFieldValue] = useState("");
  useEffect(() => {
    const storedValue = sessionStorage.getItem("specialPersonName");
    if (storedValue) {
      setTextFieldValue(storedValue);
    }
  }, []);
  const handleChange = (e) => {
    const newValue = e.target.value;
    setTextFieldValue(newValue);
    sessionStorage.setItem("specialPersonName", newValue);
  };

  const history = useHistory()

  useEffect(() => {
    GetTheatersData()
    GetOccation()
  }, [])

  const GetTheatersData = () => {
    axios
      .post(URLS.GetAllTheaters, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setIsLoading(false)
        }
      })
  }

  const GetOccation = () => {
    axios
      .post(URLS.GetAllOccation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            setOccation(res?.data?.occasions)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            setOccation([])
          }
        }
      )
  }

  const handleSubmit = () => {
    const dataArray = {
      occasionId: selectedOccasion._id,
      personName: textFieldValue,
      totalPrice: sessionStorage.getItem("TotalPrice"),
      bookingId: sessionStorage.getItem("bookingid"),
    }

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateocasion",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            if (!textFieldValue) {
              toast.error("Please fill out the text field!")
              return
            }

            history.push("/ComboPlans")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            console.log(error.response)
            toast.error(error.response.message)
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.message)
            setTimeout(() => {
              history.push("/theaters")
            }, 2000)
          }
        }
      )
  }

  const handleImageClick = occasion => {
    setSelectedOccasion(occasion)
    sessionStorage.setItem("occasionName", occasion.name)

    var totalPrice = sessionStorage.getItem("TotalPrice")

    var occprice = sessionStorage.getItem("occprice")

    console.log(occprice, "occprice")

    sessionStorage.setItem("occasion", JSON.stringify(occasion))
    // sessionStorage.setItem("selectedOccasion", JSON.stringify(occasion)); // Save localStorage

    var total =
      parseFloat(totalPrice) + parseFloat(occasion.price) - parseFloat(occprice)

    sessionStorage.setItem("TotalPrice", parseFloat(total))

    sessionStorage.setItem("occprice", occasion.price)

    console.log(total, "TotalPrice")

    setTimeout(() => {
      additionalImagesRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }, 200)
  }

  const handleClick = () => {
    history.push("/comboform")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Occassions"
          />
          <Row>
            <>
              {isLoading === true ? (
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
                    <section className="shop-area p-relative ">
                      <div className="container">
                        <button
                          type="button"
                          className="btn bg-primary"
                          onClick={handleClick}
                        >
                          {" "}
                          <i className="far fa-arrow-alt-circle-left "></i> Back
                        </button>
                        <div className="container mt-4">
                          <div className="row mb-4">
                            {/* Occasions */}
                            <div className="col-md-8 shadow-lg">
                              <h3 className="mt-3">Select Occasion</h3>
                              <div className="row">
                                {Occation.map((ele, ind) => (
                                  <div
                                    className="col-6 col-md-3 mb-3 text-center"
                                    key={ind}
                                    onClick={() => handleImageClick(ele)}
                                    style={{
                                      cursor: "pointer",
                                      background:
                                        selectedOccasion?._id === ele?._id
                                          ? "linear-gradient(105deg, rgba(191,149,63,1) 0%, rgba(252,246,186,1) 28%, rgba(195,156,76,1) 66%, rgba(203,165,79,1) 79%, rgba(255,233,144,1) 94%)"
                                          : "transparent",
                                      color:
                                        selectedOccasion?._id === ele?._id
                                          ? "black"
                                          : "inherit",
                                      borderRadius: "0.5rem",
                                      padding: "1rem",
                                      transition:
                                        "background 0.3s ease, color 0.3s ease",
                                    }}
                                  >
                                    <div>
                                      <img
                                        src={URLS.Base + ele.image}
                                        alt="occasions images"
                                        // className="rounded-circle img-fluid"
                                        className="img-fluid"
                                        style={{
                                          height: "125px",
                                          width: "130px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                    <h6 className="mt-2">{ele.name}</h6>
                                  </div>
                                ))}
                              </div>
                              {/* <div className="alert alert-warning mt-3"> */}
                              {/* <i className="fa fa-exclamation-triangle me-2"></i> */}
                              <span style={{ color: "red" }}>
                                <b>ATTENTION:</b> Decoration cannot be
                                customized.
                              </span>{" "}
                              <br />
                              <span style={{ color: "red" }}>
                                <b>Note:</b> You can add multiple names by comma
                                seperated, if you have multiple special person
                              </span>
                              {/* </div> */}
                              {/* Text Field */}
                              {selectedOccasion && (
                                <div
                                  ref={additionalImagesRef}
                                  className="m-4 col-md-12"
                                >
                                  <div className="m-4 col-md-6">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Special Person Name"
                                      value={textFieldValue}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Booking Summary */}
                            <div className="col-lg-4 col-md-5 mb-3">
                              <div
                                className="position-sticky"
                                style={{ top: "20px" }}
                              >
                                <div className="shadow-lg mt-3">
                                  <div className="card-body mt-3">
                                    <div className="d-flex justify-content-between align-items-center shadow-none mb-2 rounded ">
                                      <div>Total:</div>
                                      <div>
                                        ₹ 0
                                        {/* {parseFloat(
                                          sessionStorage.getItem("TotalPrice")
                                        ).toFixed(2)} */}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="shadow-lg mt-2">
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
                                              {/* <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>
                                                  Theatre Price (
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
                                                  justifyContent:
                                                    "space-between",
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
                                                  {selectedOccasion?.price || 0}
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
                                                <div>Plan Price</div>
                                                <div>
                                                  ₹
                                                  {sessionStorage.getItem(
                                                    "cakeprice"
                                                  ) || 0}
                                                </div>
                                              </div>
                                              <hr /> */}
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>Sub Total</div>
                                                <div>
                                                  ₹ 0
                                                  {/* {sessionStorage.getItem(
                                                    "subtotal"
                                                  )} */}
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
                                                <div>Coupon Amount</div>
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
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>Total Amount</div>
                                                <div>
                                                  ₹ 0
                                                  {/* {parseFloat(
                                                    sessionStorage.getItem(
                                                      "TotalPrice"
                                                    )
                                                  ).toFixed(2)} */}
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
                                  onClick={() => handleSubmit()}
                                  className="btn btn-success w-100 mt-2 bg-primary"
                                  style={{
                                    // backgroundColor: "#a020f0",
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

export default ComboOccassions
