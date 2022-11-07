const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;
const Razorpay = require('razorpay');
const paypal = require('paypal-rest-sdk');
const { response } = require('express');

var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

exports.generateRazorpay = (orderId, totalPrice) => {
    let total = totalPrice
    return new Promise((resolve, reject) => {
        var options = {
            amount: total * 100,
            currency: "INR",
            receipt: "" + orderId
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err);
            } else {
                resolve(order)
            }

        })
    })
}

exports.verifyPayment = (details) => {
    return new Promise((resolve, reject) => {
        const crypto = require('crypto');
        var hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
        hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')
        if (hmac == details['payment[razorpay_signature]']) {
            resolve()
        } else {
            reject()
        }
    })
}

exports.changePaymentStatus = (orderId, userId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.ORDER_COLLECTION).updateOne(
            {
                _id: objId(orderId)
            },
            {
                $set: { paymentStatus: 'success' }
            })
            .then(() => {
                db.get().collection(collection.ORDER_COLLECTION).findOne(
                    { _id: objId(orderId) }
                ).then((response) => {
                    response.products.forEach(element => {
                        db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                            { _id: element?.proId },
                            {
                                $inc: { stock: -(element?.quantity) }
                            }
                        )
                    });
                });

                db.get().collection(collection.CART_COLLECTION).deleteOne(
                    { user: objId(userId) }
                )
                resolve()
            })
    })
}