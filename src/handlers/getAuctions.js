import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpJsonbodyParser from '@middy/http-json-body-parser'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

// event object will include body, query params path params etc.
async function getAuctions(event, context) {
    let auctions;
    try{
        const result = await dynamodb.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME
        }).promise()

        auctions = result.Items
    }catch(e){
        console.error(e)
        throw new createError.InternalServerError(e)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ auctions }),
    };
}

export const handler = middy(getAuctions)
.use(httpEventNormalizer())
.use(httpErrorHandler());


