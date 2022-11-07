var express = require('express');
var router = express.Router();
require('dotenv').config()

const homepage = require('../controllers/user/home-page')
const signin = require('../controllers/user/signin')
const productView = require('../controllers/user/product-view')
const productFilter = require('../controllers/user/product-filter')
const cart = require('../controllers/user/cart')
const wishlist = require('../controllers/user/wishlist')
const checkout = require('../controllers/user/checkout')
const payment = require('../controllers/user/payment')
const orders = require('../controllers/user/orders')
const address = require('../controllers/user/address')
const profile = require('../controllers/user/profile')
const coupon = require('../controllers/user/coupon')
const search = require('../controllers/user/search')



router.use(function (req, res, next) {
  if (req.query._method == 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/')
  }
}

const verifyLogout = (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    next()
  }
}

const addToCartVerify = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.json({ status: false })
  }
}


// Home page 
router.get('/', homepage.getHomePage)


//User Signup and signup
router.post('/user_registration', signin.postUserSignup)
router.post('/user_signin', verifyLogout, signin.postUesrSignin)
// router.post('/otp_verification', verifyLogout, signin.postOTP)
router.get('/logout', signin.userLogout)


// Product detail view
router.get('/product-view/:id', productView.getProductView)
router.get('/product-view-modal/:id', productView.getProductModalView)

// search
router.get('/search',search.productSearch)

// Category sort page
router.get('/product-filter-view', productFilter.getFilterProducts)


// cart
router.get('/add-to-cart/:id', addToCartVerify, cart.addToCart)
router.get('/cart', verifyLogin, cart.getCart)
router.delete('/cart', verifyLogin, cart.deleteCartItem)
router.post('/change-product-quantity', cart.putCartItem)

// wishlist
router.get('/wishlist', verifyLogin, wishlist.getWishlist)
router.get('/add-to-wishlist/:proId', verifyLogin, wishlist.addToWishlist)

//checkout
router.get('/checkout', verifyLogin, checkout.getCheckout)
router.post('/checkout', verifyLogin, checkout.postCheckout)
router.get('/pick-address/:addressId', address.getPickAddress)

// payment Razorpay
router.post('/verify-payment', verifyLogin, payment.postVerifyPayment)
router.get('/success', verifyLogin, payment.getPaypalSuccess)


// order history
router.get('/order-history', verifyLogin, orders.getOrders)
router.put('/change-order-status', verifyLogin, orders.putOrderStatus)


// Add user address
router.post('/add-address', verifyLogin, address.postAddAddress)
router.get('/edit-address/:addressId', verifyLogin, address.getCurrentAddress)
router.post('/edit-address', verifyLogin, address.putEditAddress)
router.delete('/delete-address', address.deleteAddress)


// Profile
router.get('/profile', verifyLogin, profile.getProfile)
router.put('/profile', verifyLogin, profile.putProfile)
router.get('/address', verifyLogin, profile.getUserAddress)
router.get('/change-password', verifyLogin, profile.getChangePassword)
router.put('/change-password', profile.putChangePassword)


// coupon
router.post("/coupon", coupon.postCoupon)

module.exports = router;
