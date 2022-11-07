const productViewHelper = require('../../models/user/product-view')
const cartHelper = require('../../models/user/cart');

exports.getProductView = async (req, res) => {
    let cartCount = null;
    if (req.session.user) {
        cartCount = await cartHelper.getCartCount(req.session.user._id)
        req.session.cartCount = cartCount
    }
    productViewHelper.getProductView(req.params.id).then(async (products) => {
        res.render('user/product-view', { products, cartCount, user: req.session.user, logout: !req.session.loggedIn })
    })
}

exports.getProductModalView = async (req, res) => {
    productViewHelper.getProductView(req.params.id).then(async (products) => {
        res.json(products)
    })
}