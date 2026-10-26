const express = require('express');
const router = express.Router();

const categories = [
  
  {id:1, name: 'Mountain'},
  {id:2, name: 'Route'},
  {id:3, name: 'City'}
];
let nextCategoryId = Math.max(...categories.map(category => category.id)) + 1;

router.get('/', (req, res) => {
  res.json({ categories: categories });
});
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
  let category = categories.find(c => c.id === Number(req.params.id));
  if (!category) return res.status(404).send('Category not found'); 
  const { error, value } = validateCategory(req.body);  
  if (error) return res.status(400).send(error.details[0].message);
  category.name = value.name;
  res.send(category);
});
router.get('/:id', (req, res) => {
  let category = categories.find(c => c.id === Number(req.params.id));
  if (!category) return res.status(404).send('Category not found');
  res.json({ category: category });
});
router.delete('/:id', (req, res) => {
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

module.exports = router;