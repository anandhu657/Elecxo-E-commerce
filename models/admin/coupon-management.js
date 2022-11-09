const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.getCoupon = () => {
    return new Promise(async (resolve, reject) => {
        let coupons = await db.get().collection(collection.COUPON_COLLECTION).find({}).toArray();
        resolve(coupons)
    })
}

exports.addCoupon = (couponDetails) => {
    couponDetails.percentage = Number(couponDetails.percentage)
    couponDetails.minimumPrice = Number(couponDetails.minimumPrice)
    couponDetails.maximumPrice = Number(couponDetails.maximumPrice)
    return new Promise((resolve, reject) => {
        db.get().collection(collection.COUPON_COLLECTION).insertOne(couponDetails).then(() => {
            resolve()
        })
    })
}

exports.deleteCoupon = (couponId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.COUPON_COLLECTION).deleteOne({ _id: objId(couponId.couponId) }).then((response) => {
            resolve()
        })
    })
}