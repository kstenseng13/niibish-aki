import { Client } from '@elastic/elasticsearch';

// Initialize the Elasticsearch client with your Bonsai URL from the environment variables
const client = new Client({
  node: process.env.BONSAI_URL, // Make sure this is set in your Heroku config
});

export default client;
