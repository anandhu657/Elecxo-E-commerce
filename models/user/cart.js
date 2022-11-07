const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.addToCart = (proId, userId) => {
    let proObj = {
        item: objId(proId),
        quantity: 1
    }
    return new Promise(async (resolve, reject) => {
        let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objId(userId) })

        let count;
        if (userCart) {
            count = userCart.products.length
            let proExist = userCart.products.findIndex(product => product.item == proId)
            if (proExist != -1) {
                db.get().collection(collection.CART_COLLECTION).updateOne({
                    user: objId(userId),
                    'products.item': objId(proId)
                },
                    {
                        $inc: { 'products.$.quantity': 1 }
                    }
                ).then(() => {
                    resolve()
                })
            } else {
                db.get().collection(collection.CART_COLLECTION).updateOne({
                    user: objId(userId)
                },
                    {
                        $push: { products: proObj }
                    }
                ).then((response) => {
                    resolve(count)
                })
            }
        } else {
            let cartObj = {
                user: objId(userId),
                products: [proObj]
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                count = 0;
                resolve(count)
            })
        }
    })
}

exports.getCartProducts = (userId) => {
    return new Promise(async (resolve, reject) => {
        let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match: { user: objId(userId) }
            },
            {
                $unwind: '$products'
            }, {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            }, {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            }, {
                $project: {
                    item: 1,
                    quantity: 1,
                    product: {
                        $arrayElemAt: ['$product', 0]
                    }
                }
            }
        ]).toArray()
        resolve(cartItems)
    })
}

exports.getCartCount = (userId) => {
    return new Promise(async (resolve, reject) => {
        let count;
        let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objId(userId) })
        if (cart) {
            count = cart.products.length;
        }
        resolve(count)
    })
}

exports.changeProductQuantity = (details) => {
    count = parseInt(details.count)
    quantity = parseInt(details.quantity)

    return new Promise((resolve, reject) => {
        if (count == -1 && quantity == 1) {
            db.get().collection(collection.CART_COLLECTION).updateOne({
                _id: objId(details.cart)
            },
                {
                    $pull: { products: { item: objId(details.product) } }
                }
            ).then((response) => {
                resolve({ removeProduct: true })
            })
        } else {
            db.get().collection(collection.CART_COLLECTION).updateOne({
                _id: objId(details.cart),
                'products.item': objId(details.product)
            },
                {
                    $inc: { 'products.$.quantity': count }
                }
            ).then((response) => {
                resolve({ status: true })
            })
        }
    })
}

exports.getTotalAmount = (userId) => {
    return new Promise(async (resolve, reject) => {
        let totalAmount = await db.get().collection(collection.CART_COLLECTION).aggregate(
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
                    '$project': {
                        'quantity': 1,
                        'product': {
                            '$arrayElemAt': [
                                '$result', 0
                            ]
                        }
                    }
                }, {
                    '$group': {
                        '_id': null,
                        'total': {
                            '$sum': {
                                '$multiply': [
                                    '$product.offerPrice', '$quantity'
                                ]
                            }
                        }
                    }
                }
            ]
        ).toArray()
        resolve(totalAmount[0]?.total)
    })
}

exports.deleteProductFromCart = (proId, userId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.CART_COLLECTION).updateOne({
            user: objId(userId)
        },
            {
                $pull: { products: { item: objId(proId) } }
            }
        ).then(() => {
            resolve()
        })
    })
}