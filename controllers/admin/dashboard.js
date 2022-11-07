const dashboardHelper = require('../../models/admin/dashboard')

exports.getDashboard = (req, res) => {
    res.render('admin/dashboard', { admin: true })
}

exports.getDashboardByDays = (req, res) => {
    dashboardHelper.salesReport(req.params.days).then((response) => {
        res.json(response)
    })
}