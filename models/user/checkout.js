const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.getUserDetails = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.get().collection(collection.USER_COLLECTION).find({ _id: objId(userId) }).toArray()
        resolve(user)
    })
}

exports.placeOrder = (order, totalPrice, products) => {
    let total = parseInt(totalPrice)
    let status = 'placed';
    let paymentStatus = order.paymentMethod === 'cod' ? 'success' : 'failed';
    let product = []
    products.forEach(element => {
        let proDetails = {
            proId: element.item,
            proName: element?.product,
            price: element?.offerPrice * element?.quantity,
            quantity: element?.quantity,
            image: element?.image?.[0],
            status: status
        }
        product.push(proDetails)
    });
    return new Promise((resolve, reject) => {
        let orderObj = {
            deliveryDetails: {
                fullname: order.firstname + " " + order.lastname,
                email: order.email,
                address: order.address,
                landmark: order.landmark,
                phonenumber: order.phonenumber,
                altnumber: order.altnumber,
                country: order.country,
                state: order.state,
                pincode: order.pincode
            },
            userId: objId(order.userId),
            paymentMethod: order.paymentMethod,
            products: product,
            totalAmount: total,
            date: new Date(),
            statusUpdateDate: new Date(),
            paymentStatus: paymentStatus
        }

        db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
            if (paymentStatus === 'success') {
                products.forEach(element => {
                    db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                        { _id: element?.item },
                        {
                            $inc: { stock: -(element?.quantity) }
                        }
                    )
                });
                db.get().collection(collection.CART_COLLECTION).deleteOne({ user: objId(order.userId) })
                resolve(response.insertedId)
            } else {
                resolve(response.insertedId)
            }
        })
    })
}

// exports.getCartProductList = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objId(userId) })
//         resolve(cart.products)
//     })
// }

exports.getCartProductList = (userId) => {
    return new Promise((resolve, reject) => {
        let cart = db.get().collection(collection.CART_COLLECTION).aggregate(
            [
                {
                    '$match': {
                        'user': objId(userId)
                    }
                }, {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$project': {
                        'item': '$products.item',
                        'quantity': '$products.quantity'
                    }
                }, {
                    '$lookup': {
                        'from': collection.PRODUCT_COLLECTION,
                        'localField': 'item',
                        'foreignField': '_id',
                        'as': 'result'
                    }
                }, {
                    '$unwind':
                    {
                        path: '$result'
                    }
                }, {
                    '$project': {
                        item: 1,
                        quantity: 1,
                        product: '$result.product_name',
                        price: '$result.price',
                        offerPrice: "$result.offerPrice",
                        image: '$result.images'
                    }
                }
            ]
        ).toArray()
        resolve(cart)
    })
}

// exports.getUserOrders = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ userId: objId(userId) }).toArray()
//         resolve(orders)
//     })
// }

// exports.getOrderProducts = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
//             {
//                 $match: { $and: [{ $or: [{ status: 'placed' }, { status: 'pending' }, { status: 'shipped' }] }, { userId: objId(userId) }] }
//             },
//             {
//                 $unwind: '$products'
//             },
//             {
//                 $project: {
//                     item: '$products.item',
//                     quantity: '$products.quantity',
//                     deliveryDetails: '$deliveryDetails',
//                     paymentMethod: '$paymentMethod',
//                     totalAmount: '$totalAmount',
//                     status: '$status',
//                     date: '$date'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: collection.PRODUCT_COLLECTION,
//                     localField: 'item',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             },
//             {
//                 $project: {
//                     item: 1,
//                     quantity: 1,
//                     product: {
//                         $arrayElemAt: ['$product', 0]
//                     },
//                     deliveryDetails: 1,
//                     paymentMethod: 1,
//                     totalAmount: 1,
//                     status: 1,
//                     date: 1
//                 }
//             }
//         ]).toArray()
//         resolve(orderItems)
//     })
// }

