//const Url = "https://api.carnivalcastle.com/"
//const Url = "https://api.carnivalcastle.com/";
const Url = "https://api.carnivalcastle.com/"
//const Url = "http://31.97.206.144:5091/"
//const Url = "http://localhost:5091/"


export const URLS = {
  Base: Url,

  //profile
  getProfile: Url + "v1/carnivalApi/admin/auth/getadminprofile",
  UpdateProfile: Url + "v1/carnivalApi/admin/auth/editprofile",
  UpdateImage: Url + "v1/carnivalApi/admin/auth/editprofilepic",
  ChangePass: Url + "v1/carnivalApi/admin/auth/changepass",

  //Department
  AddDepartment: Url + "v1/carnivalApi/admin/department/adddepartment",
  GetDepartment: Url + "v1/carnivalApi/admin/department/getdepartments",
  GetDepartmentSearch:
    Url + "v1/carnivalApi/admin/department/getdepartments?searchQuery=",
  UpdateDepartment: Url + "v1/carnivalApi/admin/department/editdepartment",
  InActiveDepartment: Url + "v1/carnivalApi/admin/department/deletedepartment",

  //Role
  AddRole: Url + "v1/carnivalApi/admin/role/addrole",
  GetRole: Url + "v1/carnivalApi/admin/role/getAll",
  GetRoleSearch: Url + "v1/carnivalApi/admin/role/getAll?searchQuery=",
  GetOneRole: Url + "v1/carnivalApi/admin/role/getrole",
  EditRole: Url + "v1/carnivalApi/admin/role/editrole",
  DeleteRole: Url + "v1/carnivalApi/admin/role/deleterole/",

  //Staff
  AddStaff: Url + "v1/carnivalApi/admin/staff/addstaff",
  GetStaff: Url + "v1/carnivalApi/admin/staff/getAllstaff",
  GetStaffSearch: Url + "v1/carnivalApi/admin/staff/getAllstaff?searchQuery=",
  EditStaff: Url + "v1/carnivalApi/admin/staff/editstaff/",
  DeleteStaff: Url + "v1/carnivalApi/admin/staff/deletestaff/",
  GetStaffBookings: Url + "v1/carnivalApi/admin/booking/staffbookings",
  GetStaffBookingsSearch:
    Url + "v1/carnivalApi/admin/booking/staffbookings?searchQuery=",

  //HomeSliders
  AddHomeslides: Url + "v1/carnivalApi/admin/homeslider/addhomeslider",
  GetHomeslides: Url + "v1/carnivalApi/admin/homeslider/getallhomesliders",
  GetHomeslidesSearch:
    Url + "v1/carnivalApi/admin/homeslider/getallhomesliders?searchQuery=",
  UpdateHomeslides: Url + "v1/carnivalApi/admin/homeslider/edithomeslider/",
  DeleteHomeslides: Url + "v1/carnivalApi/admin/homeslider/deletehomeslider/",

  //About
  GetAbout: Url + "v1/carnivalApi/admin/aboutus/getaboutus",
  UpdatAbout: Url + "v1/carnivalApi/admin/aboutus/editaboutus",

  //Highlights
  GetHighlights: Url + "v1/carnivalApi/admin/hightlight/gethightlight",
  UpdatHighlights: Url + "v1/carnivalApi/admin/hightlight/edithightlight",

  //HowToJoin
  GetHowToJoin: Url + "v1/carnivalApi/admin/howtojoin/gethowtojoin",
  UpdatHowToJoin: Url + "v1/carnivalApi/admin/howtojoin/edithowtojoin",

  //HowToJoin
  GetHowToJoin: Url + "v1/carnivalApi/admin/howtojoin/gethowtojoin",
  UpdatHowToJoin: Url + "v1/carnivalApi/admin/howtojoin/edithowtojoin",

  //Latest Info
  GetLatestInfo: Url + "v1/carnivalApi/admin/latestinfo/getlatestinfo",
  UpdatLatestInfo: Url + "v1/carnivalApi/admin/latestinfo/editlatestinfo",

  //Settings
  GetSetting: Url + "v1/carnivalApi/admin/policy/get",
  UpdatePRIVACYPOLICY: Url + "v1/carnivalApi/admin/policy/updateprivacyPolicy",
  UpdateTERMSANDCONDITION:
    Url + "v1/carnivalApi/admin/policy/updatetermsAndCondition",
  UpdateRefundPolicy: Url + "v1/carnivalApi/admin/policy/refundPolicy",

  //Faqs
  AddFaqs: Url + "v1/carnivalApi/admin/faq/addfaq",
  GetFaqs: Url + "v1/carnivalApi/admin/faq/getallfaqs",
  GetFaqsSearch: Url + "v1/carnivalApi/admin/faq/getallfaqs?searchQuery=",
  UpdateFaqs: Url + "v1/carnivalApi/admin/faq/editfaq",
  InActiveFaqs: Url + "v1/carnivalApi/admin/faq/deletefaq",

  //Enquiry
  GetEnquiry: Url + "v1/carnivalApi/admin/enquiry/getall",
  GetEnquirySearch: Url + "v1/carnivalApi/admin/enquiry/getall?searchQuery=",
  DeleteEnquiry: Url + "v1/carnivalApi/admin/enquiry/deleteenquiry/",
  GetLead: Url + "v1/carnivalApi/admin/leads/getall",
  GetLeadSearch: Url + "v1/carnivalApi/admin/leads/getall?searchQuery=",
  DeleteLead: Url + "v1/carnivalApi/admin/deletelead/",

  //Coupon
  AddCoupon: Url + "v1/carnivalApi/admin/coupon/addcoupon",
  GetCoupon: Url + "v1/carnivalApi/admin/coupon/getallcoupons",
  GeCouponSearch:
    Url + "v1/carnivalApi/admin/coupon/getallcoupons?searchQuery=",
  UpdateCoupon: Url + "v1/carnivalApi/admin/coupon/editcoupon",
  DeleteCoupon: Url + "v1/carnivalApi/admin/coupon/deletecoupon",

  //Features
  AddFeatures: Url + "v1/carnivalApi/admin/aboutusfeature/addfeature",
  GetFeatures: Url + "v1/carnivalApi/admin/aboutusfeature/getallfeatures",
  GetFeaturesSearch:
    Url + "v1/carnivalApi/admin/aboutusfeature/getallfeatures?searchQuery=",
  UpdateFeatures: Url + "v1/carnivalApi/admin/aboutusfeature/editfeature/",
  DeleteFeatures: Url + "v1/carnivalApi/admin/aboutusfeature/deletefeature/",

  //Gallery
  AddGallery: Url + "v1/carnivalApi/admin/gallery/addgallery",
  GetGallery: Url + "v1/carnivalApi/admin/gallery/getallgallerys",
  UpdateGallery: Url + "v1/carnivalApi/admin/gallery/editgallery/",
  DeleteGallery: Url + "v1/carnivalApi/admin/gallery/deletegallery/",

  //Testimonials
  AddTestimonials: Url + "v1/carnivalApi/admin/testimonial/addtestimonial",
  GetTestimonials: Url + "v1/carnivalApi/admin/testimonial/getalltestimoni",
  GetTestimonialsSearch:
    Url + "v1/carnivalApi/admin/testimonial/getalltestimoni?searchQuery=",
  UpdateTestimonials: Url + "v1/carnivalApi/admin/testimonial/edittestimoni/",
  DeleteTestimonials: Url + "v1/carnivalApi/admin/testimonial/deletetestimoni/",

  //Service
  AddService: Url + "v1/carnivalApi/admin/occasion/addoccasion",
  GetService: Url + "v1/carnivalApi/admin/occasion/getalloccasions",
  GetServiceSearch:
    Url + "v1/carnivalApi/admin/occasion/getalloccasions?searchQuery=",
  UpdateService: Url + "v1/carnivalApi/admin/occasion/editoccasion/",
  DeleteService: Url + "v1/carnivalApi/admin/occasion/deleteoccasion/",

  //PendingBookings
  GetPendingBookings: Url + "v1/carnivalApi/admin/getallpendingbookings",
  GetPendingBookingsSearch:
    Url + "v1/carnivalApi/admin/getallpendingbookings?searchQuery=",
  GetCompleatedBookings: Url + "v1/carnivalApi/admin/getallcompletedbookings",
  GetCompleatedBookingsSearch:
    Url + "v1/carnivalApi/admin/getallcompletedbookings?searchQuery=",
  GetCancelledBookings: Url + "v1/carnivalApi/admin/getallcancelledbookings",
  GetCancelledBookingsSearch:
    Url + "v1/carnivalApi/admin/getallcancelledbookings?searchQuery=",
  UpdateBookingsStatus: Url + "v1/carnivalApi/admin/booking/cancellbooking/",
  GetPendingBookingsbyid: Url + "v1/carnivalApi/admin/booking/getbookingbyid",
  UpdateExtraPersonStatus: Url + "v1/carnivalApi/admin/booking/update",

  //Payments
  GetPayments: Url + "v1/carnivalApi/admin/payments/getallpayments",
  GetPaymentsSearch:
    Url + "v1/carnivalApi/admin/payments/getallpayments?searchQuery=",

  //Plans
  AddPlans: Url + "v1/carnivalApi/admin/plan/addplan",
  GetPlans: Url + "v1/carnivalApi/admin/plan/getallplans",
  GetPlansSearch: Url + "v1/carnivalApi/admin/plan/getallplans?searchQuery=",
  UpdatePlans: Url + "v1/carnivalApi/admin/plan/editplan/",
  DeletePlans: Url + "v1/carnivalApi/admin/plan/deleteplan/",

  //Theater
  AddTheater: Url + "v1/carnivalApi/admin/theatre/addtheatre",
  GetTheater: Url + "v1/carnivalApi/admin/theatre/getalltheatre",
  GetTheaterSearch:
    Url + "v1/carnivalApi/admin/theatre/getalltheatre?searchQuery=",
  UpdateTheater: Url + "v1/carnivalApi/admin/theatre/edittheatre/",
  DeleteTheater: Url + "v1/carnivalApi/admin/theatre/deletetheatre/",
  GetOneTheater: Url + "v1/carnivalApi/admin/theatre/gettheatrebyid",

  //Category
  AddCategory: Url + "v1/carnivalApi/admin/category/addcategory",
  GetCategory: Url + "v1/carnivalApi/admin/category/getallcategorys",
  GetCategorySearch:
    Url + "v1/carnivalApi/admin/category/getallcategorys?searchQuery=",
  UpdateCategory: Url + "v1/carnivalApi/admin/category/editcategory/",
  DeleteCategory: Url + "v1/carnivalApi/admin/category/deletecategory/",

  //Products
  AddProducts: Url + "v1/carnivalApi/admin/product/addproduct",
  GetProducts: Url + "v1/carnivalApi/admin/product/getallproducts",
  GetProductsSearch:
    Url + "v1/carnivalApi/admin/product/getallproducts?searchQuery=",
  UpdateProducts: Url + "v1/carnivalApi/admin/product/editproduct/",
  DeleteProducts: Url + "v1/carnivalApi/admin/product/deleteproduct/",

  //FoodCategory
  AddFoodCategory: Url + "v1/carnivalApi/admin/foodcategory/addcategory",
  GetFoodCategory: Url + "v1/carnivalApi/admin/foodcategory/getallcategorys",
  GeFoodCategorySearch:
    Url + "v1/carnivalApi/admin/foodcategory/getallcategorys?searchQuery=",
  UpdateFoodCategory: Url + "v1/carnivalApi/admin/foodcategory/editcategory/",
  DeleteFoodCategory: Url + "v1/carnivalApi/admin/foodcategory/deletecategory/",

  //Products
  AddFoodProducts: Url + "v1/carnivalApi/admin/foodproduct/addfoodproduct",
  GetFoodProducts: Url + "v1/carnivalApi/admin/foodproduct/getallfoodproduct",
  GetFoodProductsSearch:
    Url + "v1/carnivalApi/admin/foodproduct/getallfoodproduct?searchQuery=",
  UpdateFoodProducts: Url + "v1/carnivalApi/admin/foodproduct/editfoodproduct/",
  DeleteFoodProducts:
    Url + "v1/carnivalApi/admin/foodproduct/deletefoodproduct/",
  GetByIdFoodProducts:
    Url + "v1/carnivalApi/admin/foodproduct/category/foodproducts",

  //Stock
  AddStocks: Url + "v1/carnivalApi/admin/stock/addstock",
  GetStock: Url + "v1/carnivalApi/admin/stock/getallstocks",
  GetStockSearch: Url + "v1/carnivalApi/admin/stock/getallstocks?searchQuery=",
  UpdatStock: Url + "v1/carnivalApi/admin/stock/editstock/",
  DeleteStock: Url + "v1/carnivalApi/admin/stock/deletestock/",
  GetStockByCategory: Url + "v1/carnivalApi/admin/stock/getcategorybyidstocks",
  GetStockByCategorySearch:
    Url + "v1/carnivalApi/admin/stock/getcategorybyidstocks?searchQuery=",
  CheckStock: Url + "v1/carnivalApi/admin/stock/checkstockquantity/",

  //Order
  AddOrder: Url + "v1/carnivalApi/admin/orderadmin/addorder",
  GetOrder: Url + "v1/carnivalApi/admin/orderadmin/getallorders",
  GetOrderSearch:
    Url + "v1/carnivalApi/admin/orderadmin/getallorders?searchQuery=",
  UpdatOrder: Url + "v1/carnivalApi/admin/orderadmin/editorder/",
  GetByOrder: Url + "v1/carnivalApi/admin/orderadmin/getorderbyid",

  //AddPos
  AddPos: Url + "v1/carnivalApi/admin/orderadmin/addorder",
  GetPos: Url + "v1/carnivalApi/admin/orderadmin/getallorders",
  GetPosSearch:
    Url + "v1/carnivalApi/admin/orderadmin/getallorders?searchQuery=",
  UpdatPos: Url + "v1/carnivalApi/admin/orderadmin/editorder/",
  GetByPosId: Url + "v1/carnivalApi/admin/orderadmin/getorderbyid",

  //TheaterTimeSlots
  AddTheaterTimeSlots: Url + "v1/carnivalApi/admin/slot/addslot",
  GetTheaterTimeSlots: Url + "v1/carnivalApi/admin/slot/getallslots",
  GetTheaterTimeSlotsSearch:
    Url + "v1/carnivalApi/admin/slot/getallslots?searchQuery=",
  UpdateTheaterTimeSlots: Url + "v1/carnivalApi/admin/slot/editslot/",
  statusReport: Url + "v1/carnivalApi/admin/slot/updateslotisactive",
  DeleteTheaterTimeSlots: Url + "v1/carnivalApi/admin/slot/deleteslot/",

  //Cakes
  AddCakes: Url + "v1/carnivalApi/admin/cake/addcake",
  GetCakes: Url + "v1/carnivalApi/admin/cake/getallcakes",
  GetCakesSearch: Url + "v1/carnivalApi/admin/cake/getallcakes?searchQuery=",
  UpdateCakes: Url + "v1/carnivalApi/admin/cake/editcake/",
  DeleteCakes: Url + "v1/carnivalApi/admin/cake/deletecake/",

  //OFFERS
  AddOffers: Url + "v1/carnivalApi/admin/offers/addoffer",
  GetOffers: Url + "v1/carnivalApi/admin/offers/getalloffers",
  GetOffersSearch:
    Url + "v1/carnivalApi/admin/offers/getalloffers?searchQuery=",
  UpdateOffers: Url + "v1/carnivalApi/admin/offers/editoffer",
  DeleteOffers: Url + "v1/carnivalApi/admin/offers/deleteoffer",

  //AddOns
  AddAddOns: Url + "v1/carnivalApi/admin/addon/addaddon",
  GetAddOns: Url + "v1/carnivalApi/admin/addon/getalladdons",
  GetAddOnsSearch: Url + "v1/carnivalApi/admin/addon/getalladdons?searchQuery=",
  UpdateAddOns: Url + "v1/carnivalApi/admin/addon/editaddon/",
  DeleteAddOns: Url + "v1/carnivalApi/admin/addon/deleteaddon/",

  //Gst
  GetPriceSettings: Url + "v1/carnivalApi/admin/charges/getcharges",
  UpdatPriceSettings: Url + "v1/carnivalApi/admin/charges/updateallgsts",

  //ContactUs
  GetContactUs: Url + "v1/carnivalApi/admin/contactus/getcontactus",
  UpdatContactUs: Url + "v1/carnivalApi/admin/contactus/editcontactus",

  //Popup
  GetPopup: Url + "v1/carnivalApi/admin/popup/getpopup",
  UpdatePopup: Url + "v1/carnivalApi/admin/popup/editpopupimage",
  UpdatePopup1: Url + "v1/carnivalApi/admin/popup/editpopupkeys",

  //Dashboard
  GetDashboard: Url + "v1/carnivalApi/admin/dashbaord",

  // NOTE
  GetNote: Url + 'v1/carnivalApi/admin/booking/updatenotedescription',

  // Filter Select field
  GetSelectProducts: Url + 'v1/carnivalApi/admin/booking/addonsproductsbycategoryanddate',
  
}
