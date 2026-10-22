const path = require('path');
const os = require('os');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('messageLogged', function() {
    console.log("Listener called");
});

emitter.emit('messageLogged');





var pathObj = path.parse(__filename);
const log = require('./logger');

let totalMemory = (os.totalmem()/ (1024 ** 3)).toFixed(2);
let freeMemory = (os.freemem()/ (1024 ** 3)).toFixed(2);
let totalMemoryGB = Math.round(totalMemory);
let freeMemoryGB = Math.round(freeMemory);

const files = fs.readdirSync('./');







console.log(`Total Memory: ${totalMemoryGB} GB`);
console.log(`Free Memory: ${freeMemoryGB} GB`);
log('message');
console.log(pathObj);
console.log(files);
console.log(`Files: ${JSON.stringify(files)}`);
