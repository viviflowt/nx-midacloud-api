#!/bin/bash

# AWS CLI configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="local"
AWS_SECRET_ACCESS_KEY="local"
AWS_ENDPOINT="http://localhost:4566"

# Resources to be created
AWS_S3_BUCKET="midacloud-bucket"
AWS_SQS_QUEUE="midacloud-queue"
AWS_SNS_TOPIC="midacloud-topic"

echo "Waiting for localstack to be ready..."
until awslocal --endpoint-url=$AWS_ENDPOINT sqs list-queues &>/dev/null; do
  sleep 1
done

echo -e "\n***** proceeding with localstack setup *****\n"
sleep 1

function create_sqs_queue {
  awslocal sqs --endpoint-url=$AWS_ENDPOINT create-queue --queue-name $1 --region $AWS_REGION
  sleep 1
  echo -e "◽ queue $1 created \n"
}

function create_sns_topic {
  awslocal sns --endpoint-url=$AWS_ENDPOINT create-topic --name $1 --region $AWS_REGION
  sleep 1
  echo -e "◽ topic $1 created \n"
}

function subscribe_sns_topic_to_sqs_queue {
  awslocal sns --endpoint-url=$AWS_ENDPOINT subscribe --topic-arn arn:aws:sns:$AWS_REGION:000000000000:$1 --protocol sqs --notification-endpoint arn:aws:sqs:$AWS_REGION:000000000000:$2 --region $AWS_REGION
  sleep 1
  echo -e "◽ topic $1 subscribed to queue $2 \n"
}

function create_s3_bucket {
  awslocal s3api --endpoint-url=$AWS_ENDPOINT create-bucket --bucket $1 --region $AWS_REGION
  sleep 1
  echo -e echo "◽ bucket $1 created \n"
}

create_s3_bucket $AWS_S3_BUCKET
create_sqs_queue $AWS_SQS_QUEUE
create_sns_topic $AWS_SNS_TOPIC
subscribe_sns_topic_to_sqs_queue $AWS_SNS_TOPIC $AWS_SQS_QUEUE

echo -e "localstack setup complete! 🎉\n"
sleep 1
