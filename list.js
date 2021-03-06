import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const params = {
        TableName: process.env.tableName,
        // 'Key Condition Expression' defines condition for query
        // - 'userId = :userId': only return items with mathcing 'userId'
        // partition key
        // 'ExpressionAttributeValues' defines the value in the condition
        // -':userId': defines 'userId' to be Identity Pool Identity id
        // of authenticated user
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    };

    try {
        const result = await dynamoDbLib.call("query", params);
        // Return the matching list of items in response body
        return success(result.Items);
    } catch (e) {
        return failure({ status: false });
    }
}