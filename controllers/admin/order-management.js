const orderManagementHelper = require('../../models/admin/order-management')

exports.getOrderDetails = (req, res) => {
    orderManagementHelper.getOrderDetails().then((response) => {
        res.render('admin/orders', { response, admin: true })
    })
}

exports.putOrderDetails = (req, res) => {
    orderManagementHelper.changeOrderStatus(req.body.orderId, req.body.proId, req.body.status).then(() => {
        res.json({ status: true })
    })
}

