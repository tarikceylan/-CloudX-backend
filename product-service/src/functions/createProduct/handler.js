'use strict';

const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: 'eu-central-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const putItem = async (item) => {
  const params = {
    TableName: process.env.ProductsTableName,
    Item: item
  };

  const putCommand = new PutItemCommand(params);

  try {
    await ddbDocClient.send(putCommand);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.createProduct = async (event) => {
  if (event.body) {
    const { newItem } = event.body;
    await putItem(newItem);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `All Fields are required` })
    };
  }
};
