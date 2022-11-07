const couponManagementHelper = require('../../models/admin/coupon-management')

exports.getCouponDetails = (req, res) => {
    couponManagementHelper.getCoupon().then((coupons) => {
        res.render('admin/coupons', { admin: true, coupons })
    })
}

exports.postCouponDetails = (req, res) => {
    couponManagementHelper.addCoupon(req.body).then(() => {
        res.json({ status: true })
    })
}

exports.deleteCouponDetails = (req, res) => {
    couponManagementHelper.deleteCoupon(req.body).then(() => {
        res.json({ status: true })
    })
}