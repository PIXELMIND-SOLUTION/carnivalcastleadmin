import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import {Container,} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url1"
import axios from "axios";
import { useHistory } from "react-router-dom"


const CakesComponent = () => {
    const history = useHistory()
    
    const [selectedCakes, setSelectedCakes] = useState(
        JSON.parse(localStorage.getItem("cartCakes")) || []
      );
      const [normalCakes, setNormalCakes] = useState([]); // EGG
      const [premiumCakes, setPremiumCakes] = useState([]); // EGGLESS
      const [isEggless, setIsEggless] = useState(false); // Toggleeeee
    
      console.log(selectedCakes, "selectedCakes");
      const [selectedCakesupdate, setSelectedCakesupdate] = useState([]); //  Select Cakes
      console.log(selectedCakes);
      console.log(selectedCakesupdate);
      const [addons, setAddons] = useState(
        JSON.parse(localStorage.getItem("adonsJSON")) || []
      );
      console.log(addons);
    
      const [newCakes, setNewCakes] = useState([]);
      console.log(newCakes);
    
      const additionalImagesRef = useRef(null);
    
      useEffect(() => {
        GetAllCakes();
      }, []);
    
      const GetAllCakes = () => {
        axios.post(URLS.GetGetAllCakes).then((res) => {
          if (res.status === 200) {
            setNormalCakes(res?.data?.normalCakes);
            setPremiumCakes(res?.data?.premiumCakes);
            setIsLoading(false);
          }
        });
      };
    
      const combineCakes = isEggless ? premiumCakes : normalCakes;
    
      // Initialize CartCakes as an empty array by default
      const [CartCakes, setCartCakes] = useState(() => {
        const savedCartCakes = localStorage.getItem("cartCakes");
        return savedCartCakes ? JSON.parse(savedCartCakes) : [];
      });
    
      const handleImageClick = (cake) => {
        // Retrieve cake price and total price from localStorage (initialize if not available)
        var cakeprice = parseFloat(localStorage.getItem("cakeprice")) || 0;
        var TotalPrice = parseFloat(localStorage.getItem("TotalPrice")) || 0;
    
        var subtotal = parseFloat(localStorage.getItem("subtotal")) || 0;
        var total = TotalPrice;
    
        // Toggle selected cakes
        setSelectedCakes((prevSelectedCakes) => {
          console.log(prevSelectedCakes, "prevSelectedCakes");
    
          if (prevSelectedCakes.includes(cake)) {
            TotalPrice = TotalPrice - cake.price;
            subtotal = subtotal - cake.price;
            var CouponData = JSON.parse(localStorage.getItem("CouponData"));
            if (CouponData) {
              if (CouponData.couponCodeType === "Percentage") {
                var discount = (subtotal * CouponData.couponAmount) / 100;
                localStorage.setItem("coupondis", discount);
                TotalPrice = subtotal - discount;
              }
            }
            // Deselect: update prices and remove from selectedCakes
            localStorage.setItem("cakeprice", cakeprice - cake.price);
            localStorage.setItem("TotalPrice", TotalPrice);
            localStorage.setItem("subtotal", subtotal);
            const updcart = prevSelectedCakes.filter((item) => item !== cake);
    
            console.log(updcart, "updcart========");
            localStorage.setItem("cartCakes", JSON.stringify(updcart));
    
            return updcart;
          } else {
            TotalPrice = TotalPrice + cake.price;
            subtotal = parseFloat(subtotal) + cake.price;
            var CouponData = JSON.parse(localStorage.getItem("CouponData"));
    
            if (CouponData) {
              if (CouponData.couponCodeType === "Percentage") {
                var discount = (subtotal * CouponData.couponAmount) / 100;
                localStorage.setItem("coupondis", discount);
                console.log("coupondis", discount);
                TotalPrice = subtotal - discount;
              }
            }
    
            // Select: update prices and add to selectedCakes
            localStorage.setItem("cakeprice", cakeprice + cake.price);
    
            localStorage.setItem("TotalPrice", TotalPrice);
    
            localStorage.setItem("subtotal", subtotal);
    
            return [...prevSelectedCakes, cake];
          }
        });
    
        // Update CartCakes with add/remove logic
        setCartCakes((prevCartCakes) => {
          const cakeInCart = prevCartCakes.some(
            (item) => item.id === cake._id.toString()
          );
    
          if (cakeInCart) {
            // Deselect: remove cake from CartCakes
            const updatedCart = prevCartCakes.filter(
              (item) => item.id !== cake._id.toString()
            );
            localStorage.setItem("cartCakes", JSON.stringify(updatedCart));
            return updatedCart;
          } else {
            // Select: add cake to CartCakes with default quantity
            const newCake = {
              id: cake._id.toString(),
              name: cake.name,
              quantity: "500", // Default quantity or based on user's input
              price: cake.price,
            };
            const updatedCart = [...prevCartCakes, newCake];
            setSelectedCakesupdate(updatedCart);
            localStorage.setItem("cartCakes", JSON.stringify(updatedCart));
            return updatedCart;
          }
        });
    
        // Smooth scroll to additional images
        setTimeout(() => {
          additionalImagesRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      };
    
      var cakesarray = JSON.parse(localStorage.getItem("cartCakes"));
      console.log(cakesarray);
    
      const handleSubmit = async () => {
        const productMap = await selectedCakesupdate.map((e, i) => {
          return {
            _id: e.id,
            name: e.name,
            type: "cake",
            price: selectedCakes[0]?.price,
            quantity: e.quantity,
          };
        });
        console.log(productMap);
        const bodyData = {
          products: productMap,
          cakes: JSON.stringify(IDS),
          // products : JSON.stringify(productMap),
          bookingId: localStorage.getItem("bookingid"),
        };
        axios
          .post(
            "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecakes",
            bodyData
          )
          .then(
            (res) => {
              if (res.status === 200) {
                navigate("/AddOns");
              }
            },
            (error) => {
              if (error.response && error.response.status === 400) {
                console.log(error.response);
              }
            }
          );
      };
    
      const [selectedWeights, setSelectedWeights] = useState({});
    
      const handleChange = async (event, index, cake) => {
        setCartCakes(JSON.parse(localStorage.getItem("cartCakes")));
        const { value } = event.target;
        const weightMultiplier = {
          500: 1,
          1: 2,
          2: 4,
          3: 6,
        };
    
        const selectedWeight = value || "500"; // Default to "500 gms" if no weight is selected
        const weightPriceMultiplier = weightMultiplier[selectedWeight] || 1;
    
        // Update the selected weight
        setSelectedWeights({
          ...selectedWeights,
          [index]: selectedWeight,
        });
    
        // Calculate the new price for the selected weight
        const newPrice = parseFloat(cake.price) * parseFloat(weightPriceMultiplier);
    
        // Retrieve the previous prices from local storage
        let cakeprice = parseFloat(localStorage.getItem("cakeprice") || 0);
        let TotalPrice = parseFloat(localStorage.getItem("TotalPrice") || 0);
        let subtotal = parseFloat(localStorage.getItem("subtotal") || 0);
    
        // Retrieve the previously selected weight for the current cake
        const prevWeight = selectedWeights[index] || "500";
        const prevMultiplier = weightMultiplier[prevWeight] || 1;
        const prevPrice = parseFloat(cake.price) * parseFloat(prevMultiplier);
    
        // Update the prices in local storage by subtracting the previous price and adding the new price
        cakeprice = cakeprice - parseFloat(prevPrice) + parseFloat(newPrice);
        TotalPrice = TotalPrice - prevPrice + newPrice;
        subtotal = subtotal - prevPrice + newPrice;
    
        var CouponData = JSON.parse(localStorage.getItem("CouponData"));
        if (CouponData) {
          if (CouponData.couponCodeType === "Percentage") {
            var discount = (subtotal * CouponData.couponAmount) / 100;
            localStorage.setItem("coupondis", discount);
            console.log("coupondis", discount);
            TotalPrice = subtotal - discount;
          }
        }
    
        // Set the updated prices back to local storage
        localStorage.setItem("cakeprice", cakeprice);
        localStorage.setItem("TotalPrice", TotalPrice);
        localStorage.setItem("subtotal", subtotal);
    
        var cakes = JSON.parse(localStorage.getItem("cartCakes"));
        // Update the selected cake in the cart with the new weight and price
        setCartCakes((cakes) =>
          cakes.map((item) =>
            item.id === cake._id.toString()
              ? { ...item, quantity: selectedWeight, price: newPrice }
              : item
          )
        );
        const updatedCakes = await cakes.map((item) =>
          item.id === cake._id.toString()
            ? { ...item, quantity: selectedWeight, price: newPrice }
            : item
        );
    
        // Ensure the cart is updated in local storage
        setSelectedCakesupdate(updatedCakes);
        localStorage.setItem("cartCakes", JSON.stringify(updatedCakes));
      };
    
      useEffect(() => {
        axios
          .post(
            "https://api.carnivalcastle.com/v1/carnivalApi/web/bookings/getallbookings",
            { bookingId: localStorage.getItem("bookingid") }
          )
          .then((res) => {
            console.log(res);
            setNewCakes(res.data.booking.products);
          });
      }, []);

  return (
<React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="Cakes"
          />
            <section
              className="shop-area p-relative "
              style={{ background: "white" }}
            >
              <div className="container">
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={() => history.push("/Addons")}
                >
                  {" "}
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>
                <div className="row mb-4">
                  {/* Cakes Selection */}
                  <div className="col-md-8 ">
                    <div className="d-flex align-items-center m-3 ">
                      <h5 style={{ marginRight: "20px" }}>Select Cake</h5>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="egglessSwitch"
                          checked={isEggless}
                          onChange={() => setIsEggless(!isEggless)}
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="egglessSwitch"
                        >
                          {isEggless ? "Egg" : "Eggless"}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cakes Display */}
                  <div className="col-lg-8 col-md-6 mx-auto">
                    <div className="row justify-content-center">
                      {combineCakes.map((cake, index) => (
                        <div
                          className="col-lg-4 col-sm-12 col-12 mb-1 mt-2"
                          // className="col-6 col-md-3 mb-1 mt-3 text-center"
                          key={index}
                        >
                          <div
                            className="card shadow-lg mx-auto"
                            style={{
                              // height: "74%",
                              height: "auto",
                              cursor: "pointer",
                              width: "90%",
                              position: "relative",
                              marginBottom: "12px",
                              cursor: "pointer",
                              border: "2px solid #F5E7B6",
                            }}
                            onClick={() => handleImageClick(cake)}
                          >
                            <img
                              src={URLS.Base + cake.image}
                              className="card-img-top"
                              alt={cake.name}
                              style={{
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />

                            {console.log(newCakes, "newCakes")}
                            {console.log(cake._id, "cake")}

                            {newCakes.map((cartCake) => {
                              console.log(cartCake._id, "how are u newchange");
                            })}

                            <div
                              className="card-body"
                              style={{
                                backgroundColor:
                                  selectedCakes.includes(cake) ||
                                  newCakes.find(
                                    (cartCake) =>
                                      String(cartCake._id) === cake._id
                                  )
                                    ? "var(--milk-white) !important" // MILK
                                    : "#212529", // dark
                                borderRadius: "3px",
                              }}
                            >
                              <h6 className="card-title d-flex align-items-center">
                                {cake.name}
                                {isEggless && (
                                  <span
                                    className="badge bg-success ms-2"
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                    }}
                                  >
                                    Eggless
                                  </span>
                                )}
                                <img
                                  src={
                                    isEggless
                                      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nGNgGDZAdH6Fh9iCisfiCyv+k40XVPwTW1hxRnRBiTKGBWILyx9RZPhCFIuWYlgAk6QoFBaVWUEtOEoTC8QXVZiDzBBbUH6CJhZILqgwBluwsOIMSRaILSz3F1tYsV9sQcUXMF5Yvk98YYUPujrRReX60CC6QLQFYgsrOvBEaDOKGYsqdaBBdJkoC8QWVQYQSjESCyu84EE0v1IDEkTl14mzYEH5AcLJsnwPTL3IvFJVqPgt4ixYWP6ViHT/Aa5+boUSNIjuEemDii9E+OA9PIgWlstBLKh4SL0gWlCxG6ZeeE6pFFT8KbFB5E8wkheUecLVL6sUh/rgJVEWQIOpHY/rG5HVSi2sEIbGwRuiLQAB8UXlvmILKvaKLyj/LL6w4hMo5SAnTxgQnFnOjx7x1C3sVtXzQHxW/pkmFsisKuSExsE3mljAMDONFWrOL9pWOAsr7mKvMqlgidiC8gdiCytcKAqJQQUAHGz+5dhaYC0AAAAASUVORK5CYII="
                                      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABW0lEQVR4nN2VP0sDQRDF01gIgoWFYGGhCBaCxRWGS/LeXXKFihK/kljoF/FT+LcRLFIIFoKgaDTZPRUVEy0sjOSYO84YzWruQBzYZvYxP+bNsJvJ/JvwyXkNXGmy9dujyDcNVHzXnfwE0GS1n+L6I2izGyC47MuFQsEWwEEqAOU4c0Ed4DAVQN11LQFUfgTQjlPWwJ4GmsEhdxW51KnzXXc2sAg4MgZocuPLYQJrca0iZ6SDYyOAJld6bUwdWAz1NXJaACdmAGC/50oC26H+BpiSLTo17eDZAPAY6fP5Ccmfm3bQNAA8RBblcuOSv0zSoq1Qf2vbY2JRzQzgOGWDIS9E+mJxVPK+EUC6WP/mzVmNa69LpRHZojtjQDsUsKzJHQU0FPnU3pz4eoZx73nDnYNP9rEjhwTQSAVQzWYHpc5LKoCWZQ3IbF7T/nDOun+ZSUCAC016/Tjxt+IdjFUzfH0mcf4AAAAASUVORK5CYII="
                                  }
                                  style={{ width: "20px", height: "auto" }}
                                  className="ms-2"
                                  alt="icon"
                                />
                              </h6>
                            </div>
                          </div>
                          <div style={{ padding: "0px 15px 15px 15px" }}>
                            <select
                              className="form-select form-select-sm"
                              value={
                                selectedCakes.includes(cake)
                                  ? selectedWeights[index] ||
                                    newCakes.find(
                                      (cartCake) =>
                                        String(cartCake._id) ===
                                        String(cake._id)
                                    )?.quantity ||
                                    "500"
                                  : "500" // Default to "500 gms" if deselected
                              }
                              onChange={(event) =>
                                handleChange(event, index, cake)
                              }
                            >
                              <option value="500">500 gms</option>
                              <option value="1">1 kg</option>
                              <option value="2">2 kg</option>
                              <option value="3">3 kg</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="col-lg-4 col-md-5">
                    <div className="position-sticky" style={{ top: "20px" }}>
                      <div className="bg-light-grey mb-3">
                        <div className="card-body mt-3">
                          <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded gradient-border">
                            <div>Total:</div>
                            <div>
                              ₹
                              {parseFloat(
                                localStorage.getItem("TotalPrice")
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shadow-lg">
                        <div className="card-body">
                          <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                              <h2 className="accordion-header" id="headingOne">
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
                                      <div>
                                        Theatre Price (
                                        {localStorage.getItem("countPeople")}{" "}
                                        ppl)
                                      </div>
                                      <div>
                                        ₹{localStorage.getItem("theaterPrice")}
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
                                        {localStorage.getItem("occasionName")})
                                      </div>
                                      <div>
                                        ₹{localStorage.getItem("occprice")}
                                      </div>
                                    </div>
                                    <hr />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Cakes:</div>
                                    </div>
                                    {JSON.parse(
                                      localStorage.getItem("cartCakes") || "[]"
                                    ).length === 0 ? (
                                      <div style={{ marginBottom: "8px" }}>
                                        No cakes in the cart
                                      </div>
                                    ) : (
                                      JSON.parse(
                                        localStorage.getItem("cartCakes") ||
                                          "[]"
                                      ).map((cake, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div>
                                            {cake.name} (x{cake.quantity})
                                          </div>
                                          <div>
                                            ₹
                                            {cake.quantity == "500"
                                              ? cake.price
                                              : cake.price}
                                          </div>
                                        </div>
                                      ))
                                    )}
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
                        onClick={handleSubmit}
                        className="btn btn-success w-100 mt-2 "
                        style={{
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
            </section>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default CakesComponent