const db = require('../../config/connection');
const collection = require('../../config/collection');

exports.deliveredOrderList = (yy, mm) => {
    return new Promise(async (resolve, reject) => {
        let agg = [{
            $match: {
                status: 'delivered'
            }
        }, {
            $unwind: {
                path: '$products'
            }
        }, {
            $project: {
                totalAmount: 1,
                paymentMethod: 1,
                statusUpdateDate: 1,
                status: 1,
            }
        }]

        if (mm) {
            let start = "1"
            let end = "30"
            let fromDate = mm.concat("/" + start + "/" + yy)
            let fromD = new Date(new Date(fromDate).getTime() + 3600 * 24 * 1000)

            let endDate = mm.concat("/" + end + "/" + yy)
            let endD = new Date(new Date(endDate).getTime() + 3600 * 24 * 1000)



            dbQuery = {
                $match: {
                    statusUpdateDate: {
                        $gte: fromD,
                        $lte: endD
                    }
                }
            }

            agg.unshift(dbQuery)
            let deliveredOrders = await db
                .get()
                .collection(collection.ORDER_COLLECTION)
                .aggregate(agg).toArray()
            resolve(deliveredOrders)


        } else if (yy) {
            let dateRange = yy.daterange.split("-")
            let [from, to] = dateRange
            from = from.trim("")
            to = to.trim("")
            fromDate = new Date(new Date(from).getTime() + 3600 * 24 * 1000)
            toDate = new Date(new Date(to).getTime() + 3600 * 24 * 1000)

            dbQuery = {
                $match: {
                    statusUpdateDate: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            }

            agg.unshift(dbQuery)
            let deliveredOrders = await db
                .get()
                .collection(collection.ORDER_COLLECTION)
                .aggregate(agg).toArray()
            resolve(deliveredOrders)

        } else {

            let deliveredOrders = await db
                .get()
                .collection(collection.ORDER_COLLECTION)
                .aggregate(agg).toArray()
            resolve(deliveredOrders)
        }
    })
}