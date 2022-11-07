const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.getOrderDetails = () => {
    return new Promise(async (resolve, reject) => {
        let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $unwind: '$products'
            },
            {
                $project: {
                    proId: '$products.proId',
                    product: '$products.proName',
                    quantity: '$products.quantity',
                    deliveryDetails: '$deliveryDetails',
                    paymentMethod: '$paymentMethod',
                    price: '$products.price',
                    status: '$products.status',
                    date: '$date',
                    statusUpdateDate:'$statusUpdateDate'
                }
            },
            {
                $sort: { statusUpdateDate: -1 }
            }
        ]).toArray()
        console.log(orderItems);
        resolve(orderItems)
    })
}

exports.changeOrderStatus = (orderId, proId, status) => {
    return new Promise((resolve, reject) => {
        let dateStatus = new Date()
        db.get().collection(collection.ORDER_COLLECTION).updateOne(
            {
                _id: objId(orderId),
                'products.proId': objId(proId)
            },
            {
                $set:
                {
                    'products.$.status': status,
                    statusUpdateDate: dateStatus
                }
            }).then((response) => {
                if ((status === 'canceled' || status === 'returned') && response.modifiedCount === 1) {
                    db.get().collection(collection.ORDER_COLLECTION).findOne(
                        {
                            _id: objId(orderId),
                            'products.proId': objId(proId)
                        }
                    ).then((response) => {
                        let quantity = response?.products[0]?.quantity
                        db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                            {
                                _id: objId(proId),
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