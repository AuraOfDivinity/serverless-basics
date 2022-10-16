// event object will include body, query params path params etc.
async function createAuction(event, context) {
  const { title } = JSON.parse(event.body)
  const now = new Date()

  const auction = {
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  }
  // Dyanmic data must never be stored on the global context. 

  // Lambda function is expected to return an object of below format. Note the body must be stringified.
  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;


