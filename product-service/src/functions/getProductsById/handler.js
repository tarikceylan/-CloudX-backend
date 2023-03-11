'use strict';

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const ddbClient = new DynamoDBClient({ region: 'eu-central-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const fetchProductData = async (productId) => {
  const params = {
    TableName: process.env.ProductsTableName,
    Key: {
      id: { S: productId }
    }
  };
  const getItemCommand = new GetItemCommand(params);
  try {
    const result = await ddbDocClient.send(getItemCommand);
    const unmarshalledItem = unmarshall(result.Item);
    return unmarshalledItem;
  } catch (error) {
    console.log(error);
  }
};

const fetchProductStock = async (productId) => {
  const params = {
    TableName: process.env.StocksTableName,
    Key: {
      product_id: { S: productId }
    },
    ProjectionExpression: 'itemCount'
  };
  const getItemCommand = new GetItemCommand(params);
  try {
    const result = await ddbDocClient.send(getItemCommand);
    const unmarshalledItemStock = unmarshall(result.Item);
    return unmarshalledItemStock;
  } catch (error) {
    console.log(error);
  }
};

const modifyProduct = async (productId) => {
  try {
    const product = await fetchProductData(productId);
    const productStock = await fetchProductStock(productId);
    product.count = productStock.itemCount;
    console.log(product);
    return product;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getProductsById = async (event) => {
  const { id } = event.pathParameters;
  const modifiedProduct = await modifyProduct(id);
  if (!modifiedProduct) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Product '${id}' not found` })
    };
  } else {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(modifiedProduct)
    };
  }
};
