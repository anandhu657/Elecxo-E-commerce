const signinHelper = require('../../models/admin/signin')

exports.redirectToAdminLogin = (req, res, next) => {
    res.redirect('/admin/admin_login')
}

exports.getAdminLogin = (req, res) => {
    var adminChecker = req.query.valid;
    res.render('admin/signin', { adminChecker, nohead: true });
}

exports.postAdminLogin = (req, res) => {
    signinHelper.adminSignin(req.body).then((response) => {
        req.session.admin = response.admin
        req.session.adminLoggedIn = true
        res.redirect('/admin/admin_panel/dashboard')
    }).catch((response) => {
        var string = encodeURIComponent(response);
        res.redirect('/admin/admin_login?valid=' + string);
    })
}