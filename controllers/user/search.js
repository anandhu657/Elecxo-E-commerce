const searchHelper = require('../../models/user/search')
const categoryHelper = require('../../models/user/home-page')

exports.productSearch = (req, res) => {
    searchHelper.getSearchProduct(req.query.search).then((response) => {
        categoryHelper.getCategory().then((category) => {
            console.log(response);
            res.render('user/category-sort', { category, response, user: req.session.user, cartCount: req.session.cartCount, logout: !req.session.loggedIn })
        })
    }).catch(() => {
        categoryHelper.getCategory().then((category) => {
            res.render('user/category-sort', { category, user: req.session.user, cartCount: req.session.cartCount, logout: !req.session.loggedIn })
        })
    })
}
