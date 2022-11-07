var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");


upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

const signin = require('../controllers/admin/signin')
const logout = require('../controllers/admin/logout')
const userManagement = require('../controllers/admin/user-management')
const categoryManagement = require('../controllers/admin/category-management')
const productManagement = require('../controllers/admin/product-management')
const orderManagement = require('../controllers/admin/order-management')
const salesReport = require('../controllers/admin/sales-report')
const dashboard = require('../controllers/admin/dashboard')
const offerManagement = require('../controllers/admin/offer-management')
const couponManagement = require('../controllers/admin/coupon-management')
const bannerManagement = require('../controllers/admin/banner-management')

//Change req to Delete method
router.use(function (req, res, next) {
  if (req.query._method == 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect('/admin')
  }
}

const verifyLogout = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    res.redirect('/admin/admin_panel/list_user');
  } else {
    next()
  }
}

// admin Signin
router.get('/', verifyLogout, signin.redirectToAdminLogin);
router.get('/admin_login', verifyLogout, signin.getAdminLogin)
router.post('/admin_login', signin.postAdminLogin)


// logout
router.get('/logout', logout.adminLogout)


// admin user management
router.get('/admin_panel/list_user', verifyLogin, userManagement.getUserDetails)
router.get('/admin_panel/list_user/:id', userManagement.changeUserDetails)


// admin category management
router.get('/admin_panel/category-management', verifyLogin, categoryManagement.getCategoryDetails);
router.post('/admin_panel/category-management', categoryManagement.postCategoryDetails);
router.put('/admin_panel/category-management', categoryManagement.putCategoryDetails)
router.delete('/admin_panel/category-management/:id', categoryManagement.deleteCategoryDetails)


//admin product management
router.get('/admin_panel/products', verifyLogin, productManagement.getProductDetails)
router.delete('/admin_panel/products/:id', productManagement.deleteProductDetails)
router.get('/admin_panel/products/add_product', verifyLogin, productManagement.getAddProducts)
router.post('/admin_panel/products/add_product', upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]),
  productManagement.postAddProduct)
router.get('/admin_panel/products/edit_product/:id', verifyLogin, productManagement.getEditProduct)
router.post('/admin_panel/products/edit_product/:id', upload.array("images", 4), productManagement.postEditProduct)


// admin orders management
router.get('/admin_panel/orders', verifyLogin, orderManagement.getOrderDetails)
router.post('/admin_panel/orderStatus', orderManagement.putOrderDetails)


// Sales report
router.get("/admin_panel/sales-report", verifyLogin, salesReport.getSalesReport);


// dashboard
router.get('/admin_panel/dashboard', verifyLogin, dashboard.getDashboard)
router.get('/admin_panel/dashboard/:days', verifyLogin, dashboard.getDashboardByDays)


// admin offer management
router.get('/admin_panel/offers', verifyLogin, offerManagement.getOfferDetails)
router.post('/admin_panel/add-category-offer', offerManagement.postCategoryOffer)
router.delete('/admin_panel/delete-category-offer', offerManagement.deleteCategoryOffer)
router.delete('/admin_panel/delete-product-offer', offerManagement.deleteProductOffer)
router.post('/admin_panel/add-product-offer', offerManagement.postProductOffer)


// admin coupons management
router.get('/admin_panel/coupons', verifyLogin, couponManagement.getCouponDetails)
router.post('/admin_panel/coupons', couponManagement.postCouponDetails)
router.delete('/admin_panel/coupons', couponManagement.deleteCouponDetails)


// banner management
router.get('/admin_panel/banner', verifyLogin, bannerManagement.getBannerDetails)
router.post("/admin_panel/banner", upload.single("image"), bannerManagement.postBannerDetails);
router.delete("/admin_panel/banner", bannerManagement.deleteBannerDetails);

module.exports = router;