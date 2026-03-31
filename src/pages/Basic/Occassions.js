import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import {Container,} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url1"
import axios from "axios";
import { useHistory } from "react-router-dom"

const Occassions = () => {
  var gets = localStorage.getItem("authUser")
  var datass = JSON.parse(gets)
  var datas = datass.token

  const [Occation, setOccation] = useState([]);
  console.log(Occation);
  const [selectedOccasion, setSelectedOccasion] = useState(
    JSON.parse(localStorage.getItem("selectedOccasion"))
  );
  const [addons, setAddons] = useState(
    JSON.parse(localStorage.getItem("adonsJSON")) || []
  );
  console.log(addons);
  const [selectedOccasion1, setSelectedOccasion1] = useState();
  console.log(selectedOccasion1);
  const additionalImagesRef = useRef(null);
  const [textFieldValue, setTextFieldValue] = useState("");

  const handleSubmit = () => {
    const dataArray = {
      occasionId: selectedOccasion._id,
      personName: textFieldValue,
      totalPrice: localStorage.getItem("TotalPrice"),
      bookingId: localStorage.getItem("bookingid"),
    };

    axios
      .post(
        'https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/new/updateocasion',
        dataArray
      )
      .then(
        (res) => {
          if (res.status === 200) {
            if (!textFieldValue) {
              toast.error("Please fill out the text field!");
              return;
            }
          }
          setOccation(res?.data?.occasions);
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log(error.response);
          }
        }
      );
  };

  const handleImageClick = (occasion) => {
    setSelectedOccasion(occasion);
    localStorage.setItem("occasionName", occasion.name);

    var totalPrice = localStorage.getItem("TotalPrice");

    var subtotal = localStorage.getItem("subtotal");

    var occprice = localStorage.getItem("occprice");

    console.log(occprice, "occprice");

    // localStorage.setItem("occasion", JSON.stringify(occasion));

    localStorage.setItem("selectedOccasion", JSON.stringify(occasion)); // Save to localStorage

    var total =
      parseFloat(totalPrice) +
      parseFloat(occasion.price) -
      parseFloat(occprice);

    var subtotalaount =
      parseFloat(subtotal) + parseFloat(occasion.price) - parseFloat(occprice);

    localStorage.setItem("subtotal", parseFloat(subtotalaount));

    var CouponData = JSON.parse(localStorage.getItem("CouponData"));
    if (CouponData) {
      if (CouponData.couponCodeType === "Percentage" && occprice === 0) {
        var discount = (subtotalaount * CouponData.couponAmount) / 100;
        localStorage.setItem("coupondis", discount);
        total = total - discount;
      }
    }

    localStorage.setItem("TotalPrice", parseFloat(total));

    localStorage.setItem("occprice", occasion.price);

    console.log(total, "TotalPrice");

    setTimeout(() => {
      additionalImagesRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 200);
  };

  const history = useHistory()

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Occassions"
          />
         <section
          className="shop-area p-relative" 
            //   style={{ background: "white" }}
            >
              <div className="container">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => history.push("/BasicForm")}
                >
                  {" "}
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>
                <div className="container mt-4">
                  <div className="row mb-4">
                    {/* Occasions */}
                    <div className="col-md-8 ">
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
                                  ? "var(--gold-gradient)"
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
                                className="rounded-circle img-fluid"
                                style={{
                                  height: "150px",
                                  width: "150px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <h6 className="mt-2">{ele.name}</h6>
                          </div>
                        ))}
                      </div>
                      <div className="alert alert-warning mt-3">
                        <i className="fa fa-exclamation-triangle me-2"></i>
                        Occasions are not customizable. Please select predefined
                        add-ons in the next window.
                      </div>
                      {/* Text Field */}
                      {selectedOccasion && (
                        <div ref={additionalImagesRef} className="m-4 col-md-12">
                        <div className="m-4 col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Please enter the required details..."
                            value={textFieldValue}
                            onChange={(e) => setTextFieldValue(e.target.value)}
                          />
                        </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Summary */}
                    <div className="col-lg-4 col-md-5">
                      <div className="position-sticky" style={{ top: "20px" }}>
                        <div className=" mb-3">
                          <div className="card-body shadow-lg mt-3">
                            <div className="d-flex justify-content-between align-items-center shadow-none p-1 mb-2 rounded">
                              <div>Total:</div>
                              <div>₹{localStorage.getItem("TotalPrice")}</div>
                            </div>
                          </div>
                        </div>

                        <div className="shadow-lg">
                          <div className="card-body">
                            <div className="accordion" id="accordionExample">
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
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Theatre Price ({localStorage.getItem("countPeople")} ppl)</div>
                                        <div>
                                          ₹
                                          {localStorage.getItem("theaterPrice")}
                                        </div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Addons</div>
                                        <div>
                                          ₹{localStorage.getItem("addons")}
                                        </div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          Occasions (
                                          {localStorage.getItem("occasionName")}
                                          )
                                        </div>
                                        <div>
                                          ₹{selectedOccasion?.price || 0}
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
                                      </div>
                                      {addons.map((occasion, index) => (
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
                                      ))}
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Sub Total</div>
                                        <div>
                                          ₹{localStorage.getItem("subtotal")}
                                        </div>
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
                                          ₹
                                          {parseFloat(
                                            localStorage.getItem("coupondis")
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Total Amount</div>
                                        <div>
                                          ₹
                                          {parseFloat(
                                            localStorage.getItem("TotalPrice")
                                          ).toFixed(2)}
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
                          className="btn btn-success w-100 mt-2 "
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
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Occassions
