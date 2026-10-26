const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Bike Rental API', message: 'Welcome to the Bike Rental API' });
});

module.exports = router;