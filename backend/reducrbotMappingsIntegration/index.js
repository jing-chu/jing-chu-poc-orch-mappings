const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "Mappings"   

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Headers" : "Content-Type"
  };


  try {
    console.log("INPUT:", event)
    const input = JSON.parse(event.body)
    let output
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
    console.log("my output:", output)
    return {  
      headers,
      output
    }
  } catch (err) {
      console.error(err)
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

//QUERY ALL **NO AUTHORITY FOR QUERY
/**
 * 
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
 */

//Scan
async function getAllItems(e) {
  let result
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "customer_id = :e_id",
    ExpressionAttributeValues: {
      ":e_id": e.customer_id
    }
  }
  try {
    result = await docClient.scan(params).promise()      
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