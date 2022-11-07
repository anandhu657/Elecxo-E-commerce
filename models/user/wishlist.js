const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.addToWishlist = (proId, userId) => {
    return new Promise(async (resolve, reject) => {
        let userWishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({ user: objId(userId) })
        let proObj = {
            item: objId(proId)
        }
        if (userWishlist) {
            let proExist = userWishlist.products.findIndex(product => product.item == proId)
            if (proExist == -1) {
                db.get().collection(collection.WISHLIST_COLLECTION).updateOne({
                    user: objId(userId)
                },
                    {
                        $push: { products: { item: objId(proId) } }
                    }
                ).then((response) => {
                    resolve()
                })
            } else {
                db.get().collection(collection.WISHLIST_COLLECTION).updateOne({
                    user: objId(userId)
                }, {
                    $pull: { products: { item: objId(proId) } }
                }).then((response) => {
                    reject()
                })
            }
        } else {
            let wishlistObj = {
                user: objId(userId),
                products: [proObj]
            }
            db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wishlistObj).then((response) => {
                resolve()
            })
        }
    })
}

exports.getWishlist = (userId) => {
    return new Promise(async (resolve, reject) => {
        let wishlist = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
            {
                $match: { user: objId(userId) }
            }, {
                '$unwind': {
                    'path': '$products'
                }
            }, {
                '$project': {
                    'item': '$products.item'
                }
            }, {
                '$lookup': {
                    'from': collection.PRODUCT_COLLECTION,
                    'localField': 'item',
                    'foreignField': '_id',
                    'as': 'product'
                }
            }, {
                '$project': {
                    product: {
                        $arrayElemAt: ['$product', 0]
                    }
                }
            }
        ]).toArray()
        resolve(wishlist)
    })
}