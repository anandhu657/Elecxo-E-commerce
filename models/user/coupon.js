const db = require('../../config/connection');
const collection = require('../../config/collection');

exports.couponCheck = (couponDetails) => {
    return new Promise(async (resolve, reject) => {
        db.get().collection(collection.COUPON_COLLECTION).findOne({ coupon: couponDetails.redeem }).then((coupon) => {
            if (coupon != null) {
                resolve(coupon)
            } else {
                reject()
            }
        })
    })
}