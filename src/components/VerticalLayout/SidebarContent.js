import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"
// //Import Scrollbar
import SimpleBar from "simplebar-react"
// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"
//i18n
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  const ref = useRef()
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];
  // console.log(Roles)

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            {Roles?.Dashview === true || Roles?.accessAll === true ? (
               <>
            <li>
              <Link to="/dashboard">
                <i className="fas fa-home"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            </>
            ):""}

        {Roles?.EmployeeManagmentView === true || Roles?.accessAll === true ? (
               <>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-wallet-alt"></i>
                <span>{props.t("Staff Managment")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.departementView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Departments">{props.t("Departments")}</Link>
                </li>) :""}
                {Roles?.rolesAndPermissionView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/RolesPremissions">
                    {props.t("Roles & Premissions")}
                  </Link>
                </li>) :""}
                {Roles?.staffView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Staff">{props.t("Staff")}</Link>
                </li>) :""}
                {Roles?.rolesAndPermissionView === true || Roles?.accessAll === true ? ( <li>
                  <Link to="/StaffBookings">{props.t("Staff Bookings")}</Link>
                </li>) :""}
              </ul>
            </li>
            </>) :""}
            {Roles?.homeSlidersView === true || Roles?.accessAll === true ? (
            <li>
              <Link to="/banner">
                <i className="bx bxs-carousel"></i>
                <span>{props.t("Home Sliders")}</span>
              </Link>
            </li>) :""}
            {Roles?.aboutUs === true || Roles?.accessAll === true ? (
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-help-circle"></i>
                <span>{props.t("About Us")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.homePopUpView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Homemodel">{props.t("Home Popup")}</Link>
                </li>) :""}
                {Roles?.officeSlidersView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/OffersSliders">{props.t("Offer Sliders")}</Link>
                </li>) :""}
                {Roles?.aboutusView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Aboutus">{props.t("About Us")}</Link>
                </li>) :""}
                {/* {Roles?.howJoinView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/HowToJoin">{props.t("How To Join")}</Link>
                </li>
                ) :""} */}
                 {Roles?.latestView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Latestinfo">{props.t("Latest Info")}</Link>
                </li>) :""}
                {Roles?.highlightView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Highlight">{props.t("Highlights")}</Link>
                </li>) :""}
                {Roles?.aboutFeaturesView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/AboutFeatures">{props.t("About Features")}</Link>
                </li>) :""}
              </ul>
            </li>) :""}
            {Roles?.servicesView === true || Roles?.accessAll === true ? (
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-book"></i>
                <span>{props.t("Service")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.theatreListView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/AddAddress">{props.t("Add Address")}</Link>
                </li>) :""}
                 {Roles?.addressview === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Theater">{props.t("Theater List")}</Link>
                </li>) :""}
                {Roles?.theatreTimeView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Slots">{props.t("Theater Time Slots")}</Link>
                </li>) :""}
                {Roles?.occassionsView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Service">{props.t("Occasions")}</Link>
                </li>) :""}
                {Roles?.addOnsView === true || Roles?.accessAll === true ? (
                <li>
                </li>) :""}
                 {Roles?.addOnsView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/blog">{props.t("Blog")}</Link>
                </li>) :""}
                  {/* {Roles?.addOnsView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/banner">{props.t("Banner")}</Link>
                </li>) :""} */}
                {Roles?.productsView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Cakes">{props.t("Products")}</Link>
                </li>) :""}
                {Roles?.plansView === true || Roles?.accessAll === true ? (
                <li>
                  
                  <Link to="/Plans">{props.t("Plans")}</Link>
                </li>) :""}
              </ul>
            </li>) :""}

            {Roles?.bookingsView === true || Roles?.accessAll === true ? (
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-alarm"></i>
                <span>{props.t("Bookings")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.addBookingView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/theaters">{props.t("Add Booking")}</Link>
                  {/* <Link to="/AddBooking">{props.t("Add Booking")}</Link> */}
                  </li>) :""}
                  {Roles?.pendingView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/PendingBookings">
                    {props.t("Pending Bookings")}
                  </Link>
                  </li>) :""}
                  {Roles?.pendingView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Confirmedbookings">
                    {props.t("Confirmed Bookings")}
                  </Link>
                  </li>) :""}

                  {Roles?.compeletedBookingsView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/CompleatedBookings">
                    {props.t("Completed Bookings")}
                  </Link>
                  </li>) :""}
                  {Roles?.cancelledBookingsView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/CancelledBookings">
                    {props.t("Cancelled Bookings")}
                  </Link>
                  </li>) :""}
                  {/* {Roles?.paymentsView === true || Roles?.accessAll === true ? ( */}
                <li>
                  <Link to="/Payments">{props.t("Payments")}</Link>
                  </li>
                   <li>
                  <Link to="/notifications">{props.t("Notifications")}</Link>
                  </li>

                    <li>
                  <Link to="/rewards">{props.t("Rewards")}</Link>
                  </li>
                    <li>
                  <Link to="/referrals">{props.t("Referral")}</Link>
                  </li>
                {/* ) :""} */}
                {Roles?.addPosView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/Pos">{props.t("Add Pos")}</Link>
                  </li>) :""}
                  {Roles?.posOrdersView === true || Roles?.accessAll === true ? (
                <li>
                  <Link to="/GetAllOrders">{props.t("Pos Orders")}</Link>
                  </li>) :""}
              </ul>
              </li>) :""}

              {Roles?.POSView === true || Roles?.accessAll === true ? (
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t("POS")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.foodCategoryView === true || Roles?.accessAll === true ? (
                <li>
                  </li>) :""}
                  {Roles?.foodProductView === true || Roles?.accessAll === true ? ( 
                <li>
                  <Link to="/FoodProduct">{props.t("Food Product")}</Link>
                  </li>) :""}
                  {Roles?.stockView === true || Roles?.accessAll === true ? ( 
                <li>
                  <Link to="/Stock">{props.t("Stock")}</Link>
                  </li>) :""}
              </ul>
              </li>) :""}
              {Roles?.galleryView === true || Roles?.accessAll === true ? ( 
            <li>
              <Link to="/Gallery">
                <i className="bx bxs-image"></i>
                <span>{props.t("Gallery")}</span>
              </Link>
              </li>) :""}

              {Roles?.CouponsView === true || Roles?.accessAll === true ? ( 
            <li>
              <Link to="/Coupon">
                <i className="bx bxs-coupon"></i>
                <span>{props.t("Coupons")}</span>
              </Link>
              </li>) :""}

               {/* {Roles?.CouponsView === true || Roles?.accessAll === true ? ( 
            <li>
              <Link to="/redeem">
                <i className="bx bxs-coupon"></i>
                <span>{props.t("Redeem Amount")}</span>
              </Link>
              </li>) :""} */}

              {Roles?.testimonialsView === true || Roles?.accessAll === true ? ( 
            <li>
              <Link to="/Testimonials">
                <i className="bx bxs-quote-right"></i>
                <span>{props.t("Testimonials")}</span>
              </Link>
              </li>) :""}

              {Roles?.enquiryAllView === true || Roles?.accessAll === true ? ( 
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-phone-incoming"></i>
                <span>{props.t("Enquiry")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.enquiryView === true || Roles?.accessAll === true ? ( 
                <li>
                  <Link to="/Enquiry">{props.t("Enquiry")}</Link>
                  </li>) :""}
                  {/* {Roles?.leadsView === true || Roles?.accessAll === true ? ( 
                <li>
                  <Link to="/Leads">{props.t("Leads")}</Link>
                  </li>) :""} */}
              </ul>
              </li>) :""}

              {Roles?.SettingManagmentView === true || Roles?.accessAll === true ? ( 
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bxs-widget"></i>
                <span>{props.t("Settings")}</span>
              </Link>
              <ul className="sub-menu">
              {Roles?.SettingsView === true ||
                    Roles?.accessAll === true ? (
                <li>
                  <Link to="/Faqs">{props.t("Faqs")}</Link>
                  </li>) :""}
                  {Roles?.SettingsView === true ||
                    Roles?.accessAll === true ? (
                <li>
                  <Link to="/PriceSettings">{props.t("Price Settings")}</Link>
                  </li>) :""}
                  {Roles?.SettingsView === true ||
                    Roles?.accessAll === true ? (
                <li>
                  <Link to="/ContactUs">{props.t("Contact Us")}</Link>
                  </li>) :""}
                  {Roles?.SettingsView === true ||
                    Roles?.accessAll === true ? (
                <li>
                  <Link to="/PrivicyPolicy">{props.t("Privicy Policy")}</Link>
                  </li>) :""}
                  {Roles?.SettingsView === true ||
                    Roles?.accessAll === true ? (
                <li>
                  <Link to="/RefundPolicy">{props.t("Refund Policy")}</Link>
                  </li>) :""}
                  {Roles?.SettingsView === true ||
                    Roles?.accessAll === true ? (
                <li>
                  <Link to="/Terms">{props.t("Terms & Conditions")}</Link>
                  </li>) :""}
              </ul>
            </li>
               ) : (
                ""
              )}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
