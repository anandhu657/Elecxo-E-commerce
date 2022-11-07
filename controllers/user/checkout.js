const checkoutHelper = require('../../models/user/checkout')
const paymentHelper = require('../../models/user/payment')
const cartHelper = require('../../models/user/cart')
const addressHelper = require('../../models/user/address')
const profileHelper = require('../../models/user/profile')

const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

exports.getCheckout = async (req, res) => {
    let total = await cartHelper.getTotalAmount(req.session.user._id)
    let userDetails = await checkoutHelper.getUserDetails(req.session.user._id)
    let addresses = await addressHelper.getAddress(req.session.user._id)
    res.render('user/checkout', { total, user: req.session.user, userDetails, addresses, cartCount: req.session.cartCount });
}

exports.postCheckout = async (req, res) => {
    let products = await checkoutHelper.getCartProductList(req.session.user._id)
    let totalPrice = req.body.total

    if (req.body.wallet == "checked" && (req.body.paymentMethod === 'paypal' || req.body.paymentMethod === 'razorpay')) {
        let user = await checkoutHelper.getUserDetails(req.session.user._id)
        await profileHelper.decreaseWallet(totalPrice, user[0].wallet, req.session.user._id).then((wallet) => {
            req.session.user.wallet = wallet
        })
        totalPrice = totalPrice - user[0].wallet
    }
    let userAddress = req.body

    checkoutHelper.placeOrder(userAddress, totalPrice, products).then((orderId) => {
        if (req.body.paymentMethod === 'cod') {
            delete req.session.cartCount
            res.json({ codSuccess: true })
        } else if (req.body.paymentMethod === 'paypal') {
            req.session.orderId = orderId
            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/success",
                    "cancel_url": "http://cancel.url"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": products[0].item,
                            "sku": "item",
                            "price": totalPrice,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": totalPrice
                    },
                    "description": "This is the payment description."
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    console.log("Create Payment Response");
                    console.log(payment);
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            console.log(payment.links[i].href);
                            res.json({ url: payment.links[i].href, paypal: true });
                        }
                    }
                }
            });
        }
        else {
            paymentHelper.generateRazorpay(orderId, totalPrice).then((response) => {
                res.json({ razorpay: true, response, user: req.session.user })
            })
        }
    })
}