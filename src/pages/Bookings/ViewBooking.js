import React, { useState, useEffect, useCallback } from "react"
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Label,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2";

function RecruitView() {
  const [modal_small, setmodal_small] = useState(false)
  const history = useHistory()
  const [Plan, setPlan] = useState([])
  const [form, setform] = useState({})
  const [AddOns, setAddOns] = useState([])
  const [Theater, setTheater] = useState({})
  const [Products, setProducts] = useState([])
  const [Payments, setPayments] = useState({})
  const [Occation, setOccation] = useState({})
  const [Theaterimg, setTheaterimg] = useState("")
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    name: "",
    image: "",
    type: "",
    price: "",
    quantity: "",
    categoryName: "",
    cakeType: "",
    cakePremiumOrNormal: ""
  });

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheaterSlots, setSelectedTheaterSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [OrderDetails, setOrderDetails] = useState(null);

  // 🔹 Wallet State
  const [walletData, setWalletData] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  // 🔹 Redeem Wallet Points State
  const [redeemModal, setRedeemModal] = useState(false);
  const [redeemCoins, setRedeemCoins] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);

  // ✅ Booking se direct walletRedemption data
  const [bookingWalletRedemption, setBookingWalletRedemption] = useState({ coins: 0, amount: 0 });

  // ========== NEW: Custom Cake Upload State ==========
  const [customCakeModal, setCustomCakeModal] = useState(false);
  const [customCakeFile, setCustomCakeFile] = useState(null);
  const [customCakeUploading, setCustomCakeUploading] = useState(false);
  const [customCakeImages, setCustomCakeImages] = useState([]);
  const [hasCakeProducts, setHasCakeProducts] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  var gets = localStorage.getItem("authUser")
  var data = gets ? JSON.parse(gets) : null
  var datas = data ? data.token : ""

  const [form1, setform1] = useState([])
  const [Price, setPrice] = useState(0)
  const [AddPrice, setAddPrice] = useState(0)
  const [form2, setform2] = useState({ noOfPersons: 0 })
  const [invoice, setInvoice] = useState("")

  // State for Offered Discount
  const [offeredDiscountModal, setOfferedDiscountModal] = useState(false);
  const [offeredDiscountValue, setOfferedDiscountValue] = useState("");

  // State for Reward Point Redemption
  const [rewardPointData, setRewardPointData] = useState([]);
  const [applicableRewardPoint, setApplicableRewardPoint] = useState(0);

  function tog_small() {
    setmodal_small(!modal_small)
  }

  const toggleOfferedDiscountModal = () => {
    setOfferedDiscountModal(!offeredDiscountModal);
  }

  const toggleRedeemModal = () => {
    setRedeemModal(!redeemModal);
    setRedeemCoins("");
    setRedeemAmount("");
  }

  // ========== NEW: Toggle Custom Cake Modal ==========
  const toggleCustomCakeModal = () => {
    setCustomCakeModal(!customCakeModal);
    setCustomCakeFile(null);
    setPreviewUrl(null);
  }

  // Add these state declarations at the top with other useState declarations
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Process categories when allProducts changes
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      console.log("All Products:", allProducts); // Debug ke liye

      // Unique categories nikalne ka sahi tarika
      const categoryMap = new Map();

      allProducts.forEach(product => {
        if (product.categoryId && product.categoryName) {
          categoryMap.set(product.categoryId, {
            id: product.categoryId,
            name: product.categoryName
          });
        }
      });

      const uniqueCategories = Array.from(categoryMap.values());
      console.log("Unique Categories:", uniqueCategories); // Debug ke liye
      setCategories(uniqueCategories);
    }
  }, [allProducts]);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory && allProducts.length > 0) {
      console.log("Selected Category ID:", selectedCategory); // Debug ke liye

      const filtered = allProducts.filter(product => {
        return product.categoryId === selectedCategory;
      });

      console.log("Filtered Products:", filtered); // Debug ke liye
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, allProducts]);

  // ========== NEW: Handle Custom Cake File Change ==========
  const handleCustomCakeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please upload only image files (jpg, jpeg, png, gif, bmp, webp)',
        });
        e.target.value = null;
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size must be less than 10MB',
        });
        e.target.value = null;
        return;
      }

      setCustomCakeFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ========== NEW: Handle Custom Cake Upload ==========
  const handleCustomCakeUpload = async () => {
    if (!customCakeFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select an image file to upload.',
      });
      return;
    }

    const bookingId = sessionStorage.getItem("BookingId");
    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Missing',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Upload Custom Cake Image?',
      text: 'Are you sure you want to upload this custom cake image?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, upload it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    setCustomCakeUploading(true);

    const formData = new FormData();
    formData.append('customCakeImage', customCakeFile);

    try {
      const response = await axios.post(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/upload-customcake/${bookingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${datas}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data && response.data.success) {
        setCustomCakeImages([...customCakeImages, response.data.image]);
        setCustomCakeFile(null);
        setPreviewUrl(null);
        toggleCustomCakeModal();

        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: 'Custom cake image has been uploaded successfully!',
        });

        // Refresh booking data to show new image
        GetBooking();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: response.data.message || 'Failed to upload custom cake image.',
        });
      }
    } catch (error) {
      console.error("Error uploading custom cake image:", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setCustomCakeUploading(false);
    }
  };

  const getpopup = data => {
    setform1(data)
    tog_small()
  }

  const handleChange1 = e => {
    let myUser = { ...form2 }
    myUser[e.target.name] = e.target.value
    setform2(myUser)
    const cal = Number(e.target.value) * Price
    setAddPrice(cal)
  }

  // 🔹 Handle Redeem Coins Change
  const handleRedeemCoinsChange = (e) => {
    const coins = e.target.value;
    setRedeemCoins(coins);
  }

  const handleRedeemAmountChange = (e) => {
    const amount = e.target.value;
    setRedeemAmount(amount);
  }

  const handleMaxRedeem = () => {
    if (walletData && walletData.walletPoints) {
      setRedeemCoins(walletData.walletPoints.toString());
    }
  }

  const handleRedeemSubmit = async () => {
    if (!redeemCoins || parseFloat(redeemCoins) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Coins',
        text: 'Please enter valid coins to redeem.',
      });
      return;
    }

    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter valid redeem amount.',
      });
      return;
    }

    if (parseFloat(redeemCoins) > walletData.walletPoints) {
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient Coins',
        text: `You only have ${walletData.walletPoints} coins available.`,
      });
      return;
    }

    const discountAmount = parseFloat(redeemAmount);

    const result = await Swal.fire({
      title: 'Redeem Coins?',
      html: `
        <div style="text-align: center;">
          <p style="font-size: 20px; margin: 10px 0;">
            <strong>${redeemCoins} Coins</strong>
          </p>
          <p style="font-size: 18px;">
            = <strong style="color: #28a745;">₹${discountAmount}</strong>
          </p>
          <p class="text-muted mt-2">This amount will be applied as discount.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, redeem now!',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#28a745',
    });

    if (!result.isConfirmed) {
      return;
    }

    setRedeemLoading(true);

    try {
      const bookingId = sessionStorage.getItem("BookingId");

      const response = await axios.post(
        `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/redeemwalletpoints`,
        {
          phone: walletData.user?.phone || form?.userPhone,
          bookingId: bookingId,
          points: parseInt(redeemCoins),
          conversionRate: parseFloat(redeemAmount) / parseFloat(redeemCoins),
          amount: discountAmount
        },
        {
          headers: { Authorization: `Bearer ${datas}` },
        }
      );

      if (response.data && response.data.success) {
        setWalletData({
          ...walletData,
          walletPoints: walletData.walletPoints - parseInt(redeemCoins)
        });

        toggleRedeemModal();

        Swal.fire({
          icon: 'success',
          title: 'Redeemed Successfully!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 24px; margin: 10px 0;">
                🎉 <strong style="color: #28a745;">₹${discountAmount}</strong>
              </p>
              <p>${redeemCoins} coins redeemed</p>
            </div>
          `,
          confirmButtonColor: '#28a745',
        });

        GetBooking();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.data.message || 'Failed to redeem coins.',
        });
      }
    } catch (error) {
      console.error("Error redeeming coins:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setRedeemLoading(false);
    }
  };

  // 🔹 Fetch wallet data by phone number
  const fetchWalletData = useCallback(async (phone) => {
    if (!phone) {
      console.log("No phone number provided");
      return;
    }

    setWalletLoading(true);
    setWalletError(null);

    try {
      var token = datas;
      const response = await axios.get(
        `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/getuserwallet/${phone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Wallet API Response:", response.data);

      if (response.data && response.data.success) {
        setWalletData(response.data.data);
      } else {
        setWalletData(null);
        setWalletError("Wallet data not found");
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setWalletError(error.response?.data?.message || "Failed to fetch wallet data");
      setWalletData(null);
    } finally {
      setWalletLoading(false);
    }
  }, [datas]);

  // 🔹 Fetch all products from API
  const fetchAllProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      var token = datas;
      const response = await axios.post(
        URLS.GetProducts,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.products) {
        setAllProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [datas]);

  // 🔹 Fetch reward point data
  const fetchRewardPointData = useCallback(async () => {
    try {
      const response = await axios.get('https://api.carnivalcastle.com/v1/carnivalApi/admin/coupon/allredeem');
      if (response.data.success) {
        setRewardPointData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching reward point data:", error);
    }
  }, []);

  // 🔹 Fetch order details
  const fetchOrderDetails = useCallback(async () => {
    const bookingId = sessionStorage.getItem("BookingId");

    try {
      const response = await fetch(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/orderadmin/getorderbybookingid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: bookingId }),
        }
      );

      const result = await response.json();

      if (result.success && result.orderResult) {
        setOrderDetails(result.orderResult);
      } else {
        setOrderDetails(null);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrderDetails(null);
    }
  }, []);

  // 🔹 Main data fetching function - ✅ USES BACKEND DATA DIRECTLY
  const GetBooking = useCallback(() => {
    const BookingId = sessionStorage.getItem("BookingId");
    if (!BookingId || !datas) return;

    const data = {
      bookingId: BookingId,
    }
    var token = datas

    axios
      .post(URLS.GetPendingBookingsbyid, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log("Booking Data from Backend:", res?.data);

        const bookingData = res?.data?.data[0] || {};
        setform(bookingData);
        setPlan(res?.data?.planData[0] || {});
        setPayments(bookingData);
        setNoteDescription(bookingData?.noteDescription || "");
        setProducts(res?.data?.selectedProductData || []);

        // ✅ Check if booking has cake products
        const allProducts = [...(res?.data?.selectedProductData || []), ...(res?.data?.data[0]?.products || [])];
        const hasCake = allProducts.some(p => p.type === "cake" || p.categoryName === "cakes");
        setHasCakeProducts(hasCake);

        // ✅ Custom cake images from backend
        if (bookingData.customCakeImages && bookingData.customCakeImages.length > 0) {
          setCustomCakeImages(bookingData.customCakeImages);
        } else {
          setCustomCakeImages([]);
        }

        // ✅ Wallet redemption from backend
        if (bookingData.walletRedemption) {
          setBookingWalletRedemption({
            coins: bookingData.walletRedemption.coinsRedeemed || 0,
            amount: bookingData.walletRedemption.amountRedeemed || 0
          });
          console.log("✅ Wallet Redemption loaded:", bookingData.walletRedemption);
        }

        const selectedCaketype1 = res?.data?.productData?.filter(
          cake => cake.categoryName !== "cakes"
        ) || []
        const oneee = [...(res?.data?.selectedProductData || []), ...selectedCaketype1]
        setProducts(oneee)
        setTheater(res?.data?.theatreData[0] || {})
        setOccation(res?.data?.occasionData[0] || {})
        setAddOns(res?.data?.data[0]?.products || [])
        setTheaterimg(res?.data?.theatreData[0]?.image || "")

        if (res?.data?.slotsData && res.data.slotsData.length > 0) {
          setSlotsData(res.data.slotsData[0]?.timings || []);

          const currentTime = res?.data?.data[0]?.time;
          if (currentTime) {
            const [currentStart, currentEnd] = currentTime.split(" - ");
            const currentSlot = res.data.slotsData[0]?.timings?.find(slot =>
              `${convertTo12Hour(slot.fromtime)} - ${convertTo12Hour(slot.totime)}` === currentTime
            );
            if (currentSlot) {
              setSelectedSlotId(currentSlot._id);
            }
          }
        }

        const dataId = res?.data?.data[0]?.theatreId
        if (dataId) {
          const [startTime, endTime] = (res?.data?.data[0]?.time || "00:00 - 00:00").split(" - ")
          const start = new Date(`01/01/1970 ${startTime}`)
          const end = new Date(`01/01/1970 ${endTime}`)
          const differenceInMinutes = (end - start) / (1000 * 60)

          axios
            .post(
              URLS.GetOneTheater,
              { id: dataId },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then(res => {
              setPrice(
                differenceInMinutes == 90
                  ? res?.data?.theatre?.onehalfanhourExtraPersonPrice || 0
                  : res?.data?.theatre?.extraPersonprice || 0
              )
            })
        }

        const userPhone = res?.data?.data[0]?.userPhone;
        console.log("User Phone from booking:", userPhone);

        if (userPhone) {
          setTimeout(() => {
            fetchWalletData(userPhone);
          }, 100);
        }
      })
      .catch(error => {
        console.error("Error fetching booking:", error);
      })
  }, [datas, fetchWalletData]);

  // 🔹 Main useEffect
  useEffect(() => {
    GetBooking();
    fetchRewardPointData();
    fetchOrderDetails();
    fetchAllProducts();
  }, [GetBooking, fetchRewardPointData, fetchOrderDetails, fetchAllProducts]);

  const BookingId = sessionStorage.getItem("BookingId")

  // 🔹 State for GST modal and selection
  const [gstModal, setGstModal] = useState(false);
  const [gstType, setGstType] = useState("withGST");

  const toggleGstModal = () => setGstModal(!gstModal);

  // ✅ POS GST calculation with safety check
  const calculatePosGST = useCallback(() => {
    if (!OrderDetails?.products || OrderDetails.products.length === 0) {
      return {
        totalWithoutGST: 0,
        cgst: 0,
        sgst: 0,
        totalGST: 0,
        totalWithGST: 0
      };
    }

    let totalWithoutGST = 0;
    OrderDetails.products.forEach(item => {
      // ✅ Safety check - skip if item or amount is undefined
      if (item && item.amount !== undefined && item.amount !== null) {
        const amount = parseFloat(item.amount || 0);
        const quantity = parseFloat(item.quantity || 1);
        if (!isNaN(amount) && !isNaN(quantity)) {
          totalWithoutGST += amount * quantity;
        }
      }
    });

    const cgst = totalWithoutGST * 0.025;
    const sgst = totalWithoutGST * 0.025;
    const totalGST = cgst + sgst;
    const totalWithGST = totalWithoutGST + totalGST;

    return {
      totalWithoutGST,
      cgst,
      sgst,
      totalGST,
      totalWithGST
    };
  }, [OrderDetails?.products]);


  // ✅ Calculate GRAND TOTAL
  const calculateInvoiceGrandTotal = useCallback(() => {
    const bookingTotal = parseFloat(form?.totalPrice || 0);
    const posTotal = calculatePosGST().totalWithGST;
    const grandTotal = bookingTotal + posTotal;
    return grandTotal;
  }, [form?.totalPrice, calculatePosGST]);

// ✅ Calculate DUE AMOUNT (including offered discount)
const calculateInvoiceDueAmount = useCallback(() => {
  const grandTotal = calculateInvoiceGrandTotal();
  const advancePayment = parseFloat(form?.advancePayment || 0);
  const offeredDiscount = parseFloat(form?.offeredDiscount || 0);
  const walletRedeemedAmount = bookingWalletRedemption.amount || 0;

  // Grand Total minus Advance Paid minus Offered Discount
  let dueAmount = grandTotal - advancePayment - offeredDiscount;

  return Math.max(0, dueAmount);
}, [calculateInvoiceGrandTotal, form?.advancePayment, form?.offeredDiscount, bookingWalletRedemption.amount]);


  // 🔹 Format wallet points
  const formatWalletPoints = (points) => {
    if (points === undefined || points === null) return "0";
    return points.toString();
  };

  const handleDownload = async (type) => {
    if (!BookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Not Found',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    const gstText = type === "withGST" ? "With GST" : "Without GST";

    const result = await Swal.fire({
      title: `Download Invoice (${gstText})?`,
      text: `Do you want to download the invoice PDF ${gstText.toLowerCase()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, download',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const showGST = type === "withGST" ? "true" : "false";

      const response = await axios.post(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/invoice/${BookingId}?showGST=${showGST}`,
        {},
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${BookingId}_${type}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: `Invoice (${gstText}) download has started successfully!`,
      });

      setGstModal(false);

    } catch (error) {
      console.error("Error downloading invoice:", error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Something went wrong while downloading the invoice.',
      });
    }
  };

  const handlePrintInvoice = async (type) => {
    if (!BookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Not Found',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    const gstText = type === "withGST" ? "With GST" : "Without GST";

    const result = await Swal.fire({
      title: `Print Invoice (${gstText})?`,
      text: `Do you want to print the invoice ${gstText.toLowerCase()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, print',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const showGST = type === "withGST" ? "true" : "false";

      const response = await axios.post(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/invoice/${BookingId}?showGST=${showGST}`,
        {},
        {
          responseType: 'blob',
        }
      );

      // Create a blob from the PDF response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Open PDF in a new window for printing
      const printWindow = window.open(blobUrl, '_blank');

      if (printWindow) {
        // Wait for the window to load then print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };

        Swal.fire({
          icon: 'success',
          title: 'Print Started',
          text: `Invoice (${gstText}) opened for printing!`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // If popup is blocked, provide fallback
        Swal.fire({
          icon: 'warning',
          title: 'Popup Blocked',
          text: 'Please allow popups for this site to print invoices.',
          confirmButtonText: 'Download Instead',
          showCancelButton: true,
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            // Fallback to download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `invoice_${BookingId}_${type}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          }
        });
      }

      // Clean up the blob URL after some time
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 60000); // Clean up after 1 minute

    } catch (error) {
      console.error("Error printing invoice:", error);
      Swal.fire({
        icon: 'error',
        title: 'Print Failed',
        text: 'Something went wrong while printing the invoice.',
      });
    }
  };

  const handleDownloadWithGSTSelection = () => {
    setGstModal(true);
  };

  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (type, index, data) => {
    setEditType(type);
    setEditIndex(index);
    setEditData({ ...data });
    setShowModal(true);
  };

  const handleModalSave = async () => {
    const result = await Swal.fire({
      title: 'Update Product?',
      text: 'Are you sure you want to update this product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    const bookingId = sessionStorage.getItem("BookingId");
    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Missing',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    try {
      const updatedProduct = {
        _id: editData._id,
        quantity: parseInt(editData.quantity),
      };

      const res = await axios.put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatebookingproducts/${bookingId}`,
        { products: [updatedProduct] }
      );

      if (res.data && res.data.message === "Products updated successfully") {
        setShowModal(false);

        Swal.fire({
          title: "Success!",
          text: "Product has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (editType === "addon") {
          const updatedAddOns = [...AddOns];
          updatedAddOns[editIndex] = { ...editData };
          setAddOns(updatedAddOns);
        } else if (editType === "combo") {
          const updatedProducts = [...Products];
          updatedProducts[editIndex] = { ...editData };
          setProducts(updatedProducts);
        }

      } else {
        Swal.fire('Error', 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire('Error', 'Something went wrong while updating the product.', 'error');
    }
  };

  // ========== NEW: POS Product Edit Function ==========
  const [editPosProductModal, setEditPosProductModal] = useState(false);
  const [editPosProductData, setEditPosProductData] = useState(null);
  const [editPosProductIndex, setEditPosProductIndex] = useState(null);

  const handleEditPosProduct = (product, index) => {
    setEditPosProductData({ ...product });
    setEditPosProductIndex(index);
    setEditPosProductModal(true);
  };

  // const handleSavePosProduct = async () => {
  //   const result = await Swal.fire({
  //     title: 'Update POS Product?',
  //     text: 'Are you sure you want to update this POS product?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, update it!',
  //     cancelButtonText: 'No, cancel'
  //   });

  //   if (!result.isConfirmed) {
  //     return;
  //   }

  //   const bookingId = sessionStorage.getItem("BookingId");
  //   if (!bookingId) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Booking ID Missing',
  //       text: 'Booking ID is missing. Please try again.',
  //     });
  //     return;
  //   }

  //   try {
  //     // Prepare updated products array
  //     const updatedProducts = [...OrderDetails.products];
  //     updatedProducts[editPosProductIndex] = {
  //       ...editPosProductData,
  //       amount: parseFloat(editPosProductData.amount),
  //       quantity: parseFloat(editPosProductData.quantity)
  //     };

  //     const response = await axios.put(
  //       `https://api.carnivalcastle.com/v1/carnivalApi/admin/order/updateposproduct/${bookingId}`,
  //       {
  //         products: updatedProducts
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${datas}` }
  //       }
  //     );

  //     if (response.data && response.data.success) {
  //       setOrderDetails({
  //         ...OrderDetails,
  //         products: updatedProducts
  //       });

  //       setEditPosProductModal(false);
  //       setEditPosProductData(null);
  //       setEditPosProductIndex(null);

  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Success!',
  //         text: 'POS product updated successfully!',
  //       });

  //       // Refresh order details
  //       fetchOrderDetails();
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Failed',
  //         text: response.data.message || 'Failed to update POS product.',
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating POS product:", error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: error.response?.data?.message || 'Something went wrong while updating the POS product.',
  //     });
  //   }
  // };

  // Updated Delete Function
  const handleDeletePosProduct = async (productId, index) => {
    const result = await Swal.fire({
      title: 'Delete POS Product?',
      text: 'Are you sure you want to delete this POS product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) {
      return;
    }

    const bookingId = sessionStorage.getItem("BookingId");
    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Missing',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    try {
      const response = await axios.delete(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/orderadmin/deleteposproduct`,
        {
          data: {
            bookingId: bookingId,
            productId: productId
          },
          headers: { Authorization: `Bearer ${datas}` }
        }
      );

      if (response.data && response.data.success) {
        // Remove the product from the local state
        const updatedProducts = OrderDetails.products.filter((_, i) => i !== index);
        setOrderDetails({
          ...OrderDetails,
          products: updatedProducts
        });

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'POS product has been deleted successfully!',
        });

        // Refresh order details to get updated totals
        fetchOrderDetails();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.data.message || 'Failed to delete POS product.',
        });
      }
    } catch (error) {
      console.error("Error deleting POS product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong while deleting the POS product.',
      });
    }
  };

  // Updated Edit Function
  const handleSavePosProduct = async () => {
    const result = await Swal.fire({
      title: 'Update POS Product?',
      text: 'Are you sure you want to update this POS product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    const bookingId = sessionStorage.getItem("BookingId");
    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Missing',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    try {
      const response = await axios.put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/orderadmin/editposproduct`,
        {
          bookingId: bookingId,
          productId: editPosProductData._id,
          quantity: parseFloat(editPosProductData.quantity),
          amount: parseFloat(editPosProductData.amount),
          stockName: editPosProductData.stockName
        },
        {
          headers: { Authorization: `Bearer ${datas}` }
        }
      );

      if (response.data && response.data.success) {
        // Update the product in the local state
        const updatedProducts = [...OrderDetails.products];
        updatedProducts[editPosProductIndex] = response.data.product;

        setOrderDetails({
          ...OrderDetails,
          products: updatedProducts,
          subAmount: response.data.order.subAmount,
          totalPrice: response.data.order.totalPrice,
          tax: response.data.order.tax
        });

        setEditPosProductModal(false);
        setEditPosProductData(null);
        setEditPosProductIndex(null);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'POS product updated successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.data.message || 'Failed to update POS product.',
        });
      }
    } catch (error) {
      console.error("Error updating POS product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong while updating the POS product.',
      });
    }
  };
  const Bookingid = async () => {
    const result = await Swal.fire({
      title: 'Open POS?',
      text: 'Do you want to open the POS system for this booking?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, open POS',
      cancelButtonText: 'No, cancel'
    });

    if (result.isConfirmed) {
      sessionStorage.setItem("PosID", form._id)
      sessionStorage.setItem("BookID", form._id)
      sessionStorage.setItem("PosName", form._id)
      sessionStorage.setItem("bookingdate", form?.date)
      sessionStorage.setItem("orderid", form?.orderId)
      sessionStorage.setItem("theatername", Theater?.name)

      history.push("/Pos")
    }
  }

  const handleSubmit1 = e => {
    e.preventDefault()
    editbenners()
  }

  // note api calling
  const [noteDescription, setNoteDescription] = useState("")

  const updateNote = async () => {
    if (noteDescription.trim() === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Note',
        text: 'Please write the note before submitting.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Update Note?',
      text: 'Are you sure you want to update the note description?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = datas
    const dataArray = {
      noteDescription: noteDescription,
    }

    axios
      .put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatenotedescription/${BookingId}`,
        dataArray,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Note Updated',
            text: res.data.message,
          });
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred.',
          });
        }
      })
  }

  const handleNoteChange = e => {
    setNoteDescription(e.target.value)
  }

  const editbenners = async () => {
    const result = await Swal.fire({
      title: 'Update Extra Persons?',
      text: 'Are you sure you want to update the extra persons count?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    var token = datas

    const dataArray = {
      bookingId: form._id,
      noOfPersons: Number(form2.noOfPersons),
      extraPersonPrice: AddPrice,
    }

    axios
      .put(URLS.UpdateExtraPersonStatus, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res.data.message,
            });
            setmodal_small(false)
            GetBooking()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message,
            });
          }
        }
      )
  }

  const [prevExtraPersons, setPrevExtraPersons] = useState(0);

  const handleIncrement = async () => {
    const result = await Swal.fire({
      title: 'Add Extra Person?',
      text: 'Are you sure you want to add 1 extra person?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const updatedBooking = await updateBookingApi(1);
      if (updatedBooking) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: '1 extra person added successfully!',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to add extra person',
      });
    }
  };

  const handleDecrement = async () => {
    if (prevExtraPersons > 0) {
      const result = await Swal.fire({
        title: 'Remove Extra Person?',
        text: 'Are you sure you want to remove 1 extra person?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, cancel'
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        const updatedBooking = await updateBookingApi(-1);
        if (updatedBooking) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: '1 extra person removed successfully!',
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to remove extra person',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No Extra Persons',
        text: 'No extra persons to remove',
      });
    }
  };

  const [AllOccasions, setAllOccasions] = useState([]);
  const [selectedOccasionId, setSelectedOccasionId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const fetchAllOccasions = useCallback(async () => {
    try {
      const response = await fetch("https://api.carnivalcastle.com/v1/carnivalApi/admin/occasion/getalloccasions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      setAllOccasions(data?.occasions || []);
    } catch (error) {
      console.error("Error fetching occasions:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllOccasions();
  }, [fetchAllOccasions]);

  const handleOccasionSelect = async (occasionId) => {
    setSelectedOccasionId(occasionId);
    const selected = AllOccasions.find((item) => item._id === occasionId);
    setOccation(selected);

    if (!BookingId) {
      console.error("BookingId not found in sessionStorage");
      return;
    }

    const result = await Swal.fire({
      title: 'Update Occasion?',
      text: `Are you sure you want to update the occasion to "${selected?.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updateoccasion/${BookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ occasionId: occasionId }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Occasion updated successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to update occasion',
        });
      }
    } catch (error) {
      console.error("Error during update:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred during update',
      });
    }
  };

  const updateBookingApi = async (difference) => {
    const data = {
      bookingId: BookingId,
      noOfExtraPersons: difference,
    };

    try {
      const response = await axios.put('https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/update', data);
      const updatedBooking = response.data.booking;

      setform({
        ...form,
        noOfPersons: updatedBooking.noOfPersons,
        totalPrice: updatedBooking.totalPrice,
        subTotal: updatedBooking.subTotal,
        totalExtraPersonPrice: updatedBooking.totalExtraPersonPrice,
        extraAddedPersons: updatedBooking.extraAddedPersons,
        remainingAmount: updatedBooking.remainingAmount,
      });

      setPayments({
        ...Payments,
        subTotal: updatedBooking.subTotal,
        totalPrice: updatedBooking.totalPrice,
        remainingAmount: updatedBooking.remainingAmount,
        extraAddedPersons: updatedBooking.extraAddedPersons,
        totalExtraPersonPrice: updatedBooking.totalExtraPersonPrice,
      });

      setPrevExtraPersons(updatedBooking.extraAddedPersons);

      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error.response?.data || error.message);
      throw error;
    }
  };

  const [AllPlans, setAllPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const togglePlanModal = () => setPlanModalOpen(!planModalOpen);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await axios.post("https://api.carnivalcastle.com/v1/carnivalApi/admin/plan/getallplans");
      if (res.data.success) {
        setAllPlans(res.data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans", error);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handlePlanSelect = async (planId) => {
    setSelectedPlanId(planId);
    const selected = AllPlans.find((p) => p._id === planId);

    if (!selected) return;

    const result = await Swal.fire({
      title: 'Update Plan?',
      text: `Are you sure you want to update the plan to "${selected.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    setPlan(selected);

    try {
      const res = await axios.put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updateplan/${BookingId}`,
        { planId }
      );

      if (res.data && res.data.message === "Plan updated successfully") {
        setPlan(res.data.booking?.planId);
        togglePlanModal();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Plan updated successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to update plan',
        });
      }
    } catch (error) {
      console.error("Error updating booking plan", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while updating the plan.',
      });
    }
  };

  const [bookingModal, setBookingModal] = useState(false);
  const [selectedBookingType, setSelectedBookingType] = useState(form?.type || "");

  const toggleBookingModal = () => setBookingModal(!bookingModal);

  const [date, setDate] = useState('');

  useEffect(() => {
    if (form?.date) {
      setDate(form?.date);
    }
  }, [form?.date]);

  const handleDateChange = async (e) => {
    const newDate = e.target.value;

    const result = await Swal.fire({
      title: 'Update Date?',
      text: `Are you sure you want to update the date to ${newDate}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    setDate(newDate);

    const BookingId = sessionStorage.getItem("BookingId");

    try {
      const response = await fetch(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatedate/${BookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newDate }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Date Updated",
          text: result.message,
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Conflict",
          html: `
            <p>${result.message}</p>
            ${result.conflictingBookings?.length
              ? `<ul style="text-align: left; margin-top: 10px;">
                    ${result.conflictingBookings
                .map(
                  (b) =>
                    `<li><strong>${b.name}</strong> — ${b.date} at ${b.time}</li>`
                )
                .join("")}
                  </ul>`
              : ""
            }
          `,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const convertTo12Hour = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const updateTime = async () => {
    if (!selectedSlotId) {
      Swal.fire({
        icon: 'warning',
        title: 'No Slot Selected',
        text: 'Please select a time slot first.',
      });
      return;
    }

    const selectedSlot = slotsData.find(slot => slot._id === selectedSlotId);
    if (!selectedSlot) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Slot',
        text: 'Selected slot not found.',
      });
      return;
    }

    const formattedTime = `${convertTo12Hour(selectedSlot.fromtime)} - ${convertTo12Hour(selectedSlot.totime)}`;

    const result = await Swal.fire({
      title: 'Update Time?',
      text: `Are you sure you want to update the time to ${formattedTime}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatetiming/${BookingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTime: formattedTime }),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Time Updated",
          text: result.message,
          confirmButtonColor: "#3085d6",
        });
        GetBooking();
      } else {
        Swal.fire({
          icon: "error",
          title: "Conflict Detected",
          html: `
            <p>${result.message}</p>
            ${result.conflictingBookings?.length
              ? `<ul style="text-align:left;margin-top:10px">
                    ${result.conflictingBookings
                .map(
                  (b) =>
                    `<li><strong>${b.name}</strong> — ${b.date} at ${b.time}</li>`
                )
                .join("")}
                  </ul>`
              : ""
            }
          `,
        });
      }
    } catch (error) {
      console.error("Time update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const updateBookingTypeAPI = async (bookingId, type) => {
    try {
      const res = await fetch(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatetype/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message || "Booking type updated successfully.",
        });
        return { success: true };
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Failed to update booking type.",
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error updating booking type:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong!",
      });
      return { success: false };
    }
  };

  const [theaterNameModal, setTheaterNameModal] = useState(false);
  const [allTheaters, setAllTheaters] = useState([]);
  const [updatedTheaterName, setUpdatedTheaterName] = useState(Theater?.name || "");
  const [updatedTheaterId, setUpdatedTheaterId] = useState('');

  const toggleTheaterNameModal = () => setTheaterNameModal(!theaterNameModal);

  const fetchTheaters = useCallback(async () => {
    try {
      const res = await axios.post("https://api.carnivalcastle.com/v1/carnivalApi/admin/theatre/getalltheatre");
      if (res.data.success) {
        setAllTheaters(res.data.theatres || []);
      }
    } catch (err) {
      console.error("Failed to fetch theaters:", err);
    }
  }, []);

  useEffect(() => {
    if (theaterNameModal) {
      fetchTheaters();
    }
  }, [theaterNameModal, fetchTheaters]);

  const handleTheaterSelect = async (theaterId) => {
    if (!theaterId) return;

    setUpdatedTheaterId(theaterId);

    const selectedTheater = allTheaters.find(t => t._id === theaterId);
    if (!selectedTheater) return;

    const updatedTheaterDetails = {
      name: selectedTheater.name,
      batchType: selectedTheater.batchType,
      maxPeople: selectedTheater.maxPeople,
      price: selectedTheater.price,
      offerPrice: selectedTheater.offerPrice,
      extraPersonprice: selectedTheater.extraPersonprice,
      image: selectedTheater.image,
    };

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to update the theater to "${selectedTheater.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const BookingId = sessionStorage.getItem("BookingId");

        const res = await axios.put(
          `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatetheater/${BookingId}`,
          { theatreId: theaterId }
        );

        if (res.data?.message === "Theater updated successfully") {
          setTheater(updatedTheaterDetails);
          toggleTheaterNameModal();

          await Swal.fire({
            title: 'Success!',
            text: 'Theater has been updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          GetBooking();

        } else {
          Swal.fire('Error', 'Failed to update theater.', 'error');
        }

      } catch (error) {
        console.error("Error updating theater", error);
        Swal.fire('Oops!', 'Something went wrong while updating the theater.', 'error');
      }
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState(form.status || "pending");

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleStatusChange = async (newStatus) => {
    const bookingId = sessionStorage.getItem("BookingId");

    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Not Found',
        text: 'Please make sure the Booking ID is available in session storage.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Change Status?',
      text: `Are you sure you want to change the status to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/status/${bookingId}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        setStatus(newStatus);

        Swal.fire({
          icon: 'success',
          title: 'Booking Status Updated',
          text: `Booking status has been successfully updated to ${newStatus}.`,
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error Updating Status',
        text: 'There was an error updating the booking status. Please try again later.',
      });
    }
  };

  const [productQuery, setProductQuery] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);

  const handleQuerySubmit = async () => {
    if (!productQuery.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Query',
        text: 'Please enter a query before submitting.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Submit Query?',
      text: 'Are you sure you want to submit this query?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const bookingId = sessionStorage.getItem("BookingId");

      if (!bookingId) {
        Swal.fire({
          icon: 'error',
          title: 'Booking ID Missing',
          text: 'Booking ID is missing. Please try again.',
        });
        return;
      }

      const response = await axios.post('https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/addQuery', {
        bookingId: bookingId,
        query: productQuery
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Query Submitted',
          text: 'Your query has been successfully submitted!',
        });
        setQuerySubmitted(true);
        setProductQuery("");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong',
          text: 'Please try again.',
        });
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting the query. Please try again.',
      });
    }
  };

  const handleDelete = async (type, index, data) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) {
      return;
    }

    const bookingId = sessionStorage.getItem("BookingId");
    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking ID Missing',
        text: 'Booking ID is missing. Please try again.',
      });
      return;
    }

    try {
      // Call API to delete product from backend
      const response = await axios.delete(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/deletebookingproducts/${bookingId}/${data._id}`,
        {
          headers: { Authorization: `Bearer ${datas}` }
        }
      );

      if (response.data && response.data.success) {
        // Update local state after successful deletion
        if (type === "addon") {
          const updatedAddOns = AddOns.filter((_, i) => i !== index);
          setAddOns(updatedAddOns);
        } else if (type === "combo") {
          const updatedProducts = Products.filter((_, i) => i !== index);
          setProducts(updatedProducts);
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Product has been deleted successfully!',
        });

        // Refresh booking data to get updated totals
        GetBooking();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: response.data?.message || 'Failed to delete product.',
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong while deleting the product.',
      });
    }
  };

  const updateOccasionAPI = async (bookingId, occasionId) => {
    return { success: true, data: {} };
  };

  const updatePlanAPI = async (bookingId, planId) => {
    return { success: true, data: {} };
  };

  // ✅ Helper function to format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  // ✅ Calculate per item GST for addons
  const calculateAddonItemDetails = (item) => {
    let totalWithoutGST = 0;

    if (item.type === "cake") {
      if (item.quantity === 500) {
        totalWithoutGST = parseFloat(item.price);
      } else {
        totalWithoutGST = parseFloat(item.price) * (2 * parseFloat(item.quantity));
      }
    } else {
      totalWithoutGST = parseFloat(item.price) * parseFloat(item.quantity);
    }

    const cgst = totalWithoutGST * 0.09;
    const sgst = totalWithoutGST * 0.09;
    const totalWithGST = totalWithoutGST + cgst + sgst;

    return {
      totalWithoutGST,
      cgst,
      sgst,
      totalWithGST
    };
  };

  const saveOfferedDiscount = async () => {
    if (!offeredDiscountValue || isNaN(offeredDiscountValue)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter a valid discount amount.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Save Offered Discount?',
      text: `Are you sure you want to apply ₹${offeredDiscountValue} as offered discount?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const bookingId = sessionStorage.getItem("BookingId");
      if (!bookingId) {
        Swal.fire({ icon: 'error', title: 'Booking ID Missing', text: 'Booking ID is missing.' });
        return;
      }

      const response = await axios.put(
        'https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/addoffereddiscount',
        {
          bookingId: bookingId,
          offeredDiscount: parseFloat(offeredDiscountValue)
        }
      );

      if (response.data.success) {
        const newDiscount = parseFloat(offeredDiscountValue);
        const updatedData = response.data.data; // backend se updated booking

        // ✅ UI turant update karo — backend response se
        setform(prev => ({
          ...prev,
          offeredDiscount: updatedData?.offeredDiscount ?? newDiscount,
          remainingAmount: updatedData?.remainingAmount ?? (prev.remainingAmount - newDiscount),
        }));

        setPayments(prev => ({
          ...prev,
          offeredDiscount: updatedData?.offeredDiscount ?? newDiscount,
          remainingAmount: updatedData?.remainingAmount ?? (prev.remainingAmount - newDiscount),
        }));

        setOfferedDiscountModal(false);
        setOfferedDiscountValue("");

        Swal.fire({
          icon: 'success',
          title: 'Discount Saved',
          text: 'Offered discount has been successfully applied!',
        });

        GetBooking(); // background refresh bhi karo
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Save',
          text: response.data.message || 'Failed to save offered discount.',
        });
      }
    } catch (error) {
      console.error("Error saving offered discount:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while saving the offered discount.',
      });
    }
  };

  const handleProductSelect = (productId) => {
    const selectedProduct = allProducts.find(product => product._id === productId);
    if (selectedProduct) {
      setNewProduct({
        productId: selectedProduct._id,
        name: selectedProduct.name,
        image: selectedProduct.image,
        type: selectedProduct.type,
        price: selectedProduct.price,
        quantity: selectedProduct.type === 'grams' ? 500 : 1,
        categoryName: selectedProduct.categoryName,
        cakeType: selectedProduct.cakeType || '',
        cakePremiumOrNormal: selectedProduct.cakePremiumOrNormal || ''
      });
    }
  };

  const handleAddProductSubmit = async () => {
    if (!newProduct.productId || !newProduct.quantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a product and enter quantity.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Add Product?',
      text: 'Are you sure you want to add this product to the booking?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const bookingId = sessionStorage.getItem("BookingId");
      if (!bookingId) {
        Swal.fire({
          icon: 'error',
          title: 'Booking ID Missing',
          text: 'Booking ID is missing. Please try again.',
        });
        return;
      }

      // ✅ Send productId, not _id for new products
      const productToAdd = {
        productId: newProduct.productId,  // Changed from _id to productId
        quantity: parseInt(newProduct.quantity),
        price: parseFloat(newProduct.price),
        type: newProduct.type,
        name: newProduct.name
      };

      const response = await axios.put(
        `https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/updatebookingproducts/${bookingId}`,
        { products: [productToAdd] }
      );

      if (response.data && response.data.message === "Products updated successfully") {

        // Refresh booking data to get updated products
        await GetBooking();

        // Close modal and reset form
        setShowAddProductModal(false);
        setNewProduct({
          productId: "",
          name: "",
          image: "",
          type: "",
          price: "",
          quantity: "",
          categoryName: "",
          cakeType: "",
          cakePremiumOrNormal: ""
        });

        Swal.fire({
          title: "Success!",
          text: "Product has been added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

      } else {
        Swal.fire('Error', response.data?.message || 'Failed to add product', 'error');
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire('Error', error.response?.data?.message || 'Something went wrong while adding the product.', 'error');
    }
  };
  const refreshWalletData = () => {
    const userPhone = form?.userPhone;
    if (userPhone) {
      fetchWalletData(userPhone);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Carnival Castle Admin"
            breadcrumbItem="View Booking"
          />
          <Row>
            <Col>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret color="secondary" className="mb-3 m-1" style={{ float: "right" }}>
                  Change Status
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => handleStatusChange('booking-confirmed')}>Confirmed</DropdownItem>
                  <DropdownItem onClick={() => handleStatusChange('cancelled')}>Cancelled</DropdownItem>
                  <DropdownItem onClick={() => handleStatusChange('completed')}>Completed</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {walletData && walletData.walletPoints > 0 && (
                <Button
                  onClick={toggleRedeemModal}
                  className="mb-3 m-1"
                  style={{ float: "right" }}
                  color="success"
                >
                  <i className="fas fa-coins me-2"></i> {walletData.walletPoints} coins
                </Button>
              )}

              {walletData && (
                <Button
                  onClick={refreshWalletData}
                  className="mb-3 m-1"
                  style={{ float: "right" }}
                  color="info"
                  outline
                >
                  <i className="fas fa-sync-alt me-2"></i> Refresh
                </Button>
              )}

              <Button
                onClick={toggleOfferedDiscountModal}
                className="mb-3 m-1"
                style={{ float: "right" }}
                color="info"
              >
                <i className="fas fa-tag me-2"></i> Offered Discount
              </Button>

              {/* ========== NEW: Custom Cake Upload Button ========== */}
              {hasCakeProducts && (
                <Button
                  onClick={toggleCustomCakeModal}
                  className="mb-3 m-1"
                  style={{ float: "right" }}
                  color="warning"
                >
                  <i className="fas fa-cake-candles me-2"></i> Upload Custom Cake
                </Button>
              )}

              <Button
                onClick={() => Bookingid()}
                className="mb-3 m-1"
                style={{ float: "right" }}
                color="warning"
              >
                Add POS
              </Button>

              <Button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Go Back?',
                    text: 'Are you sure you want to go back?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, go back',
                    cancelButtonText: 'No, stay here'
                  });

                  if (result.isConfirmed) {
                    history.push("/Confirmedbookings");
                  }
                }}
                className="mb-3 m-1"
                style={{ float: "right" }}
                color="primary"
              >
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </Button>
            </Col>
          </Row>

          {/* ========== NEW: Custom Cake Upload Modal ========== */}
          <Modal isOpen={customCakeModal} toggle={toggleCustomCakeModal} size="lg">
            <ModalHeader toggle={toggleCustomCakeModal}>
              <div className="d-flex align-items-center">
                <i className="fas fa-cake-candles text-warning me-2" style={{ fontSize: '24px' }}></i>
                <span>Upload Custom Cake Image</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label className="fw-bold">Select Custom Cake Image</Label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                    onChange={handleCustomCakeFileChange}
                    disabled={customCakeUploading}
                  />
                  <small className="text-muted">
                    Allowed formats: JPG, JPEG, PNG, GIF, BMP, WEBP (Max size: 10MB)
                  </small>
                </FormGroup>

                {previewUrl && (
                  <div className="mt-3 text-center">
                    <p className="fw-bold mb-2">Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Custom Cake Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '5px'
                      }}
                    />
                    <p className="mt-2 text-muted">{customCakeFile?.name}</p>
                  </div>
                )}

                {customCakeImages.length > 0 && (
                  <div className="mt-4">
                    <p className="fw-bold mb-2">Previously Uploaded Custom Cakes:</p>
                    <Row>
                      {customCakeImages.map((img, index) => (
                        <Col md={4} key={index} className="mb-3">
                          <div className="border p-2 rounded text-center">
                            <img
                              src={URLS.Base + img.image}
                              alt={`Custom Cake ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '5px'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/100?text=Error";
                              }}
                            />
                            <small className="d-block mt-1 text-truncate">
                              {img.originalName || `Image ${index + 1}`}
                            </small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Form>

              <div className="mt-4 d-flex justify-content-end gap-2">
                <Button
                  color="secondary"
                  onClick={toggleCustomCakeModal}
                  disabled={customCakeUploading}
                >
                  <i className="fas fa-times me-2"></i> Close
                </Button>
                <Button
                  color="warning"
                  onClick={handleCustomCakeUpload}
                  disabled={!customCakeFile || customCakeUploading}
                  className="px-4"
                >
                  {customCakeUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload me-2"></i> Upload Image
                    </>
                  )}
                </Button>
              </div>
            </ModalBody>
          </Modal>

          <Card className="mb-4">
            <CardBody>
              <h5 className="text-primary pt-3">Booking Details :</h5>
              <Row className="mt-4">
                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-user-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">User Name</h6>
                      <p className="text-muted fs-14 mb-0">{form?.userName || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-phone text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Phone</h6>
                      <p className="text-muted fs-14 mb-0">{form?.userPhone || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-mail-send text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Email</h6>
                      <p className="text-muted fs-14 mb-0">{form?.userEmail || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-package text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Plan Name</h6>
                      <p className="text-muted fs-14 mb-0">{form?.planName || "Basic Plan"}</p>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-calendar-event text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Occasion Name</h6>
                      <p className="text-muted fs-14 mb-0">{form?.occasionName || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-calendar text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Event Date</h6>
                      <p className="text-muted fs-14 mb-0">{form?.date || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-time-five text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Event Time</h6>
                      <p className="text-muted fs-14 mb-0">{form?.time || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-barcode-reader text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Order ID</h6>
                      <p className="text-muted fs-14 mb-0">{form?.orderId || "N/A"}</p>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-gift text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Referral Code</h6>
                      <p className="text-muted fs-14 mb-0">{form?.referredCode || "Not Used"}</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-discount text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Offered Discount</h6>
                      <p className="text-muted fs-14 mb-0">
                        ₹{formatCurrency(form?.offeredDiscount || 0)}
                      </p>
                    </div>
                  </div>
                </Col>

                {bookingWalletRedemption.coins > 0 && (
                  <Col md={3}>
                    <div className="d-flex align-items-start">
                      <i className="fas fa-coins text-warning fs-4"></i>
                      <div className="ms-3">
                        <h6 className="fs-14 mb-2">Coins Redeemed</h6>
                        <p className="text-muted fs-14 mb-0">
                          {bookingWalletRedemption.coins} coins = ₹{formatCurrency(bookingWalletRedemption.amount)}
                        </p>
                      </div>
                    </div>
                  </Col>
                )}

                {/* ✅ GST Details from Backend */}
                <Col md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bx bx-tax text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">GST Details</h6>
                      <p className="text-muted fs-14 mb-0">
                        {form?.showGst ? (
                          <>CGST: ₹{formatCurrency(form?.cgstAmount)} | SGST: ₹{formatCurrency(form?.sgstAmount)}</>
                        ) : (
                          "GST Not Applied"
                        )}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* ========== NEW: Display Custom Cake Images ========== */}
              {customCakeImages.length > 0 && (
                <Row className="mt-3">
                  <Col md={12}>
                    <div className="d-flex align-items-start">
                      <i className="fas fa-cake-candles text-warning fs-4"></i>
                      <div className="ms-3">
                        <h6 className="fs-14 mb-2">Custom Cake Images</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {customCakeImages.map((img, index) => (
                            <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                              <img
                                src={URLS.Base + img.image}
                                alt={`Custom Cake ${index + 1}`}
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '5px',
                                  border: '1px solid #ddd'
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/80?text=Error";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>

          {/* Offered Discount Modal */}
          <Modal isOpen={offeredDiscountModal} toggle={toggleOfferedDiscountModal}>
            <ModalHeader toggle={toggleOfferedDiscountModal}>
              Add Offered Discount
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Enter Offered Discount Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter discount amount"
                  value={offeredDiscountValue}
                  onChange={(e) => setOfferedDiscountValue(e.target.value)}
                />
                <small className="text-muted">
                  Current discount: ₹{formatCurrency(form?.offeredDiscount || 0)}
                </small>
              </FormGroup>
              <div className="d-flex justify-content-end mt-3">
                <Button
                  color="secondary"
                  className="me-2"
                  onClick={toggleOfferedDiscountModal}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={saveOfferedDiscount}
                >
                  Save Discount
                </Button>
              </div>
            </ModalBody>
          </Modal>

          {/* 🔹 REDEEM COINS MODAL */}
          <Modal isOpen={redeemModal} toggle={toggleRedeemModal} size="md">
            <ModalHeader toggle={toggleRedeemModal}>
              <div className="d-flex align-items-center">
                <i className="fas fa-coins text-warning me-2" style={{ fontSize: '24px' }}></i>
                <span>Redeem Coins</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="bg-light p-4 rounded-3 mb-4 text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="bg-warning rounded-circle p-3 text-white me-3">
                    <i className="fas fa-coins fa-2x"></i>
                  </div>
                  <div>
                    <small className="text-muted d-block">Available Coins</small>
                    <h2 className="mb-0 text-warning fw-bold">
                      {formatWalletPoints(walletData?.walletPoints)}
                    </h2>
                  </div>
                </div>
              </div>

              <Form>
                <FormGroup>
                  <Label className="fw-bold">
                    <i className="fas fa-coins me-2 text-warning"></i>
                    Coins to Redeem
                  </Label>
                  <div className="d-flex">
                    <Input
                      type="number"
                      placeholder="Enter coins"
                      value={redeemCoins}
                      onChange={handleRedeemCoinsChange}
                      min="1"
                      max={walletData?.walletPoints || 0}
                      className="me-2"
                      disabled={redeemLoading}
                    />
                    <Button
                      color="info"
                      onClick={handleMaxRedeem}
                      disabled={!walletData || redeemLoading}
                      style={{ minWidth: '80px' }}
                    >
                      Max
                    </Button>
                  </div>
                  <small className="text-muted">
                    Max: {formatWalletPoints(walletData?.walletPoints)} coins
                  </small>
                </FormGroup>

                <FormGroup>
                  <Label className="fw-bold">
                    <i className="fas fa-rupee-sign me-2 text-success"></i>
                    Redeem Amount (₹)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={redeemAmount}
                    onChange={handleRedeemAmountChange}
                    min="1"
                    step="0.01"
                    disabled={redeemLoading}
                  />
                  <small className="text-muted">
                    Enter the amount you want to redeem for {redeemCoins || '0'} coins
                  </small>
                </FormGroup>

                {redeemCoins > 0 && redeemAmount > 0 && (
                  <div className="alert alert-success mt-3 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{redeemCoins} coins</span>
                      <span className="mx-2">=</span>
                      <span className="fw-bold text-success fs-5">
                        ₹{parseFloat(redeemAmount).toFixed(2)}
                      </span>
                    </div>
                    <small className="d-block mt-2">
                      Rate: ₹{(parseFloat(redeemAmount) / parseFloat(redeemCoins)).toFixed(2)} per coin
                    </small>
                  </div>
                )}
              </Form>

              <div className="mt-4 d-flex justify-content-end gap-2">
                <Button
                  color="secondary"
                  onClick={toggleRedeemModal}
                  disabled={redeemLoading}
                >
                  <i className="fas fa-times me-2"></i> Cancel
                </Button>
                <Button
                  color="success"
                  onClick={handleRedeemSubmit}
                  disabled={!redeemCoins || !redeemAmount || parseFloat(redeemCoins) <= 0 || parseFloat(redeemAmount) <= 0 || redeemLoading || parseFloat(redeemCoins) > walletData?.walletPoints}
                  className="px-4"
                >
                  {redeemLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle me-2"></i> Redeem
                    </>
                  )}
                </Button>
              </div>
            </ModalBody>
          </Modal>

          <Card>
            <CardBody>
              <h5 className="mb-3 text-primary">Occasion Details :</h5>
              <Row>
                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Occasion Image</h6>
                      <p className="text-muted fs-14 mb-0">
                        <img
                          src={URLS.Base + (Occation?.image || "")}
                          style={{ width: "80px" }}
                          alt="Occasion"
                        />
                      </p>
                    </div>
                  </div>
                </Col>

                <Col className="mt-2 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex">
                      <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                      <div className="ms-3">
                        <h6 className="fs-14 mb-2">Occasion Name</h6>
                        <p className="text-muted fs-14 mb-0">{Occation?.name || "Not Selected"}</p>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary" onClick={toggleModal}>
                      Edit
                    </button>
                  </div>

                  <Modal isOpen={modalOpen} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Select Occasion</ModalHeader>
                    <ModalBody>
                      <FormGroup>
                        <Label>Occasion</Label>
                        <Input
                          type="select"
                          onChange={(e) => setSelectedOccasionId(e.target.value)}
                          value={selectedOccasionId}
                        >
                          <option value="">Select</option>
                          {AllOccasions.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                      <div className="text-end">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={async () => {
                            if (!selectedOccasionId) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'No Selection',
                                text: 'Please select an occasion first.',
                              });
                              return;
                            }

                            const confirm = await Swal.fire({
                              title: 'Update Occasion?',
                              text: 'Do you want to update the occasion?',
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Yes, update it!',
                              cancelButtonText: 'No, cancel'
                            });

                            if (confirm.isConfirmed) {
                              const res = await updateOccasionAPI(form._id, selectedOccasionId);
                              if (res.success) {
                                setOccation(res.data);
                                toggleModal();
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Success',
                                  text: 'Occasion updated successfully!',
                                });
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Failed',
                                  text: 'Failed to update occasion.',
                                });
                              }
                            }
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </ModalBody>
                  </Modal>
                </Col>

                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Person Name</h6>
                      <p className="text-muted fs-14 mb-0">{form?.personName || "N/A"}</p>
                    </div>
                  </div>
                </Col>

                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Price</h6>
                      <p className="text-muted fs-14 mb-0">{formatCurrency(Occation?.price)}</p>
                    </div>
                  </div>
                </Col>

                <Col className="mt-2 mb-3">
                  <div className="d-flex">
                    <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                    <div className="ms-3">
                      <h6 className="fs-14 mb-2">Status</h6>
                      <p className="text-muted fs-14 mb-0">{Occation?.status || "N/A"}</p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Plan Details */}
              {form?.planId && Plan && (
                <>
                  <hr />
                  <h5 className="mb-3 text-primary">Plan Details :</h5>
                  <Row>
                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex">
                          <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">Plan Name</h6>
                            <p className="text-muted fs-14 mb-0">{Plan?.name || form?.planName || "Basic Plan"}</p>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={togglePlanModal}
                        >
                          Edit
                        </button>
                      </div>
                    </Col>

                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Plan Price</h6>
                          <p className="text-muted fs-14 mb-0">{Plan?.price || "N/A"}</p>
                        </div>
                      </div>
                    </Col>

                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Plan Offer Price</h6>
                          <p className="text-muted fs-14 mb-0">{Plan?.offerPrice || "N/A"}</p>
                        </div>
                      </div>
                    </Col>

                    <Col md={3} className="mt-2 mb-3">
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Theater Price Included</h6>
                          <p className="text-muted fs-14 mb-0">
                            {Plan?.theatrePriceIncluded ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {Plan?.benefits && Plan.benefits.length > 0 && (
                    <Row>
                      <Col md={12} className="mt-2 mb-3">
                        <div className="d-flex">
                          <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">Plan Benefits</h6>
                            <ul className="text-muted fs-14 mb-0">
                              {Plan.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}

                  <Modal isOpen={planModalOpen} toggle={togglePlanModal}>
                    <ModalHeader toggle={togglePlanModal}>Select Plan</ModalHeader>
                    <ModalBody>
                      <FormGroup>
                        <Label>Select Plan</Label>
                        <Input
                          type="select"
                          value={selectedPlanId}
                          onChange={(e) => setSelectedPlanId(e.target.value)}
                        >
                          <option value="">Select</option>
                          {AllPlans?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>

                      <div className="text-end">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={async () => {
                            if (!selectedPlanId) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'No Selection',
                                text: 'Please select a plan first.',
                              });
                              return;
                            }

                            const confirm = await Swal.fire({
                              title: 'Update Plan?',
                              text: 'Do you want to update the plan?',
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Yes, update it!',
                              cancelButtonText: 'No, cancel'
                            });

                            if (confirm.isConfirmed) {
                              const res = await updatePlanAPI(form._id, selectedPlanId);
                              if (res.success) {
                                setPlan(res.data);
                                togglePlanModal();
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Success',
                                  text: 'Plan updated successfully!',
                                });
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Failed',
                                  text: 'Failed to update plan. Please try again.',
                                });
                              }
                            }
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </ModalBody>
                  </Modal>
                </>
              )}
            </CardBody>
          </Card>

          <Row>
            <Col md={4}>
              <Card>
                <CardBody>
                  <h5 className="text-primary">Slot Details:</h5>
                  <ul className="list-unstyled mt-4">
                    <li>
                      <div className="d-flex">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Date</h6>
                          <p className="text-muted fs-14 mb-0">{form?.date || "N/A"}</p>
                          <div className="mt-2">
                            <input
                              type="date"
                              className="form-control fs-14"
                              value={date}
                              onChange={handleDateChange}
                            />
                          </div>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">Time</h6>
                          <p className="text-muted fs-14 mb-2">{form?.time || "N/A"}</p>
                          <div className="mt-2">
                            <div className="mb-2">
                              <Label>Select Time Slot:</Label>
                              <Input
                                type="select"
                                className="form-control fs-14"
                                value={selectedSlotId}
                                onChange={(e) => setSelectedSlotId(e.target.value)}
                              >
                                <option value="">Select a time slot</option>
                                {slotsData
                                  .filter(slot => slot.isActive)
                                  .map((slot) => (
                                    <option key={slot._id} value={slot._id}>
                                      {convertTo12Hour(slot.fromtime)} - {convertTo12Hour(slot.totime)}
                                    </option>
                                  ))}
                              </Input>
                            </div>
                            <button
                              onClick={updateTime}
                              className="btn btn-sm btn-primary"
                              disabled={!selectedSlotId}
                            >
                              Update Time
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="d-flex pt-4">
                        <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                        <div className="ms-3">
                          <h6 className="fs-14 mb-2">No. of Persons</h6>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn text-white me-2"
                              style={{
                                backgroundColor: "#6a1b9a",
                                borderColor: "#6a1b9a",
                                padding: "8px 12px",
                                fontSize: "2px",
                              }}
                              onClick={handleDecrement}
                            >
                              <i className="fas fa-minus" style={{ fontSize: "10px" }}></i>
                            </button>
                            <p className="text-muted fs-14 mb-0 mx-2">
                              {form?.noOfPersons || 0}
                            </p>
                            <button
                              className="btn text-white ms-2"
                              style={{
                                backgroundColor: "#6a1b9a",
                                borderColor: "#6a1b9a",
                                padding: "8px 12px",
                                fontSize: "2px",
                              }}
                              onClick={handleIncrement}
                            >
                              <i className="fas fa-plus" style={{ fontSize: "10px" }}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="d-flex pt-4 justify-content-between align-items-start">
                        <div className="d-flex">
                          <i className="bx bx-right-arrow-circle text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-1">Booking Type:</h6>
                            <p className="text-muted fs-14 mb-0">
                              {form?.type ? form?.type : "-"}
                            </p>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={toggleBookingModal}
                        >
                          Edit
                        </button>
                      </div>

                      <Modal isOpen={bookingModal} toggle={toggleBookingModal}>
                        <ModalHeader toggle={toggleBookingModal}>
                          Select Booking Type
                        </ModalHeader>
                        <ModalBody>
                          <FormGroup>
                            <Label>Booking Type</Label>
                            <Input
                              type="select"
                              value={selectedBookingType}
                              onChange={(e) => setSelectedBookingType(e.target.value)}
                            >
                              <option value="">Select</option>
                              <option value="normal">Normal</option>
                              <option value="combo">Combo</option>
                            </Input>
                          </FormGroup>
                          <div className="text-end">
                            <Button
                              color="primary"
                              size="sm"
                              onClick={async () => {
                                if (!selectedBookingType) {
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'No Selection',
                                    text: 'Please select a booking type first.',
                                  });
                                  return;
                                }

                                const confirmUpdate = await Swal.fire({
                                  title: 'Update Booking Type?',
                                  text: 'Do you want to update the booking type?',
                                  icon: 'question',
                                  showCancelButton: true,
                                  confirmButtonText: 'Yes, update it!',
                                  cancelButtonText: 'No, cancel'
                                });

                                if (confirmUpdate.isConfirmed) {
                                  const res = await updateBookingTypeAPI(form._id, selectedBookingType);
                                  if (res.success) {
                                    setform({ ...form, type: selectedBookingType });
                                    toggleBookingModal();
                                    Swal.fire({
                                      icon: 'success',
                                      title: 'Success',
                                      text: 'Booking type updated successfully!',
                                    });
                                  } else {
                                    Swal.fire({
                                      icon: 'error',
                                      title: 'Failed',
                                      text: 'Failed to update booking type.',
                                    });
                                  }
                                }
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </ModalBody>
                      </Modal>
                    </li>
                  </ul>
                  <hr />
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <CardBody>
                  <h5 className="text-primary">Theater Details:</h5>
                  <Col md={12} className="text-center">
                    <img
                      src={URLS.Base + (Theater?.image || "")}
                      alt="Theater"
                      style={{ height: "150px", width: "100%" }}
                    />
                  </Col>

                  <ul className="list-unstyled mt-3">
                    <li>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <i className="bx bx-store-alt text-primary fs-4"></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">Theater Name</h6>
                            <p className="text-muted fs-14 mb-0">
                              {Theater?.name || "Not selected"}
                            </p>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={toggleTheaterNameModal}
                        >Edit</button>
                      </div>

                      <Modal isOpen={theaterNameModal} toggle={toggleTheaterNameModal}>
                        <ModalHeader toggle={toggleTheaterNameModal}>
                          Select Theater
                        </ModalHeader>
                        <ModalBody>
                          <FormGroup>
                            <Label>Select Theater</Label>
                            <Input
                              type="select"
                              value={updatedTheaterId}
                              onChange={(e) => setUpdatedTheaterId(e.target.value)}
                            >
                              <option value="">-- Select --</option>
                              {allTheaters.map((t) => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                              ))}
                            </Input>
                          </FormGroup>

                          <div className="text-end mt-3">
                            <Button
                              color="primary"
                              size="sm"
                              disabled={!updatedTheaterId}
                              onClick={async () => {
                                const confirm = await Swal.fire({
                                  title: 'Update Theater?',
                                  text: 'Do you want to update the theater?',
                                  icon: 'question',
                                  showCancelButton: true,
                                  confirmButtonText: 'Yes, update it!',
                                  cancelButtonText: 'No, cancel'
                                });

                                if (confirm.isConfirmed) {
                                  await handleTheaterSelect(updatedTheaterId);
                                }
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </ModalBody>
                      </Modal>
                    </li>

                    {[
                      ["Batch Type", Theater?.batchType, "bx-map"],
                      ["Seats", Theater?.maxPeople, "bx-handicap"],
                      ["Price", Theater?.price?.toFixed(2), "bx-wallet-alt"],
                      ["Offer Price", Theater?.offerPrice?.toFixed(2), "bx-wallet-alt"],
                      ["Extra Person Price", Theater?.extraPersonprice?.toFixed(2), "bx-handicap"],
                    ].map(([label, value, icon], idx) => (
                      <li className="mt-3" key={idx}>
                        <div className="d-flex">
                          <i className={`bx ${icon} text-primary fs-4`}></i>
                          <div className="ms-3">
                            <h6 className="fs-14 mb-2">{label}</h6>
                            <p className="text-muted fs-14 mb-0">{value ?? "-"}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Col>

            <Col md={4}>
              {/* Payments Table Section - ✅ USING BACKEND DATA */}
              <Card>
                <CardBody>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="text-primary mb-3">Payments Summary (Matches Invoice):</h5>

                      <div className="d-flex gap-2 mb-3">
                        <Button
                          className="btn btn-success flex-fill"
                          onClick={handleDownloadWithGSTSelection}
                        >
                          <i className="fas fa-file-download me-2"></i>
                          Download Invoice
                        </Button>

                        <Button
                          className="btn btn-warning flex-fill"
                          onClick={() => setGstModal(true)}
                        >
                          <i className="fas fa-print me-2"></i>
                          Print Invoice
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Table hover className="table table-bordered">
                    <tbody>
                      <tr className="text-center">
                        <th>Transaction Id</th>
                        <td>{Payments?.transactionId || "N/A"}</td>
                      </tr>
                      <tr className="text-center">
                        <th>Transaction Status</th>
                        <td>{Payments?.transactionStatus || "N/A"}</td>
                      </tr>

                      {/* ✅ Using Backend GST fields */}
                      <tr className="text-center">
                        <th>Subtotal</th>
                        <td>₹{formatCurrency(form?.subTotal)}</td>
                      </tr>

                      <tr className="text-center">
                        <th>CGST @9%</th>
                        <td>+ ₹{formatCurrency(form?.cgstAmount)}</td>
                      </tr>

                      <tr className="text-center">
                        <th>SGST @9%</th>
                        <td>+ ₹{formatCurrency(form?.sgstAmount)}</td>
                      </tr>

                      <tr className="text-center">
                        <th><strong>Booking Total (With 18% GST)</strong></th>
                        <td><strong>₹{formatCurrency(form?.totalPrice)}</strong></td>
                      </tr>

                      {/* POS GST */}
                      <tr className="text-center">
                        <th>POS CGST @2.5%</th>
                        <td>+ ₹{formatCurrency(calculatePosGST().cgst)}</td>
                      </tr>

                      <tr className="text-center">
                        <th>POS SGST @2.5%</th>
                        <td>+ ₹{formatCurrency(calculatePosGST().sgst)}</td>
                      </tr>

                      <tr className="text-center">
                        <th><strong>GRAND TOTAL (All GST Included)</strong></th>
                        <td><strong>₹{formatCurrency(calculateInvoiceGrandTotal())}</strong></td>
                      </tr>

                      <tr className="text-center">
                        <th>Coupon Code ({Payments?.couponCode || "None"})</th>
                        <td>- ₹{formatCurrency(Payments?.couponAmount)}</td>
                      </tr>

                      <tr className="text-center">
                        <th>Offered Discount</th>
                        <td>- ₹{formatCurrency(form?.offeredDiscount || 0)}</td>
                      </tr>

                      {bookingWalletRedemption.coins > 0 && (
                        <tr className="text-center">
                          <th>Coins Redeemed ({bookingWalletRedemption.coins} coins)</th>
                          <td>- ₹{formatCurrency(bookingWalletRedemption.amount)}</td>
                        </tr>
                      )}

                      <tr className="text-center">
                        <th>Payment Type</th>
                        <td>{Payments?.paymentType || "N/A"}</td>
                      </tr>

                      <tr className="text-center">
                        <th>Advance Amount Paid</th>
                        <td>- ₹{formatCurrency(form?.advancePayment)}</td>
                      </tr>

                      <tr className="text-center">
                        <th><strong>DUE PAYMENT</strong></th>
                        <td><strong>₹{formatCurrency(calculateInvoiceDueAmount())}</strong></td>
                      </tr>
                      <tr className="text-center">
                        <th>Extra Added Persons</th>
                        <td>{form?.extraAddedPersons || Payments?.extraAddedPersons || "0"}</td>
                      </tr>

                      <tr className="text-center">
                        <th>Total Extra Person Price</th>
                        <td>₹{formatCurrency(Payments?.totalExtraPersonPrice)}</td>
                      </tr>
                    </tbody>
                  </Table>

                  {/* ✅ Summary using Backend Data */}
                  <div className="mt-3 p-2" style={{ backgroundColor: "#e8f5e9", borderRadius: "5px", border: "1px solid #4caf50" }}>
                    <p className="mb-1"><strong>✓ From Backend:</strong></p>
                    <div className="row">
                      <div className="col-md-12">
                        <ul className="mb-1" style={{ fontSize: "12px" }}>
                          <li>Subtotal: ₹{formatCurrency(form?.subTotal)}</li>
                          <li>CGST: ₹{formatCurrency(form?.cgstAmount)}</li>
                          <li>SGST: ₹{formatCurrency(form?.sgstAmount)}</li>
                          <li><strong>Booking Total: ₹{formatCurrency(form?.totalPrice)}</strong></li>
                          {form?.showGst === false && (
                            <li className="text-danger"><strong>GST Not Applied</strong></li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* User Coins Section */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-primary mb-0">
                      <i className="fas fa-coins me-2"></i>
                      User Coins
                    </h5>
                    <div>
                      {walletData && walletData.walletPoints > 0 && (
                        <Button
                          color="success"
                          size="sm"
                          onClick={toggleRedeemModal}
                          className="me-2"
                        >
                          <i className="fas fa-coins me-1"></i> Redeem ({walletData.walletPoints} coins)
                        </Button>
                      )}
                      {walletLoading && (
                        <span className="badge bg-info">
                          <i className="fas fa-spinner fa-spin me-1"></i> Loading...
                        </span>
                      )}
                      {form?.userPhone && !walletLoading && (
                        <Button
                          color="outline-primary"
                          size="sm"
                          onClick={refreshWalletData}
                        >
                          <i className="fas fa-sync-alt me-1"></i> Refresh
                        </Button>
                      )}
                    </div>
                  </div>

                  {walletLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Fetching wallet data...</p>
                    </div>
                  ) : walletError ? (
                    <div className="alert alert-warning mb-0">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle me-3 fa-2x"></i>
                        <div>
                          <h6 className="alert-heading mb-1">Unable to load wallet data</h6>
                          <p className="mb-0">{walletError}</p>
                        </div>
                      </div>
                    </div>
                  ) : walletData ? (
                    <div className="wallet-details">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="p-5 rounded-3 text-center" style={{ backgroundColor: '#fff3e0' }}>
                            <div className="bg-warning rounded-circle p-4 d-inline-flex mb-3">
                              <i className="fas fa-coins fa-3x text-white"></i>
                            </div>
                            <h3 className="mb-2">Available Coins</h3>
                            <h1 className="display-3 fw-bold text-warning mb-0">
                              {formatWalletPoints(walletData.walletPoints)}
                            </h1>
                            <p className="text-muted mt-3">
                              {walletData.user?.name || form?.userName || 'User'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {bookingWalletRedemption.coins > 0 && (
                        <div className="mt-4">
                          <div className="alert alert-success">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-check-circle me-3 fa-2x"></i>
                              <div>
                                <strong>Recently Redeemed:</strong>
                                <p className="mb-0">{bookingWalletRedemption.coins} coins = ₹{formatCurrency(bookingWalletRedemption.amount)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle d-inline-flex p-4">
                          <i className="fas fa-coins fa-4x text-muted"></i>
                        </div>
                      </div>
                      <h6 className="text-muted mb-2">No wallet data available</h6>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* GST Selection Modal */}
          <Modal isOpen={gstModal} toggle={toggleGstModal}>
            <ModalHeader toggle={toggleGstModal}>
              Select Invoice Type
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Select GST Type for Invoice</Label>
                <Input
                  type="select"
                  value={gstType}
                  onChange={(e) => setGstType(e.target.value)}
                >
                  <option value="withGST">With GST (Includes all taxes)</option>
                  <option value="withoutGST">Without GST (Taxes will be charged separately)</option>
                </Input>
              </FormGroup>

              <div className="d-flex flex-column gap-2 mt-3">
                <Button
                  color="success"
                  size="sm"
                  block
                  onClick={() => {
                    handleDownload(gstType);
                  }}
                >
                  <i className="fas fa-download me-2"></i>
                  Download Invoice ({gstType === "withGST" ? "With GST" : "Without GST"})
                </Button>

                <Button
                  color="warning"
                  size="sm"
                  block
                  onClick={() => {
                    handlePrintInvoice(gstType);
                  }}
                >
                  <i className="fas fa-print me-2"></i>
                  Print Invoice ({gstType === "withGST" ? "With GST" : "Without GST"})
                </Button>

                <Button
                  color="secondary"
                  size="sm"
                  block
                  onClick={toggleGstModal}
                >
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </Modal>

          {/* AddOns Section */}
          <Card>
            <CardBody className="mt-3 mb-3">
              <Row>
                <Col md={form?.type === "combo" ? 6 : 12}>
                  {form?.type !== "combo" && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="text-primary">AddOns Details (18% GST: 9% CGST + 9% SGST - Matches Invoice):</h5>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setShowAddProductModal(true)}
                        >
                          Add Product
                        </button>
                      </div>
                      <div className="table-rep-plugin mt-3 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>Sl.No</th>
                              <th>Product Name</th>
                              <th>Unit Price</th>
                              <th>Quantity</th>
                              <th>Total (Without GST)</th>
                              <th>CGST @9%</th>
                              <th>SGST @9%</th>
                              <th>Total (With 18% GST)</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {AddOns?.map((data, key) => {
                              const itemDetails = calculateAddonItemDetails(data);

                              return (
                                <tr key={key} className="text-center">
                                  <td>{key + 1}</td>
                                  <td>{data?.name || "N/A"}</td>
                                  <td>{parseFloat(data?.price || 0).toFixed(2)}</td>
                                  <td>
                                    {data?.quantity || 0}
                                    {data?.type === "cake"
                                      ? data?.quantity === 500
                                        ? " GMS"
                                        : " Kg"
                                      : ""}
                                  </td>
                                  <td>{itemDetails.totalWithoutGST.toFixed(2)}</td>
                                  <td>+ {itemDetails.cgst.toFixed(2)}</td>
                                  <td>+ {itemDetails.sgst.toFixed(2)}</td>
                                  <td><strong>{itemDetails.totalWithGST.toFixed(2)}</strong></td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-primary me-2"
                                      onClick={() => handleEdit("addon", key, data)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete("addon", key, data)}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}

                            {AddOns && AddOns.length > 0 && (
                              <>
                                <tr className="text-center" style={{ backgroundColor: "#f8f9fa" }}>
                                  <td colSpan="4"><strong>TOTAL ADDONS (Without GST)</strong></td>
                                  <td><strong>
                                    {AddOns.reduce((total, data) => {
                                      const itemDetails = calculateAddonItemDetails(data);
                                      return total + itemDetails.totalWithoutGST;
                                    }, 0).toFixed(2)}
                                  </strong></td>
                                  <td><strong>
                                    {AddOns.reduce((total, data) => {
                                      const itemDetails = calculateAddonItemDetails(data);
                                      return total + itemDetails.cgst;
                                    }, 0).toFixed(2)}
                                  </strong></td>
                                  <td><strong>
                                    {AddOns.reduce((total, data) => {
                                      const itemDetails = calculateAddonItemDetails(data);
                                      return total + itemDetails.sgst;
                                    }, 0).toFixed(2)}
                                  </strong></td>
                                  <td><strong>
                                    {AddOns.reduce((total, data) => {
                                      const itemDetails = calculateAddonItemDetails(data);
                                      return total + itemDetails.totalWithGST;
                                    }, 0).toFixed(2)}
                                  </strong></td>
                                  <td></td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}

                  {form?.type === "combo" && (
                    <>
                      <h5 className="text-primary">Plan Benefits Details :</h5>
                      <div className="table-rep-plugin mt-3 table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr className="text-center">
                              <th>Sl.No</th>
                              <th>Image</th>
                              <th>Product Name</th>
                              <th>Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Products?.map((data, key) => (
                              <tr key={key} className="text-center">
                                <td>{key + 1}</td>
                                <td>
                                  <img
                                    src={URLS.Base + (data?.image || "")}
                                    style={{ width: "20px" }}
                                    alt={data?.name}
                                  />
                                </td>
                                <td>{data?.name || "N/A"}</td>
                                <td>{"Free"}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEdit("combo", key, data)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete("combo", key, data)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* POS Products with GST - UPDATED WITH EDIT AND DELETE FUNCTIONS */}
          <Card>
            <CardBody>
              <h5 className="text-primary mb-3">Ordered POS Products (5% GST: 2.5% CGST + 2.5% SGST) - Matches Invoice:</h5>

              {OrderDetails?.products && OrderDetails.products.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr className="text-center">
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total (Without GST)</th>
                        <th>CGST @2.5%</th>
                        <th>SGST @2.5%</th>
                        <th>Total (With 5% GST)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OrderDetails.products.map((product, index) => {
                        // ✅ Skip if product is undefined or null
                        if (!product) return null;

                        const unitPrice = parseFloat(product.amount || 0);
                        const quantity = parseFloat(product.quantity || 1);

                        // ✅ Skip if invalid numbers
                        if (isNaN(unitPrice) || isNaN(quantity)) return null;

                        const totalWithoutGST = unitPrice * quantity;
                        const cgst = totalWithoutGST * 0.025;
                        const sgst = totalWithoutGST * 0.025;
                        const totalWithGST = totalWithoutGST + cgst + sgst;

                        return (
                          <tr key={product._id || index} className="text-center">
                            <td>{index + 1}</td>
                            <td>{product.stockName || "N/A"}</td>
                            <td>{quantity}</td>
                            <td>₹{formatCurrency(unitPrice)}</td>
                            <td>₹{formatCurrency(totalWithoutGST)}</td>
                            <td>+ ₹{formatCurrency(cgst)}</td>
                            <td>+ ₹{formatCurrency(sgst)}</td>
                            <td><strong>₹{formatCurrency(totalWithGST)}</strong></td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEditPosProduct(product, index)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeletePosProduct(product._id, index)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {/* POS Products Total Row */}
                      <tr className="text-center" style={{ backgroundColor: "#f8f9fa" }}>
                        <td colSpan="4"><strong>TOTAL POS (Without GST)</strong></td>
                        <td><strong>₹{formatCurrency(calculatePosGST().totalWithoutGST)}</strong></td>
                        <td><strong>+ ₹{formatCurrency(calculatePosGST().cgst)}</strong></td>
                        <td><strong>+ ₹{formatCurrency(calculatePosGST().sgst)}</strong></td>
                        <td><strong>₹{formatCurrency(calculatePosGST().totalWithGST)}</strong></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No products found for this order.</p>
              )}
            </CardBody>
          </Card>

          {/* Edit POS Product Modal */}
          <Modal isOpen={editPosProductModal} toggle={() => setEditPosProductModal(false)}>
            <ModalHeader toggle={() => setEditPosProductModal(false)}>
              Edit POS Product
            </ModalHeader>
            <ModalBody>
              {editPosProductData && (
                <Form>
                  <FormGroup>
                    <Label>Product Name</Label>
                    <Input
                      type="text"
                      value={editPosProductData.stockName || ""}
                      onChange={(e) => setEditPosProductData({ ...editPosProductData, stockName: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={editPosProductData.quantity || 1}
                      onChange={(e) => setEditPosProductData({ ...editPosProductData, quantity: parseFloat(e.target.value) })}
                      min="1"
                      step="1"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Unit Price (₹)</Label>
                    <Input
                      type="number"
                      value={editPosProductData.amount || 0}
                      onChange={(e) => setEditPosProductData({ ...editPosProductData, amount: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </FormGroup>

                  {editPosProductData.quantity && editPosProductData.amount && (
                    <div className="alert alert-info">
                      <div className="d-flex justify-content-between">
                        <span>Total (Without GST):</span>
                        <strong>₹{formatCurrency(editPosProductData.quantity * editPosProductData.amount)}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>CGST @2.5%:</span>
                        <strong>+ ₹{formatCurrency((editPosProductData.quantity * editPosProductData.amount) * 0.025)}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>SGST @2.5%:</span>
                        <strong>+ ₹{formatCurrency((editPosProductData.quantity * editPosProductData.amount) * 0.025)}</strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total (With 5% GST):</strong>
                        <strong className="text-success">₹{formatCurrency((editPosProductData.quantity * editPosProductData.amount) * 1.05)}</strong>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                      color="secondary"
                      onClick={() => setEditPosProductModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSavePosProduct}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </ModalBody>
          </Modal>

          <Card>
            <CardBody className="mt-3 mb-3">
              <h5 className="text-primary">Product Query Section:</h5>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleQuerySubmit();
                }}
              >
                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <Label for="productQueryInput">
                        Enter Query/Instruction for Product:
                      </Label>
                      <textarea
                        id="productQueryInput"
                        className="form-control"
                        rows="4"
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        placeholder="Enter your query related to this booking..."
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-sm btn-outline-success">
                        Submit Query
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>

              {querySubmitted && (
                <div className="mt-3 alert alert-success">
                  <strong>Query Submitted!</strong> Your query has been successfully added.
                </div>
              )}
            </CardBody>
          </Card>

          {/* Add Product Modal */}
          {showAddProductModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Product</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddProductModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* Category Dropdown */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Category</label>
                      <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setNewProduct({
                            productId: "",
                            name: "",
                            image: "",
                            type: "",
                            price: "",
                            quantity: "",
                            categoryName: "",
                            cakeType: "",
                            cakePremiumOrNormal: ""
                          });
                        }}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading categories...</option>
                        )}
                      </select>
                    </div>

                    {/* Products Dropdown - Shows only when category selected */}
                    {selectedCategory && (
                      <div className="mb-3">
                        <label className="form-label fw-bold">Select Product</label>
                        <select
                          className="form-select"
                          value={newProduct.productId || ""}
                          onChange={(e) => handleProductSelect(e.target.value)}
                          required
                        >
                          <option value="">-- Select Product --</option>
                          {isLoading ? (
                            <option>Loading...</option>
                          ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.name} - ₹{product.price}
                                {product.type === 'grams' ? ' (per 500g)' : ' (per piece)'}
                              </option>
                            ))
                          ) : (
                            <option disabled>No products in this category</option>
                          )}
                        </select>
                      </div>
                    )}

                    {/* Product Details - Show only when product selected */}
                    {newProduct.productId && (
                      <>
                        <div className="card mt-3">
                          <div className="card-body">
                            <h6 className="card-title text-primary mb-3">Product Details</h6>

                            {/* Product Image */}
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <label className="fw-bold">Image:</label>
                              </div>
                              <div className="col-md-9">
                                {newProduct.image ? (
                                  <img
                                    src={URLS.Base + newProduct.image}
                                    alt={newProduct.name}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "cover",
                                      border: "1px solid #ddd",
                                      borderRadius: "5px",
                                      padding: "5px"
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://via.placeholder.com/100?text=No+Image";
                                    }}
                                  />
                                ) : (
                                  <p className="text-muted">No image available</p>
                                )}
                              </div>
                            </div>

                            {/* Product Name */}
                            <div className="row mb-2">
                              <div className="col-md-3">
                                <label className="fw-bold">Name:</label>
                              </div>
                              <div className="col-md-9">
                                <p className="form-control-plaintext">{newProduct.name || "N/A"}</p>
                              </div>
                            </div>

                            {/* Category Name */}
                            <div className="row mb-2">
                              <div className="col-md-3">
                                <label className="fw-bold">Category:</label>
                              </div>
                              <div className="col-md-9">
                                <p className="form-control-plaintext">{newProduct.categoryName || "N/A"}</p>
                              </div>
                            </div>

                            {/* Product Type */}
                            <div className="row mb-2">
                              <div className="col-md-3">
                                <label className="fw-bold">Type:</label>
                              </div>
                              <div className="col-md-9">
                                <p className="form-control-plaintext">
                                  {newProduct.type === 'grams' ? 'Weight Based (per 500g)' : 'Piece Based'}
                                </p>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="row mb-2">
                              <div className="col-md-3">
                                <label className="fw-bold">Price:</label>
                              </div>
                              <div className="col-md-9">
                                <p className="form-control-plaintext">₹{parseFloat(newProduct.price || 0).toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Cake Type - if applicable */}
                            {newProduct.cakeType && (
                              <div className="row mb-2">
                                <div className="col-md-3">
                                  <label className="fw-bold">Cake Type:</label>
                                </div>
                                <div className="col-md-9">
                                  <p className="form-control-plaintext">{newProduct.cakeType}</p>
                                </div>
                              </div>
                            )}

                            {/* Premium Type - if applicable */}
                            {newProduct.cakePremiumOrNormal && (
                              <div className="row mb-2">
                                <div className="col-md-3">
                                  <label className="fw-bold">Premium Type:</label>
                                </div>
                                <div className="col-md-9">
                                  <p className="form-control-plaintext">{newProduct.cakePremiumOrNormal}</p>
                                </div>
                              </div>
                            )}

                            {/* Quantity Input */}
                            <div className="row mb-2">
                              <div className="col-md-3">
                                <label className="fw-bold">
                                  Quantity:
                                  {newProduct.type === 'grams' ? ' (in grams)' : ''}
                                </label>
                              </div>
                              <div className="col-md-9">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={newProduct.quantity || ""}
                                  onChange={(e) => setNewProduct({
                                    ...newProduct,
                                    quantity: parseInt(e.target.value) || 0
                                  })}
                                  placeholder={newProduct.type === 'grams' ? 'Enter grams (e.g., 500)' : 'Enter quantity'}
                                  required
                                  min="1"
                                />
                                <small className="text-muted">
                                  {newProduct.type === 'grams'
                                    ? 'Note: Price is per 500 grams. Total will be calculated accordingly.'
                                    : 'Enter quantity in pieces'}
                                </small>
                              </div>
                            </div>

                            {/* Total Amount Calculation */}
                            {newProduct.price && newProduct.quantity && newProduct.quantity > 0 && (
                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <div className="alert alert-info">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span className="fw-bold">Total Amount:</span>
                                      <span className="fs-5 fw-bold text-success">
                                        ₹{newProduct.type === 'grams'
                                          ? (parseFloat(newProduct.price) * (parseFloat(newProduct.quantity) / 500)).toFixed(2)
                                          : (parseFloat(newProduct.price) * parseFloat(newProduct.quantity)).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="small text-muted mt-1">
                                      {newProduct.type === 'grams' && (
                                        <>Calculation: ₹{newProduct.price} × ({newProduct.quantity}g ÷ 500g)</>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowAddProductModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddProductSubmit}
                      disabled={!newProduct.productId || !newProduct.quantity || newProduct.quantity <= 0}
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Edit Product Modal */}
          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Product</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label>Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData?.image || ""}
                        onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label>Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editData?.quantity || ""}
                        onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                      />
                    </div>
                    {editType === "addon" && (
                      <div className="mb-2">
                        <label>Price</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editData?.price || ""}
                          onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    <button className="btn btn-primary" onClick={handleModalSave}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Note Section */}
          <div className="form-group m-3 position-relative">
            <label htmlFor="nameInput">
              <b style={{ color: "red" }}>Note : </b>
            </label>
            <div className="input-group">
              <textarea
                className="form-control"
                id="exampleTextarea"
                rows="4"
                required
                placeholder="Type here..."
                value={noteDescription}
                onChange={e => {
                  handleNoteChange(e)
                }}
              ></textarea>
            </div>
            <div className="mt-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={updateNote}
              >
                Submit
              </button>
            </div>
          </div>
        </Container>

        {/* Extra Person Modal */}
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
              Add Extra Person
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
                  Add Extra Person <span className="text-danger">*</span>
                </Label>
                <input
                  type="number"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Add Extra Person"
                  required
                  name="noOfPersons"
                  value={form2.noOfPersons}
                  onChange={e => {
                    handleChange1(e)
                  }}
                />
              </div>
              <div className="mb-3">
                <Label for="basicpill-firstname-input1">
                  Extra Person Price ({Price})
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  className="form-control"
                  id="basicpill-firstname-input1"
                  placeholder="Enter Price"
                  required
                  name="AddPrice"
                  value={AddPrice}
                  disabled
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
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default RecruitView;