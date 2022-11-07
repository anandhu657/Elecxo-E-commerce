const db = require('../../config/connection');
const collection = require('../../config/collection');
const { order } = require('paypal-rest-sdk');
const objId = require('mongodb').ObjectId;

exports.orderHistory = (userId) => {
    return new Promise(async (resolve, reject) => {
        let orderedItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: { userId: objId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $sort: { statusUpdateDate: -1 }
            }
        ]).toArray()
        console.log(orderedItems);
        resolve(orderedItems)
    })
}

exports.changeOrderStatus = (orderDetails) => {
    console.log(orderDetails);
    return new Promise((resolve, reject) => {
        let dateStatus = new Date()
        db.get().collection(collection.ORDER_COLLECTION).updateOne(
            {
                _id: objId(orderDetails.orderId),
                'products.proId': objId(orderDetails.proId)
            },
            {
                $set: { 'products.$.status': orderDetails.status, statusUpdateDate: dateStatus }
            }).then((response) => {
                if ((orderDetails.status === 'canceled' || orderDetails.status === 'returned') && response.modifiedCount === 1) {
                    db.get().collection(collection.ORDER_COLLECTION).findOne(
                        {
                            _id: objId(orderDetails.orderId),
                            'products.proId': objId(orderDetails.proId)
                        }
                    ).then((response) => {
                        let quantity = response?.products[0]?.quantity
                        db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                            {
                                _id: objId(orderDetails.proId),
                            },
                            {
                                $inc: { stock: quantity }
                            }
                        )
                    });
                }
                resolve()
            })
    })
}

exports.deletePending = () => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.ORDER_COLLECTION).deleteMany({
            paymentStatus: 'failed'
        })
        resolve()
    })
}