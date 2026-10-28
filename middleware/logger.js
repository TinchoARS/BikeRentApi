const EventEmitter = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');

class Logger extends EventEmitter {
  constructor(file = path.join(__dirname, '..', 'logs', 'app.log')) {
    super();
    this.file = file;
    this.on('log', (entry) => this.#write(entry).catch(console.error));
  }
  log(message) {
    this.emit('log', { message, at: new Date().toISOString() });
  }
  async #write(entry) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.appendFile(this.file, JSON.stringify(entry) + '\n');
  }
}

const fileLogger = new Logger();

function logger(req, res, next) {
  fileLogger.log(`${req.method} ${req.originalUrl}`);
  next();
}

module.exports = logger;