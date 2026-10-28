const express = require('express');
const config = require('config');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: config.get('name'),
    appName: config.get('name'),
    env: req.app.get('env'),
  });
});

module.exports = router;