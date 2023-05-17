const categoryManagementHelper = require('../../models/admin/category-management')

exports.getCategoryDetails = (req, res) => {
    categoryManagementHelper.getCategories().then((response) => {
        res.render('admin/category-management', { response, admin: true})
    })
}

exports.postCategoryDetails = (req, res) => {
    categoryManagementHelper.setCategory(req.body).then((id) => {
        res.json({ status: true })
        // res.json({ msg: 'Category added successfully' })
    }).catch(() => {
        res.redirect('/admin/admin_panel/category-management')
        // res.json({ msg: 'Category already exist' })
    })
}

exports.putCategoryDetails = (req, res) => {
    categoryManagementHelper.editCategory(req.body).then(() => {
        res.json({ status: true })
    }).catch(() => {
        res.json({ status: false })
    })
}

exports.deleteCategoryDetails = (req, res) => {
    categoryManagementHelper.deleteCategory(req.params.id).then((response) => {
        res.redirect('/admin/admin_panel/category-management')
    })
}