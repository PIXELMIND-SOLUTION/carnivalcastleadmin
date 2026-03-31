// import React, { useState, useEffect, useRef } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { ToastContainer, toast } from "react-toastify";
// import {Container,} from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { URLS } from "../../Url1"
// import axios from "axios";
// import { useHistory } from "react-router-dom"

// const Addons = () => {

//     const history = useHistory();

//     const [addOns, setAddOns] = useState([]);
//     const selectaddonsdata = JSON.parse(localStorage.getItem("addonsData")) || [];
  
//     const [selectedOccasions, setSelectedOccasions] = useState(
//       JSON.parse(localStorage.getItem("addonsData")) || []
//     );
//     // JSON.parse(localStorage.getItem("adonsJSON")) ||
//     console.log(selectedOccasions);
  
//     const additionalImagesRef = useRef(null);
  
//     console.log(selectaddonsdata.map((data) => data._id));
  
//     useEffect(() => {
//       GetTheatersData();
//       GetAddOns();
//     }, []);
  
//     const GetTheatersData = () => {
//       axios.post(URLS.GetAllTheaters, {}).then((res) => {
//         if (res.status === 200) {
//           setIsLoading(false);
//         }
//       });
//     };
  
//     const GetAddOns = () => {
//       axios
//         .post(
//           "https://api.carnivalcastle.com/v1/carnivalApi/web/getalladdonproducts",
//           {}
//         )
//         .then(
//           (res) => {
//             if (res.status === 200) {
//               setAddOns(res?.data?.products);
//             }
//           },
//           (error) => {
//             if (error.response && error.response.status === 400) {
//               setAddOns([]);
//             }
//           }
//         );
//     };
  
//     const [advanceAmount, setAdvanceAmount] = useState(0);
//     console.log(advanceAmount);
//     useEffect(() => {
//       getOneGst();
//     }, []);
  
