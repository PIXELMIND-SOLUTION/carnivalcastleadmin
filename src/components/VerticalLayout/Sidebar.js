import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

import { Link } from "react-router-dom"

import logo from "../../assets/images/logos.png"

import newLogo from "./carnival_footer_logo-2-removebg-preview.png"

const Sidebar = props => {
  return (
    <React.Fragment>
     <div className="vertical-menu">
     <div className="navbar-brand-box"  style={{backgroundColor:"#272822"}}>
          <Link to="/dashboard" className="logo logo-dark">
            <span className="logo-sm">
              <img src={newLogo} alt=""  height="20px" />
            </span>
            <span className="logo-lg">
              <img src={newLogo} alt=""   height="68px" />
            </span>
          </Link>

          <Link to="/dashboard" className="logo logo-light">
            <span className="logo-sm">
              <img src={newLogo} alt=""    height="20px"/>
            </span>
            <span className="logo-lg">
              <img src={newLogo} alt=""    height="68px"/>
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))
