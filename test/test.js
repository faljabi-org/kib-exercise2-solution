var assert = require('assert');
const fs = require('fs');
const { parse } = require('csv-parse');

const {
    validateOrders,
    getAverageProductQuantityPurchasedPerOrder,
    getMostPopularBrandPerProduct
} = require('../src/orders/orders-manager');

describe('Orders', () => {

    describe('#validateOrders()', () => {

        it(`should return true when passing input_example.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/input_example.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.equal(validateOrders(orders), true);
                });
        });

        it(`should return true when passing order_log00.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/order_log00.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.equal(validateOrders(orders), true);
                });
        });

        it(`should return false when passing invalid_example.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/invalid_example.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.equal(validateOrders(orders), false);
                });
        });

    });

    describe('#getAverageProductQuantityPurchasedPerOrder()', () => {

        it(`should match expected result when passing input_example.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/input_example.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.deepEqual(Object.fromEntries(getAverageProductQuantityPurchasedPerOrder(orders)), { shoes: 2, forks: 0.75 });
                });
        });

        it(`should match expected result when passing passing order_log00.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/order_log00.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.deepEqual(
                        Object.fromEntries(getAverageProductQuantityPurchasedPerOrder(orders)),
                        { 'Intelligent Copper Knife': 2.4, 'Small Granite Shoes': 0.8 }
                    );
                });
        });
    });

    describe('#getMostPopularBrandPerProduct()', () => {

        it(`should match expected result when passing input_example.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/input_example.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.deepEqual(
                        Object.fromEntries(getMostPopularBrandPerProduct(orders)),
                        { shoes: 'Air', forks: 'Pfitzcraft' }
                    );
                });
        });

        it(`should match expected result when passing order_log00.csv as orders`, () => {

            const orders = [];

            fs.createReadStream(`data/order_log00.csv`)
                .pipe(parse({ delimiter: ',' }))
                .on('data', row => orders.push(row))
                .on('end', () => {

                    assert.deepEqual(Object.fromEntries(getMostPopularBrandPerProduct(orders)), {
                        'Intelligent Copper Knife': 'Hilll-Gorczany ',
                        'Small Granite Shoes': 'Rowe and Legros '
                    });
                });
        });
    });
    
});
