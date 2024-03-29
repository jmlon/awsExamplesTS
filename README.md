# Examples using AWS services with TypeScript

## Install yarn globally
```
npm install -g yarn
```

## Installing required dependencies
```
# One by one
yarn add @types/node --dev
yarn add @aws-sdk/credential-providers
yarn add @aws-sdk/client-s3
yarn add @aws-sdk/client-dynamodb
yarn add @aws-sdk/client-ses
yarn add @aws-sdk/client-sqs
yarn add dotenv
yarn add ioredis
yarn add tsc-watch --dev

yarn add date-and-time
yarn add @types/date-and-time --dev

# Installing dependencies described in package.json
yarn install 

# Upgrading dependencies to latest versions
yarn upgrade --latest
```

## Environment configuration 

### Using ES Modules instead of CommonJS
In `package.json` : "type": "module", "scripts":{"build":"tsc",...}

### For compiling TS
In `tsconfig.json` : "outDir":"./dist", "target":"es2020", "module":"NodeNext", "moduleResolution":"NodeNext"  
Terminal -> Configure default build task : `tsc: watch - tsconfig.json`  
Ctrl-Shift-B    : Start running the compilation task  

## App configuration
Edit `.env` file and set all the required variables.  
```
REGION=us-east-1
PROFILE=YOUR_CREDENTIALS_PROFILE
```

## Runing the examples
```
node dist/S3/example_S3.js
node dist/DynamoDB/example_DynamoDB.js
node .\dist\DynamoDB\importCSV.js
```

## Running predefined entry points
```
yarn run build
yarn run test
```




## Documentation

[AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/introduction/)  
[AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)  
[API Reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)  
[Github SDK Examples](https://github.com/awsdocs/aws-doc-sdk-examples)  
[How to setup Node.js with TypeScript in 2023](https://fireship.io/lessons/typescript-nodejs-setup/)  
[yarn installation](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-the-yarn-package-manager-for-node-js)   


### MemoryDB / Redis
[API](https://ioredis.readthedocs.io/en/latest/API/)  
[Access Amazon MemoryDB for Redis from AWS Lambda](https://aws.amazon.com/blogs/database/access-amazon-memorydb-for-redis-from-aws-lambda/)  


