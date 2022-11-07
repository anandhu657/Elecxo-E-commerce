const addressHelper = require('../../models/user/address')

exports.postAddAddress = (req, res) => {
    addressHelper.addAddress(req.body, req.session.user._id).then((response) => {
        res.json({ status: true })
    })
}

exports.getCurrentAddress = async (req, res) => {
    let userAddress = await addressHelper.getOrderAddress(req.session.user._id, req.params.addressId)
    res.json(userAddress)
}

exports.putEditAddress = (req, res) => {
    addressHelper.editAddress(req.body, req.session.user._id).then(() => {
        res.json({ status: true })
    })
}

exports.deleteAddress = (req, res) => {
    addressHelper.deleteAddress(req.session.user._id, req.body.addressId).then(() => {
        res.json({ status: true })
    })
}

exports.getPickAddress = (req, res) => {
    addressHelper.getOrderAddress(req.session.user._id, req.params.addressId).then((address) => {
        res.json(address)
    })
}