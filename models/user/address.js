const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.addAddress = (userAddress, userId) => {
    const obj = new objId()
    let addr = {
        _id: objId(obj),
        firstname: userAddress.firstname,
        lastname: userAddress.lastname,
        address: userAddress.address,
        landmark: userAddress.landmark,
        phonenumber: userAddress.phonenumber,
        country: userAddress.country,
        state: userAddress.state,
        pincode: userAddress.pincode,
    }
    return new Promise(async (resolve, reject) => {
        let checkUserAddress = await db.get().collection(collection.USER_COLLECTION).findOne({
            $and: [
                { _id: objId(userId) },
                { address: { $exists: true } }
            ]
        })

        if (checkUserAddress) {
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {
                    _id: objId(userId)
                },
                {
                    $push: { address: addr }
                }
            ).then(() => {
                resolve()
            })
        } else {
            let addrObj = [addr]
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {
                    _id: objId(userId)
                },
                {
                    $set: { address: addrObj }
                }
            ).then(() => {
                resolve()
            })
        }
    })
}

exports.getAddress = (userId) => {
    return new Promise(async (resolve, reject) => {
        let addresses = await db.get().collection(collection.USER_COLLECTION).aggregate([
            {
                '$match': {
                    '_id': objId(userId)
                }
            }, {
                '$unwind': {
                    'path': '$address'
                }
            }, {
                '$project': {
                    'address': 1,
                    'email': 1
                }
            }
        ]).toArray()
        resolve(addresses)
    })
}

exports.getOrderAddress = (userId, addressId) => {
    return new Promise(async (resolve, reject) => {
        let address = await db.get().collection(collection.USER_COLLECTION).aggregate(
            [
                {
                    '$match': {
                        '_id': objId(userId)
                    }
                }, {
                    '$unwind': {
                        'path': '$address'
                    }
                }, {
                    '$match': {
                        'address._id': objId(addressId)
                    }
                }, {
                    '$project': {
                        'address': 1,
                        'email': 1,
                        'username': 1
                    }
                }
            ]
        ).toArray()
        resolve(address)
    })
}

exports.editAddress = (addressDetails, userId) => {
    let addressId = addressDetails.addressId;
    const obj = new objId()
    let addr = {
        _id: objId(obj),
        firstname: addressDetails.editfirstname,
        lastname: addressDetails.editlastname,
        address: addressDetails.editaddress,
        landmark: addressDetails.editlandmark,
        phonenumber: addressDetails.editphonenumber,
        country: addressDetails.editcountry,
        state: addressDetails.editstate,
        pincode: addressDetails.editpincode,
    }
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).updateOne(
            {
                _id: objId(userId),
                'address._id': objId(addressId)
            },
            {
                $set: { "address.$": addr }
            }
        ).then(() => {
            resolve()
        })
    })
}

exports.deleteAddress = (userId, addressId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).updateOne(
            {
                _id: objId(userId)
            },
            {
                $pull: { address: { _id: objId(addressId) } }
            }
        ).then((response) => {
            resolve()
        })
    })
}