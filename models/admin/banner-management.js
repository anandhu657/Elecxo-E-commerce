const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;


exports.getBanner = () => {
    return new Promise(async (resolve, reject) => {
        let banners = await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
        resolve(banners)
    })
}

exports.bannerUpload = (banner) => {
    let imgObj = {
        image: banner,
        date: new Date()
    }
    return new Promise(async (resolve, reject) => {
        db.get().collection(collection.BANNER_COLLECTION).insertOne(imgObj).then(() => {
            resolve()
        })
    })
}

exports.deleteBanner = (bannerId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.BANNER_COLLECTION).deleteOne(
            {
                _id: objId(bannerId)
            }
        ).then(() => {
            resolve()
        })
    })
}