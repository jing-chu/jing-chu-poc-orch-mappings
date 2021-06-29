
const AWS = require("aws-sdk")


const TABLE_NAME = "Mappings"   

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient() 

module.exports = (req, res) => {
  let body = '';


    req.on('data', (chunk) => {
        body += chunk;
    })
    req.on('end', async () => {
      const result = await lamdafun(body)
      console.log("my result: ",result)
  })
  res.end('Welcome to THE END')

 
  async function lamdafun (event) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

    const headers = {
      "Content-Type": "application/json"
    }

    try {
      let output

      const input = JSON.parse(event)
      console.log("INPUT:", input)
      if (input.route === "add-item") {
        output = await addOneItem(input)   // PUT
      } else if (input.route === "get-all-items") {
        output = await getAllItems(input)   // QUERY ALL ITEMS FOR A CUSTOMER
      } else if (input.route === "get-item") {
        output = await getOneItem(input)  // QUERY ONE ITEMS
      } else if (input.route === "update-item") {
        output = await updateItem(input)  // UPDATE
      } else if (input.route === "delete-item") {
        output = await deleteItem(input)  //  DELETE
      } else {
        throw new Error("Unsupportted route.")
      }
      return output
    } catch (err) {
        console.error(err)
      }
  }

}
  
//PUT
async function addOneItem(e) {
  let result
  const params = {
    TableName: TABLE_NAME,
    Item: {
      "customer_key": e.customer_key,
      "customer_id": e.customer_id,
      "bot_intent": e.bot_intent,
      "operation": e.operation,
      "info": e.info
    }
  }
  try {
    result = await docClient.put(params).promise()      
  } catch (err) {
    result = err.message
  }
  return result
}

//QUERY ALL
async function getAllItems(e) {
  let result
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "customer_id = :e_id",
    ExpressionAttributeValues: {
      ":e_id": e.customer_id
    }
  }
  try {
    result = await docClient.query(params).promise()      
  } catch(err) {
    result = err.message
  } 
  return result  
}

//QUERY ONE
async function getOneItem(e) {
  let result
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "customer_key": e.customer_key,
      "customer_id": e.customer_id
    }
  }
  try {
    result = await docClient.get(params).promise()      
  } catch(err) {
    result = err.message
  } 
  return result   
}

//UPDATE
async function updateItem(e) {
  let result
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "customer_key": e.customer_key,
      "customer_id": e.customer_id
    },
    ConditionExpression: "attribute_exists(customer_key)",
    UpdateExpression: "set bot_intent = :b, operation = :o, info = :i",
    ExpressionAttributeValues: {
      ":b": e.bot_intent,
      ":o": e.operation,
      ":i": e.info  
    },
    ReturnValues: "UPDATED_NEW"
  }

  try {      
    result = await docClient.update(params).promise() 
  } catch (err) {
    result = err.message
  }
  return result  
}  

//DELETE
async function deleteItem(e) {
  let result 
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "customer_key": e.customer_key,
      "customer_id": e.customer_id
    }
  }
  try {
    result = await docClient.delete(params).promise()
  } catch (err) {
    result = err.message
  }
} 



