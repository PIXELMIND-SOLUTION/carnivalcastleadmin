import React, { useEffect, useState } from "react"
import {
    Row,
    Col,
    Card,
    CardBody,
    Input,
    Button,
    Table,
} from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import axios from "axios"
import jsPDF from "jspdf"
import "jspdf-autotable"

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [notificationInCsv, setNotificationInCsv] = useState([])
    const [form, setForm] = useState({})
    const [listPerPage] = useState(5)
    const [pageNumber, setPageNumber] = useState(0)

    var gets = localStorage.getItem("authUser")
    var data = JSON.parse(gets)
    var token = data?.token

    // ✅ Fetch Notifications
    const GetNotifications = () => {
        axios
            .get(
                "https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/getallnotificatins",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(res => {
                setNotifications(res.data.notifications || [])
                setNotificationInCsv(res.data.notifications || [])
            })
            .catch(err => {
                console.error("Error fetching notifications:", err)
                toast.error("Failed to load notifications")
            })
    }

    // ✅ Delete Notification
    const deleteNotification = async id => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            try {
                await axios.delete(
                    `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/deletenotification/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                toast.success("Notification deleted successfully")
                GetNotifications()
            } catch (error) {
                console.error("Error deleting notification:", error)
                toast.error("Failed to delete notification")
            }
        }
    }

    // ✅ Search
    const custsearch = e => {
        const value = e.target.value.toLowerCase()
        setForm({ search: value })

        if (!value) {
            setNotifications(notificationInCsv)
        } else {
            const filtered = notificationInCsv.filter(
                item =>
                    item?.title?.toLowerCase().includes(value) ||
                    item?.message?.toLowerCase().includes(value) ||
                    item?.userDetails?.name?.toLowerCase().includes(value) ||
                    item?.userDetails?.email?.toLowerCase().includes(value)
            )
            setNotifications(filtered)
        }
    }

    useEffect(() => {
        GetNotifications()
    }, [])

    // ✅ Pagination
    const pagesVisited = pageNumber * listPerPage
    const lists = notifications.slice(pagesVisited, pagesVisited + listPerPage)
    const pageCount = Math.ceil(notifications.length / listPerPage)
    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    // ✅ Export CSV
    const csvReport = {
        filename: "Notifications_Report.csv",
        data: notificationInCsv,
    }

    // ✅ Export PDF
    const exportPDF = () => {
        const unit = "pt"
        const size = "A2"
        const orientation = "portrait"
        const doc = new jsPDF(orientation, unit, size)
        doc.setFontSize(15)

        const headers = [
            ["S.No", "Title", "Message", "User Name", "Email", "Phone", "Source", "Status", "Created At"],
        ]

        const data = notifications.map((elt, i) => [
            i + 1,
            elt.title,
            elt.message,
            elt?.userDetails?.name,
            elt?.userDetails?.email,
            elt?.userDetails?.phone,
            elt.source,
            elt.status,
            new Date(elt.createdAt).toLocaleString(),
        ])

        let content = {
            startY: 50,
            head: headers,
            body: data,
        }
        doc.autoTable(content)
        doc.save("Notifications_Report.pdf")
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs
                        title="Carnival Castle Admin"
                        breadcrumbItem="Booking Notifications"
                    />

                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <CSVLink {...csvReport}>
                                                <button className="btn btn-success me-2" type="submit">
                                                    <i className="fas fa-file-excel"></i> Excel
                                                </button>
                                            </CSVLink>
                                            <Button
                                                type="button"
                                                className="btn btn-danger "
                                                onClick={exportPDF}
                                            >
                                                <i className="fas fa-file-pdf"></i> Pdf
                                            </Button>
                                        </Col>
                                        <Col>
                                            <div style={{ float: "right" }}>
                                                <Input
                                                    name="search"
                                                    value={form.search || ""}
                                                    onChange={custsearch}
                                                    type="search"
                                                    placeholder="Search..."
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="table-rep-plugin mt-4 table-responsive">
                                        <Table hover bordered responsive>
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Title</th>
                                                    <th>Message</th>
                                                    <th>User Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Source</th>
                                                    <th>Status</th>
                                                    <th>Created At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lists.length > 0 ? (
                                                    lists.map((data, key) => (
                                                        <tr key={key}>
                                                            <th scope="row">
                                                                {pageNumber * listPerPage + key + 1}
                                                            </th>
                                                            <td>{data.title}</td>
                                                            <td>{data.message}</td>
                                                            <td>{data?.userDetails?.name}</td>
                                                            <td>{data?.userDetails?.email}</td>
                                                            <td>{data?.userDetails?.phone}</td>
                                                            <td>{data.source}</td>
                                                            <td>{data.status}</td>
                                                            <td>
                                                                {new Date(data.createdAt).toLocaleString()}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    size="sm"
                                                                    color="danger"
                                                                    onClick={() => deleteNotification(data._id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="text-center">
                                                            No Notifications Found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>

                                        <Col sm="12">
                                            <div
                                                className="d-flex mt-3 mb-1"
                                                style={{ float: "right" }}
                                            >
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
                                        </Col>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <ToastContainer />
            </div>
        </React.Fragment>
    )
}

export default Notifications
