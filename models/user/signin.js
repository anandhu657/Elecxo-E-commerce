const db = require('../../config/connection');
const collection = require('../../config/collection');
const bcrypt = require('bcrypt');
const objId = require('mongodb').ObjectId;

exports.userSignup = (userData) => {
    return new Promise(async (resolve, reject) => {
        let emailChecking = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
        if (emailChecking == null) {
            userData.password = await bcrypt.hash(userData.password, 10)
            userData.status = true;
            userData.date = new Date()
            let refer_code = userData.referal_code
            delete userData.referal_code
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(() => {
                resolve("success")
            }).catch(() => {
                reject({ msg: "Signed Up failed" })
            })
            
            if (refer_code) {
                db.get().collection(collection.USER_COLLECTION).findOne({ _id: objId(refer_code) }).then((user) => {
                    if (user) {
                        if (user.wallet) {
                            db.get().collection(collection.USER_COLLECTION).updateOne(
                                {
                                    _id: objId(user._id)
                                },
                                {
                                    $inc: { 'wallet': 100 }
                                }
                            )
                        } else {
                            db.get().collection(collection.USER_COLLECTION).updateOne(
                                {
                                    _id: objId(user._id)
                                }, {
                                $set: {
                                    wallet: 100
                                }
                            })
                        }
                    }
                })
            }
        } else {
            reject({ msg: "Email is already taken" })
        }
    })
}

exports.userSignin = (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
        let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
        if (user && user.status) {
            bcrypt.compare(userData.password, user.password).then((status) => {
                if (status) {
                    response.user = user;
                    response.status = true;
                    resolve(response);
                } else {
                    reject("Invalid password")
                }
            })
        }
        else {
            reject("Invalid email");
        }

    })
}