//     const getOneGst = async () => {
//       try {
//         const res = await axios.post(URLS.GetCharges, {});
//         if (res.status === 200) {
//           // setGst(Number(res.data.charges.bookingGst));
//           setAdvanceAmount(Number(res.data.charges.advancePayment));
         
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 400) {
//           // setGst(0);
//         }
//       }
//     };
  
//     const [totalAmountOption, setTotalAmountOption] = useState("fullpayment");
//     const [totalAmountOption1, setTotalAmountOption1] = useState("");
  
//     const slecthandleChange = (e) => {
//       const myChange = { ...totalAmountOption };
//       myChange[e.target.name] = e.target.value;
//     localStorage.setItem("paymentkey", e.target.value)
//       setTotalAmountOption(myChange);
//       if (e.target.value == "partialpayment") {
//         const advanceamountkey =
//           parseFloat(localStorage.getItem("TotalPrice")) -
//           parseFloat(advanceAmount);
//         setTotalAmountOption1(advanceamountkey);
//         localStorage.setItem("TotalPrice2", advanceamountkey)
//         localStorage.setItem('advancePayment', parseFloat(advanceAmount));
//       } else {
//         const advanceamountkey = parseFloat(localStorage.getItem("TotalPrice"));
//         setTotalAmountOption1(advanceamountkey);
//         localStorage.setItem("TotalPrice2", advanceamountkey)
//       }
//     };
  
//     // Conditional total amount calculation
//     const remainingAmount =
//       totalAmountOption === "fullpayment"
//         ? 0
//         : localStorage.getItem("TotalPrice") - advanceAmount;
  
//     const totalAmount = Number(localStorage.getItem("TotalPrice"));
//     const remainingAmountFixed = remainingAmount.toFixed(2);
//     const totalAmountFixed = totalAmount.toFixed(2);
//     const displayedAdvanceAmount =
//       totalAmountOption === "fullpayment" ? 0 : advanceAmount;
  
//     const handleImageClick = (occasion) => {
//       var addons = localStorage.getItem("addons");
//       var TotalPrice = localStorage.getItem("TotalPrice");
  
//       // totalAmountOption !== "fullpayment"
//       //   ? remainingAmountFixed
//       //   : totalAmountFixed;
  
//       var subtotal = localStorage.getItem("subtotal");
  
//       setSelectedOccasions((prevSelected) => {
//         const isSelected = prevSelected.includes(occasion);
  
//         if (isSelected) {
//           localStorage.setItem("addons", parseFloat(addons) - occasion.price);
  
//           TotalPrice = parseFloat(TotalPrice) - occasion.price;
  
//           subtotal = parseFloat(subtotal) - occasion.price;
  
//           var CouponData = JSON.parse(localStorage.getItem("CouponData"));
  
//           if (CouponData) {
//             if (CouponData.couponCodeType === "Percentage") {
//               var discount = (subtotal * CouponData.couponAmount) / 100;
//               localStorage.setItem("coupondis", discount);
//               console.log("coupondis", discount);
//               TotalPrice = subtotal - discount;
//             }
//           }
  
//           // localStorage.setItem("TotalPrice", TotalPrice);
  
//           // const totalPrice =
//           //   totalAmountOption !== "fullpayment"
//           //     ? remainingAmountFixed
//           //     : totalAmountFixed;
  
//           localStorage.setItem("TotalPrice", TotalPrice);
  
//           //   console.log("Total Price", totalPrice);
  
//           localStorage.setItem("subtotal", subtotal);
  
//           console.log(isSelected);
//           return prevSelected.filter((item) => item !== occasion);
//         } else {
//           localStorage.setItem("addons", occasion.price + parseFloat(addons));
  
//           TotalPrice = parseFloat(TotalPrice) + occasion.price;
  
//           subtotal = parseFloat(subtotal) + occasion.price;
  
//           var CouponData = JSON.parse(localStorage.getItem("CouponData"));
//           if (CouponData) {
//             if (CouponData.couponCodeType === "Percentage") {
//               var discount = (subtotal * CouponData.couponAmount) / 100;
//               localStorage.setItem("coupondis", discount);
//               console.log("coupondis", discount);
//               TotalPrice = subtotal - discount;
//             }
//           }
  
//           // localStorage.setItem(
//           //   "TotalPrice",
//           //   totalAmountOption !== "fullpayment"
//           //     ? remainingAmountFixed
//           //     : totalAmountFixed
//           // );
//           localStorage.setItem("subtotal", subtotal);
//           // console.log(
//           //   "TotalPrice",
//           //   totalAmountOption !== "fullpayment"
//           //     ? remainingAmountFixed
//           //     : totalAmountFixed
//           // );
//           localStorage.setItem("TotalPrice", parseFloat(TotalPrice));
//           // localStorage.setItem(
//           //   "subtotal",
//           //   parseFloat(subtotal) + occasion.price
//           // );
//           return [...prevSelected, occasion];
//         }
//       });
  
//       console.log(selectedOccasions, "selectedOccasions");
  
//       // localStorage.setItem("adonsJSON", JSON.stringify(selectedOccasions));
//       // localStorage.setItem("adonsJSON", JSON.stringify([...selectedOccasions, occasion]));
  
//       setTimeout(() => {
//         additionalImagesRef?.current?.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }, 200);
//     };
  
//     const handleSubmit = () => {
//       const productMap = selectedOccasions.map((e, i) => {
//         return {
//           _id: e._id,
//           name: e.name,
//           type: "other",
//           price: e.price,
//           quantity: 1,
//         };
//       });
//       const bodyData = {
//         products: productMap,
//         // products: JSON.stringify(productMap),
//         bookingId: localStorage.getItem("bookingid"),
//       };
//       axios
//         .post(
//           "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateaddons",
//           bodyData
//         )
//         .then(
//           (res) => {
//             if (res.status === 200) {
//               navigate("/BookingSummary");
//             }
//           },
//           (error) => {
//             if (error.response && error.response.status === 400) {
//               console.log(error.response);
//             }
//           }
//         );
//       localStorage.setItem("addonsData", JSON.stringify(selectedOccasions));
//     };
  
//   return (

//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title="Carnival Castle Admin"
//             breadcrumbItem="Addons"
//           />
//           <section
//              className="shop-area p-relative"
//               style={{ background: "white" }}
//             >
//               <div className="container">
//                 <button
//                   type="button"
//                   class="btn btn-primary"
//                 >
//                   <i className="far fa-arrow-alt-circle-left"></i> Back
//                 </button>
//                 <div className="container mt-4">
//                   <div className="row mb-4">
//                     {/* Addons */}
//                     <div className="col-md-8">
//                       {addOns.map((data, key) => (
//                         <div key={key}>
//                           <div className="row">
//                             <h4 className="mt-1">{data.name}</h4>
//                             <div className="d-flex flex-wrap">
//                               {data?.products.map((ele, ind) => (
//                                 <div
//                                   className="col-6 col-md-3 mb-3 text-center d-flex"
//                                   key={ind}
//                                   onClick={() => handleImageClick(ele)}
//                                   style={{
//                                     cursor: "pointer",
//                                     borderRadius: "0.5rem",
//                                     display: "flex",
//                                     padding: "3px",
//                                     boxSizing: "border-box",
//                                   }}
//                                 >
//                                   <div
//                                     className="d-flex flex-column justify-content-between align-items-center w-100"
//                                     style={{
//                                       padding: "10px",
//                                       borderRadius: "10px",
//                                       background:
//                                         selectaddonsdata.some(
//                                           (data) => data._id === ele._id
//                                         ) ||
//                                         selectedOccasions.some(
//                                           (data) => data._id === ele._id
//                                         )
//                                           ? "var(--gold-gradient)"
//                                           : "transparent",
//                                       color:
//                                         selectaddonsdata.some(
//                                           (data) => data._id === ele._id
//                                         ) ||
//                                         selectedOccasions.some(
//                                           (data) => data._id === ele._id
//                                         )
//                                           ? "black"
//                                           : "inherit",
//                                     }}
//                                   >
//                                     <div>
//                                       <img
//                                         src={URLS.Base + ele.image}
//                                         alt="occasions images"
//                                         className="rounded-circle img-fluid"
//                                         style={{
//                                           height: "150px",
//                                           width: "150px",
//                                           objectFit: "cover",
//                                         }}
//                                       />
//                                     </div>
//                                     <p
//                                       style={{
//                                         fontSize: "14px",
//                                         fontWeight: "bold",
//                                       }}
//                                     >
//                                       {ele.name}
//                                     </p>
//                                     <p
//                                       style={{
//                                         fontSize: "14px",
//                                         fontWeight: "bold",
//                                       }}
//                                     >
//                                       ₹ {ele.price}/-
//                                     </p>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Booking Summary */}
//                     <div className="col-lg-4 col-md-5">
//                       <div className="position-sticky" style={{ top: "20px" }}>
//                         <div className=" mb-3">
//                           <div className="card-body mt-3">
//                             <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded">
//                               <div>Total:</div>
//                               <div>₹{localStorage.getItem("TotalPrice")}</div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="shadow-lg">
//                           <div className="card-body">
//                             <div className="accordion" id="accordionExample">
//                               <div className="accordion-item">
//                                 <h2
//                                   className="accordion-header"
//                                   id="headingOne"
//                                 >
//                                   <button
//                                     className="accordion-button"
//                                     type="button"
//                                     data-bs-toggle="collapse"
//                                     data-bs-target="#collapseOne"
//                                     aria-expanded="true"
//                                     aria-controls="collapseOne"
//                                   >
//                                     Summary Details
//                                   </button>
//                                 </h2>
//                                 <div
//                                   id="collapseOne"
//                                   className="accordion-collapse collapse show"
//                                   aria-labelledby="headingOne"
//                                   data-bs-parent="#accordionExample"
//                                 >
//                                   <div className="accordion-body">
//                                     <div>
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                         }}
//                                       >
//                                         <div>
//                                           Theatre Price (
//                                           {localStorage.getItem("countPeople")}{" "}
//                                           ppl)
//                                         </div>
//                                         <div>
//                                           ₹
//                                           {localStorage.getItem("theaterPrice")}
//                                         </div>
//                                       </div>
//                                       <hr />
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                           marginBottom: "8px",
//                                         }}
//                                       >
//                                         <div>Addons</div>
//                                       </div>
//                                       {selectedOccasions.map(
//                                         (occasion, index) => (
//                                           <div
//                                             key={index}
//                                             style={{
//                                               display: "flex",
//                                               justifyContent: "space-between",
//                                               marginBottom: "8px",
//                                             }}
//                                           >
//                                             <div>{occasion.name}</div>
//                                             <div>₹{occasion.price}</div>
//                                           </div>
//                                         )
//                                       )}

