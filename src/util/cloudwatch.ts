import AWS from 'aws-sdk'
import { config } from 'dotenv';

config();

const AWS_REGION = process.env.AWS_REGION;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';

const cloudwatch = new AWS.CloudWatchLogs({
	region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
})

const logGroupName = 'employgig-log-group';
const logStreamName = 'employgig-log-stream';

async function initCloudwatch() {
	try {
	  const response = await cloudwatch.createLogGroup({ logGroupName }).promise();
    console.log("log group created", response)
	} catch (err: any) {
		if (err.code !== 'ResourceAlreadyExistsException') {
			console.error('Error creating log group:', err);
		}
	}

	try {
		const response = await cloudwatch.createLogStream({ logGroupName, logStreamName }).promise();
    console.log('log stream created', response);
	} catch (err: any) {
		if (err.code !== 'ResourceAlreadyExistsException') {
			console.error('Error creating log stream:', err);
		}
	}
}

let sequenceToken: string | undefined;

async function logToCloudWatch(message: string) {
  const params: AWS.CloudWatchLogs.Types.PutLogEventsRequest = {
    logEvents: [
      {
        message: typeof message === 'string' ? message : JSON.stringify(message),
        timestamp: new Date().getTime(),
      },
    ],
    logGroupName,
    logStreamName,
    sequenceToken,
  };

  try {
    const data = await cloudwatch.putLogEvents(params).promise();
    sequenceToken = data.nextSequenceToken;
    console.log('success log', data)
  } catch (err) {
    console.error('Error putting log events:', err);
  }
}

export {
  initCloudwatch,
  logToCloudWatch
}