import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

// event object will include body, query params path params etc.
async function getAuction(event, context) {
    const { id } = event.pathParameters
    let auction;

    try{
        const result = await dynamodb.get({TableName : process.env.AUCTIONS_TABLE_NAME, Key: { id}}).promise()
        auction = result.Item

        if(!auction){
            throw new createError.NotFound(`Auction with ID ${id} not found.`)
        }
    }catch(e){
        console.error(e)
        throw new createError.InternalServerError(e)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ auction }),
    };
}

export const handler = middy(getAuction)
.use(httpEventNormalizer())
.use(httpErrorHandler());


