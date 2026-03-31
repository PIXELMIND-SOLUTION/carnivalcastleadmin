import React, { useState, useEffect } from "react";
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { URLS } from "../../Url";
import axios from "axios";

function RecruitView() {
  const history = useHistory();
  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const user = JSON.parse(localStorage.getItem("authUser"));
  const token = user?.token;

  const Theaterid = sessionStorage.getItem("Theaterid");

  useEffect(() => {
    if (Theaterid && token) {
      getTheater();
    }
  }, [Theaterid, token]);

  const getTheater = () => {
    axios
      .post(
        URLS.GetOneTheater,
        { id: Theaterid },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const theater = res.data.theatre;
        setForm(theater);

        if (Array.isArray(theater.image)) {
          setImages(theater.image);
          setMainImage(theater.image[0]);
        } else if (theater.image) {
          setImages([theater.image]);
          setMainImage(theater.image);
        } else {
          setImages([]);
          setMainImage("");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch theater:", err);
      });
  };

  if (!form) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="View Theater"
          />
          <p>Loading theater details...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Carnival Castle Admin"
          breadcrumbItem="View Theater"
        />
        <Row>
          <Col>
            <Button
              onClick={() => history.goBack()}
              className="mb-3 m-1"
              style={{ float: "right" }}
              color="primary"
            >
              <i className="far fa-arrow-alt-circle-left"></i> Back
            </Button>
          </Col>
        </Row>
        <Card>
          <CardBody className="mt-3 mb-3">
            <Row>
              {/* IMAGE SECTION */}
              <Col lg={4}>
                <h5 className="mb-3 text-primary">Theater Images:</h5>
                {mainImage && (
                  <img
                    src={URLS.Base + mainImage}
                    style={{
                      borderRadius: "10px",
                      height: "300px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    alt={`Main image of ${form.name}`}
                  />
                )}
                <div className="d-flex flex-wrap mt-3">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URLS.Base + img}
                      onClick={() => setMainImage(img)}
                      style={{
                        width: "70px",
                        height: "70px",
                        marginRight: "10px",
                        marginBottom: "10px",
                        cursor: "pointer",
                        border:
                          mainImage === img
                            ? "2px solid #007bff"
                            : "1px solid #ccc",
                        borderRadius: "5px",
                        objectFit: "cover",
                      }}
                      alt={`Thumbnail ${idx + 1} of ${form.name}`}
                    />
                  ))}
                </div>
              </Col>

              {/* THEATER INFO */}
              <Col xl={4} className="mt-3">
                <div className="mt-4 mt-xl-3">
                  <h4 className="mt-1 mb-3">{form.name}</h4>
                  <h5 className="mb-4">
                    Price:{" "}
                    <span className="text-muted me-2">
                      <del>₹{form.price}</del>
                    </span>
                    <b>₹{form.offerPrice} /-</b>
                  </h5>
                  <p className="text-muted mb-4">{form.description}</p>
                  <p className="text-muted">
                    <i className="bx bxs-user text-primary me-2" />
                    Max People: {form.maxPeople}
                  </p>
                  <p className="text-muted">
                    <i className="bx bx-handicap text-primary me-2" />
                    Max Seating: {form.maxSeating}
                  </p>
                  <p className="text-muted">
                    <i className="bx bxs-group text-primary me-2" />
                    Extra Person: {form.extraPerson}
                  </p>
                  <p className="text-muted">
                    <i className="bx bxs-badge-check text-primary me-2" />
                    Extra Person Cost: ₹{form.extraPersonprice} /-
                  </p>
                  <p className="text-muted">
                    <i className="bx bx-time text-primary me-2" />
                    One and Half Hour: ₹{form.oneandhalfslotPrice || 0} /-
                  </p>
                  <p className="text-muted">
                    <i className="bx bx-link text-primary me-2" />
                    Link:{" "}
                    <a
                      href={form.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {form.link}
                    </a>
                  </p>
                  <p className="text-muted">
                    <i className="bx bxs-star text-primary me-2" />
                    Batch Type: {form.batchType}
                  </p>
                  <p className="text-muted">
                    <i className="bx bx-clock text-primary me-2" />
                    One Half An Hour Extra Person Price: ₹
                    {form.onehalfanhourExtraPersonPrice}
                  </p>
                  <p className="text-muted">
                    <i className="bx bxs-toggle-on text-primary me-2" />
                    Status: {form.status}
                  </p>
                </div>
              </Col>

              {/* FEATURES + ADDRESS */}
              <Col md={4} className="mt-4">
                <h5 className="mb-3 text-primary">Features:</h5>
                {form.features?.length > 0 ? (
                  form.features.map((item, i) => (
                    <p key={i} className="text-muted">
                      <i className="fa fa-caret-right text-primary me-2" />
                      {item}
                    </p>
                  ))
                ) : (
                  <p className="text-muted">No features listed.</p>
                )}

                <h5 className="mt-4 mb-3 text-primary">Address:</h5>
                {form.address ? (
                  <>
                    <p className="text-muted">
                      <i className="bx bx-map text-primary me-2" />
                      {form.address.addressLine1}
                    </p>
                    <p className="text-muted">
                      <i className="bx bx-map-pin text-primary me-2" />
                      {form.address.city}, {form.address.state} -{" "}
                      {form.address.postalCode}
                    </p>
                    <p className="text-muted">
                      <i className="bx bx-landscape text-primary me-2" />
                      Landmark: {form.address.landmark}
                    </p>
                    <p className="text-muted">
                      <i className="bx bx-phone text-primary me-2" />
                      Phone: {form.address.phone}
                    </p>
                    <p className="text-muted">
                      <i className="bx bx-globe text-primary me-2" />
                      Country: {form.address.country}
                    </p>
                  </>
                ) : (
                  <p className="text-muted">No address details available.</p>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}

export default RecruitView;
