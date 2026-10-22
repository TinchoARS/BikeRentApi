const os = require('node:os');
const logger = require('./logger');

logger.log(`BikeRent v0.1 en ${os.type()} ${os.release()} (${os.platform()})`);
logger.log(`RAM libre: ${(os.freemem() / 2 ** 20).toFixed(0)} MB, CPUs: ${os.availableParallelism()}`);