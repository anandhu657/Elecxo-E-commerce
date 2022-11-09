const couponHelper = require('../../models/user/coupon')
const cartHelper = require('../../models/user/cart')

exports.postCoupon = async (req, res) => {
    let total = await cartHelper.getTotalAmount(req.session.user._id,)
    couponHelper.couponCheck(req.body).then((couponOffer) => {
        if (total > couponOffer.minimumPrice && total < couponOffer.maximumPrice) {
            let offerPrice = (total * couponOffer.percentage) / 100
            offerPrice = parseInt(offerPrice)
            total = total - parseInt(offerPrice)
            console.log(total, offerPrice);
            res.json({ total: total, offer: offerPrice })
        } else {
            let message = "Coupon is valid for purchase above " + couponOffer.minimumPrice + "below " + couponOffer.maximumPrice
            res.json({ msg: message, total: total })
        }
    }).catch(() => {
        res.json({ msg: "Invalid Coupon code", total: total })
    })
}