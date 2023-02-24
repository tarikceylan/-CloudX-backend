'use strict';

const mockProducts = require('../../../data/products');

module.exports.getProductsById = async (event) => {
  const { id } = event.pathParameters;
  const foundProduct = await mockProducts.find((product) => product.id === id);
  if (foundProduct) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(foundProduct)
    };
  } else {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: `Product '${id}' not found` })
    };
  }
};
