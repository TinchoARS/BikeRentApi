const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const os = require('node:os');
const logger = require('./logger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);

console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Host: ${config.get('mail').host}`);
console.log(`Mail Password: ${config.get('mail').password}`);

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);
if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}

dbDebugger('connected to the database...');

app.use(function(req, res, next){
 console.log("Authenticating...");
 next();
});
const categories = [
  
  {id:1, name: 'Mountain'},
  {id:2, name: 'Route'},
  {id:3, name: 'City'}
];
let nextCategoryId = Math.max(...categories.map(category => category.id)) + 1;

app.get('/api/categories', (req, res) => {
  res.json({ categories: categories });
});



app.post('/api/categories', (req, res) => {
  const { error, value } = validateCategory(req.body);
  
  if (error) return res.status(400).send(error.details[0].message);

  const category = {
    id: nextCategoryId,
    name: value.name
  };
  categories.push(category);
  nextCategoryId += 1;
  res.status(201).json(category);
});

app.put('/api/categories/:id', (req, res) => {
  let category = categories.find(c => c.id === Number(req.params.id));
  if (!category) return res.status(404).send('Category not found');
 
  const { error, value } = validateCategory(req.body);
  
  if (error) return res.status(400).send(error.details[0].message);


  category.name = value.name;
  res.send(category);
});
app.get('/api/categories/:id', (req, res) => {
  let category = categories.find(c => c.id === Number(req.params.id));
  if (!category) return res.status(404).send('Category not found');
  res.json({ category: category });
});

app.delete('/api/categories/:id', (req, res) => {
  let category = categories.find(c => c.id === Number(req.params.id));
  if (!category) return res.status(404).send('Category not found');

  const index = categories.indexOf(category);
  categories.splice(index, 1);
  res.send(category);
});


function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).required().max(50)
  });
  return schema.validate(category ?? {});
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));