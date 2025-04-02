const logdna = require('@logdna/logger');

const options = {
    app: 'niibish-aki-stg',
    env: process.env.NODE_ENV || 'production'
};

const logger = logdna.createLogger(process.env.LOGDNA_KEY, options);

export default logger;
