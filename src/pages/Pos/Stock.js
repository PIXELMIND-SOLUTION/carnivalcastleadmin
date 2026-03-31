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
import { URLS } from "../../Url"
import Select from "react-select"
import axios from "axios"

const Stocks = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [show, setshow] = useState(false)
  const [prodects, setProducts] = useState([])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const getAllStoks = () => {
    var token = datas
    axios
      .post(
        URLS.GetStock,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setProducts(res.data.stock)
      })
  }

  const [productslist, setproductslist] = useState([])

  const getAllProducts = () => {
    var token = datas
    axios
      .post(
        URLS.GetFoodProducts,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setproductslist(res.data.foodproducts)
      })
  }
  useEffect(() => {
    getAllStoks()
    getAllProducts()
  }, [])

  const [selectedGroup1, setSelectedGroup1] = useState(null)
  const [selectedGroup2, setSelectedGroup2] = useState({})
  const [sellingData, setSellingData] = useState([])
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    amount: "",
    tax: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const handleChange12 = e => {
    const { value } = e.target
    setSelectedGroup2(prevSelectedGroup2 => ({
      ...prevSelectedGroup2,
      unitPrice: value,
    }))
  }

  useEffect(() => {
    if (selectedGroup1) {
      setSelectedGroup2(selectedGroup1.value)
    }
  }, [selectedGroup1])

  const handleSelectGroup1 = selectedGroup1 => {
    setSelectedGroup1(selectedGroup1)
  }

  const handleChanges = e => {
    const { value } = e.target
    setSelectedGroup2(prevSelectedGroup2 => ({
      ...prevSelectedGroup2,
      product: value,
    }))
  }

  const handleChanges123 = e => {
    const { name, value } = e.target
    setSellingData(prevSellingData => ({
      ...prevSellingData,
      [name]: value,
    }))
  }

  const options1 = productslist.map(data => ({
    value: data,
    label: data.name,
  }))

  var token = datas

  // Add fuction
  const addcategory = e => {
    e.preventDefault()
    const bodydata = {
      purchaseDate: form.purchaseDate || new Date().toISOString().split("T")[0],
      subCategoryId: selectedGroup2._id || "",
      quantity: parseFloat(selectedGroup2.product || 0),
      tax: parseFloat(selectedGroup2.tax || 0),
      price: parseFloat(sellingData.amount || 0),
      purchaseAmount: parseFloat(selectedGroup2.unitPrice) || 0,
      totalPrice:
        parseFloat(selectedGroup2.product) *
        (parseFloat(selectedGroup2.unitPrice) || 0).toFixed(2),
    }

    axios
      .post(URLS.AddStocks, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setForm([])
            getAllStoks()
            setSelectedGroup1([])
            setSelectedGroup2([])
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

  const [form1, setform1] = useState([])

  function tog_small() {
    setmodal_small(!modal_small)
  }

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const [totalpricedata, settotalpricedata] = useState("")

  const getpopup = data => {
    settotalpricedata(data.totalPrice)
    setform1(data)
    tog_small()
  }

  const handleChange121 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
    const totalprices =
      parseFloat(form1.purchaseAmount) * parseFloat(e.target.value)
    settotalpricedata(totalprices)
  }

  const handleChanges1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
    const totalprices =
      parseFloat(form1.quantity) * parseFloat(myUser.purchaseAmount)
    settotalpricedata(totalprices)
  }

  // Edit fuction
  const editCategory = e => {
    e.preventDefault()
    const bodydata = {
      purchaseDate: form1.purchaseDate,
      subCategoryId: form1.subCategoryId,
      quantity: parseFloat(form1.quantity),
      tax: parseFloat(form1.tax),
      purchaseAmount: parseFloat(form1.purchaseAmount).toFixed(2),
      price: parseFloat(form1.price).toFixed(2),
      totalPrice: parseFloat(totalpricedata).toFixed(2),
    }

    axios
      .put(URLS.UpdatStock + form1._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllStoks()
            setmodal_small(false)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  // Delete fuction
  const deleteCategory = async data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteStock + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            getAllStoks()
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
    const confirmBox = window.confirm("Do you want to Delete?")
    if (confirmBox === true) {
      deleteCategory(data)
    }
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GetStockSearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setProducts(res.data.stock)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Stock" />
          {show == true ? (
            <div>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Add Stock</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      addcategory(e)
                    }}
                  >
                    <Row>
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Purchase date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            className="form-control"
                            id="basicpill-firstname-input1"
                            placeholder="Enter Name"
                            required
                            name="purchaseDate"
                            defaultValue={form.purchaseDate}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Select product{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            required
                            onChange={handleSelectGroup1}
                            name="productid"
                            options={options1}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {selectedGroup2?.name == "" ||
                      selectedGroup2?.name == null ? (
                        ""
                      ) : (
                        <>
                          <Col md="12">
                            <div className="table-responsive">
                              <Table className="table align-middle mb-0 table-nowrap">
                                <thead className="table-light">
                                  <tr>
                                    <th>Product</th>
                                    <th>Product Name</th>
                                    <th>Selling Price</th>
                                    <th>Quantity</th>
                                    <th>Purchase price</th>
                                    <th colSpan="2">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <img
                                        src={URLS.Base + selectedGroup2?.image}
                                        alt="product-img"
                                        title="product-img"
                                        className="avatar-md"
                                      />
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        {selectedGroup2?.name}
                                      </h5>
                                    </td>
                                    <td>
                                      <div style={{ width: "100px" }}>
                                        <Input
                                          type="text"
                                          pattern="[0-9.]*"
                                          min={0}
                                          placeholder="Selling"
                                          required
                                          name="amount"
                                          onChange={handleChanges123}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ width: "100px" }}>
                                        <div className="input-group">
                                          <Input
                                            type="number"
                                            value={
                                              selectedGroup2?.product || ""
                                            }
                                            min={0}
                                            required
                                            name="product"
                                            onChange={handleChanges}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <Input
                                        type="text"
                                        pattern="[0-9.]*"
                                        min={0}
                                        style={{ width: "100px" }}
                                        name="unitPrice"
                                        placeholder="Price"
                                        required
                                        onChange={handleChange12}
                                      />
                                    </td>
                                    <td>
                                      ₹{" "}
                                      {selectedGroup2?.product *
                                        (selectedGroup2?.unitPrice || 0)}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                    <div className="mt-4" style={{ float: "right" }}>
                      <Button
                        className="m-2"
                        onClick={() => {
                          setshow(!show)
                        }}
                        color="danger"
                        type="submit"
                      >
                        Cancel <i className="fas fa-times-circle"></i>
                      </Button>
                      <Button className="m-2" color="success" type="submit">
                        Submit <i className="fas fa-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          ) : (
            ""
          )}
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white">
                  <Row className="mt-3 mb-3">
                  {Roles.stockAdd  || Roles?.accessAll === true ?<> 
                    <Col>
                      <Button
                        onClick={() => {
                          setshow(!show)
                        }}
                        color="primary"
                      >
                        Add Stock <i className="bx bx-plus-circle" />
                      </Button>
                    </Col></>:""}
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
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-4 ">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Category Name</th>
                            <th>Product Name</th>
                            <th>Image</th>
                            <th>Selling Price</th>
                            <th>Quantity</th>
                            <th>Purchase price</th>
                            <th>Total Price</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prodects.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th>{key + 1}</th>
                              <td>{data.purchaseDate}</td>
                              <td>{data.subCategoryName}</td>
                              <td>{data.categoryName}</td>
                              <td>
                                <img
                                  style={{ width: "80px" }}
                                  src={URLS.Base + data.image}
                                />
                              </td>
                              <td>{data.price}</td>
                              <td>{data.quantity}</td>
                              <td>{data.purchaseAmount}</td>
                              <td>{data.totalPrice}</td>
                              <td>
                              {Roles.stockEdit  || Roles?.accessAll === true ?<> 
                                <Button
                                  onClick={() => {
                                    getpopup(data)
                                  }}
                                  className="mr-2"
                                  style={{
                                    padding: "6px",
                                    margin: "3px",
                                  }}
                                  color="success"
                                  outline
                                >
                                  <i className="bx bx-edit "></i>
                                </Button></>:""}
                                {Roles.stockDelete  || Roles?.accessAll === true ?<> 
                                <Button
                                  onClick={() => {
                                    manageDelete(data)
                                  }}
                                  style={{
                                    padding: "6px",
                                    margin: "3px",
                                  }}
                                  color="danger"
                                  outline
                                >
                                  <i className="bx bx-trash"></i>
                                </Button></>:""}
                              </td>
                            </tr>
                          ))}{" "}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal
          size="lg"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Stock
            </h5>
            <button
              onClick={() => {
                setmodal_small(false)
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
            <Form
              onSubmit={e => {
                editCategory(e)
              }}
            >
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label for="basicpill-firstname-input1">
                      Purchase date <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="date"
                      className="form-control"
                      id="basicpill-firstname-input1"
                      placeholder="Enter Date"
                      required
                      name="purchaseDate"
                      value={form1.purchaseDate}
                      onChange={e => {
                        handleChange1(e)
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="table-responsive">
                    <Table className="table align-middle mb-0 table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Product Name</th>
                          <th>Selling price</th>
                          <th>Quantity</th>
                          <th>Purchase Price</th>
                          <th colSpan="2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img
                              src={URLS.Base + form1.image}
                              alt="product-img"
                              title="product-img"
                              className="avatar-md"
                            />
                          </td>
                          <td>
                            <h5 className="font-size-14 text-truncate">
                              {form1.subCategory}
                            </h5>
                          </td>
                          <td>
                            <Input
                              type="text"
                              pattern="[0-9.]*"
                              style={{ width: "100px" }}
                              name="price"
                              min={0}
                              placeholder="Selling"
                              required
                              value={form1.price}
                              onChange={e => {
                                handleChanges1(e)
                              }}
                            />
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <div className="input-group">
                                <Input
                                  type="number"
                                  min={0}
                                  placeholder="Quantity"
                                  value={form1.quantity}
                                  required
                                  name="quantity"
                                  onChange={e => {
                                    handleChange121(e)
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <Input
                                type="text"
                                pattern="[0-9.]*"
                                min={0}
                                required
                                placeholder="Purchase"
                                value={form1.purchaseAmount}
                                name="purchaseAmount"
                                onChange={e => {
                                  handleChanges1(e)
                                }}
                              />
                            </div>
                          </td>
                          <td>₹ {totalpricedata}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <div className="mt-4" style={{ float: "right" }}>
                <Button
                  className="m-2"
                  onClick={() => {
                    setmodal_small(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-2" color="success" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Stocks
