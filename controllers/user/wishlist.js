const wishlistHelper = require('../../models/user/wishlist')

exports.getWishlist = (req, res) => {
    wishlistHelper.getWishlist(req.session.user._id).then((response) => {
        console.log(response);
        res.render('user/wishlist', { response, user: req.session.user, cartCount: req.session.cartCount })
    })
}

exports.addToWishlist = (req, res) => {
    wishlistHelper.addToWishlist(req.params.proId, req.session.user._id).then(() => {
        res.json({ status: true, user: req.session.user })
    }).catch((response) => {
        res.json({ status: false })
    })
}