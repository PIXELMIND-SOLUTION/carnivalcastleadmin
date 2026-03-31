import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPassword from "pages/Authentication/ForgetPassword"
import Compareotp from "pages/Authentication/Compareotp"
import Resetpsw from "pages/Authentication/Resetpsw"
import StaffBookings from "pages/Staff/StaffBookings"

//Employee List
import Staff from "pages/Staff/Staff"
import AddRoles from "pages/Staff/AddRoles"
import EditRoles from "pages/Staff/EditRoles"
import Departments from "pages/Staff/Departments"
import RolesPremissions from "pages/Staff/RolesPremissions"

//Dashboard
import Dashboard from "../pages/Dashboard/index"

//About
import Aboutus from "pages/Home/Aboutus"
import HomeSlide from "pages/Home/HomeSlide"
// import HowToJoin from "pages/Home/HowToJoin"
import Latestinfo from "pages/Home/Latestinfo"
import Highlight from "pages/Home/Highlight"
import AboutFeatures from "pages/Settings/AboutFeatures"
import OffersSliders from "pages/Home/OffersSliders"

//Settings
import Faqs from "pages/Settings/Faqs"
import Terms from "pages/Settings/Terms"
import ContactUs from "pages/Home/ContactUs"
import PriceSettings from "pages/Settings/PriceSettings"
import PrivicyPolicy from "pages/Settings/PrivicyPolicy"
import RefundPolicy from "pages/Settings/RefundPolicy"
// import Leads from "pages/Settings/Leads"

//Testimonials
import Coupon from "pages/Settings/Coupon"
import RedeemAmount from "pages/Settings/RedeemAmount"
import Enquiry from "pages/Settings/Enquiry"
import Gallery from "pages/Settings/Gallery"
import Plans from "pages/Subscriptions/Plans"
import Testimonials from "pages/Settings/Testimonials"

//bookings
import Payments from "pages/Bookings/Payments"
import PendingBookings from "pages/Bookings/PendingBookings"
import Confirmedbookings from "pages/Bookings/Confirmedbookings"
import ViewBooking from "pages/Bookings/ViewBooking"
import CancelledBookings from "pages/Bookings/CancelledBookings"
import CompleatedBookings from "pages/Bookings/CompleatedBookings"

//Services
import Cakes from "pages/Services/Cakes"
import Slots from "pages/Services/Slots"
import AddOns from "pages/Services/AddOns"
import Service from "pages/Services/Service"
import Theater from "pages/Services/Theater"
import AddTheater from "pages/Services/AddTheater"
import EditTheater from "pages/Services/EditTheater"
import ViewTheater from "pages/Services/ViewTheater"
import AddAddress from "pages/Services/AddAddress"

//Pos
import FoodCategory from "pages/Pos/FoodCategory"
import FoodProduct from "pages/Pos/FoodProduct"
import Pos from "pages/Pos/Pos"
import Stock from "pages/Pos/Stock"
import GetAllOrders from "pages/Pos/GetAllOrders"
import ViewBookingPos from "pages/Pos/ViewBookingPos"

import AddBooking from "pages/Addbookings/AddBooking"
import EditBookings from "pages/Addbookings/EditBookings"
import ViewBookingSlots from "pages/Addbookings/ViewBookingSlots"

import CheckOut from "pages/Addbookings/CheckOut"

import Homemodel from "pages/Home/Homemodel"

// Basic 
// import BasicForm from "pages/Basic/BasicForm"
// import Occassions from "pages/Basic/Occassions"
// import CakesComponent from "pages/Basic/CakesComponent"
// import Addons from "pages/Basic/Addons"



//Basic Flow
import Theaters from "pages/Bookingflow/Theaters"
import Testcomponents from "pages/Bookingflow/Testcomponents"
import Basicplan from "pages/Bookingflow/Basicplan"
import Occations from "pages/Bookingflow/Occations"
import WebCakes from "pages/Bookingflow/Cakes"
import Addonsweb from "pages/Bookingflow/Addons"

import Webcheckout from "pages/Bookingflow/Bookingsummary"
import ThankYouPage from "pages/Bookingflow/Bookingsummary"
// import PaymentFail from "pages/Bookingflow/PaymentFail"

