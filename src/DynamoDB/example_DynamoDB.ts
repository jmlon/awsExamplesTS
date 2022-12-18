// based on examples from:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-examples-using-tables.html

import { fromIni } from "@aws-sdk/credential-providers";
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand, CreateTableCommandInput, CreateTableCommandOutput } from "@aws-sdk/client-dynamodb";
import { ListTablesCommand, ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";

const config : DynamoDBClientConfig = { 
    region: process.env.REGION,
    credentials: fromIni({ profile: process.env.PROFILE})
};
const ddbClient = new DynamoDBClient(config);



async function createTable() {
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
              TableName: "TEST_TABLE", //TABLE_NAME
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
        console.log(response);
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


async function funct() {
    try {

    }
    catch(err) {
        console.error(err);
    }
}


(async () => {
    // createTable();
    listTables();
})();