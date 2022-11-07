const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.addProduct = (productData, urls, callback) => {
    productData.stock = parseInt(productData.stock)
    productData.offerPrice = parseInt(productData.price)
    productData.categoryOffer = 0
    productData.productOffer = 0
    productData.images = urls
    return new Promise((resolve, reject) => {
        productData.price = Number(productData.price)
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productData).then((data) => {
            callback(data.insertedId.toString());
        })
    })
}

exports.editProduct = (proId, updatedData, images) => {
    updatedData.images = images
    return new Promise((resolve, reject) => {
        updatedData.price = Number(updatedData.price)
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objId(proId) }, { "$set": updatedData })
        resolve()
    })
}

exports.getProducts = () => {
    return new Promise(async (resolve, reject) => {
        let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({}).toArray()
        resolve(products)
    })
}

exports.getProductById = (proId) => {
    return new Promise(async (resolve, reject) => {
        let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objId(proId) }).then((response) => {
            resolve(response)
        })
    })
}

exports.getProductImage = (proId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objId(proId) }).then((response) => {
            resolve(response)
        })
    })
}

exports.deleteProduct = (proId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objId(proId) }).then((response) => {
            resolve();
        })
    })
}