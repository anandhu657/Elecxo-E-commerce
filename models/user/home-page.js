const db = require('../../config/connection');
const collection = require('../../config/collection');

exports.getNewProduct = () => {
    return new Promise(async (resolve, reject) => {
        // let products = db.get().collection(collection.PRODUCT_COLLECTION).aggregate(
        //     [
        //         {
        //             '$lookup': {
        //                 'from': collection.OFFER_COLLECTION,
        //                 'localField': '_id',
        //                 'foreignField': 'product',
        //                 'as': 'productOffer'
        //             }
        //         }, {
        //             '$lookup': {
        //                 'from': collection.OFFER_COLLECTION,
        //                 'localField': 'category',
        //                 'foreignField': 'category',
        //                 'as': 'categoryOffers'
        //             }
        //         }, {
        //             '$project': {
        //                 'product_name': 1,
        //                 'brand': 1,
        //                 'price': 1,
        //                 'stock': 1,
        //                 'category': 1,
        //                 'description': 1,
        //                 'payment': 1,
        //                 'productOffer': {
        //                     '$arrayElemAt': [
        //                         '$productOffer', 0
        //                     ]
        //                 },
        //                 'categoryOffer': {
        //                     '$arrayElemAt': [
        //                         '$categoryOffers', 0
        //                     ]
        //                 }
        //             }
        //         }
        //     ]
        // ).toArray()
        let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().limit(4).toArray()
        console.log(products);
        resolve(products)
    })
}

exports.getOfferProducts = () => {
    return new Promise(async (resolve, reject) => {
        let offerProducts = await db.get().collection(collection.PRODUCT_COLLECTION).find(
            {
                $or: [
                    { categoryOffer: { $ne: 0 } },
                    { productOffer: { $ne: 0 } }
                ]
            }
        ).limit(4).toArray()
        resolve(offerProducts)
    })
}

exports.getCategory = () => {
    return new Promise(async (resolve, reject) => {
        let categories = await db.get().collection(collection.CATEGORIES_COLLECTION).find().toArray()
        resolve(categories);
    })
}