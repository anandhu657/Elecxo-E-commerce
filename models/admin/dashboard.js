const db = require('../../config/connection');
const collection = require('../../config/collection');

exports.salesReport = (days) => {
    days = parseInt(days)
    return new Promise(async (resolve, reject) => {
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(startDate.getDate() - days)

        let data = {};

        data.deliveredOrders = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'delivered' }).count()
        data.shippedOrders = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, ' products.status': 'shipped' }).count()
        data.placedOrders = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'placed' }).count()
        data.pendingOrders = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'pending' }).count()
        data.canceledOrders = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate }, 'products.status': 'canceled' }).count()
        let codTotal = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate, $lte: endDate
                    },
                    paymentMethod: 'cod'
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]).toArray()
        data.codTotal = codTotal?.[0]?.totalAmount
        let razorpayTotal = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: startDate, $lte: endDate
                            },
                        },
                        {
                            paymentMethod: 'razorpay'
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]).toArray()
        data.razorpayTotal = razorpayTotal?.[0]?.totalAmount

        let paypalTotal = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: startDate, $lte: endDate
                            },
                        },
                        {
                            paymentMethod: 'paypal'
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]).toArray()
        data.paypalTotal = paypalTotal?.[0]?.totalAmount

        let totalAmount = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate, $lte: endDate
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]).toArray()
        data.totalAmount = totalAmount?.[0]?.totalAmount || 0
        let refundAmount = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate, $lte: endDate
                    },
                    status: 'canceled'
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]).toArray()
        data.refundAmount = refundAmount?.[0]?.totalAmount

        let categoryCount = await db.get().collection(collection.CATEGORIES_COLLECTION).aggregate(
            [
                {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'category',
                        'foreignField': 'category',
                        'as': 'result'
                    }
                }, {
                    '$project': {
                        'count': {
                            '$size': '$result'
                        },
                        'category':1
                    }
                }
            ]
        ).toArray()
        data.categoryCount = categoryCount

        data.users = await db.get().collection(collection.USER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate } }).count()
        resolve(data)
    })
}