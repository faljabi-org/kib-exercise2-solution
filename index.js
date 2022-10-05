const fs = require('fs');
var path = require('path');
const { parse } = require('csv-parse');
const { groupBy, sumBy, maxBy } = require('lodash');
const { Parser } = require('json2csv');

const CSV_FIELD_INDEX = require('./constants');

const fileName = process.argv.slice(2)[0];

if (path.extname(fileName).toLowerCase() != '.csv') {

    console.error('Please ensure to have an input file of extension .csv');
    return;
}

const orders = [];
const averageProductQuantity = [];
const mostPopularBrandPerProduct = [];

fs.createReadStream(`data/${fileName}`)
    .on('error', e => console.error([e.message, 'Please ensure the csv file is in data folder.'].join('. ')))
    .pipe(parse({ delimiter: ',' }))
    .on('data', row => orders.push(row))
    .on('end', _ => {

        if (orders.length < 1 || orders.length > Math.pow(10, 4)) {

            console.error('Please ensure the csv file has between 1 and 10^4 rows to process');
            return;
        }

        const ordersGroupedByProductName = groupBy(orders, CSV_FIELD_INDEX.PRODUCT_NAME);

        for (const productName in ordersGroupedByProductName) {

            // Generate 0_input_file_name data

            let totalProductOrders = sumBy(ordersGroupedByProductName[productName], product => parseInt(product[CSV_FIELD_INDEX.ORDER_QUANTITY]))
            averageProductQuantity.push([productName, totalProductOrders / orders.length]);

            // Generate 1_input_file_name data

            const ordersGroupedByProductNameAndBrandName = groupBy(ordersGroupedByProductName[productName], CSV_FIELD_INDEX.BRAND_NAME);
            const mostTotalOrdersPerBrandPerProduct = maxBy(Object.entries(ordersGroupedByProductNameAndBrandName), o => o[1].length);

            mostPopularBrandPerProduct.push([productName, mostTotalOrdersPerBrandPerProduct[0]]);
        }

        console.info('Average product quantity per order', Object.fromEntries(averageProductQuantity));
        console.info('Most popular brand per product', Object.fromEntries(mostPopularBrandPerProduct));

        try {

            const parser = new Parser({ header: false, quote: '' });

            const csvAverageProductQuantity = parser.parse(averageProductQuantity);
            const csvMostPopularBrandPerProduct = parser.parse(mostPopularBrandPerProduct);

            fs.writeFile(`output/0_${fileName}`, csvAverageProductQuantity, error => {

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
