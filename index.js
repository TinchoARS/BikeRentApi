const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const logger = require('./middleware/logger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const categories = require('./routes/categories');
const home = require('./routes/home');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');            

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use('/api/categories', categories);
app.use('/', home);

console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Host: ${config.get('mail').host}`);

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);
if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}

// dbDebugger('connected to the database...');


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));