// based on examples from:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html

import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fromIni } from "@aws-sdk/credential-providers";
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { CreateBucketCommand, CreateBucketCommandOutput } from "@aws-sdk/client-s3";
import { ListBucketsCommand, ListBucketsOutput } from "@aws-sdk/client-s3";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3";
import { ListObjectsCommand, ListObjectsCommandInput, ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3";
import { DeleteBucketCommand, DeleteBucketCommandInput } from "@aws-sdk/client-s3";
dotenv.config();


const config : S3ClientConfig = { 
    region: process.env.REGION,
    credentials: fromIni({ profile: process.env.PROFILE})
};
const s3Client = new S3Client(config);


async function createBucket(bucket: string) {
    try {
    const response:CreateBucketCommandOutput = await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
    console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


async function listBuckets() {
    try {
        const data: ListBucketsOutput = await s3Client.send(new ListBucketsCommand({}));
        if (data.Buckets != undefined) 
            for(const b of data.Buckets) {
                console.log(b.Name);
            }
    }
    catch(err) {
        console.error(err);
    }
}


async function createObject(bucketName: string, objectKey: string, body: string) {
    // Overwrite object ok, no error
    try {
        const cmdInput: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: objectKey,
            Body: body
        };
        const command = new PutObjectCommand(cmdInput)
        const response = await s3Client.send(command);
        console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


async function createObjectFromStream(bucketName: string, filename: string) {
    try {
        const cmdInput: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: path.basename(filename),
            Body: fs.createReadStream(filename)
        };
        const command = new PutObjectCommand(cmdInput)
        const response = await s3Client.send(command);
        console.log(response);
    }
    catch(err) {
        console.error(err);
    }
}


async function getObject(bucket: string, key: string) {
    try {
        const cmdInput: GetObjectCommandInput = {
            Bucket: bucket,
            Key: key
        };
        const response = await s3Client.send(new GetObjectCommand(cmdInput));
        const data = await response.Body?.transformToString();
        console.log(data);
    }
    catch(err) {
        console.error(err);
    }
}


async function listObjects(bucket: string) {
    try {
        const bucketParams: ListObjectsCommandInput =  {
            Bucket: bucket
        };
        const resp: ListObjectsCommandOutput = await s3Client.send(new ListObjectsCommand(bucketParams));
        // console.log(resp);
        if (resp.Contents) {
            for(let object of resp.Contents) {
                console.log(object.Key);
            }
        }
    }
    catch(err) {
        console.error(err);
    }
}


async function listObjectsMoreThan1000(bucket: string) {
    let truncated = true;
    let pageMarker;
    while(truncated) {
        try {
            const bucketParams: ListObjectsCommandInput =  {
                Bucket: bucket
            };
            const resp: ListObjectsCommandOutput = await s3Client.send(new ListObjectsCommand(bucketParams));
            truncated = resp.IsTruncated ? resp.IsTruncated : false;
            if (resp.Contents) {
                if (truncated) {
                    pageMarker = resp.Contents.slice(-1)[0].Key;
                    bucketParams.Marker = pageMarker;
                }
                for(let object of resp.Contents) {
                    console.log(object.Key);
                }
            }
        }
        catch(err) {
            console.error(err);
        }
    
    }
}


async function deleteObject(bucket: string, key: string) {
    try {
        const params: DeleteObjectCommandInput = {
            Bucket: bucket,
            Key: key
        };
        const resp = await s3Client.send(new DeleteObjectCommand(params));
        console.log(resp);
    }
    catch(err) {
        console.error(err);
    }
}


async function deleteBucket(bucket: string) {
    try {
        const params: DeleteBucketCommandInput = {
            Bucket: bucket
        };
        const resp = await s3Client.send(new DeleteBucketCommand(params));
        console.log(resp);
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
    const bucket = 'alittlebucketfortesting';
    // await createBucket(bucket);
    await listBuckets();
    // createObject(bucket, 'dir1/dir2/object.txt', 'This is a test body');
    // createObjectFromStream(bucket, 'D:\\Downloads\\object2.txt');
    // getObject(bucket, 'dir1/dir2/object.txt');
    // getObject(bucket, 'object2.txt');
    // listObjects(bucket);
    // listObjectsMoreThan1000(bucket);
    // deleteObject(bucket, 'object2.txt');
    // deleteObject(bucket, 'dir1/dir2/object.txt');
    // deleteBucket(bucket);
})();

