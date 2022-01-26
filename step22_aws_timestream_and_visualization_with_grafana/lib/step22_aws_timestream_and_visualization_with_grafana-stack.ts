import * as cdk from '@aws-cdk/core';
import * as timestream from '@aws-cdk/aws-timestream';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';

export class Step22AwsTimestreamAndVisualizationWithGrafanaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define a timestream database
    const TimeStreamDB = new timestream.CfnDatabase(this, 'TimeStreamDB', {
      databaseName: 'TimeStreamDB',
    });
    // Database table
    const DBTable = new timestream.CfnTable(this, 'TSTable', {
      tableName: 'TSTable',
      databaseName: TimeStreamDB.databaseName!,
    });
    // Create table after database creation
    DBTable.addDependsOn(TimeStreamDB);

    // Lambda function to add data to db
    const TSlambda = new lambda.Function(this, 'TSLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda-fns'),
      handler: 'main.handler',
    });
    // Set environment variables
    TSlambda.addEnvironment('TS_DATABASE_NAME', DBTable.databaseName);
    TSlambda.addEnvironment('TS_TABLE_NAME', DBTable.tableName!);

    // New Rest API
    const api = new apigateway.RestApi(this, 'TSApi', {
      restApiName: 'TSApi',
      description: 'Testing TSDB',
    });
    // API intergration
    const postStepsIntegration = new apigateway.LambdaIntegration(TSlambda);
    // APi method
    api.root.addMethod('POST', postStepsIntegration);

    // Policy for Time stream db
    const policy = new iam.PolicyStatement();
    policy.addActions(
      'timestream:DescribeEndpoints',
      'timestream:WriteRecords'
    );
    policy.addResources('*');
    TSlambda.addToRolePolicy(policy);
  }
}
