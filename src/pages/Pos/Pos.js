import React, { useState, useEffect, useRef } from "react"
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  Label,
  CardBody,
  CardTitle,
  Modal,
  Button,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useReactToPrint } from "react-to-print"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"

const EcommerceCheckout = () => {
  const [modal_small, setmodal_small] = useState(false)
  const [modal_small2, setmodal_small2] = useState(false)
  const [btnshows, setbtnshows] = useState(false)

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [activeTab, setactiveTab] = useState("1")

  function tog_small2() {
    setmodal_small2(!modal_small2)
  }
  const modalclose = () => {
    setmodal_small2(false)
    setproducts([])
    setform({ bookingId: "" })
    setform2({ couponAmount: "" })
  }

  const history = useHistory()

  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const printsecctions = () => {
    handlePrint()
    setmodal_small2(!modal_small2)
    setproducts([])
    setform({ bookingId: "" })
    setform2({ couponAmount: "" })
  }

  const [products, setproducts] = useState([])
  const [products1, setproducts1] = useState([])
  const [ordercount, setordercount] = useState(1)
  const [orderResponse, setOrderResponse] = useState(null)

  const caramout = products.map(
    data => parseFloat(data.price) * parseFloat(data.quantity)
  )

  const subamount = caramout.reduce((acc, value) => {
    if (!isNaN(value)) {
      return acc + value
    } else {
      return acc
    }
  }, 0)
  
  const [sumtax, setsumtax] = useState(0)
  
  const calculateTotalTax = () => {
    let totalTax = 0
    products.forEach(product => {
      const productTotal = parseFloat(product.price) * parseFloat(product.quantity)
      const taxRate = parseFloat(product.tax || sumtax)
      const taxAmount = (productTotal * taxRate) / 100
      totalTax += taxAmount
    })
    return totalTax
  }
  
  const taxvalue = calculateTotalTax()

  const getAlltaxes = () => {
    var token = datas
    axios
      .post(
        URLS.GetPriceSettings,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setsumtax(res.data.charges.foodGst)
      })
  }

  function removeCartItem(_id) {
    var filtered = products.filter(function (item) {
      return item._id !== _id
    })
    setproducts(filtered)
  }

  useEffect(() => {
    setordercount(products.map(product => 1))
  }, [products])

  const countUP = (index, quantity) => {
    setexctra({
      cashPrice: "",
    })

    let myUser = [...products]
    myUser[index].quantity = parseFloat(quantity) + 1
    setproducts(myUser)
    const bodydata = {
      quantity: parseFloat(myUser[index].quantity),
    }
    var token = datas
    axios
      .post(URLS.CheckStock + myUser[index]._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            var _data = res
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Please try again.")
          }
        }
      )
  }

  const quantityChange = (e, index) => {
    setexctra({
      cashPrice: "",
    })
    let myUser = [...products]
    myUser[index][e.target.name] = e.target.value
    setproducts(myUser)
    const bodydata = {
      quantity: e.target.value,
    }
    var token = datas
    axios
      .post(URLS.CheckStock + myUser[index]._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            var _data = res
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Please try again.")
          }
        }
      )
  }

  const countDown = async (index, quantity) => {
    setexctra({
      cashPrice: "",
    })
    let myUser = [...products]
    myUser[index].quantity = Math.max(parseFloat(quantity) - 1, 1)
    setproducts(myUser)
    setordercount(prevCounts =>
      prevCounts.map((count, i) =>
        i === index ? Math.max(count - 1, 1) : count
      )
    )
    const bodydata = {
      quantity: parseFloat(myUser[index].quantity),
    }
    var token = datas
    axios
      .post(URLS.CheckStock + myUser[index]._id, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            var _data = res
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Please try again.")
          }
        }
      )
  }

  const [category, setcategory] = useState([])
  const [category1, setcategory1] = useState([])
  const [subcategory, setsubcategory] = useState([])
  const [form, setform] = useState({ bookingId: "" })
  const [form2, setform2] = useState([])
  const [invoice, setinvoice] = useState([])
  const [monytypes, setmonytypes] = useState([])
  const [exctra, setexctra] = useState([])
  const [balnceamss, setbalnceamss] = useState([])
  const [totalPrice, settotalPrice] = useState([])

  useEffect(() => {
    const totamount = parseFloat(subamount) + parseFloat(taxvalue) -
      parseFloat(form2.couponAmount == "" || form2.couponAmount == undefined ? 0 : form2.couponAmount)
    settotalPrice(parseFloat(totamount).toFixed(2))
  }, [subamount, taxvalue, form2.couponAmount])

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const handleChangeAmount = e => {
    let myUser = { ...monytypes }
    myUser[e.target.name] = e.target.value
    setmonytypes(myUser)
  }

  const handleChangeexctra = e => {
    let myUser = { ...exctra }
    myUser[e.target.name] = e.target.value
    setexctra(myUser)
    const balnceam = totalPrice - e.target.value
    setbalnceamss(parseFloat(balnceam).toFixed(2))
  }

  const getAllCategories = () => {
    var token = datas
    axios
      .post(
        URLS.GetFoodCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setcategory(res.data.Foodcategories)
        setcategory1(res.data.Foodcategories[0])
        const bodydata = res.data.Foodcategories[0]._id
        axios
          .post(
            URLS.GetStockByCategory,
            { categoryId: bodydata },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then(res => {
            setsubcategory(res.data.stockResult)
          })
      })
  }

  const [activeCategory, setActiveCategory] = useState(null)
  const [subsearch, setsubsearch] = useState([])

  const getAllSubcategories = async data => {
    const bodydata = { categoryId: data._id }

    var token = datas
    axios
      .post(URLS.GetStockByCategory, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setsubcategory(res.data.stockResult)
        setcategory1([])
        setActiveCategory(data)
        setsubsearch(data)
      })
  }

  const getAllsearch = e => {
    const bodydata = { categoryId: subsearch._id || category1._id }
    var token = datas
    axios
      .post(URLS.GetStockByCategorySearch + e.target.value, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setsubcategory(res.data.stockResult)
      })
  }

  useEffect(() => {
    getAllCategories()
    getAlltaxes()
  }, [])

  const getData = (data, key) => {
    setexctra({
      cashPrice: "",
    })

    setproducts(prevProducts => {
      const existingProductNames = prevProducts.map(
        value => value.subCategoryName
      )
      if (existingProductNames.includes(data.subCategoryName)) {
        toast.error("Product is already added")
        return prevProducts
      } else {
        var resdata = {
          _id: data._id,
          image: data.image,
          subCategoryName: data.subCategoryName,
          price: data.price,
          tax: data.tax || sumtax,
          quantity: 1,
        }
        return [...prevProducts, resdata]
      }
    })
  }

  const addProducts = e => {
    e.preventDefault()
    setbtnshows(true)
    
    const productData = products.map((data, index) => {
      const subtotal = parseFloat(data.price) * parseFloat(data.quantity);
      const taxRate = parseFloat(data.tax || sumtax);
      const taxAmount = (subtotal * taxRate) / 100;
      const totalWithTax = subtotal + taxAmount;
      
      return {
        productId: data._id,
        productName: data.subCategoryName,
        quantity: data.quantity,
        tax: taxAmount.toFixed(2),
        price: parseFloat(data.price).toFixed(2),
        subtotal: parseFloat(subtotal).toFixed(2),
        totalprice: totalWithTax.toFixed(2),
      }
    })

    const bodydata = {
      bookingId: sessionStorage.getItem("BookID"),
      subAmount: parseFloat(subamount).toFixed(2),
      couponAmount: form2.length == 0 ? 0 : parseFloat(form2.couponAmount).toFixed(2) || 0,
      tax: parseFloat(taxvalue).toFixed(2),
      totalPrice: totalPrice,
      products: productData,
      moneyType: monytypes.moneyType || "Cash",
      cashPrice: monytypes.moneyType == "Cash" ? totalPrice : exctra.cashPrice || 0,
      onlinePrice: monytypes.moneyType == "Card" ? totalPrice : balnceamss.length == 0 ? 0 : balnceamss,
    }

    console.log("Sending to backend:", bodydata);

    var token = datas

    axios
      .post(URLS.AddPos, bodydata, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res?.data?.message)
            console.log("Full Response:", res?.data);
            setOrderResponse(res?.data)
            setinvoice(res?.data?.order || {})
            setproducts1(res?.data?.order?.products || [])
            setmodal_small(false)
            sessionStorage.setItem("orderid", res.data._id)
            setmodal_small2(true)
            setbtnshows(false)
            getAllCategories()
          }
        },
        error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message)
            setbtnshows(false)
          } else {
            toast.error("An error occurred. Please try again.")
          }
        }
      )
  }

  const [Bookings, setBookings] = useState([])
  const [date, setDate] = useState(sessionStorage.getItem("bookingdate"))

  const handleChanges = e => {
    setDate(e.target.value)
    console.log(e.target.value)

    var token = datas
    axios
      .post(
        URLS.GetPendingBookings,
        { singleDate: e.target.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setBookings(res.data.data)
      })
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  const calculateTaxBreakdown = () => {
    const taxMap = new Map()
    products.forEach(product => {
      const productTotal = parseFloat(product.price) * parseFloat(product.quantity)
      const taxRate = parseFloat(product.tax || sumtax)
      const taxAmount = (productTotal * taxRate) / 100
      
      if (taxMap.has(taxRate)) {
        taxMap.set(taxRate, taxMap.get(taxRate) + taxAmount)
      } else {
        taxMap.set(taxRate, taxAmount)
      }
    })
    return taxMap
  }

  // Calculate totals from products1 or orderResponse
  const getCalculatedTotals = () => {
    const productList = products1?.length > 0 ? products1 : orderResponse?.order?.products || [];
    let calcSubtotal = 0;
    let calcTax = 0;
    let calcTotal = 0;
    
    productList.forEach(p => {
      const baseAmount = parseFloat(p.amount || p.price) * parseFloat(p.quantity);
      const totalAmount = parseFloat(p.totalprice || (baseAmount * 1.05));
      const taxAmount = totalAmount - baseAmount;
      calcSubtotal += baseAmount;
      calcTax += taxAmount;
      calcTotal += totalAmount;
    });
    
    return { calcSubtotal, calcTax, calcTotal };
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Pos" />
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

          <div className="checkout-tabs">
            <Row>
              <Col md="8">
                <Row>
                  <Col md="2 p-1">
                    <Nav className="flex-column" pills>
                      {category.map((data, key) => (
                        <NavItem
                          key={key}
                          onClick={() => {
                            getAllSubcategories(data)
                          }}
                        >
                          <NavLink
                            className={`navcardshadow ${
                              activeCategory === data || category1 === data
                                ? "active"
                                : ""
                            }`}
                          >
                            <img
                              style={{ height: "45px", width: "45px" }}
                              src={URLS.Base + data.image}
                              alt={data.name}
                            />
                            <p className="font-weight-bold">{data.name}</p>
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  </Col>
                  <Col md="10">
                    <div className="mb-3">
                      <Row>
                        <Col md="6">
                          <Input
                            onChange={getAllsearch}
                            type="text"
                            className="rounded-pill"
                            placeholder="Search..."
                          />
                        </Col>
                        <Col md="6"></Col>
                      </Row>
                    </div>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <div>
                          <Row
                            style={{
                              maxHeight: "700px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {subcategory.length == 0 ? (
                              <Container>
                                <Card>
                                  <CardBody>
                                    <div className="text-center">
                                      <h5>No Data...</h5>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Container>
                            ) : (
                              <>
                                {subcategory.map((data, key) => (
                                  <Col key={key} md="4">
                                    <Card>
                                      <div className="text-center ">
                                        <img
                                          className="rounded-top"
                                          src={URLS.Base + data.image}
                                          alt={data.subCategoryName}
                                          style={{
                                            height: "150px",
                                            width: "100%",
                                            objectFit: "cover"
                                          }}
                                        />
                                      </div>{" "}
                                      <CardBody style={{ padding: "10px" }}>
                                        <h6 style={{ fontSize: "14px" }}>
                                          {data.subCategoryName.length > 15
                                            ? data.subCategoryName.substring(
                                                0,
                                                15
                                              ) + "..."
                                            : data.subCategoryName}
                                        </h6>
                                        <Row className="mt-2">
                                          <Col>
                                            {" "}
                                            <h6 className="mt-2">
                                              ₹ {data.price}
                                            </h6>
                                          </Col>
                                          <Col className="text-end">
                                            {" "}
                                            <h6 className="mt-2 text-muted">
                                              {data.finalQuantity} items
                                            </h6>
                                          </Col>
                                          <Col className="mt-2" md="12">
                                            {data.quantity == "0" ? (
                                              <Button
                                                disabled
                                                className="btn-sm w-100"
                                                onClick={() => {
                                                  getData(data, key)
                                                }}
                                                style={{ width: "110px" }}
                                                color="danger"
                                              >
                                                Out of Stock
                                              </Button>
                                            ) : (
                                              <Button
                                                className="btn-sm w-100"
                                                onClick={() => {
                                                  getData(data, key)
                                                }}
                                                style={{ width: "100px" }}
                                                color="primary"
                                              >
                                                Add +
                                              </Button>
                                            )}
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Card>
                                  </Col>
                                ))}
                              </>
                            )}
                          </Row>
                        </div>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </Col>
              <Col md="4">
                <Card>
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        addProducts(e)
                      }}
                    >
                      <div>
                        <CardTitle className="mb-3">Order Summary</CardTitle>
                        <div>
                          <div>
                            <div className="mb-2 row">
                              <div
                                className="col-md-12 pb-2"
                                style={{ padding: "1px" }}
                              >
                                <label>Check Availability</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={date}
                                  name="date"
                                  readOnly
                                />
                              </div>
                              <div
                                style={{ padding: "1px" }}
                                className="col-12"
                              >
                                <Label>Booking Id </Label>
                                <span className="text-danger">*</span>
                                <input
                                  required
                                  type="text"
                                  className="form-control"
                                  value={
                                    sessionStorage.getItem("orderid") +
                                    " - " +
                                    sessionStorage.getItem("theatername")
                                  }
                                  name="date"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            overflowX: "hidden",
                          }}
                        >
                          <Table className="table align-middle mb-0 table-nowrap">
                            <tbody>
                              {products.map((product, index) => {
                                const productTotal = parseFloat(product.price) * parseFloat(product.quantity);
                                const taxRate = parseFloat(product.tax || sumtax);
                                const taxAmount = (productTotal * taxRate) / 100;
                                const totalWithTax = productTotal + taxAmount;
                                
                                return (
                                  <tr key={product._id}>
                                    <td style={{ width: "70px" }}>
                                      <img
                                        src={URLS.Base + product.image}
                                        alt="product-img"
                                        title="product-img"
                                        className="avatar-md"
                                        style={{ objectFit: "cover", width: "50px", height: "50px", borderRadius: "8px" }}
                                      />
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        {product.subCategoryName.length > 10
                                          ? product.subCategoryName.substring(0, 10) + "..."
                                          : product.subCategoryName}
                                      </h5>
                                      <p className="mb-0">
                                        Price (incl. Tax):{" "}
                                        <span className="fw-medium">
                                          ₹ {totalWithTax.toFixed(2)}
                                        </span>
                                      </p>
                                      <small className="text-muted">
                                        Base: ₹{productTotal.toFixed(2)} + Tax: ₹{taxAmount.toFixed(2)} ({taxRate}%)
                                      </small>
                                      <div style={{ width: "120px" }}>
                                        <div className="input-group mt-2">
                                          <div className="input-group-append">
                                            <button
                                              type="button"
                                              className="btn-primary rounded-left"
                                              style={{ padding: "0 8px", border: "none", borderRadius: "4px 0 0 4px" }}
                                              onClick={() => countDown(index, product.quantity)}
                                            >
                                              -
                                            </button>
                                          </div>
                                          <Input
                                            style={{ height: "30px", textAlign: "center", width: "50px", padding: "0" }}
                                            className="text-center"
                                            type="number"
                                            value={products[index].quantity}
                                            name="quantity"
                                            onChange={e => quantityChange(e, index)}
                                          />
                                          <div className="input-group-prepend">
                                            <button
                                              type="button"
                                              className="btn-primary rounded-right"
                                              style={{ padding: "0 8px", border: "none", borderRadius: "0 4px 4px 0" }}
                                              onClick={() => countUP(index, product.quantity)}
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{ width: "40px" }}>
                                      <Link
                                        to="#"
                                        onClick={() => removeCartItem(product._id)}
                                        className="action-icon text-danger"
                                      >
                                        <i className="mdi mdi-trash-can font-size-18" />
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <tbody>
                            <tr>
                              <td>Subtotal (without Tax):</td>
                              <td className="text-end">
                                ₹ {parseFloat(subamount).toFixed(2)}
                              </td>
                            </tr>
                            {/* Tax Breakdown with CGST + SGST */}
                            {Array.from(calculateTaxBreakdown().entries()).map(([rate, amount]) => {
                              const halfTax = amount / 2;
                              return (
                                <React.Fragment key={rate}>
                                  <tr>
                                    <td>CGST ({rate/2}%):</td>
                                    <td className="text-end">₹ {halfTax.toFixed(2)}</td>
                                  </tr>
                                  <tr>
                                    <td>SGST ({rate/2}%):</td>
                                    <td className="text-end">₹ {halfTax.toFixed(2)}</td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                            {calculateTaxBreakdown().size === 0 && sumtax > 0 && (
                              <>
                                <tr>
                                  <td>CGST ({sumtax/2}%):</td>
                                  <td className="text-end">₹ {(taxvalue / 2).toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>SGST ({sumtax/2}%):</td>
                                  <td className="text-end">₹ {(taxvalue / 2).toFixed(2)}</td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <th>Total (with Tax):</th>
                              <th className="text-end">₹ {totalPrice}</th>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      <div>
                        <Row className="mt-3">
                          <Col md="4">
                            <div className="form-check">
                              <input
                                type="radio"
                                onChange={handleChangeAmount}
                                id="Cash"
                                className="form-check-input"
                                value="Cash"
                                name="moneyType"
                              />
                              <label className="form-check-label" htmlFor="Cash">
                                Cash
                              </label>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-check">
                              <input
                                type="radio"
                                onChange={handleChangeAmount}
                                id="Online"
                                className="form-check-input"
                                value="Card"
                                name="moneyType"
                              />
                              <label className="form-check-label" htmlFor="Online">
                                Online
                              </label>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-check">
                              <input
                                type="radio"
                                onChange={handleChangeAmount}
                                id="Split"
                                className="form-check-input"
                                value="Split"
                                name="moneyType"
                              />
                              <label className="form-check-label" htmlFor="Split">
                                Split
                              </label>
                            </div>
                          </Col>
                        </Row>
                        {monytypes.moneyType == "Split" ? (
                          <Row className="mt-3">
                            <Col>
                              <Input
                                onChange={handleChangeexctra}
                                max={totalPrice}
                                value={exctra.cashPrice}
                                required
                                name="cashPrice"
                                type="number"
                                placeholder="Enter Cash Amount"
                              />
                            </Col>
                            <Col>
                              <Input
                                value={balnceamss}
                                disabled
                                name="onlinePrice"
                                type="number"
                                placeholder="Enter Online Amount"
                              />
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                        <Button
                          type="submit"
                          style={{ width: "100%" }}
                          color="primary"
                          className="mt-3"
                          disabled={btnshows}
                        >
                          Print <i className="bx bx-check-circle" />
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
        <ToastContainer />
        <Modal
          isOpen={modal_small2}
          toggle={tog_small2}
        >
          <div className="modal-body">
            <div className="">
              <Button onClick={printsecctions} className="m-2" color="success">
                <i className="bx bx-printer"></i> Proceed If thermal printer is ready
              </Button>
              <Button onClick={modalclose} className="m-2" color="danger">
                <i className="bx bx-left-arrow-alt"></i> Cancel
              </Button>
              <hr />
            </div>
            <Row>
              <Col md="2"></Col>
              <Col md="8">
                <div ref={componentRef}>
                  <div className="modal-body">
                    <div id="printableArea">
                      <div className="initial-38-1">
                        <div style={{ borderBottomStyle: "dashed" }} className="text-center mb-2">
                          <h5 style={{ fontSize: "14px" }} className="text-break initial-38-4">
                            <b>Carnival Castle Private Theatres</b>
                          </h5>
                          <h5 style={{ fontSize: "13px" }} className="text-break initial-38-4">
                            4th floor, Garden View Enclave, Plot No.16, behind Pista House, Kondapur, Hyderabad, Telangana, 500084
                          </h5>
                          <h5 style={{ fontSize: "13px" }} className="text-break initial-38-4">
                            Receipt: {invoice?.orderNo || orderResponse?.order?.orderNo || "N/A"}
                          </h5>
                          <h5 style={{ fontSize: "13px" }} className="text-break initial-38-4">
                            Date: {invoice?.date || orderResponse?.order?.date} - {invoice?.time || orderResponse?.order?.time}
                          </h5>
                        </div>

                        <div style={{ borderBottomStyle: "dashed", margin: "0px" }} className="row text-center">
                          <div className="col-4">
                            <h6>ITEM</h6>
                          </div>
                          <div className="col-4">
                            <h6>QTY</h6>
                          </div>
                          <div className="col-4">
                            <h6>PRICE (incl. Tax)</h6>
                          </div>
                        </div>
                        
                        {(products1?.length > 0 ? products1 : orderResponse?.order?.products || []).map((data, key) => {
                          const totalWithTax = data.totalprice || 
                            (parseFloat(data.amount || data.price) * parseFloat(data.quantity) * 1.05);
                          return (
                            <div key={key} className="row text-center">
                              <div className="col-4">
                                <h6>{data.stockName || data.productName}</h6>
                              </div>
                              <div className="col-4">
                                <h6>{data.quantity}</h6>
                              </div>
                              <div className="col-4">
                                <h6>₹{parseFloat(totalWithTax).toFixed(2)}</h6>
                              </div>
                            </div>
                          );
                        })}

                        <div style={{ borderTopStyle: "dashed" }} className="">
                          <dl style={{ margin: "0px" }} className="row">
                            <dt style={{ margin: "0px" }} className="col-8">
                              Subtotal (without Tax):
                            </dt>
                            <dd style={{ margin: "0px" }} className="col-4">
                              ₹ {getCalculatedTotals().calcSubtotal.toFixed(2)}
                            </dd>

                            {/* Show tax with CGST + SGST breakdown */}
                            {(products1?.length > 0 || orderResponse?.order?.products?.length > 0) && (
                              <>
                                {(() => {
                                  const productList = products1?.length > 0 ? products1 : orderResponse?.order?.products || [];
                                  const taxMap = new Map();
                                  productList.forEach(p => {
                                    const baseAmount = parseFloat(p.amount || p.price) * parseFloat(p.quantity);
                                    const totalAmount = parseFloat(p.totalprice || (baseAmount * 1.05));
                                    const taxAmount = totalAmount - baseAmount;
                                    let taxPercentage = 0;
                                    if (baseAmount > 0) {
                                      taxPercentage = ((taxAmount / baseAmount) * 100).toFixed(0);
                                    }
                                    if (taxMap.has(taxPercentage)) {
                                      taxMap.set(taxPercentage, taxMap.get(taxPercentage) + taxAmount);
                                    } else {
                                      taxMap.set(taxPercentage, taxAmount);
                                    }
                                  });
                                  
                                  return Array.from(taxMap.entries()).map(([percentage, amount]) => {
                                    const halfTax = amount / 2;
                                    return (
                                      <React.Fragment key={percentage}>
                                        <dt style={{ margin: "0px" }} className="col-8">
                                          CGST ({percentage/2}%):
                                        </dt>
                                        <dd style={{ margin: "0px" }} className="col-4">
                                          ₹{halfTax.toFixed(2)}
                                        </dd>
                                        <dt style={{ margin: "0px" }} className="col-8">
                                          SGST ({percentage/2}%):
                                        </dt>
                                        <dd style={{ margin: "0px" }} className="col-4">
                                          ₹{halfTax.toFixed(2)}
                                        </dd>
                                      </React.Fragment>
                                    );
                                  });
                                })()}
                              </>
                            )}

                            <dt style={{ margin: "0px" }} className="col-8">
                              Discount:
                            </dt>
                            <dd style={{ margin: "0px" }} className="col-4">
                              ₹ {invoice?.couponAmount == "NaN" ? 0 : (invoice?.couponAmount || orderResponse?.order?.couponAmount || 0)}
                            </dd>
                            
                            <dt style={{ margin: "0px" }} className="col-8">
                              Total Tax:
                            </dt>
                            <dd style={{ margin: "0px" }} className="col-4">
                              ₹{getCalculatedTotals().calcTax.toFixed(2)}
                              <hr style={{ marginBottom: "5px", marginTop: "5px" }} />
                            </dd>
                            
                            <dt className="col-8 font-20px">Total (with Tax):</dt>
                            <dd className="col-4 font-20px">
                              ₹ {getCalculatedTotals().calcTotal.toFixed(2)}
                            </dd>
                            
                            <dt className="col-8 font-20px">Money Type:</dt>
                            <dd className="col-4 font-20px">
                              {invoice?.moneyType || orderResponse?.order?.moneyType || "Cash"}
                            </dd>
                            
                            {(invoice?.cashPrice > 0 || orderResponse?.order?.cashPrice > 0) && (
                              <>
                                <dt className="col-8 font-20px">Cash Amount:</dt>
                                <dd className="col-4 font-20px">₹ {invoice?.cashPrice || orderResponse?.order?.cashPrice}</dd>
                              </>
                            )}
                            {(invoice?.onlinePrice > 0 || orderResponse?.order?.onlinePrice > 0) && (
                              <>
                                <dt className="col-8 font-20px">Online Amount:</dt>
                                <dd className="col-4 font-20px">₹ {invoice?.onlinePrice || orderResponse?.order?.onlinePrice}</dd>
                              </>
                            )}
                          </dl>
                          <h5 style={{ borderTopStyle: "dashed", borderBottomStyle: "dashed", fontSize: "14px" }} className="text-center">
                            <span className="d-block my-2">"Thank You. Visit Again."</span>
                          </h5>
                          <span className="d-block text-center">
                            Receipts by carnivalcastle.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="2"></Col>
            </Row>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default EcommerceCheckout