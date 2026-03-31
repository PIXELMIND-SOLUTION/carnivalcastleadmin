import React, { useState, useEffect } from "react"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap"
import axios from "axios"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import { useHistory } from "react-router-dom"

const Roles = () => {
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [ras, setras] = useState([])

  const handleChange1s = e => {
    const myUser = { ...ras }
    myUser[e.target.name] = e.target.checked
    setras(myUser)
  }

  const [form, setform] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    Addrole()
  }

  const check = {
    Dashview: ras.Dashview,

    EmployeeManagmentView: ras.EmployeeManagmentView,

    departementView: ras.departementView,
    departementAdd: ras.departementAdd,
    departementeEdit: ras.departementeEdit,
    departementDelete: ras.departementDelete,

    rolesAndPermissionView: ras.rolesAndPermissionView,
    rolesAndPermissionAdd: ras.rolesAndPermissionAdd,
    rolesAndPermissionEdit: ras.rolesAndPermissionEdit,

    staffView: ras.staffView,
    staffAdd: ras.staffAdd,
    staffEdit: ras.staffEdit,
    staffDelete: ras.staffDelete,

    staffBookingView: ras.staffBookingView,

     // HomeSliders
     homeSlidersView: ras.homeSlidersView,
     homeSlidersAdd: ras.homeSlidersAdd,
     homeSlidersEdit: ras.homeSlidersEdit,
     homeSlidersDelete: ras.homeSlidersDelete,
 
     // About us
     aboutUs: ras.aboutUs,
 
     homePopUpView: ras.homePopUpView,
     homePopUpAdd: ras.homePopUpAdd,
     homePopUpEdit: ras.homePopUpEdit,
     homePopUpDelete: ras.homePopUpDelete,
 
     officeSlidersView: ras.officeSlidersView,
     officeSlidersAdd: ras.officeSlidersAdd,
     officeSlidersEdit: ras.officeSlidersEdit,
     officeSlidersDelete: ras.officeSlidersDelete,
 
     aboutusView: ras.aboutusView,
     aboutusEdit: ras.aboutusEdit,
 
     howJoinView: ras.howJoinView,
     howJoinEdit: ras.howJoinEdit,
     howJoinDelete: ras.howJoinDelete,
 
     latestView: ras.latestView,
     latestEdit: ras.latestEdit,
     latestDelete: ras.latestDelete,
 
     highlightView: ras.highlightView,
     highlightEdit: ras.highlightEdit,
     highlightDelete: ras.highlightDelete,
 
     aboutFeaturesView: ras.aboutFeaturesView,
     aboutFeaturesAdd: ras.aboutFeaturesAdd,
     aboutFeaturesEdit: ras.aboutFeaturesEdit,
     aboutFeaturesDelete: ras.aboutFeaturesDelete,
 
     // Service
 
     servicesView: ras.servicesView,
 
     theatreListView: ras.theatreListView,
     theatreListAdd: ras.theatreListAdd,
     theatreListEdit: ras.theatreListEdit,
     theatreListDelete: ras.theatreListDelete,
 
     theatreTimeView: ras.theatreTimeView,
     theatreTimeAdd: ras.theatreTimeAdd,
     theatreTimeEdit: ras.howJoinEdit,
     theatreTimeDelete: ras.howJoinDelete,
 
     occassionsAdd: ras.occassionsAdd,
     occassionsView: ras.occassionsView,
     occassionsEdit: ras.occassionsEdit,
     occassionsDelete: ras.occassionsDelete,
 
     addOnsAdd: ras.addOnsAdd,
     addOnsView: ras.addOnsView,
     addOnsEdit: ras.addOnsEdit,
     addOnsDelete: ras.addOnsDelete,
 
     productsAdd: ras.productsAdd,
     productsView: ras.productsView,
     productsEdit: ras.productsEdit,
     productsDelete: ras.productsDelete,
 
     plansView: ras.plansView,
     plansAdd: ras.plansAdd,
     plansEdit: ras.plansEdit,
     plansDelete: ras.plansDelete,
 
     // Bookings
     bookingsView: ras.bookingsView,
 
     // add bookings pending  ?????????????????
     addBookingAdd:ras.addBookingAdd,
     addBookingView:ras.addBookingView,
 
     pendingEdit: ras.pendingEdit,
     pendingView: ras.pendingView,
 
     completedBookingsEdit: ras.completedBookingsEdit,
     compeletedBookingsView: ras.compeletedBookingsView,
 
     cancelledBookingsEdit: ras.cancelledBookingsEdit,
     cancelledBookingsView: ras.cancelledBookingsView,
 
     addPosDelete: ras.addPosDelete,
     addPosView: ras.addPosView,
 
     posOrdersView: ras.posOrdersView,
 
     // POS
     POSView: ras.POSView,
 
     foodCategoryAdd: ras.foodCategoryAdd,
     foodCategoryView: ras.foodCategoryView,
     foodCategoryEdit: ras.foodCategoryEdit,
     foodCategoryDelete: ras.foodCategoryDelete,
 
     foodProductAdd: ras.foodProductAdd,
     foodProductView: ras.foodProductView,
     foodProductEdit: ras.foodProductEdit,
     foodProductDelete: ras.foodProductDelete,
 
     stockAdd: ras.stockAdd,
     stockView: ras.stockView,
     stockEdit: ras.stockEdit,
     stockDelete: ras.stockDelete,
 
     // Gallery
 
     galleryAdd: ras.galleryAdd,
     galleryView: ras.galleryView,
     galleryEdit: ras.galleryEdit,
     galleryDelete: ras.galleryDelete,
 
     // Coupons
 
     CouponsAdd: ras.CouponsAdd,
     CouponsView: ras.CouponsView,
     CouponsEdit: ras.CouponsEdit,
     CouponsDelete: ras.CouponsDelete,
 
     // testimonials
 
     testimonialsAdd: ras.testimonialsAdd,
     testimonialsView: ras.testimonialsView,
     testimonialsEdit: ras.testimonialsEdit,
     testimonialsDelete: ras.testimonialsDelete,
 
     // ENQUIRY
     enquiryAllView: ras.enquiryAllView,
     
     enquiryDelete: ras.enquiryDelete,
     enquiryView: ras.enquiryView,
 
     leadsDelete: ras.leadsDelete,
     leadsView: ras.leadsView,
    
        // SETTINGS

    SettingManagmentView: ras.SettingManagmentView,
    SettingsView: ras.SettingsView,
    SettingsEdit: ras.SettingsEdit,
  }

  const Addrole = () => {
    const token = datas

    const data = {
      roleName: form.roleName,
      rolesAndPermission: check,
    }
    axios
      .put(URLS.EditRole + "/" + form._id, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            history.push("/RolesPremissions")
            sessionStorage.setItem("tost", "Roles has been Added Successfully")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  function handleChange(e) {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const history = useHistory()

  useEffect(() => {
    GetOneActins()
  }, [])

  const Actinid = sessionStorage.getItem("Roleids")

  const GetOneActins = () => {
    const data = {
      _id: Actinid,
    }

    var token = datas
    axios
      .post(URLS.GetOneRole, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setform(res.data.data)
        setras(res.data.data.rolesAndPermission[0])
      })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container>
          <Breadcrumbs title="Narada Media Admin " breadcrumbItem="Edit Roles" />
          <Row>
            <Col>
              <Button
                onClick={() => history.goBack()}
                className="mb-3  m-1 "
                style={{ float: "right" }}
                color="primary"
              >
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white mt-2">
                  <CardTitle>Role & Permissions</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <Row>
                      <Col md={4}>
                        <Label for="basicpill-firstname-input1">
                          Role <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Role  Name"
                          required
                          value={form.roleName}
                          name="roleName"
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </Col>
                    </Row>
                    <h5 className="mt-4 mb-3">Dashboard:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Dashboard: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="Dashview"
                            defaultChecked={ras.Dashview}
                            value={ras.Dashview}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="read">
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <h5 className="mt-3 mb-3">Employee Managment:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Employee Managment View: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeManagmentView"
                            defaultChecked={ras.EmployeeManagmentView}
                            value={ras.EmployeeManagmentView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Department : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="departementView"
                            defaultChecked={ras.departementView}
                            value={ras.departementView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="departementAdd"
                            defaultChecked={ras.departementAdd}
                            value={ras.departementAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="departementeEdit"
                            defaultChecked={ras.departementeEdit}
                            value={ras.departementeEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="departementDelete"
                            defaultChecked={ras.departementDelete}
                            value={ras.departementDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Roles & Premissions : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="rolesAndPermissionView"
                            defaultChecked={ras.rolesAndPermissionView}
                            value={ras.rolesAndPermissionView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="rolesAndPermissionAdd"
                            defaultChecked={ras.rolesAndPermissionAdd}
                            value={ras.rolesAndPermissionAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="rolesAndPermissionEdit"
                            defaultChecked={ras.rolesAndPermissionEdit}
                            value={ras.rolesAndPermissionEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Staff : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="staffView"
                            defaultChecked={ras.staffView}
                            value={ras.staffView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="staffAdd"
                            defaultChecked={ras.staffAdd}
                            value={ras.staffAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="staffEdit"
                            defaultChecked={ras.staffEdit}
                            value={ras.staffEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="staffDelete"
                            defaultChecked={ras.staffDelete}
                            value={ras.staffDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Staff Bookings : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="staffBookingView"
                            defaultChecked={ras.staffBookingView}
                            value={ras.staffBookingView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      </Row>

                    <h5 className="mt-3 mb-3">Home Sliders:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Home Sliders : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homeSlidersView"
                            defaultChecked={ras.homeSlidersView}
                            value={ras.homeSlidersView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homeSlidersAdd"
                            defaultChecked={ras.homeSlidersAdd}
                            value={ras.homeSlidersAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homeSlidersEdit"
                            defaultChecked={ras.homeSlidersEdit}
                            value={ras.homeSlidersEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homeSlidersDelete"
                            defaultChecked={ras.homeSlidersDelete}
                            value={ras.homeSlidersDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">About us:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">About us View: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutUs"
                            defaultChecked={ras.aboutUs}
                            value={ras.aboutUs}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Home PopUp: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homePopUpView"
                            defaultChecked={ras.homePopUpView}
                            value={ras.homePopUpView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homePopUpAdd"
                            defaultChecked={ras.homePopUpAdd}
                            value={ras.homePopUpAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homePopUpEdit"
                            defaultChecked={ras.homePopUpEdit}
                            value={ras.homePopUpEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="homePopUpDelete"
                            defaultChecked={ras.homePopUpDelete}
                            value={ras.homePopUpDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Offer Sliders : </p>
                      </Col>
                      <Col md={1}></Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="officeSlidersView"
                            defaultChecked={ras.officeSlidersView}
                            value={ras.officeSlidersView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="officeSlidersAdd"
                            defaultChecked={ras.officeSlidersAdd}
                            value={ras.officeSlidersAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="officeSlidersEdit"
                            defaultChecked={ras.officeSlidersEdit}
                            value={ras.officeSlidersEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="officeSlidersDelete"
                            defaultChecked={ras.officeSlidersDelete}
                            value={ras.officeSlidersDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">About Us : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutusView"
                            defaultChecked={ras.aboutusView}
                            value={ras.aboutusView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutusEdit"
                            defaultChecked={ras.aboutusEdit}
                            value={ras.aboutusEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    {/* <Row className="mt-2">
                      <Col md={2}>
                        <p className="">How To Join : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="howJoinView"
                            defaultChecked={ras.howJoinView}
                            value={ras.howJoinView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="howJoinEdit"
                            defaultChecked={ras.howJoinEdit}
                            value={ras.howJoinEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="howJoinDelete"
                            defaultChecked={ras.howJoinDelete}
                            value={ras.howJoinDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row> */}

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Latest Info : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="latestView"
                            defaultChecked={ras.latestView}
                            value={ras.latestView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="latestEdit"
                            defaultChecked={ras.latestEdit}
                            value={ras.latestEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="latestDelete"
                            defaultChecked={ras.latestDelete}
                            value={ras.latestDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Highlights: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="highlightView"
                            defaultChecked={ras.highlightView}
                            value={ras.highlightView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="highlightEdit"
                            defaultChecked={ras.highlightEdit}
                            value={ras.highlightEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="highlightDelete"
                            defaultChecked={ras.highlightDelete}
                            value={ras.highlightDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">About Features: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutFeaturesView"
                            defaultChecked={ras.aboutFeaturesView}
                            value={ras.aboutFeaturesView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutFeaturesAdd"
                            defaultChecked={ras.aboutFeaturesAdd}
                            value={ras.aboutFeaturesAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutFeaturesEdit"
                            defaultChecked={ras.aboutFeaturesEdit}
                            value={ras.aboutFeaturesEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="aboutFeaturesDelete"
                            defaultChecked={ras.aboutFeaturesDelete}
                            value={ras.aboutFeaturesDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Service:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Service View: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="servicesView"
                            defaultChecked={ras.servicesView}
                            value={ras.servicesView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Theater List: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreListView"
                            defaultChecked={ras.theatreListView}
                            value={ras.theatreListView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreListAdd"
                            defaultChecked={ras.theatreListAdd}
                            value={ras.theatreListAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreListEdit"
                            defaultChecked={ras.theatreListEdit}
                            value={ras.theatreListEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreListDelete"
                            defaultChecked={ras.theatreListDelete}
                            value={ras.theatreListDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Theatre Time Slots : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreTimeView"
                            defaultChecked={ras.theatreTimeView}
                            value={ras.theatreTimeView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreTimeAdd"
                            defaultChecked={ras.theatreTimeAdd}
                            value={ras.theatreTimeAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreTimeEdit"
                            defaultChecked={ras.theatreTimeEdit}
                            value={ras.theatreTimeEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="theatreTimeDelete"
                            defaultChecked={ras.theatreTimeDelete}
                            value={ras.theatreTimeDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Occasions: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="occassionsView"
                            defaultChecked={ras.occassionsView}
                            value={ras.occassionsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="occassionsAdd"
                            defaultChecked={ras.occassionsAdd}
                            value={ras.occassionsAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="occassionsEdit"
                            defaultChecked={ras.occassionsEdit}
                            value={ras.occassionsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="occassionsDelete"
                            defaultChecked={ras.occassionsDelete}
                            value={ras.occassionsDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Addons: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addOnsView"
                            defaultChecked={ras.addOnsView}
                            value={ras.addOnsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addOnsAdd"
                            defaultChecked={ras.addOnsAdd}
                            value={ras.addOnsAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addOnsEdit"
                            defaultChecked={ras.addOnsEdit}
                            value={ras.addOnsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addOnsDelete"
                            defaultChecked={ras.addOnsDelete}
                            value={ras.addOnsDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Products: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="productsView"
                            defaultChecked={ras.productsView}
                            value={ras.productsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="productsAdd"
                            defaultChecked={ras.productsAdd}
                            value={ras.productsAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="productsEdit"
                            defaultChecked={ras.productsEdit}
                            value={ras.productsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="productsDelete"
                            defaultChecked={ras.productsDelete}
                            value={ras.productsDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Plans: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="plansView"
                            defaultChecked={ras.plansView}
                            value={ras.plansView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="plansAdd"
                            defaultChecked={ras.plansAdd}
                            value={ras.plansAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="plansEdit"
                            defaultChecked={ras.plansEdit}
                            value={ras.plansEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="plansDelete"
                            defaultChecked={ras.plansDelete}
                            value={ras.plansDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Bookings:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Bookings View: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="bookingsView"
                            defaultChecked={ras.bookingsView}
                            value={ras.bookingsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Add Bookings: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addBookingView"
                            defaultChecked={ras.addBookingView}
                            value={ras.addBookingView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addBookingAdd"
                            defaultChecked={ras.addBookingAdd}
                            value={ras.addBookingAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Pending Bookings : </p>
                      </Col>
                      <Col md={1}></Col>
                    
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="pendingView"
                            defaultChecked={ras.pendingView}
                            value={ras.pendingView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="pendingEdit"
                            defaultChecked={ras.pendingEdit}
                            value={ras.pendingEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Completed Bookings : </p>
                      </Col>
                      <Col md={1}></Col>
                     
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="compeletedBookingsView"
                            defaultChecked={ras.compeletedBookingsView}
                            value={ras.compeletedBookingsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="completedBookingsEdit"
                            defaultChecked={ras.completedBookingsEdit}
                            value={ras.completedBookingsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Cancelled Bookings : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="cancelledBookingsView"
                            defaultChecked={ras.cancelledBookingsView}
                            value={ras.cancelledBookingsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="cancelledBookingsEdit"
                            defaultChecked={ras.cancelledBookingsEdit}
                            value={ras.cancelledBookingsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Add POS : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addPosView"
                            defaultChecked={ras.addPosView}
                            value={ras.addPosView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="addPosDelete"
                            defaultChecked={ras.addPosDelete}
                            value={ras.addPosDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">POS Orders: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="posOrdersView"
                            defaultChecked={ras.posOrdersView}
                            value={ras.posOrdersView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">POS :</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">POS View: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="POSView"
                            defaultChecked={ras.POSView}
                            value={ras.POSView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Food Category: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodCategoryView"
                            defaultChecked={ras.foodCategoryView}
                            value={ras.foodCategoryView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodCategoryAdd"
                            defaultChecked={ras.foodCategoryAdd}
                            value={ras.foodCategoryAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodCategoryEdit"
                            defaultChecked={ras.foodCategoryEdit}
                            value={ras.foodCategoryEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodCategoryDelete"
                            defaultChecked={ras.foodCategoryDelete}
                            value={ras.foodCategoryDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Food Product: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodProductView"
                            defaultChecked={ras.foodProductView}
                            value={ras.foodProductView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodProductAdd"
                            defaultChecked={ras.foodProductAdd}
                            value={ras.foodProductAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodProductEdit"
                            defaultChecked={ras.foodProductEdit}
                            value={ras.foodProductEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="foodProductDelete"
                            defaultChecked={ras.foodProductDelete}
                            value={ras.foodProductDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Stock: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="stockView"
                            defaultChecked={ras.stockView}
                            value={ras.stockView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="stockAdd"
                            defaultChecked={ras.stockAdd}
                            value={ras.stockAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="stockEdit"
                            defaultChecked={ras.stockEdit}
                            value={ras.stockEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="stockDelete"
                            defaultChecked={ras.stockDelete}
                            value={ras.stockDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Gallery:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Gallery : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="galleryView"
                            defaultChecked={ras.galleryView}
                            value={ras.galleryView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="galleryAdd"
                            defaultChecked={ras.galleryAdd}
                            value={ras.galleryAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="galleryEdit"
                            defaultChecked={ras.galleryEdit}
                            value={ras.galleryEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="galleryDelete"
                            defaultChecked={ras.galleryDelete}
                            value={ras.galleryDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Coupons:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Coupons : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CouponsView"
                            defaultChecked={ras.CouponsView}
                            value={ras.CouponsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CouponsAdd"
                            defaultChecked={ras.CouponsAdd}
                            value={ras.CouponsAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CouponsEdit"
                            defaultChecked={ras.CouponsEdit}
                            value={ras.CouponsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CouponsDelete"
                            defaultChecked={ras.CouponsDelete}
                            value={ras.CouponsDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Testimonials:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Testimonials : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="testimonialsView"
                            defaultChecked={ras.testimonialsView}
                            value={ras.testimonialsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="testimonialsAdd"
                            defaultChecked={ras.testimonialsAdd}
                            value={ras.testimonialsAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="testimonialsEdit"
                            defaultChecked={ras.testimonialsEdit}
                            value={ras.testimonialsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="testimonialsDelete"
                            defaultChecked={ras.testimonialsDelete}
                            value={ras.testimonialsDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Enquiry:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Enquiry View: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="enquiryAllView"
                            defaultChecked={ras.enquiryAllView}
                            value={ras.enquiryAllView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Enquiry: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="enquiryView"
                            defaultChecked={ras.enquiryView}
                            value={ras.enquiryView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="enquiryDelete"
                            defaultChecked={ras.enquiryDelete}
                            value={ras.enquiryDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Leads: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="leadsView"
                            defaultChecked={ras.leadsView}
                            value={ras.leadsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>{" "}
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="leadsDelete"
                            defaultChecked={ras.leadsDelete}
                            value={ras.leadsDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Settings Module View:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Settings: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SettingManagmentView"
                            defaultChecked={ras.SettingManagmentView}
                            value={ras.SettingManagmentView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">
                          Faqs, Contact Us, Terms & Conditions, Privacy Policy,
                          Refund Policy
                        </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SettingsView"
                            defaultChecked={ras.SettingsView}
                            value={ras.SettingsView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="laneview">
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SettingsEdit"
                            defaultChecked={ras.SettingsEdit}
                            value={ras.SettingsEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3" style={{ float: "right" }}>
                      <button
                        type="submit"
                        style={{ width: "120px" }}
                        className="btn btn-primary m-1"
                      >
                        Submit
                        <i
                          className="fa fa-check-circle-o"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Roles
