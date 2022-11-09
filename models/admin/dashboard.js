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
        data.shippedOrders = await db.get().collection(collection.ORDER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate },' products.status': 'shipped' }).count()
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
        let onlineTotal = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: startDate, $lte: endDate
                            },
                        },
                        {
                            $or: [
                                { paymentMethod: 'online' },
                                { paymentMethod: 'razorpay' },
                                { paymentMethod: 'paypal' },
                            ]
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
        data.onlineTotal = onlineTotal?.[0]?.totalAmount
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
        data.totalAmount = totalAmount?.[0]?.totalAmount
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
        data.users = await db.get().collection(collection.USER_COLLECTION).find({ date: { $gte: startDate, $lte: endDate } }).count()
        resolve(data)
    })
}