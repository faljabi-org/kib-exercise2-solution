const { groupBy, sumBy, maxBy } = require('lodash');

const CSV_FIELD_INDEX = require('../constants/constants');

const validateOrders = orders => {

    return orders.length >= 1 && orders.length <= Math.pow(10, 4);
}

const getAverageProductQuantityPurchasedPerOrder = orders => {

    const averageProductQuantityPurchasedPerOrder = [];

    const ordersGroupedByProductName = groupBy(orders, CSV_FIELD_INDEX.PRODUCT_NAME);

    for (const productName in ordersGroupedByProductName) {

        let totalProductOrders = sumBy(ordersGroupedByProductName[productName], product => parseInt(product[CSV_FIELD_INDEX.ORDER_QUANTITY]))
        averageProductQuantityPurchasedPerOrder.push([productName, totalProductOrders / orders.length]);
    }

    return averageProductQuantityPurchasedPerOrder;
}

const getMostPopularBrandPerProduct = orders => {

    const mostPopularBrandPerProduct = [];

    const ordersGroupedByProductName = groupBy(orders, CSV_FIELD_INDEX.PRODUCT_NAME);

    for (const productName in ordersGroupedByProductName) {

        const ordersGroupedByProductNameThenByBrandName = groupBy(ordersGroupedByProductName[productName], CSV_FIELD_INDEX.BRAND_NAME);
        const mostTotalOrdersPerBrandPerProduct = maxBy(Object.entries(ordersGroupedByProductNameThenByBrandName), o => o[1].length);

        mostPopularBrandPerProduct.push([productName, mostTotalOrdersPerBrandPerProduct[0]]);
    }

    return mostPopularBrandPerProduct;
}

module.exports = {
    validateOrders,
    getAverageProductQuantityPurchasedPerOrder,
    getMostPopularBrandPerProduct
};