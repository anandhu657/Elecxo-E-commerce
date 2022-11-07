const ordersHelper = require('../../models/user/orders')

exports.getOrders = (req, res) => {
    ordersHelper.deletePending()
    ordersHelper.orderHistory(req.session.user._id).then((response) => {
        res.render('user/order-history', { response, user: req.session.user, cartCount: req.session.cartCount })
    })
}

exports.putOrderStatus = (req, res) => {
    ordersHelper.changeOrderStatus(req.body).then(() => {
        res.json({ status: true })
    })
}