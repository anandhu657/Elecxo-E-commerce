const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.getSearchProduct = (key, pageno, sortno) => {
    return new Promise(async (resolve, reject) => {
        let page = 1 || pageno
        let limit = 10 || sortno

        let data = await db.get().collection(collection.PRODUCT_COLLECTION).find({
            "$or": [
                { product_name: { $regex: key, '$options': 'i' } },
                { brand: { $regex: key, '$options': 'i' } },
                { category: { $regex: key, '$options': 'i' } },
            ]
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .toArray()

        if (data.length > 0) {
            resolve(data)
        } else {
            reject()
        }
    })
}
