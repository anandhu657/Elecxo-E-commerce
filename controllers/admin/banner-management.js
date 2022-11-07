const bannerManagementHelper = require('../../models/admin/banner-management')
const cloudinary = require('../../utils/cloudinary')

exports.getBannerDetails = (req, res) => {
    bannerManagementHelper.getBanner().then((response) => {
        res.render('admin/banner', { admin: true, response })
    })
}

exports.postBannerDetails = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    let image_url = result.secure_url
    console.log(image_url);
    bannerManagementHelper.bannerUpload(image_url).then(() => {
        res.redirect('/admin/admin_panel/banner')
    })
}

exports.deleteBannerDetails = (req, res) => {
    console.log(req.body);
    const bannerId = req.body.bannerId;
    bannerManagementHelper.deleteBanner(bannerId).then(() => {
        res.json({ status: true })
    })
}