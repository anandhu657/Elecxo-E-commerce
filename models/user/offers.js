const db = require('../../config/connection');
const collection = require('../../config/collection');

exports.getOfferCategory = () => {
    return new Promise(async (resolve, reject) => {
        let categoryOffer = await db.get().collection(collection.OFFER_COLLECTION).find({ category: { $exists: true } }).toArray()
        resolve(categoryOffer)
    })
}

exports.getOfferProduct = () => {
    return new Promise(async (resolve, reject) => {
        let productOffer = await db.get().collection(collection.OFFER_COLLECTION).find(
            { product: { $exists: true } }
        ).toArray()
        resolve(productOffer)
    })
}
