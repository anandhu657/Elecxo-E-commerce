exports.adminLogout = (req, res) => {
    delete req.session.admin
    delete req.session.adminLoggedIn
    res.redirect('/admin')
}