const offerManagementHelper = require('../../models/admin/offer-management')
const categoryManagementHelper = require('../../models/admin/category-management')
const productManagementHelper = require('../../models/admin/product-management')

exports.getOfferDetails = (req, res) => {
    categoryManagementHelper.getCategories().then((category) => {
        productManagementHelper.getProducts().then((products) => {
            offerManagementHelper.getOfferCategory().then((offerCategories) => {
                offerManagementHelper.getOfferProducts().then((offerProducts) => {
                    console.log(offerCategories);
                    console.log(offerProducts);
                    res.render('admin/offers', { admin: true, category, products, offerCategories, offerProducts })
                })
            })
        })
    })
}

exports.postCategoryOffer = (req, res) => {
    offerManagementHelper.addCategoryOffer(req.body).then((response) => {
        res.json({ status: true })
    }).catch(() => {
        res.json({ status: false })
    })
}

exports.deleteCategoryOffer = (req, res) => {
    console.log(req.body);
    offerManagementHelper.deleteCategoryOffer(req.body.category).then((response) => {
        res.json({ status: true })
    })
}

exports.deleteProductOffer = (req, res) => {
    offerManagementHelper.deleteProductOffer(req.body.proId).then((response) => {
        res.json({ status: true })
    })
}

exports.postProductOffer = (req, res) => {
    offerManagementHelper.addProductOffer(req.body).then((response) => {
        console.log("lhkjjgjg");
        res.json({ status: true })
    }).catch(() => {
        res.json({ status: false })
    })
}