//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "flex-end",
//                                           marginTop: "8px",
//                                         }}
//                                       >
//                                         ₹{localStorage.getItem("addons") || 0}
//                                       </div>

//                                       <hr />
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                         }}
//                                       >
//                                         <div>
//                                           Occasions (
//                                           {localStorage.getItem("occasionName")}
//                                           )
//                                         </div>
//                                         <div>
//                                           ₹{localStorage.getItem("occprice")}
//                                         </div>
//                                       </div>
//                                       <hr />
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                         }}
//                                       >
//                                         <div> Cake</div>
//                                         <div>
//                                           ₹{localStorage.getItem("cakeprice")}
//                                         </div>
//                                       </div>
//                                       <hr />
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                         }}
//                                       >
//                                         <div>Sub Total</div>
//                                         <div>
//                                           ₹{localStorage.getItem("subtotal")}
//                                         </div>
//                                       </div>
//                                       <hr />
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                         }}
//                                       >
//                                         <div>Coupon Amount</div>
//                                         <div>
//                                           ₹
//                                           {parseFloat(
//                                             localStorage.getItem("coupondis")
//                                           ).toFixed(2)}
//                                         </div>
//                                       </div>
//                                       <hr />

//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                         }}
//                                       >
//                                         <div>Total Amount</div>
//                                         {totalAmountOption.amountOption ===
//                                         "partialpayment" ? (
//                                           <div>
//                                             {/* {localStorage.getItem("TotalPrice")} */}
//                                             {totalAmountOption1}
//                                           </div>
//                                         ) : (
//                                           localStorage.getItem("TotalPrice")
//                                         )}
//                                       </div>
//                                       <hr />
//                                       <div className="row mb-3">
//                                         <div className="col">
//                                           <div className="form-check mt-2">
//                                             <input
//                                               className="form-check-input"
//                                               type="radio"
//                                               name="amountOption"
//                                               id="partialpaymentOption"
//                                               value="partialpayment"
//                                               checked={
//                                                 totalAmountOption.amountOption ===
//                                                 "partialpayment"
//                                               }
//                                               onChange={(e) =>
//                                                 slecthandleChange(e)
//                                               }
//                                             />
//                                             <label
//                                               className="form-check-label"
//                                               htmlFor="partialpaymentOption"
//                                             >
//                                               <small>Advance Amount</small>
//                                             </label>
//                                           </div>
//                                         </div>
//                                         <div className="col pt-0">
//                                           <div className="form-check mt-2">
//                                             <input
//                                               className="form-check-input"
//                                               type="radio"
//                                               name="amountOption"
//                                               id="fullpaymentOption"
//                                               value="fullpayment"
//                                               checked={
//                                                 totalAmountOption.amountOption ===
//                                                 "fullpayment"
//                                               }
//                                               onChange={(e) =>
//                                                 slecthandleChange(e)
//                                               }
//                                             />
//                                             <label
//                                               className="form-check-label"
//                                               htmlFor="fullpaymentOption"
//                                             >
//                                               <small>Full Amount</small>
//                                             </label>
//                                           </div>
//                                         </div>
//                                       </div>

//                                       {totalAmountOption.amountOption ===
//                                         "partialpayment" && (
//                                         <div
//                                           style={{
//                                             display: "flex",
//                                             justifyContent: "space-between",
//                                           }}
//                                         >
//                                           <div>Advance Amount</div>
//                                           <div>
//                                             - ₹ {displayedAdvanceAmount} /-
//                                           </div>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           type="submit"
//                           onClick={handleSubmit}
//                           className="btn btn-success w-100 mt-2 main-booknow"
//                           style={{
//                             boxShadow: "none",
//                             color: "black",
//                             border: "none",
//                           }}
//                         >
//                           Proceed
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//         </Container>
//         <ToastContainer />
//       </div>
//     </React.Fragment>


//   )
// }

// export default Addons