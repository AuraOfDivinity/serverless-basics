import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()

// event object will include body, query params path params etc.
async function createAuction(event, context) {
  const { title } = JSON.parse(event.body)
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  }
  // Dyanmic data must never be stored on the global context. This is because the execution time of a lambda function at max is 15 mins

  // Have to follow it up with .promise so that it returns a promise. the default implementation is using callbacks.
  await dynamodb.put({
    TableName: 'AuctionsTable',
    Item: auction
  }).promise()

  // Lambda function is expected to return an object of below format. Note the body must be stringified.
  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;


