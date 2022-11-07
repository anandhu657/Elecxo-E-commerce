const db = require('../../config/connection');
const collection = require('../../config/collection');
const bcrypt = require('bcrypt');

exports.adminSignin = (adminData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
        let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email });
        if (admin) {
            bcrypt.compare(adminData.password, admin.password).then((status) => {
                if (status) {
                    response.admin = admin;
                    response.status = true;
                    resolve(response);
                } else {
                    reject("Invalid password")
                }
            })
        } else {
            reject("Invalid email");
        }
    })
}