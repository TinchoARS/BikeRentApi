const express = require('express');
const router = express.Router();
const validateCategory = require('../validators/category');

const store = require('../db/categoriesStore');

router.get('/', async (req, res) => {
  const categories = await store.getAllCategories();
  res.json({ categories });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('Invalid category id');
  }

  const category = await store.getCategory(id);
  if (!category) return res.status(404).send('Category not found');
  res.json({ category });
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
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('Invalid category id');
  }

  const { error, value } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await store.addCategory(value.name);
  if (!category) return res.status(404).send('Category not found');

  res.json(category);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('Invalid category id');
  }

  const category = await store.deleteCategory(id);
  if (!category) return res.status(404).send('Category not found');

  res.json(category);
});

module.exports = router;