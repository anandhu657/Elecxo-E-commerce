const db = require('../../config/connection');
const collection = require('../../config/collection');
const objId = require('mongodb').ObjectId;

exports.getCategories = () => {
    return new Promise(async (resolve, reject) => {
        let categories = await db.get().collection(collection.CATEGORIES_COLLECTION).find({}).sort({ date: -1 }).toArray()
        resolve(categories);
    })
}

exports.setCategory = (categoryData) => {
    return new Promise(async (resolve, reject) => {
        categoryData.category = categoryData.category.toUpperCase()
        categoryData.date = new Date();
        let categoryCheck = await db.get().collection(collection.CATEGORIES_COLLECTION).findOne({ category: categoryData.category })
        if (categoryCheck == null) {
            db.get().collection(collection.CATEGORIES_COLLECTION).insertOne(categoryData).then((response) => {
                resolve(response.insertedId)
            })
        } else {
            reject()
        }
    })
}

exports.editCategory = (categoryData) => {
    return new Promise(async (resolve, reject) => {
        categoryData.inputValue = categoryData.inputValue.toUpperCase()
        let categoryCheck = await db.get().collection(collection.CATEGORIES_COLLECTION).findOne({ category: categoryData.inputValue })
        if (categoryCheck == null) {
            db.get().collection(collection.CATEGORIES_COLLECTION).updateOne(
                {
                    _id: objId(categoryData.categoryId)
                }, {
                $set: {
                    category: categoryData.inputValue
                }
            }
            ).then((response) => {
                resolve(response.insertedId)
            })
        } else {
            reject()
        }
    })
}

exports.deleteCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.CATEGORIES_COLLECTION).deleteOne({ _id: objId(categoryId) }).then((status) => {
            resolve(status)
        })

    })
}