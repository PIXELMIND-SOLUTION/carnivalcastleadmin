import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import logo from "../../assets/images/logos.png"
import logoLightSvg from "../../assets/images/logos.png"
import { withTranslation } from "react-i18next"
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"

import axios from "axios"
import { URLS } from "../../Url"

const Header = () => {
  function tToggle() {
    var body = document.body
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable")
    } else {
      body.classList.toggle("vertical-collpsed")
      body.classList.toggle("sidebar-enable")
    }
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [form, setform] = useState([])

  useEffect(() => {
    GetSettings()
  }, [])

  const GetSettings = () => {
    var token = datas

    axios
      .post(
        URLS.GetDashboard,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setform(res.data)
      })
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header" style={{backgroundColor:"#272822"}}>
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
          </div>

          <div className="d-flex">
            <div
              className="dropdown d-none d-lg-inline-block ms-1"
              style={{ paddingTop: "23px" }}
            >
              <Link to="/PendingBookings" className="blink2">
                {" "}
                Pending Bookings : {form.pendingBookingCount}
              </Link>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
