'use strict';

const AWS = require('aws-sdk');
const mockProducts = require('./products');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-central-1'
});

mockProducts.forEach((product) => {
  let params = {
    Item: {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price
    },
    TableName: 'products'
  };
  populateProducts(params);
});

async function populateProducts(item) {
  try {
    await dynamoDb.put(item).promise();
  } catch (err) {
    console.log(err);
  }
}