//Combo Flow
import ComboForm from "pages/ComboFlow/ComboForm"
import ComboOccassions from "pages/ComboFlow/ComboOccassions"
import ComboPlans from "pages/ComboFlow/ComboPlans"
import ComboCheckOut from "pages/ComboFlow/ComboCheckOut"
import Notifications from "pages/Bookings/Notifications"
import RewardPoints from "pages/Bookings/RewardsPoints"
import AddBlog from "pages/Services/Blog"
import AddBanner from "pages/Services/Banner"
import UserReferrals from "pages/Bookings/UserReffrals"
import AdvancedFilter from "pages/Bookings/AdvancedFilter"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  { path: "/CheckOut", component: CheckOut },

  { path: "/Homemodel", component: Homemodel },

  //Home
  { path: "/HomeSlide", component: HomeSlide },
  // { path: "/HowToJoin", component: HowToJoin },
  { path: "/Latestinfo", component: Latestinfo },
  { path: "/Highlight", component: Highlight },
  { path: "/OffersSliders", component: OffersSliders },

  { path: "/AddBooking", component: AddBooking },
  { path: "/EditBookings", component: EditBookings },
  { path: "/ViewBookingSlots", component: ViewBookingSlots },
  { path: "/notifications", component: Notifications },

  //Aboutus
  { path: "/Aboutus", component: Aboutus },
  { path: "/ContactUs", component: ContactUs },
  { path: "/profile", component: UserProfile },

  //Pos
  { path: "/FoodCategory", component: FoodCategory },
  { path: "/FoodProduct", component: FoodProduct },
  { path: "/Pos", component: Pos },
  { path: "/Stock", component: Stock },
  { path: "/GetAllOrders", component: GetAllOrders },
  { path: "/ViewBookingPos", component: ViewBookingPos },

  //Plans
  { path: "/Plans", component: Plans },

  //Enquiry
  { path: "/Enquiry", component: Enquiry },

  //Bookings
  { path: "/Payments", component: Payments },
  { path: "/ViewBooking", component: ViewBooking },
  { path: "/PendingBookings", component: PendingBookings },
  { path: "/Confirmedbookings", component: Confirmedbookings },
    { path: "/advanced-filter", component: AdvancedFilter },
  { path: "/CancelledBookings", component: CancelledBookings },
  { path: "/CompleatedBookings", component: CompleatedBookings },
  { path: "/StaffBookings", component: StaffBookings },
    { path: "/rewards", component: RewardPoints },
    { path: "/referrals", component: UserReferrals },

  //Testimonials
  { path: "/Testimonials", component: Testimonials },
  { path: "/AboutFeatures", component: AboutFeatures },
  { path: "/Gallery", component: Gallery },

  //Testimonials
  { path: "/Coupon", component: Coupon },
  { path: "/redeem", component: RedeemAmount },

  //Service
  { path: "/Cakes", component: Cakes },
  { path: "/Slots", component: Slots },
  { path: "/AddOns", component: AddOns },
  { path: "/Service", component: Service },
  { path: "/Theater", component: Theater },
  { path: "/AddTheater", component: AddTheater },
  { path: "/AddAddress", component: AddAddress },
  { path: "/EditTheater", component: EditTheater },
  { path: "/ViewTheater", component: ViewTheater },
    { path: "/blog", component: AddBlog },
    { path: "/banner", component: AddBanner },


  //Staff
  { path: "/AddRoles", component: AddRoles },
  { path: "/EditRoles", component: EditRoles },
  { path: "/RolesPremissions", component: RolesPremissions },
  { path: "/Departments", component: Departments },
  { path: "/Staff", component: Staff },

  //settings
  { path: "/Faqs", component: Faqs },
  { path: "/PriceSettings", component: PriceSettings },
  { path: "/PrivicyPolicy", component: PrivicyPolicy },
  { path: "/RefundPolicy", component: RefundPolicy },
  { path: "/Terms", component: Terms },
  // { path: "/Leads", component: Leads },
  
  // Web flow booking
 
  { path: "/theaters", component: Theaters },
  { path: "/Testcomponents", component: Testcomponents },
  { path: "/basicplan", component: Basicplan },
  { path: "/occations", component: Occations },
  { path: "/bookingcake", component: WebCakes },
  { path: "/addonsthings", component: Addonsweb },
  { path: "/bookingsummary", component: Webcheckout },
  { path: "/payment-success", component: ThankYouPage },
  // { path: "/payment-fail", component: PaymentFail },
  { path: "/comboform", component: ComboForm },
  { path: "/combooccassions", component: ComboOccassions },
  { path: "/comboplans", component: ComboPlans },
  { path: "/combocheckout", component: ComboCheckOut },

  // this route should be at the end of all other routesside
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/ForgetPassword", component: ForgetPassword },

  { path: "/Compareotp", component: Compareotp },
  { path: "/Resetpsw", component: Resetpsw },
]

export { publicRoutes, authProtectedRoutes }
