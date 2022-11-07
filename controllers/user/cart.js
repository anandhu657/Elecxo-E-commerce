const cartHelper = require('../../models/user/cart')

exports.addToCart = (req, res) => {
    cartHelper.addToCart(req.params.id, req.session.user._id).then((count) => {
        if (count >= 0) {
            req.session.cartCount = count + 1;
        }
        res.json({ status: true, count })
    })
}

exports.getCart = async (req, res) => {
    let products = await cartHelper.getCartProducts(req.session.user._id)
    let total = await cartHelper.getTotalAmount(req.session.user._id)
    res.render('user/cart', { products, user: req.session.user, userId: req.session.user._id, total, cartCount: req.session.cartCount });
}

exports.deleteCartItem = (req, res) => {
    cartHelper.deleteProductFromCart(req.body.id, req.session.user._id).then(async () => {
        let total = await cartHelper.getTotalAmount(req.session.user._id)
        req.session.cartCount = (req.session.cartCount) - 1
        res.json({ status: true, count: req.session.cartCount, total: total })
    })
}

exports.putCartItem = (req, res, next) => {
    cartHelper.changeProductQuantity(req.body).then(async (response) => {
        response.total = await cartHelper.getTotalAmount(req.session.user._id)
        res.json(response)
    })
}