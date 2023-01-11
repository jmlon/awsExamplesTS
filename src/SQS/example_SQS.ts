import dotenv from "dotenv";
import { fromIni } from "@aws-sdk/credential-providers";
import { CreateQueueCommand, CreateQueueCommandInput, DeleteQueueCommand, DeleteQueueCommandInput, ReceiveMessageCommand, ReceiveMessageCommandInput, SendMessageCommand, SendMessageCommandInput, SQSClient, SQSClientConfig } from "@aws-sdk/client-sqs";
dotenv.config();


const config: SQSClientConfig = {
    region: process.env.REGION,
    credentials: fromIni({ profile: process.env.PROFILE })
};
const sqsClient = new SQSClient(config);


async function sendMessage(queue_url: string) {
    const params: SendMessageCommandInput = {
        DelaySeconds: 10,
        MessageAttributes: {
            Title: {
                DataType: "String",
                StringValue: "The Whistler",
            },
            Author: {
                DataType: "String",
                StringValue: "John Grisham",
            },
            WeeksOn: {
                DataType: "Number",
                StringValue: "6",
            },
        },
        MessageBody:
            "Information about current NY Times fiction bestseller for week of 12/11/2016.",
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl: queue_url //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
    };

    try {
        const response = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", response.MessageId);
        console.log(response);
    } catch (err) {
        console.error("Error", err);
    }

}


async function receiveMessage(queue_url: string) {
    const params: ReceiveMessageCommandInput = {
        AttributeNames: ["SentTimestamp"],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ["All"],
        QueueUrl: queue_url,
        WaitTimeSeconds: 20,
    };
    try {
        const response = await sqsClient.send(new ReceiveMessageCommand(params));
        console.log("Success, ", response);
    } catch (err) {
        console.error("Error", err);
    }
}


async function createQueue(queue_name: string) {
    const params: CreateQueueCommandInput = {
        QueueName: queue_name,
        Attributes: {
            DelaySeconds: "60", // Number of seconds delay.
            MessageRetentionPeriod: "86400", // Number of seconds delay.
        },
    };
    try {
        const response = await sqsClient.send(new CreateQueueCommand(params));
        console.log("Success", response);
    } catch (err) {
        console.error("Error", err);
    }
}


async function deleteQueue(queue_url: string) {
    const params: DeleteQueueCommandInput = { QueueUrl: queue_url };
    try {
        const data = await sqsClient.send(new DeleteQueueCommand(params));
        console.log("Success", data);
        return data; // For unit tests.
    } catch (err) {
        console.error('Error:', err);
    }
}


(async () => {
    const queue_name = 'SAMPLE_QUEUE';
    const queue_url = 'https://sqs.us-east-1.amazonaws.com/${process.env.ACCOUNT}/${queue_name}';
    // await createQueue(queue_name);
    // await sendMessage(queue_url);
    // await receiveMessage(queue_url);
    await deleteQueue(queue_url);


})();

