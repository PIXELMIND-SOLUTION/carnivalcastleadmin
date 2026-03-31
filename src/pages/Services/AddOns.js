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
import { useHistory } from "react-router-dom"
import Select from "react-select"

const Banner = () => {
  const history = useHistory()
  const [modal_small, setmodal_small] = useState(false)
  const [product_modal, setproduct_modal] = useState(false) // New modal for product creation
  const [banner, setbanner] = useState([])
  const [form, setform] = useState([])
  const [form1, setform1] = useState([])
  const [productForm, setProductForm] = useState({ // New form for product creation
    categoryId: "",
    name: "",
    type: "",
    price: "",
    occasionId: "",
    cakeType: "",
    cakePremiumOrNormal: "",
    cakesFilds: false,
    dropdown: false,
    increment: false
  })

  const [Files, setFiles] = useState("")
  const [Files1, setFiles1] = useState("")
  const [productFiles, setProductFiles] = useState("") // Files for product creation

  const [selectedOptions, setSelectedOptions] = useState([])
  const [Occasions, setOccasions] = useState([])

  const multis = selectedOptions => {
    setSelectedOptions(selectedOptions)
  }

  const options = Occasions.map(response => ({
    value: response._id,
    label: response.name,
  }))

  useEffect(() => {
    GetOcation()
  }, [])

  const GetOcation = () => {
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
        setOccasions(res.data.occasions)
      })
  }

  const changeHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setFiles(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported.Pls choose Image")
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
      toast("file format not supported.Pls choose Image")
    }
  }

  const productFileHandler = e => {
    const file = e.target.files
    var ext = file[0].name.split(".").pop()
    var type = ext
    if (type == "jpg" || type == "jpeg" || type == "png") {
      setProductFiles(e.target.files)
    } else {
      e.target.value = null
      toast("file format not supported.Pls choose Image")
    }
  }

  function tog_small() {
    setmodal_small(!modal_small)
  }

  function tog_product_modal() {
    setproduct_modal(!product_modal)
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

  const handleProductChange = e => {
    let myUser = { ...productForm }
    myUser[e.target.name] = e.target.value
    setProductForm(myUser)
  }

  useEffect(() => {
    GetAllBanners()
  }, [])

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(5)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = banner.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(banner.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const handleSubmit = e => {
    e.preventDefault()
    AddBanner()
  }

  const handleProductSubmit = e => {
    e.preventDefault()
    AddProductFromCategory()
  }

  const AddBanner = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("name", form.name)
    for (let i = 0; i < Files.length; i++) {
      dataArray.append("image", Files[i])
    }
    axios
      .post(URLS.AddCategory, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
            clearForm()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  // NEW: Add Product from Category List
  const AddProductFromCategory = () => {
    var token = datas
    const dataArray = new FormData()
    dataArray.append("categoryId", productForm.categoryId)
    dataArray.append("name", productForm.name)
    dataArray.append("type", productForm.type)
    dataArray.append("price", productForm.price)
    
    if (productForm.cakesFilds) {
      dataArray.append("cakeType", productForm.cakeType)
      dataArray.append("cakePremiumOrNormal", productForm.cakePremiumOrNormal)
    } else {
      dataArray.append("cakeType", "")
      dataArray.append("cakePremiumOrNormal", "")
    }

    dataArray.append("occasionId", JSON.stringify(selectedOptions))
    for (let i = 0; i < productFiles.length; i++) {
      dataArray.append("image", productFiles[i])
    }
    
    axios
      .post(URLS.AddProducts, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setproduct_modal(false)
            clearProductForm()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const EditBanner = () => {
    var token = datas
    var formid = form1._id
    const dataArray = new FormData()
    dataArray.append("name", form1.name)
    for (let i = 0; i < Files1.length; i++) {
      dataArray.append("image", Files1[i])
    }
    axios
      .put(URLS.UpdateCategory + formid, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
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

  const DeleteBanner = data => {
    var token = datas
    var remid = data._id
    axios
      .delete(URLS.DeleteCategory + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetAllBanners()
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
      DeleteBanner(data)
    }
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    EditBanner()
  }

  const GetAllBanners = () => {
    var token = datas
    axios
      .post(
        URLS.GetCategory,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.categorys)
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
    })
    setFiles({
      image: "",
    })
  }

  const clearProductForm = () => {
    setProductForm({
      categoryId: "",
      name: "",
      type: "",
      price: "",
      occasionId: "",
      cakeType: "",
      cakePremiumOrNormal: "",
      cakesFilds: false,
      dropdown: false,
      increment: false
    })
    setProductFiles("")
    setSelectedOptions([])
  }

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  // NEW: Open product creation modal with category pre-filled
  const openProductModal = (category) => {
    setProductForm(prev => ({
      ...prev,
      categoryId: category._id,
      cakesFilds: category.name === "Cakes" || category.name === "Customisation Cakes"
    }))
    tog_product_modal()
  }

  const [search, setsearch] = useState([])

  const searchAll = e => {
    let myUser = { ...search }
    myUser[e.target.name] = e.target.value
    setsearch(myUser)

    var token = datas
    axios
      .post(
        URLS.GetCategorySearch + `${e.target.value}`,
        {},

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setbanner(res.data.categorys)
      })
  }
  
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission[0]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Carnival Castle Admin" breadcrumbItem="Addons" />
          <Row>
            {Roles.addOnsAdd || Roles?.accessAll === true ? (
              <>
                <Col md={4}>
                  <Card>
                    <CardHeader className="bg-white">
                      <CardTitle>Add Addons</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form
                        onSubmit={e => {
                          handleSubmit(e)
                        }}
                      >
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Name <span className="text-danger">*</span>
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
                        <div className="mb-3">
                          <Label for="basicpill-firstname-input1">
                            Image <span className="text-danger">*</span>
                            <span className="text-danger">298*180</span>
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
                        <div style={{ float: "right" }}>
                          <Button color="primary" type="submit">
                            Submit <i className="fas fa-check-circle"></i>
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </>
            ) : (
              ""
            )}
            <Col md={Roles.addOnsAdd || Roles?.accessAll === true ? 8 : 12}>
              <Card>
                <CardHeader className="bg-white">
                  <CardTitle>Addons List</CardTitle>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="table-responsive">
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
                      <Table className="table table-bordered mb-4 mt-5">
                        <thead>
                          <tr className="text-center">
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th>{(pageNumber) * 5 + key + 1}</th>
                              <td>{data.name}</td>
                              <td>
                                <img
                                  style={{ width: "100px" }}
                                  src={URLS.Base + data.image}
                                  alt={data.name}
                                />
                              </td>
                              <td>
                                {/* NEW: Add Product Button */}
                                {Roles.productsAdd || Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        openProductModal(data)
                                      }}
                                      className="mr-2"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="warning"
                                      outline
                                      title="Add Product"
                                    >
                                      <i className="bx bx-plus"></i>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                
                                {Roles.addOnsView || Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        history.push("/Cakes")
                                      }}
                                      className="mr-2"
                                      style={{
                                        padding: "6px",
                                        margin: "3px",
                                      }}
                                      color="info"
                                      outline
                                    >
                                      <i className="bx bx-show"></i>
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles.addOnsEdit ||
                                Roles?.accessAll === true ? (
                                  <>
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
                                    </Button>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles.addOnsDelete ||
                                Roles?.accessAll === true ? (
                                  <>
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
                                    </Button>{" "}
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

        {/* Edit Category Modal */}
        <Modal
          size="md"
          isOpen={modal_small}
          toggle={() => {
            tog_small()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="mySmallModalLabel">
              Edit Addons
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
                handleSubmit1(e)
              }}
            >
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Name <span className="text-danger">*</span>
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
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Image <span className="text-danger">*</span>
                  <span className="text-danger">298*180</span>
                </Label>
                <Input
                  type="file"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  name="image"
                  value={Files1.image}
                  onChange={changeHandler1}
                />
              </div>
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setmodal_small(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-1" color="primary" type="submit">
                  Submit <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* NEW: Add Product Modal */}
        <Modal
          size="lg"
          isOpen={product_modal}
          toggle={() => {
            tog_product_modal()
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add New Product</h5>
            <button
              onClick={() => {
                setproduct_modal(false)
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
                handleProductSubmit(e)
              }}
            >
              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Occasion Name<span className="text-danger">*</span></Label>
                    <Select
                      options={options}
                      placeholder="Enter Occasion Name"
                      value={selectedOptions}
                      onChange={multis}
                      isSearchable={true}
                      isMulti
                    />
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Category</Label>
                    <span className="text-danger">*</span>
                    <Input
                      type="text"
                      className="form-control"
                      value={banner.find(cat => cat._id === productForm.categoryId)?.name || ""}
                      disabled
                    />
                    <small className="text-muted">Selected from category list</small>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Product Name<span className="text-danger">*</span></Label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Name"
                      required
                      name="name"
                      value={productForm.name}
                      onChange={e => {
                        handleProductChange(e)
                      }}
                    />
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label>Product Image<span className="text-danger">*</span></Label>
                    <Input
                      type="file"
                      className="form-control"
                      required
                      name="image"
                      onChange={productFileHandler}
                    />
                  </div>
                </Col>

                {/* Cake Fields for Cakes and Customisation Cakes */}
                {productForm.cakesFilds && (
                  <>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Cake Type<span className="text-danger">*</span></Label>
                        <select
                          value={productForm.cakeType}
                          name="cakeType"
                          required
                          onChange={e => handleProductChange(e)}
                          className="form-select"
                        >
                          <option value="">Select Cake Type</option>
                          <option value="egg">Egg</option>
                          <option value="eggless">Egg Less</option>
                        </select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Is Premium<span className="text-danger">*</span></Label>
                        <select
                          value={productForm.cakePremiumOrNormal}
                          name="cakePremiumOrNormal"
                          required
                          onChange={e => handleProductChange(e)}
                          className="form-select"
                        >
                          <option value="">Select Premium Type</option>
                          <option value="premium">Premium</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>
                    </Col>
                  </>
                )}

                <Col md="6">
                  <div className="mb-3">
                    <Label>Type<span className="text-danger">*</span></Label>
                    <select
                      value={productForm.type}
                      name="type"
                      required
                      onChange={e => {
                        handleProductChange(e)
                      }}
                      className="form-select"
                    >
                      <option value="">Select Type</option>
                      <option value="quantity">Quantity</option>
                      <option value="grams">Grams</option>
                    </select>
                  </div>
                </Col>
                
                <Col md="6">
                  <div className="mb-3">
                    <Label>
                      Price<span className="text-danger">*</span>
                      {productForm.type === "quantity" ? (
                        <small className="text-muted"> (Price per piece)</small>
                      ) : (
                        <small className="text-muted"> (Price for 500 grams)</small>
                      )}
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      placeholder="Enter Price"
                      required
                      name="price"
                      value={productForm.price}
                      onChange={e => {
                        handleProductChange(e)
                      }}
                    />
                  </div>
                </Col>
              </Row>
              
              <div style={{ float: "right" }}>
                <Button
                  onClick={() => {
                    setproduct_modal(false)
                  }}
                  color="danger"
                  type="button"
                >
                  Cancel <i className="fas fa-times-circle"></i>
                </Button>
                <Button className="m-1" color="primary" type="submit">
                  Add Product <i className="fas fa-check-circle"></i>
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

export default Banner