const os = require('node:os');
const logger = require('./logger');
const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());
const categories = [
  
  {id:1, name: 'Mountain'},
  {id:2, name: 'Route'},
  {id:3, name: 'City'}
];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/category', (req, res) => {
  res.json({ categories: categories });
});



app.post('/api/category', (req, res) => {
  const { error, value } = validateCategory(req.body);
  
  if (error) return res.status(400).send(error.details[0].message);

  const category ={
    id: categories.length + 1,
    name: value.name
  };
  categories.push(category);
  res.send(category);
  //res.status(201).json({ category: category });
});

app.put('/api/category/:id', (req, res) => {
  let category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).send('Category not found');
 
  const { error, value } = validateCategory(req.body);
  
  if (error) return res.status(400).send(error.details[0].message);


  category.name = value.name;
  res.send(category);
});

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(category);
}
app.get('/api/category/:id', (req, res) => {
  let category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).send('Category not found');
  res.json({ category: category });
});

app.delete('/api/category/:id', (req, res) => {
  let category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).send('Category not found');

  const index = categories.indexOf(category);
  categories.splice(index, 1);
  res.send(category);
});

app.listen(3000, () => 
  console.log('Server is running on port 3000'));


//logger.log(`BikeRent v0.1 en ${os.type()} ${os.release()} (${os.platform()})`);
//logger.log(`RAM libre: ${(os.freemem() / 2 ** 20).toFixed(0)} MB, CPUs: ${os.availableParallelism()}`);