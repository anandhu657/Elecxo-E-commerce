const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.getProductView = (proId) => {
    return new Promise(async (resolve, reject) => {
        let productView = await db.get().collection(collection.PRODUCT_COLLECTION).findOne(
            { _id: objId(proId) }
        ).then((productView) => {
            resolve(productView)
        })
    })
}