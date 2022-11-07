const salesReportHelper = require('../../models/admin/sales-report')

exports.getSalesReport = async (req, res) => {
    if (req.query?.month) {
        let month = req.query?.month.split("-");
        let [yy, mm] = month;
        deliveredOrders = await salesReportHelper.deliveredOrderList(yy, mm);
    } else if (req.query?.daterange) {
        deliveredOrders = await salesReportHelper.deliveredOrderList(req.query);
    } else {
        deliveredOrders = await salesReportHelper.deliveredOrderList();
    }
    res.render("admin/sales-report", { admin: true, deliveredOrders });
}