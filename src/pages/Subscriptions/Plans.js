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
  Table,
  Modal,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import axios from "axios"
import { URLS } from "../../Url"
import Select from "react-select"

const Plans = () => {
  const [form, setform] = useState({
    name: "",
    price: "",
    theatreId: "",
    occasionId: "",
    offerPrice: "",
    oneandhalfslotPrice: "",
    noOfPersons: "",
    extraPersonPrice: "",
    theatrePriceIncluded: "",
  })
  const [Plans, setPlans] = useState([])
  const [form1, setform1] = useState([])
  const [Files, setFiles] = useState("")
  const [Files1, setFiles1] = useState("")
  const [show, setshow] = useState(false)
  const [Products, setProducts] = useState([])
  const [Occasion, setOccasion] = useState([])
  const [inputList, setInputList] = useState([""])
  const [inputList1, setInputList1] = useState([])
  const [modal_small, setmodal_small] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOptions1, setSelectedOptions1] = useState([])

  const handleInputChange = (e, index) => {
    const { value } = e.target
    const list = [...inputList]
    list[index] = value
    setInputList(list)
  }

  const handleRemoveClick = index => {
    const list = [...inputList]
    list.splice(index, 1)
    setInputList(list)
  }

  const handleAddClick = () => {
    setInputList([...inputList, ""])
  }

  const handleInputChange1 = (e, index) => {
    const { value } = e.target
    const list = [...inputList1]
    list[index] = value
    setInputList1(list)
  }

  const handleRemoveClick1 = index => {
    const list = [...inputList1]
    list.splice(index, 1)
    setInputList1(list)
  }

  const handleAddClick1 = () => {
    setInputList1([...inputList1, ""])
  }

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("File format not supported. Please choose JPG, JPEG, or PNG.")
    }
  }

  const changeHandler1 = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles1(e.target.files)
    } else {
      e.target.value = null
      toast("File format not supported. Please choose JPG, JPEG, or PNG.")
    }
  }

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }
  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  useEffect(() => {
    GetAllPlans()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = Plans.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Plans.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const handleSubmit = e => {
    e.preventDefault()
    AddPlans()
  }

  const AddPlans = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("name", form.name)
    dataArray.append("price", form.price)
    dataArray.append("theatreId", form.theatreId)
    dataArray.append("occasionId", form.occasionId)
    dataArray.append("offerPrice", form.offerPrice)
    dataArray.append("oneandhalfslotPrice", form.oneandhalfslotPrice)
    dataArray.append("noOfPersons", form.noOfPersons)
    dataArray.append("extraPersonPrice", form.extraPersonPrice)
    dataArray.append("theatrePriceIncluded", form.theatrePriceIncluded)
    dataArray.append("benefits", JSON.stringify(inputList))
    dataArray.append("productIds", JSON.stringify(selectedOptions))

    for (let i = 0; i < Files.length; i++) {
      dataArray.append("image", Files[i])
    }

    axios
      .post(URLS.AddPlans, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllPlans()
            clearForm()
            setshow(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const EditPlans = () => {
    var token = datas
    var formid = form1._id
    const dataArray = new FormData()
    dataArray.append("name", form1.name)
    dataArray.append("price", form1.price)
    dataArray.append("theatreId", form1.theatreId)
    dataArray.append("occasionId", form1.occasionId)
    dataArray.append("offerPrice", form1.offerPrice)
    dataArray.append("oneandhalfslotPrice", form1.oneandhalfslotPrice)
    dataArray.append("noOfPersons", form1.noOfPersons)
    dataArray.append("extraPersonPrice", form1.extraPersonPrice)
    dataArray.append("theatrePriceIncluded", form1.theatrePriceIncluded)
    dataArray.append("benefits", JSON.stringify(inputList1))
    dataArray.append("productIds", JSON.stringify(selectedOptions1))

    for (let i = 0; i < Files1.length; i++) {
      dataArray.append("image", Files1[i])
    }
    axios
      .put(URLS.UpdatePlans + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllPlans()
            setmodal_small(false)
            clearForm1()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const DeletePlans = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeletePlans + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllPlans()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      DeletePlans(data)
    }
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    EditPlans()
  }

  const GetAllPlans = () => {
    var token = datas
    axios
      .post(
        URLS.GetPlans,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setPlans(res.data.plans)
      })
  }

  const clearForm1 = () => {
    setFiles1({
      image: "",
    })
  }

  const clearForm = () => {
    setform({
      name: "",
      price: "",
      theatreId: "",
      occasionId: "",
      offerPrice: "",
      oneandhalfslotPrice: "",
      noOfPersons: "",
      extraPersonPrice: "",
      theatrePriceIncluded: "",
    })
    setSelectedOptions("")
    setInputList([""])
    setFiles({
      image: "",
    })
  }

  const getpopup = data => {
    setform1(data)
    setInputList1(data.benefits)
    setSelectedOptions1(data.productIds)
    setmodal_small(true)
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GetPlansSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setPlans(res.data.plans)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const [ins, setins] = useState(false)
  const [Instructions, setInstructions] = useState([])

  const [product, setproduct] = useState([])
  const [pro, setpro] = useState(false)

  function inst() {
    setins(!ins)
  }

  function proc() {
    setpro(!pro)
  }

  const getpoc = data => {
    setproduct(data.productIds)
    proc()
  }

  const getinc = data => {
    setInstructions(data.benefits)
    inst()
  }

  const [Theater, setTheater] = useState([])

  const GetTheaters = () => {
    var token = datas

    axios
      .post(
        URLS.GetTheater,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setTheater(res.data.theatres)
      })
  }

  useEffect(() => {
    GetProduct()
    GetTheaters()
    GetAllOccasion()
  }, [])

  const GetProduct = () => {
    var token = datas

    axios
      .post(
        URLS.GetProducts,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setProducts(res.data.products)
      })
  }

  const multis = selectedOptions => {
    setSelectedOptions(selectedOptions)
  }

  const multis1 = selectedOptions1 => {
    setSelectedOptions1(selectedOptions1)
  }

  const options = Products.map(response => ({
    value: response._id,
    label: response.name,
  }))

  const GetAllOccasion = () => {
    var token = datas
    axios
      .post(
        URLS.GetService,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setOccasion(res.data.occasions)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Plans" />
          <Row>
            {show == true ? (
              <Col md={12}>
                <Card>
                  <CardHeader className="bg-white">
                    <CardTitle>Add Plan</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        handleSubmit(e)
                      }}
                    >
                      <Row>
                        <Col md="4">
                          <div className="mb-3">
                            <Label> Theater</Label>
                            <span className="text-danger">*</span>
                            <select
                              value={form.theatreId}
                              name="theatreId"
                              required
                              onChange={e => {
                                handleChange(e)
                              }}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {Theater.map((data, key) => {
                                return (
                                  <option key={key} value={data._id}>
                                    {data.name}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label> Occasion</Label>
                            <span className="text-danger">*</span>
                            <select
                              value={form.occasionId}
                              name="occasionId"
                              required
                              onChange={e => {
                                handleChange(e)
                              }}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {Occasion.map((data, key) => {
                                return (
                                  <option key={key} value={data._id}>
                                    {data.name}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                        </Col>
                        {/* <Col md="4">
                          <div className="mb-3 ">
                            <Label for="basicpill-firstname-input1">
                              Product Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              options={options}
                              placeholder="Enter Product Name"
                              value={selectedOptions}
                              onChange={multis}
                              isSearchable={true}
                              isMulti
                            />
                          </div>{" "}
                        </Col> */}
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Product Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              options={[
                                { label: "Select All", value: "selectAll" },
                                ...options,
                              ]}
                              placeholder="Enter Product Name"
                              value={selectedOptions}
                              onChange={selectedOption => {
                                if (
                                  selectedOption.find(
                                    opt => opt.value === "selectAll"
                                  )
                                ) {
                                  multis(options)
                                } else {
                                  multis(selectedOption)
                                }
                              }}
                              isSearchable={true}
                              isMulti
                            />
                          </div>
                        </Col>

                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Plan Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              placeholder="Enter Name"
                              required
                              name="name"
                              value={form.name}
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Plan Price <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              placeholder="Enter Plan Price "
                              required
                              name="price"
                              value={form.price}
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Offer Price <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              placeholder="Enter  Offer Price "
                              required
                              name="offerPrice"
                              value={form.offerPrice}
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </Col>

                        {/* 1.5 HOURS show */}
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              One and Half Hour Slot Price <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              placeholder="Enter  One and Half Hour Slot Price "
                              required
                              name="oneandhalfslotPrice"
                              value={form.oneandhalfslotPrice}
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              No of Persons <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              placeholder="Enter No of Persons "
                              required
                              name="noOfPersons"
                              value={form.noOfPersons}
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Extra Person Price <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              placeholder="Enter Extra Person Price "
                              required
                              name="extraPersonPrice"
                              value={form.extraPersonPrice}
                              onChange={e => {
                                handleChange(e)
                              }}
                            />
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label for="basicpill-firstname-input1">
                              Image <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="file"
                              className="form-control"
                              id="basicpill-firstname-input1"
                              required
                              name="image"
                              value={Files.image}
                              onChange={changeHandler}
                            />
                          </div>
                        </Col>
                        <Col md="4">
                          <div className="mb-3">
                            <Label> Theater Price Included</Label>
                            <span className="text-danger">*</span>
                            <select
                              value={form.theatrePriceIncluded}
                              name="theatrePriceIncluded"
                              required
                              onChange={e => {
                                handleChange(e)
                              }}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </Col>
                        <div>
                          <Label>Benfits</Label>
                          <Row>
                            {inputList.map((x, i) => {
                              return (
                                <>
                                  <Row>
                                    <div key={i} className="box row">
                                      <Col md="4" sm="12" className="mb-3">
                                        <Input
                                          type="text"
                                          required
                                          name="benefits"
                                          placeholder="Enter Benfits"
                                          value={x}
                                          onChange={e =>
                                            handleInputChange(e, i)
                                          }
                                        />
                                      </Col>
                                      <Col sm="2" md="3">
                                        <div className="btn-box">
                                          {inputList.length !== 1 && (
                                            <button
                                              className="mr10 btn btn-outline-danger btn-sm m-1"
                                              type="button"
                                              onClick={() =>
                                                handleRemoveClick(i)
                                              }
                                            >
                                              Remove
                                              <i className="bx bx-x-circle"></i>
                                            </button>
                                          )}
                                          {inputList.length - 1 === i && (
                                            <button
                                              className="btn btn-sm btn-outline-info m-1"
                                              onClick={handleAddClick}
                                            >
                                              Add
                                              <i className="bx bx-plus-circle"></i>
                                            </button>
                                          )}
                                        </div>
                                      </Col>
                                    </div>
                                  </Row>
                                </>
                              )
                            })}
                          </Row>
                        </div>
                      </Row>
                      <Row>
                        <Col md="12">
                          <div style={{ float: "right" }}>
                            <Button color="primary" type="submit">
                              Submit <i className="fas fa-check-circle"></i>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            ) : (
              ""
            )}
          </Row>
          {modal_small == true ? (
            <Card>
              <CardHeader className="bg-white">
                <CardTitle>Edit Plan</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Form
                    onSubmit={e => {
                      handleSubmit1(e)
                    }}
                  >
                    <Row>
                      <Col md="4">
                        <div className="mb-3">
                          <Label> Theater</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form1.theatreId}
                            name="theatreId"
                            required
                            onChange={e => {
                              handleChange1(e)
                            }}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {Theater.map((data, key) => {
                              return (
                                <option key={key} value={data._id}>
                                  {data.name}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label> Occasion</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form1.occasionId}
                            name="occasionId"
                            required
                            onChange={e => {
                              handleChange1(e)
                            }}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {Occasion.map((data, key) => {
                              return (
                                <option key={key} value={data._id}>
                                  {data.name}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </Col>
                      {/* <Col md="4">
                        <div className="mb-3 ">
                          <Label for="basicpill-firstname-input1">
                            Product Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            options={options}
                            placeholder="Enter Product Name"
                            value={selectedOptions1}
                            onChange={multis1}
                            isSearchable={true}
                            isMulti
                          />
                        </div>{" "}
                      </Col> */}
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Product Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            options={[
                              { label: "Select All", value: "selectAll" },
                              ...options,
                            ]}
                            placeholder="Enter Product Name"
                            value={selectedOptions1}
                            onChange={selectedOption => {
                              if (
                                selectedOption.some(
                                  opt => opt.value === "selectAll"
                                )
                              ) {
                                multis1(options)
                              } else {
                                multis1(selectedOption)
                              }
                            }}
                            isSearchable={true}
                            isMulti
                          />
                        </div>
                      </Col>

                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Plan Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Name"
                            required
                            name="name"
                            value={form1.name}
                            onChange={e => {
                              handleChange1(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                           Plan Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Plan Price "
                            required
                            name="price"
                            value={form1.price}
                            onChange={e => {
                              handleChange1(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Offer Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter  Offer Price "
                            required
                            name="offerPrice"
                            value={form1.offerPrice}
                            onChange={e => {
                              handleChange1(e)
                            }}
                          />
                        </div>
                      </Col>

                      {/* 1.5 hours SHOW */}
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            One and Half Hour Slot Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter One and Half Hour Slot Price "
                            required
                            name="oneandhalfslotPrice"
                            value={form1.oneandhalfslotPrice}
                            onChange={e => {
                              handleChange1(e)
                            }}
                          />
                        </div>
                      </Col>

                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            No of Persons <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter No of Persons "
                            required
                            name="noOfPersons"
                            value={form1.noOfPersons}
                            onChange={e => {
                              handleChange1(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Extra Person Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Extra Person Price "
                            required
                            name="extraPersonPrice"
                            value={form1.extraPersonPrice}
                            onChange={e => {
                              handleChange1(e)
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">Image</Label>
                          <Input
                            type="file"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            name="image"
                            value={Files1.image}
                            onChange={changeHandler1}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label>Theater Price Included</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form1.theatrePriceIncluded}
                            name="theatrePriceIncluded"
                            required
                            onChange={e => {
                              handleChange1(e)
                            }}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </Col>
                      <div>
                        <Label>Benfits</Label>
                        <Row>
                          {inputList1.map((x, i) => {
                            return (
                              <>
                                <Row>
                                  <div key={i} className="box row">
                                    <Col md="6" sm="12" className="mb-3">
                                      <Input
                                        type="text"
                                        required
                                        name="benefits"
                                        placeholder="Enter Benfits"
                                        value={x}
                                        onChange={e => handleInputChange1(e, i)}
                                      />
                                    </Col>
                                    <Col sm="2" md="3">
                                      <div className="btn-box">
                                        {inputList1.length !== 1 && (
                                          <button
                                            className="mr10 btn btn-outline-danger btn-sm m-1"
                                            type="button"
                                            onClick={() =>
                                              handleRemoveClick1(i)
                                            }
                                          >
                                            Remove
                                            <i className="bx bx-x-circle"></i>
                                          </button>
                                        )}
                                        {inputList1.length - 1 === i && (
                                          <button
                                            className="btn btn-sm btn-outline-info m-1"
                                            onClick={handleAddClick1}
                                          >
                                            Add
                                            <i className="bx bx-plus-circle"></i>
                                          </button>
                                        )}
                                      </div>
                                    </Col>
                                  </div>
                                </Row>
                              </>
                            )
                          })}
                        </Row>
                      </div>
                    </Row>
                    <div style={{ float: "right" }}>
                      <Button color="primary" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Row>
              </CardBody>
            </Card>
          ) : (
            ""
          )}

          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <div>
                    <Row>
                      {Roles.plansAdd || Roles?.accessAll === true ? (
                        <>
                          <Col>
                            <Button
                              onClick={() => {
                                setshow(!show)
                              }}
                              color="primary"
                            >
                              Add Plan <i className="bx bx-user-plus"></i>
                            </Button>
                          </Col>
                        </>
                      ) : (
                        ""
                      )}
                      <Col>
                        <div style={{ float: "right" }}>
                          <Input
                            type="text"
                            className="form-control"
                            placeholder="Search.."
                            value={search.search}
                            onChange={searchAll}
                            name="search"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-4 mt-5">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Plan Name</th>
                            <th>Plan Price </th>
                            <th>Offer Price</th>
                            <th>One and Half Hour</th>
                            <th>No Of Persons</th>
                            <th>Extra Person Price</th>
                            <th>Theater</th>
                            <th>Occasions</th>
                            <th>Price Included</th>
                            <th>Products</th>
                            <th>Benfits </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th>{(pageNumber - 1) * 5 + key + 6}</th>
                              <td>
                                <img
                                  style={{ width: "60px" }}
                                  src={URLS.Base + data.image}
                                />
                              </td>
                              <td>{data.name}</td>
                              <td>{data.price}</td>
                              <td>{data.offerPrice}</td>
                              <td>{data.oneandhalfslotPrice}</td>
                              <td>{data.noOfPersons}</td>
                              <td>{data.extraPersonPrice}</td>
                              <td>{data.theatreName}</td>
                              <td>{data.occassionName}</td>
                              <td>{data.theatrePriceIncluded}</td>
                              <td style={{ width: "200px" }}>
                                {Roles.plansView ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      outline
                                      color="warning"
                                      className="btn-sm"
                                      onClick={() => {
                                        getpoc(data)
                                      }}
                                    >
                                      <div className="d-flex">
                                        <small>View</small>
                                      </div>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td style={{ width: "200px" }}>
                                {Roles.plansView ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      outline
                                      color="warning"
                                      className="btn-sm"
                                      onClick={() => {
                                        getinc(data)
                                      }}
                                    >
                                      <div className="d-flex">
                                        <small>View</small>
                                      </div>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>

                              <td style={{ width: "200px" }}>
                                {Roles.plansEdit ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        getpopup(data)
                                      }}
                                      className="m-1"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="success"
                                      outline
                                    >
                                      <div className="d-flex">
                                        <i className="bx bx-edit "></i>
                                      </div>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles.plansDelete ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        manageDelete(data)
                                      }}
                                      className="m-1"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="danger"
                                      outline
                                    >
                                      <div className="d-flex">
                                        <i className="bx bx-trash "></i>
                                      </div>
                                    </Button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div className="mt-3" style={{ float: "right" }}>
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"pagination"}
                          previousLinkClassName={"previousBttn"}
                          nextLinkClassName={"nextBttn"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                          total={lists.length}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal
          size="lg"
          isOpen={ins}
          toggle={() => {
            inst()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              View Benfits :-
            </h5>
            <button
              onClick={() => {
                setins(false)
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {Instructions.map((data, i) => (
              <>
                <p key={i} className="pt-2">
                  {data}
                </p>
                <hr></hr>
              </>
            ))}
          </div>
        </Modal>

        <Modal
          size="lg"
          isOpen={pro}
          toggle={() => {
            pro()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              View Products :-
            </h5>
            <button
              onClick={() => {
                setpro(false)
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {product.map((data, i) => (
              <>
                <p key={i} className="pt-2">
                  {data.label}
                </p>
                <hr></hr>
              </>
            ))}
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Plans
