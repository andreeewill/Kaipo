import Redis, { RedisClientOptions } from 'redis';

const createClient = async (options: RedisClientOptions) => {
  const client = await Redis.createClient(options).connect();

  return client;
};
