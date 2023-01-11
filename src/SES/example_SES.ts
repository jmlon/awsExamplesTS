import dotenv from "dotenv";
import { fromIni } from "@aws-sdk/credential-providers";
import { SendEmailCommand, SESClient, SESClientConfig } from "@aws-sdk/client-ses";
dotenv.config();


const config : SESClientConfig = { 
    region: process.env.REGION,
    credentials: fromIni({ profile: process.env.PROFILE})
};
const sesClient = new SESClient(config);


const createSendEmailCommand = (toAddress:string, fromAddress:string, subject:string, text:string) => {
    return new SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `<html><body>${text}</body></html>`,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: text,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};



async function sendEmail() {
    const cmd: SendEmailCommand = createSendEmailCommand(
        "sender@sample.com",
        "recipient@sample.com",
        "Test menssage",
        "Sample content for the email");

    try {
        return await sesClient.send(cmd);

    } catch (e) {
        console.error("Failed to send email.\n", e);
        return e;
    }

}


(async () => {
    await sendEmail();

})();
