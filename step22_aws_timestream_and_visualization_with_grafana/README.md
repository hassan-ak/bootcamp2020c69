# Step22 AWS Timestream And Visualization with Grafana

## Steps (AWS Console)

1. Login in to AWS website nad naviagte to timestream console
2. Create new database

   - Standard for actual data and sample for sample data
   - Name
   - Select data (IoT or DevOps)

3. Open any table
4. Query table
5. Use SQL queries to query the table

## Steps to code

1. Create new directory using `mkdir step22_aws_timestream_and_visualization_with_grafana`.
2. Navigate to newly created directory using `cd step22_aws_timestream_and_visualization_with_grafana`
3. Create cdk app using `cdk init app --language typescript`
4. Use `npm run watch` to auto transpile the code
5. Install timestream database in the app using `npm i @aws-cdk/aws-timestream`. Update "./lib/step22_aws_timestream_and_visualization_with_grafana-stack.ts" to create a timestream databse and a table

   ```js
   import * as timestream from '@aws-cdk/aws-timestream';
   const TimeStreamDB = new timestream.CfnDatabase(this, 'TimeStreamDB', {
     databaseName: 'TimeStreamDB',
   });
   const DBTable = new timestream.CfnTable(this, 'TSTable', {
      tableName: 'TSTable',
      databaseName: TimeStreamDB.databaseName!,
    });
    DBTable.addDependsOn(TimeStreamDB);
   ```

6. Install timestream database in the app using `npm i @aws-cdk/aws-lambda`. Update "./lib/step22_aws_timestream_and_visualization_with_grafana-stack.ts" and create a lambda funcition to write data intp the datbase and set environment varibales

   ```js
   import * as lambda from '@aws-cdk/aws-lambda';
   const TSlambda = new lambda.Function(this, 'TSLambda', {
     runtime: lambda.Runtime.NODEJS_14_X,
     code: lambda.Code.fromAsset('lambda-fns'),
     handler: 'main.handler',
   });
   TSlambda.addEnvironment('TS_DATABASE_NAME', DBTable.databaseName);
   TSlambda.addEnvironment('TS_TABLE_NAME', DBTable.tableName!);
   ```

7. Create "./lambda-fns/main.ts" to define lambda handler code

   ```js
   const AWS = require('aws-sdk');
   const https = require('https');
   exports.handler = async (event: any) => {
     const body = JSON.parse(event.body);
     try {
       /**
        * Recommended Timestream write client SDK configuration:
        *  - Set SDK retry count to 10.
        *  - Use SDK DEFAULT_BACKOFF_STRATEGY
        *  - Set RequestTimeout to 20 seconds .
        *  - Set max connections to 5000 or higher.
        */
       const agent = new https.Agent({
         maxSockets: 5000,
       });
       const writeClient = new AWS.TimestreamWrite({
         maxRetries: 10,
         httpOptions: {
           timeout: 20000,
           agent: agent,
         },
       });
       const method = event.httpMethod;
       if (method === 'POST') {
         const currentTime = Date.now().toString(); // Unix time in milliseconds
         const dimensions = [
           { Name: 'region', Value: 'us-east-1' },
           { Name: 'az', Value: 'az1' },
           { Name: 'hostname', Value: 'host3' },
         ];
         const cpuUtilization = {
           Dimensions: dimensions,
           MeasureName: 'cpu_utilization',
           MeasureValue: `${body.cpu}`,
           MeasureValueType: 'DOUBLE',
           Time: currentTime.toString(),
         };
         const memoryUtilization = {
           Dimensions: dimensions,
           MeasureName: 'memory_utilization',
           MeasureValue: `${body.memory}`,
           MeasureValueType: 'DOUBLE',
           Time: currentTime.toString(),
         };
         const records = [cpuUtilization, memoryUtilization];
         const params = {
           DatabaseName: process.env.TS_DATABASE_NAME,
           TableName: process.env.TS_TABLE_NAME,
           Records: records,
         };

         await writeClient.writeRecords(params).promise();
       }
       return {
         isBase64Encoded: true,
         statusCode: 200,
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
         },
         body: 'Saved',
       };
     } catch (err) {
       console.log(err);
       return {
         isBase64Encoded: false,
         statusCode: 422,
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
         },
         body: 'Failed',
       };
     }
   };
   ```

8. Install api gateway in the app using `npm i @aws-cdk/aws-apigateway`. Update "./lib/step22_aws_timestream_and_visualization_with_grafana-stack.ts" and create new a rest api to access the lambda function. create APi integration and post method

   ```js
   import * as apigateway from '@aws-cdk/aws-apigateway';
   const postStepsIntegration = new apigateway.LambdaIntegration(TSlambda);
   api.root.addMethod('POST', postStepsIntegration);
   ```

9. Install IAM the app using `npm i @aws-cdk/aws-apigateway`. Update "./lib/step22_aws_timestream_and_visualization_with_grafana-stack.ts" and define a policy and add it to lambda function

   ```js
   import * as iam from '@aws-cdk/aws-iam';
   const policy = new iam.PolicyStatement();
   policy.addActions('timestream:DescribeEndpoints', 'timestream:WriteRecords');
   policy.addResources('*');
   TSlambda.addToRolePolicy(policy);
   ```

10. Deploy the app using `cdk deploy`
11. For visulization naviagte to grafana console or grafana cloud

- Login to Grafana
- Naviagte to plugins and install Amazon timestream
- Add new data source select time stream and add cradentials
- Create new dashboard and add required panels.

---

7. Test using console
8. Destroy using `cdk destroy`
