const productViewHelper = require('../../models/user/product-view')
const cartHelper = require('../../models/user/cart');

exports.getProductView = async (req, res) => {
    let cartCount = null;
    if (req.session.user) {
        cartCount = await cartHelper.getCartCount(req.session.user._id)
        req.session.cartCount = cartCount
    }
    productViewHelper.getProductView(req.params.id).then(async (products) => {
        productViewHelper.getproductSuggesstion(products.category).then((suggesstions) => {
            res.render('user/product-view', { products, suggesstions, cartCount, user: req.session.user, logout: !req.session.loggedIn })
        })
    })
}

exports.getProductModalView = async (req, res) => {
    productViewHelper.getProductView(req.params.id).then(async (products) => {
        res.json(products)
    })
}