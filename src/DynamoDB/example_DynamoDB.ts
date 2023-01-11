// based on examples from:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-examples-using-tables.html

import dotenv from "dotenv";
import { fromIni } from "@aws-sdk/credential-providers";
import { DynamoDBClient, DynamoDBClientConfig, AttributeValue } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand, CreateTableCommandInput, CreateTableCommandOutput } from "@aws-sdk/client-dynamodb";
import { ListTablesCommand, ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";
import { DeleteTableCommand, DeleteTableCommandInput } from "@aws-sdk/client-dynamodb";
import { DescribeTableCommand, DescribeTableCommandInput } from "@aws-sdk/client-dynamodb";
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DeleteItemCommand, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb";
import { BatchWriteItemCommand, BatchWriteItemCommandInput } from "@aws-sdk/client-dynamodb";
import { BatchGetItemCommand, BatchGetItemCommandInput, BatchGetItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { QueryCommand, QueryCommandInput, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
 
dotenv.config();

const config : DynamoDBClientConfig = { 
    region: process.env.REGION,
    credentials: fromIni({ profile: process.env.PROFILE})
};
const ddbClient = new DynamoDBClient(config);



export async function createTable(tablename: string) {
    try {
        const params: CreateTableCommandInput = {
            AttributeDefinitions: [
                {
                  AttributeName: "Season", //ATTRIBUTE_NAME_1
                  AttributeType: "N", //ATTRIBUTE_TYPE
                },
                {
                  AttributeName: "Episode", //ATTRIBUTE_NAME_2
                  AttributeType: "N", //ATTRIBUTE_TYPE
                },
              ],
              KeySchema: [
                {
                  AttributeName: "Season", //ATTRIBUTE_NAME_1
                  KeyType: "HASH",
                },
                {
                  AttributeName: "Episode", //ATTRIBUTE_NAME_2
                  KeyType: "RANGE",
                },
              ],
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
              TableName: tablename, //TABLE_NAME
              StreamSpecification: {
                StreamEnabled: false,
              },            
        };
        const response: CreateTableCommandOutput = await ddbClient.send(new CreateTableCommand(params));
        console.log(response);

    }
    catch(err) {
        console.error(err);
    }
}


async function listTables() {
    try {
        const response: ListTablesCommandOutput = await ddbClient.send(new ListTablesCommand({}));
        // console.log(response);
        if (response.TableNames) {
            for(let table of response.TableNames) {
                console.log(table);
            }
        }
    }
    catch(err) {
        console.error(err);
    }
}


export async function deleteTable(tablename: string) {
    try {
        const params: DeleteTableCommandInput =  {
            TableName: tablename,
        };
        const response = await ddbClient.send(new DeleteTableCommand(params));
        console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


async function describeTable(tablename: string) {
    try {
        const params: DescribeTableCommandInput =  {
            TableName: tablename,
        };
        const response = await ddbClient.send(new DescribeTableCommand(params));
        console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


export async function putItem(tablename: string, item: Record<string, AttributeValue>) {
    // inserts/overwrites item associated with key
    // allows extra fields
    try {
        const params: PutItemCommandInput = {
            TableName: tablename,
            Item: item,
        };
        const response = await ddbClient.send(new PutItemCommand(params));
        //   console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


async function updateItem(tablename: string, key: Record<string,AttributeValue>, newValue: Record<string,AttributeValue>) {
    try {
        const params: UpdateItemCommandInput = {
            TableName: tablename,
            Key: key,
            UpdateExpression: "set Title = :t",
            ExpressionAttributeValues: newValue,
            ReturnValues: "ALL_NEW"
        };
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log(data);        
    }
    catch(err) {
        console.error(err);
    }
}


async function getItem(tablename: string, key: Record<string,AttributeValue>) {
    try {
        const params: GetItemCommandInput = {
            TableName: tablename,
            Key: key,
            ProjectionExpression: "Season, Episode, Title",
        };
        const response = await ddbClient.send(new GetItemCommand(params));
        console.log("Retrieved item:\n", response.Item);
    }
    catch(err) {
        console.error(err);
    }
}


async function deleteItem(tablename: string, key: Record<string,AttributeValue>) {
    try {
        const params: DeleteItemCommandInput = {
            TableName: tablename,
            Key: key
        };
        const response = await ddbClient.send(new DeleteItemCommand(params));
        console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


async function batchWriteItem(tablename: string) {
    try {
        const params: BatchWriteItemCommandInput = {
            RequestItems: {
              [tablename]: [
                {
                  PutRequest: {
                    Item: {
                      Season: { N: "1" },
                      Episode: { N: "2" },
                      Title: { S: "The naked now" }
                    },
                  },
                },
                {
                  PutRequest: {
                    Item: {
                      Season: { N: "2" },
                      Episode: { N: "1" },
                      Title: { S: "The child" },
                    },
                  },
                },
              ],
            },
        };
        const response = await ddbClient.send(new BatchWriteItemCommand(params));
        console.log("Batch write success:\n", response);
    }
    catch(err) {
        console.error(err);
    }
}


async function batchGetItem(tablename: string) {
    try {
        const params: BatchGetItemCommandInput = {
            RequestItems: {
              [tablename]: {
                Keys: [
                  {
                    Season: { N: "1" },
                    Episode: { N: "3" }
                  },
                  {
                    Season: { N: "2" },
                    Episode: { N: "4" }
                  }
                ],
                ProjectionExpression: "Title",
              },
            },
        };
        const response: BatchGetItemCommandOutput = await ddbClient.send(new BatchGetItemCommand(params));
        // console.log("Success, items retrieved", response);
        if (response.Responses) {
            for (let rec of response.Responses[tablename]) {
                console.log(rec);
            }
        }
    }
    catch(err) {
        console.error(err);
    }
}


async function queryTable(tablename: string) {
    try {
        const params: QueryCommandInput = {
            KeyConditionExpression: "Season = :s and Episode > :e",
            FilterExpression: "contains (Title, :topic)",   // looks for substring, case-sensitive
            ExpressionAttributeValues: {
                ":s": { N: "1" },
                ":e": { N: "3" },
                ":topic": { S: "one" },
            },
            ProjectionExpression: "Season, Episode, Title",
            TableName: tablename,
        };
        const response: QueryCommandOutput = await ddbClient.send(new QueryCommand(params));
        response.Items?.forEach(item => {
            console.log(`${item.Season.N} - ${item.Episode.N} : title = ${item.Title.S}`);
        });
    }
    catch(err) {
        console.error(err);
    }
}


async function scanTable(tablename: string) {
    try {
        const params = {
            // Specify which items in the results are returned.
            //FilterExpression: "Subtitle = :topic AND Season = :s AND Episode = :e",
            // Define the expression attribute value, which are substitutes for the values you want to compare.
            // ExpressionAttributeValues: {
            //     ":topic": { S: "SubTitle2" },
            //     ":s": { N: "1" },
            //     ":e": { N: "2" },
            // },
            // Set the projection expression, which the the attributes that you want.
            ProjectionExpression: "Season, Episode, Title",
            TableName: tablename,
        };
        const response = await ddbClient.send(new ScanCommand(params));
        response.Items?.forEach(item => {
            console.log(item.Title.S);
        });
    }
    catch(err) {
        console.error(err);
    }
}


async function funct() {
    try {

    }
    catch(err) {
        console.error(err);
    }
}


(async () => {
    const tableName = 'TEST_TABLE';
    // await createTable(tableName);
    // await listTables();
    // await describeTable(tableName);
    // await putItem(tableName, {
    //     Season: { N: "1" },
    //     Episode: { N: "1" },
    //     Title: { S: "Encounter at farpoint very far away" }
    // });
    // await updateItem(tableName, {
    //     Season: {"N":"1"},
    //     Episode: {"N":"1"} }, 
    //     {
    //         ":t": {"S":"Encounter at farpoint"},
    // });
    // await getItem(tableName, {
    //     Season: {"N":"1"},
    //     Episode: {"N":"1"} 
    // });
    // await deleteItem(tableName, {
    //     Season: {"N":"1"},
    //     Episode: {"N":"1"} 
    // });
    // await batchWriteItem(tableName);
    // await batchGetItem(tableName);
    // await queryTable(tableName);
    await scanTable(tableName);

    // await deleteTable(tableName);
})();