import React, { useState, useEffect } from "react"
import Accordion from "react-bootstrap/Accordion"
import Footer from "./Footer"
import Header from "./Header"
import { URLS } from "../Url"
import axios from "axios"
import { Checkmark } from "react-checkmark"
import thank from "./images/thankYOU.webp"
import { useHistory } from "react-router-dom"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import thank from "./thankYOU.webp"

import {
  Modal,
  ModalBody,
  Row,
  Container,
  ModalFooter,
  ModalHeader,
} from "reactstrap"
function Enquiry() {
  var gets = localStorage.getItem("authUser")
  var data123 = JSON.parse(gets)
  var datas = data123.token
  var token = datas

  const [resdata, setresdata] = useState([]);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    GetFaqsData()
  }, [])

  const GetFaqsData = () => {
    const bodydata={
      bookingId: sessionStorage.getItem("bookingid"),
    }
    axios.post("https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/get-bookingbyid", bodydata, {}).then((res) => {
      if (res.status === 200) {
        setresdata(res.data.data[0]);
        setIsLoading(false);
        // sessionStorage.clear();
      }
    });
  };

  const invoice = sessionStorage.getItem("invoicePath")
  const orderId = sessionStorage.getItem("orderId")

  const history = useHistory()

  const handleClick = () => {
    history.push("/dashboard")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Thank You Page" />
          <Row>
            <>
              {isLoading == true ? (
                <>
                  <div
                    className="text-center "
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
                      <img
                        src="assets/img/gipss.gif"
                        style={{ height: "300px", color: "white" }}
                      ></img>
                      <h6 style={{ color: "gold" }}>Loading...</h6>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="home-page indexsix">
                    <Header />
                    <main className="main-wrapper">
                      <section
                        id="parallax"
                        className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
                      ></section>
                      <div className="container d-flex justify-content-center align-items-center vh-100">
                        <div
                          className="p-4 m-3 rounded text-center"
                          style={{
                            maxWidth: "100%",
                            width: "100%",
                            maxWidth: "400px",
                          }}
                        >
                          <div className="mb-3">
                            <Checkmark
                              style={{
                                color: "green",
                                fontSize: "3rem",
                                animation: "bounce 1s infinite",
                              }}
                            />
                          </div>
                          <h3>Payment Successful</h3>
                          <p>
                            Order ID: <strong>{resdata.orderId}</strong>
                          </p>
                          <img
                            src={thank}
                            alt="Payment Successful"
                            className="img-fluid mt-3 mb-3"
                          />
                          <div className="d-flex flex-column flex-sm-row justify-content-between">
                            <button
                              onClick={handleClick}
                              className="btn bg-primary mb-2 mb-sm-0"
                              style={{ boxShadow: "none" }}
                            >
                              Go to Home
                            </button>
                            <a
                              href={"https://api.carnivalcastle.com/" + resdata.invoice}
                              className="btn bg-primary"
                              target="_blank"
                              style={{ boxShadow: "none" }}
                            >
                              Invoice
                            </a>
                          </div>
                        </div>
                      </div>
                    </main>
                    <Footer />
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

export default Enquiry
