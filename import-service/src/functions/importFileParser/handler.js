'use strict';
const csvParser = require('csv-parser');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = 'import-service-dev-tarik';
const s3Client = new S3Client({ region: 'eu-central-1' });

module.exports.importFileParser = async (event) => {
  const productsData = [];
  const params = {
    Bucket: bucketName,
    Key: `uploaded/products.csv`
  };
  try {
    const command = new GetObjectCommand(params);
    const s3Stream = await s3Client.send(command);

    s3Stream.Body.pipe(csvParser())
      .on('data', (data) => {
        console.log(data);
        productsData.push(data);
      })
      .on('error', () => {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Invalid Request!` })
        };
      })
      .on('end', () => {
        console.log(productsData);
        return {
          statusCode: 202,
          body: JSON.stringify({ message: `Successfully read and parsed!` })
        };
      });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(`Internal Server Error: ${error.message}`)
    };
  }
};
