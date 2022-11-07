const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.listUser = () => {
    return new Promise(async (resolve, reject) => {
        let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
        resolve(users)
    })
}

exports.changeUserStatus = (userId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objId(userId) }, [{ "$set": { status: { "$not": "$status" } } }])
        resolve("success")
    })
}