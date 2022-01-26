# bootcamp2020c69 - AWS Timestream DB and Visualization with Grafana

## Timestream DB and Visualization with Grafana

### Class Notes

AWS have multiple databases

- DynamoDB
  - Good for serverless model not that good
- DocumentDB
  - Compatable with mangoDB
- RDS
  - Compatable with MySQL
  - Aurora Serverless
- TimestreamDB
  - Time series data compatable
  - Serverless
  - It is not a relational database
  - Auto Scalebale
  - Can be integrated with other services
  - Latest data stored in RAM and then to multiple storages and old data is backed up
  - Real time SQL query database
  - Key Concepts of timestream database
    - Time Series
    - Record
      - Can only update data and cant delete or update data
    - Dimensions
      - Can have max of 128 dimensions
    - Measure
      - Measure name relates to some measure value
      - 1024 measures a table
    - Timestamp
    - Table
    - Database

### Reading Material

- [AWS Timestream Introduction with Apple HealthKit, Grafana and AWS CDK](https://jason-wiker.medium.com/aws-timestream-introduction-with-apple-healthkit-grafana-and-aws-cdk-ccf7baeaaa98)
- [Getting Started with Amazon Timestream](https://www.youtube.com/watch?v=8RHFPNReylI&ab_channel=AmazonWebServices)
- [amazon-timestream-tools](https://github.com/awslabs/amazon-timestream-tools/tree/mainline/sample_apps/js)
- [What Is Amazon Timestream?](https://docs.aws.amazon.com/timestream/latest/developerguide/what-is-timestream.html)
- [Grafana](https://grafana.com/get/)

### Sections

- [AWS Timestream and Visualization with grafana](./step22_aws_timestream_and_visualization_with_grafana)

### Class Videos

- [YouTube English](https://www.youtube.com/watch?v=6kwKtE8d9dc)
- [Facebook English](https://www.facebook.com/zeeshanhanif/videos/10225763251372883)
- [YouTube Urdu](https://www.youtube.com/watch?v=EgYiEO8P704&ab_channel=PanacloudServerlessSaaSTraininginUrdu)
- [Facebook Urdu](https://www.facebook.com/zeeshanhanif/videos/10225811165650710)
