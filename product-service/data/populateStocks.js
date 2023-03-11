'use strict';

const AWS = require('aws-sdk');
const mockStocks = require('../data/stocks');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-central-1'
});

mockStocks.forEach((productStock) => {
  let params = {
    Item: {
      product_id: productStock.product_id,
      itemCount: productStock.itemCount
    },
    TableName: 'stocks'
  };
  populateStocks(params);
});

async function populateStocks(item) {
  try {
    await dynamoDb.put(item).promise();
  } catch (err) {
    throw err;
  }
}
