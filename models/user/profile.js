const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.editProfile = (userId, userDetails) => {
    return new Promise(async (resolve, reject) => {
        if (userDetails.fieldId == 'username') {
            let gender = '';
            gender = userDetails.gender
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {
                    _id: objId(userId)
                },
                {
                    $set: { username: userDetails.fieldValue, gender: gender }
                }
            )
        } else if (userDetails.fieldId == 'email') {
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {
                    _id: objId(userId)
                },
                {
                    $set: { email: userDetails.fieldValue }
                }
            )
        } else if (userDetails.fieldId == 'phone_number') {
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {
                    _id: objId(userId)
                },
                {
                    $set: { phone_number: userDetails.fieldValue }
                }
            )
        }
        let user = await db.get().collection(collection.USER_COLLECTION).aggregate(
            [
                {
                    $match: { _id: objId(userId) }
                },
                {
                    $project: {
                        username: 1,
                        email: 1,
                        phone_number: 1,
                        gender: 1
                    }
                }
            ]
        ).toArray()
        resolve(user);
    })
}

exports.changePassword = (passwordDetails, userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.get().collection(collection.USER_COLLECTION).find({ _id: objId(userId) }).toArray()
        if (user) {
            bcrypt.compare(passwordDetails.oldPassword, user[0].password).then(async (status) => {
                if (status) {
                    passwordDetails.newPassword = await bcrypt.hash(passwordDetails.newPassword, 10)
                    db.get().collection(collection.USER_COLLECTION).updateOne(
                        { _id: objId(userId) },
                        {
                            $set: { password: passwordDetails.newPassword }
                        }
                    ).then((response) => {

                        resolve(response)
                    })
                }
            }).catch((response) => {

                reject()
            })
        }
    })
}

exports.decreaseWallet = (totalPrice, walletAmount, userId) => {
    return new Promise((resolve, reject) => {
        if (totalPrice > walletAmount) {
            db.get().collection(collection.USER_COLLECTION).updateOne(
                { _id: objId(userId) },
                {
                    $set: { wallet: 0 }
                }
            ).then(() => {
                resolve(0)
            })
        } else {
            let amount = walletAmount - totalPrice
            db.get().collection(collection.USER_COLLECTION).updateOne(
                { _id: objId(userId) },
                {
                    $set: { wallet: amount }
                }
            ).then(() => {
                resolve(amount)
            })
        }
    })
}