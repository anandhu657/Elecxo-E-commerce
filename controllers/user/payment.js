const paymentHelper = require('../../models/user/payment')
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

exports.postVerifyPayment = (req, res) => {
    paymentHelper.verifyPayment(req.body).then(() => {
        let userId = req.session.user._id
        paymentHelper.changePaymentStatus(req.body['order[receipt]'], userId).then(() => {
            delete req.session.cartCount
            res.json({ status: true })
        })
    }).catch((err) => {
        res.json({ status: false })
    })
}

exports.getPaypalSuccess = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    paymentHelper.changePaymentStatus(req.session.orderId, req.session.user._id).then(() => {
        delete req.session.cartCount
        delete req.session.orderId
        res.redirect('/order-history')
    })
}

