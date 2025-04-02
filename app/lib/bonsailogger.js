import client from "./elasticsearch.js";

const BonsaiLogger = async (message) => {
    try {
        await client.transport.request({
            method: "POST",
            path: "/niibish-logs/_doc",
            body: {
                message,
                timestamp: new Date().toISOString(),
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        console.log('Log sent to Elasticsearch:', message);
    } catch (error) {
        console.error('Error sending log to Elasticsearch:', error);
    }
};

export default BonsaiLogger;
