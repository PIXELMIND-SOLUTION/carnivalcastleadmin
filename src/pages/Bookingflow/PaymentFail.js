import React, { useState, useEffect } from "react"
import Footer from "./Footer"
import Header from "./Header"
import { URLS } from "../Url"
import axios from "axios"
import error from "./errorImage.jpg"
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

  const [Faqs, setFaqs] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    GetFaqsData()
  }, [])

  const GetFaqsData = () => {
    axios
      .post(
        URLS.AllModules,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setFaqs(res.data.faqs)
          setIsLoading(false)
        }
      })
  }

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
                          <h3 className="text-danger">Payment Failed</h3>
                          <img
                            src={error}
                            alt="Payment Failed"
                            className="img-fluid mt-3 mb-3"
                          />
                          <div className="d-flex flex-column flex-sm-row justify-content-between">
                            <button
                              onClick={handleClick}
                              className="btn bg-primary mb-2 mb-sm-0"
                              style={{ boxShadow: "none" }}
                            >
                              Try Again
                            </button>
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
