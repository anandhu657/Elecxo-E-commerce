const profileHelper = require('../../models/user/profile')
const addressHelper = require('../../models/user/address')

exports.getProfile = (req, res) => {
    res.render('user/profile', { user: req.session.user, cartCount: req.session.cartCount })
}

exports.putProfile = (req, res) => {
    profileHelper.editProfile(req.session.user._id, req.body).then((response) => {
        req.session.user = response[0]
        res.json({ status: true })
    })
}

exports.getUserAddress = (req, res) => {
    addressHelper.getAddress(req.session.user._id).then((response) => {
        res.render('user/address', { response, cartCount: req.session.cartCount })
    })
}

exports.getChangePassword = (req, res) => {
    res.render('user/change-password', { cartCount: req.session.cartCount })
}

exports.putChangePassword = (req, res) => {
    profileHelper.changePassword(req.body, req.session.user._id).then((response) => {
        delete req.session.loggedIn
        delete req.session.user
        res.json()
    })
}