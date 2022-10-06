var path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');
const { Parser } = require('json2csv');

const {
    validateOrders,
    getAverageProductQuantityPurchasedPerOrder,
    getMostPopularBrandPerProduct
} = require('./src/orders/orders-manager');

const fileName = process.argv.slice(2)[0];

if (!fileName || path.extname(fileName).toLowerCase() != '.csv') {

    console.error('Please pass an argument input file name of extension .csv and ensure it is placed in the data folder.');
    return;
}

const orders = [];

fs.createReadStream(`data/${fileName}`)
    .on('error', e => console.error([e.message, 'Please ensure the csv file is in data folder.'].join('. ')))
    .pipe(parse({ delimiter: ',' }))
    .on('data', row => orders.push(row))
    .on('end', _ => {

        try {

            if (validateOrders(orders) === false) {

                console.error(`Please ensure input csv file has between 1 and ${Math.pow(10, 4)} rows to process.`);
                return;
            }

            let averageProductQuantityPurchasedPerOrder = getAverageProductQuantityPurchasedPerOrder(orders);
            let mostPopularBrandPerProduct = getMostPopularBrandPerProduct(orders);

            console.info('Average product quantity per order', Object.fromEntries(averageProductQuantityPurchasedPerOrder));
            console.info('Most popular brand per product', Object.fromEntries(mostPopularBrandPerProduct));

            const parser = new Parser({ header: false, quote: '' });

            const csvAverageProductQuantityPurchasedPerOrder = parser.parse(averageProductQuantityPurchasedPerOrder);
            const csvMostPopularBrandPerProduct = parser.parse(mostPopularBrandPerProduct);

            fs.writeFile(`output/0_${fileName}`, csvAverageProductQuantityPurchasedPerOrder, error => {

                if (error) throw error;

                console.info(`0_${fileName} created in the output folder.`)
            });

            fs.writeFile(`output/1_${fileName}`, csvMostPopularBrandPerProduct, error => {

                if (error) throw error;

                console.info(`1_${fileName} created in the output folder.`)
            });

        } catch (error) {

            console.error(error);
        }
    });
