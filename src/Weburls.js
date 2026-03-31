const Url = "https://api.carnivalcastle.com/";
//const Url = "http://localhost:5091/";

export const URLS = {
  Base: Url,

  //Enquiry
  AddEnquiry: Url + "v1/carnivalApi/web/enquiry/addenquiry",

  //GetAllModules
  AllModules: Url + "v1/carnivalApi/web/getallmodules",

  //About
  GetAbout: Url + "v1/carnivalApi/web/getaboutus",
  GetAboutFeatures: Url + "v1/carnivalApi/web/getaboutusfeatures",

  //GetUnicId
  GetUnicId: Url + "v1/carnivalApi/web/cart/generateuniqueid",

  //Theaters
  // GetAllTheaters: Url + "v1/carnivalApi/web/getalltheatres",
  GetAllTheaters: Url + "v1/carnivalApi/web/getalltheatres/forweb",

  //GetByTheaters
  GetByOneTheater: Url + "v1/carnivalApi/web/gettheatrebyid",

  //GetBySlot
  GetByOneSlot: Url + "v1/carnivalApi/web/slots/bydate",

  //GetOccation
  GetAllOccation: Url + "v1/carnivalApi/web/getoccassions",
  GetOccationById: Url + "v1/carnivalApi/web/getoccasiondetailsbyid",

  //GetCategories
  GetAllCategories: Url + "v1/carnivalApi/web/getcategories",

  //GetByPlan
  GetByPlanIdProducts: Url + "v1/carnivalApi/web/getplansbyid",

  //Products
  GetOneCategoryByIdProducts: Url + "v1/carnivalApi/web/getcategorydetailsbyid",

  //Products
  GetAllCategoryProducts:
    Url + "v1/carnivalApi/web/getallcategoriesandproducts",

  //CheckCoupon
  GetCheckCoupon: Url + "v1/carnivalApi/web/couponcheckstatusapi",

  //AddBookings
  // AddBookings: Url + "v1/carnivalApi/web/booking/addbooking",
  AddBookings: Url + "v1/carnivalApi/web/booking/newadmin/addbooking",

  //Gallery
  GetAllGallery: Url + "v1/carnivalApi/web/getallgallerys",

  //GetPolicies
  GetPolicies: Url + "v1/carnivalApi/web/getpolicies",

  //GetCharges
  GetCharges: Url + "v1/carnivalApi/web/getcharges",

  //GetAllProducts
  GetAllProducts: Url + "v1/carnivalApi/web/getallproducts",

  //GetAllCakes 
  GetGetAllCakes: Url + "v1/carnivalApi/web/category/getcakes",

  //GetDateSlots
  GetDateSlots: Url + "v1/carnivalApi/web/getslotsbydate",

  //GetFooter
  GetFooter: Url + "v1/carnivalApi/web/getcontactus",

  //AddLead
  AddLead: Url + "v1/carnivalApi/web/leads/addleads",
};
