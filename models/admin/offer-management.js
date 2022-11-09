const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.addCategoryOffer = async (categoryDetails) => {
    let category = categoryDetails.category
    let percentage = Number(categoryDetails.percentage)

    return new Promise(async (resolve, reject) => {
        await db.get().collection(collection.CATEGORIES_COLLECTION).updateOne(
            { category: category },
            {
                $set: {
                    categoryOffer: percentage
                }
            }
        )

        await db.get().collection(collection.PRODUCT_COLLECTION).updateMany(
            { category: category },
            {
                $set: {
                    categoryOffer: percentage
                }
            }
        )

        let products = await db.get().collection(collection.PRODUCT_COLLECTION).find(
            { category: category }
        ).toArray()
        products.forEach(async product => {
            let temp = (product.price * product.categoryOffer) / 100
            let updatedOfferPrice = parseInt(product.price - temp)
            console.log(updatedOfferPrice);
            if (product.categoryOffer > product.productOffer) {
                db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                    { _id: objId(product._id) },
                    {
                        $set: {
                            offerPrice: updatedOfferPrice
                        }
                    }
                )
            }
        });
        resolve()
    })
}

exports.deleteCategoryOffer = (category) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.CATEGORIES_COLLECTION).updateOne(
            { category: category },
            {
                $set: {
                    categoryOffer: 0
                }
            }
        )

        db.get().collection(collection.PRODUCT_COLLECTION).updateMany(
            { category: category },
            {
                $set: {
                    categoryOffer: 0
                }
            }
        ).then(async () => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find(
                { category: category }
            ).toArray()
            products.forEach(product => {
                if (product.productOffer == 0 && product.categoryOffer == 0) {
                    let price = product.price
                    db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                        { _id: objId(product._id) },
                        {
                            $set: {
                                offerPrice: price
                            }
                        }
                    )
                } else if (product.productOffer > 0) {
                    let temp = (product.price * product.productOffer) / 100
                    let updatedOfferPrice = parseInt(product.price - temp)

                    db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                        { _id: objId(product._id) },
                        {
                            $set: {
                                offerPrice: updatedOfferPrice
                            }
                        }
                    )
                }
            });
        })
        resolve()
    })
}

exports.getOfferCategory = () => {
    return new Promise(async (resolve, reject) => {
        let offerCategories = await db.get().collection(collection.CATEGORIES_COLLECTION).find(
            {
                categoryOffer:
                    { $gt: 0 }
            }
        ).toArray()
        resolve(offerCategories)
    })
}


// product offer
exports.addProductOffer = async (productDetails) => {
    let proId = objId(productDetails.product)
    let offerPercentage = Number(productDetails.percentage)
    // let productCheck = await db.get().collection(collection.OFFER_COLLECTION).findOne({ product: objId(productDetails.product) })
    return new Promise(async (resolve, reject) => {
        await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
            { _id: proId },
            {
                $set:
                {
                    productOffer: offerPercentage
                }
            }
        )

        let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: proId })
        if (product.productOffer >= product.categoryOffer) {
            let temp = (product.price * product.productOffer) / 100
            let updatedOfferPrice = parseInt(product.price - temp)
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                { _id: proId },
                {
                    $set: {
                        offerPrice: updatedOfferPrice
                    }
                }
            ).then(() => {
                resolve()
            })
        }
    })
}


exports.getOfferProducts = () => {
    return new Promise(async (resolve, reject) => {
        let offerProducts = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate(
            [
                {
                    $match: {
                        productOffer: {
                            $gt: 0
                        }
                    }
                },
                {
                    $project: {
                        product_name: 1,
                        productOffer: 1
                    }
                }
            ]
        ).toArray()
        resolve(offerProducts)
    })
}

exports.deleteProductOffer = (proId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
            { _id: objId(proId) },
            {
                $set:
                {
                    productOffer: 0
                }
            }
        ).then(() => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne(
                { _id: objId(proId) }
            ).then(async (response) => {
                if (response.productOffer == 0 && response.categoryOffer == 0) {
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                        { _id: objId(proId) },
                        {
                            $set: {
                                offerPrice: response.price
                            }
                        }
                    )
                } else if (response.categoryOffer > 0) {
                    let temp = (response.price * response.categoryOffer) / 100
                    let updatedOfferPrice = parseInt(response.price - temp)

                    db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                        { _id: objId(proId) },
                        {
                            $set: {
                                offerPrice: updatedOfferPrice
                            }
                        }
                    )
                }
            })
        })
        resolve()
    })
}