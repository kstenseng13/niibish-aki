import client from './elasticsearch';

const logToElasticsearch = async (message) => {
    try {
        await client.index({
            index: 'niibish-logs',
            document: {
                message,
                timestamp: new Date().toISOString(),
            },
        });
        console.log('Log sent to Elasticsearch:', message);
    } catch (error) {
        console.error('Error sending log to Elasticsearch:', error);
    }
};

export default logToElasticsearch;
