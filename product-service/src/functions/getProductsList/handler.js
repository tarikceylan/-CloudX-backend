'use strict';

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const ddbClient = new DynamoDBClient({ region: 'eu-central-1' });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const fetchProductsData = async () => {
  const params = {
    TableName: process.env.ProductsTableName
  };
  const scanCommand = new ScanCommand(params);
  try {
    const result = await ddbDocClient.send(scanCommand);
    return result.Items;
  } catch (error) {
    throw new Error(error);
  }
};

const getProductStock = async (productId) => {
  const params = {
    TableName: process.env.StocksTableName,
    Key: {
      product_id: { S: productId }
    }
  };
  const getItemCommand = new GetItemCommand(params);
  try {
    const result = await ddbDocClient.send(getItemCommand);

    return result.Item.itemCount.N;
  } catch (error) {
    throw new Error(error);
  }
};

const modifyProducts = async () => {
  try {
    const products = await fetchProductsData();
    const modifiedProducts = Promise.all(
      products.map(async (item) => {
        item.count = await getProductStock(item.id);
        return item;
      })
    );
    return modifiedProducts;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.getProductsList = async (event) => {
  const modifiedProducts = await modifyProducts();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(modifiedProducts)
  };
};
