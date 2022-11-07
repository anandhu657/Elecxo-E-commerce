const userManagementHelper = require('../../models/admin/user-management')

exports.getUserDetails = (req, res) => {
    userManagementHelper.listUser().then((response) => {
        res.render('admin/list-user', { response, admin: true });
    })
}

exports.changeUserDetails = (req, res) => {
    userManagementHelper.changeUserStatus(req.params.id).then((response) => {
        res.redirect('/admin/admin_panel/list_user')
    })
}