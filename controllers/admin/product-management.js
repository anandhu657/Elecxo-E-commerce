const productManagementHelper = require('../../models/admin/product-management')
const categoryManagementHelper = require('../../models/admin/category-management')
// const mkdirp = require('mkdirp');
const cloudinary = require('../../utils/cloudinary');

exports.getProductDetails = (req, res) => {
    productManagementHelper.getProducts().then((response) => {
        res.render('admin/product', { response, admin: true })
    })
}

exports.deleteProductDetails = (req, res) => {
    productManagementHelper.deleteProduct(req.params.id).then(() => {
        res.redirect('/admin/admin_panel/products')
    })
}

exports.getAddProducts = (req, res) => {
    categoryManagementHelper.getCategories().then((category) => {
        res.render('admin/add_product', { category, admin: true })
    })
}

exports.postAddProduct = async (req, res) => {
    const cloudinaryImageUploadMethod = (file) => {
        return new Promise((resolve) => {
            cloudinary.uploader.upload(file, (err, res) => {
                if (err) return res.status(500).send("upload image error");
                resolve(res.secure_url);
            });
        });
    };

    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();

    const urls = await Promise.all(
        arr2.map(async (file) => {
            const { path } = file;
            const result = await cloudinaryImageUploadMethod(path);
            return result;
        })
    )
    console.log(urls);
    productManagementHelper.addProduct(req.body, urls, () => {
        res.redirect('/admin/admin_panel/products')
    })
}

exports.getEditProduct = (req, res) => {
    productManagementHelper.getProductById(req.params.id).then((response) => {
        categoryManagementHelper.getCategories().then((category) => {
            res.render('admin/edit_product', { response, admin: true, category })
        })
    })
}

exports.postEditProduct = async (req, res) => {
    var oldImages = await productManagementHelper.getProductImage(req.params.id)
    oldImages = oldImages.images
    if (req.files.length > 0) {

        const cloudinaryImageUploadMethod = async (file) => {
            return new Promise((resolve) => {
                cloudinary.uploader.upload(file, (err, res) => {
                    if (err) return res.status(500).send("upload image error");
                    resolve(res.secure_url);
                });
            });
        };

        const urls = [];
        const files = req.files;
        if (files) {
            for (const file of files) {
                const { path } = file;
                const newPath = await cloudinaryImageUploadMethod(path);
                urls.push(newPath);
            }
        }

        oldImages.splice(0, urls.length, ...urls);
    }

    productManagementHelper.editProduct(req.params.id, req.body, oldImages).then(() => {
        res.redirect('/admin/admin_panel/products')
    })
}