const durableConsumerName = 'DURABLE';
const messageBatchSize = 1;
const pullExpiresMs = 10000;
const pullIntervalMs = 2000;
const streamName = 'STREAM';
const subjectList = ['SUBJECT'];

export default {
  durableConsumerName,
  messageBatchSize,
  pullExpiresMs,
  pullIntervalMs,
  streamName,
  subjectList
};