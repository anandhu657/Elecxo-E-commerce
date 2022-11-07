const homePageHelper = require('../../models/user/home-page')
const cartHelper = require('../../models/user/cart')
const wishlistHelper = require('../../models/user/wishlist')
const bannerHelper = require('../../models/admin/banner-management')

exports.getHomePage = async (req, res) => {
    let cartCount = null;
    let wishlist;
    if (req.session.user) {
        cartCount = await cartHelper.getCartCount(req.session.user._id)
        req.session.cartCount = cartCount
        wishlist = await wishlistHelper.getWishlist(req.session.user._id);
    }
    let category = await homePageHelper.getCategory();
    let banner = await bannerHelper.getBanner();
    console.log(banner);
    homePageHelper.getProduct().then((products) => {
        // products.forEach(product => {
        //     product.totalPrice = product.price
        //     if (product.categoryOffer?.percentage > product.productOffer?.percentage) {
        //         productOfferPrice = (product.price * product.categoryOffer?.percentage) / 100
        //         product.offer = product.categoryOffer?.percentage
        //         product.totalPrice -= productOfferPrice
        //     } else if (product.categoryOffer?.percentage < product.productOffer?.percentage) {
        //         productOfferPrice = (product.price * product.productOffer?.percentage) / 100
        //         product.offer = product.productOffer?.percentage
        //         product.totalPrice -= productOfferPrice
        //     } else {
        //         if (product.categoryOffer?.percentage != undefined) {
        //             productOfferPrice = (product.price * product.categoryOffer?.percentage) / 100
        //             product.offer = product.categoryOffer?.percentage
        //             product.totalPrice -= productOfferPrice
        //         } else if (product.productOffer?.percentage != undefined) {
        //             productOfferPrice = (product.price * product.productOffer?.percentage) / 100
        //             product.offer = product.productOffer?.percentage
        //             product.totalPrice -= productOfferPrice
        //         }
        //     }
        //     product.totalPrice = parseInt(product.totalPrice)

        //     wishlist?.forEach((wishlist) => {
        //         let proId = product._id.toString()
        //         let wishlistId = wishlist?.product?._id.toString()
        //         if (proId === wishlistId) {
        //             product.wishlist = true
        //         }
        //     })
        // });

        res.render('user/landing-page', { products, banner, cartCount, category, user: req.session.user, logout: !req.session.loggedIn })
    })
}