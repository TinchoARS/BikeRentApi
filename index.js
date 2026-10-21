const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.get('/', (req, res) => res.send('ok'));
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);
mongoose.connect(process.env.MONGO_URL)
  .then(() => app.listen(3000, () => console.log('Escuchando en 3000')))
  .catch(err => { console.error(err); process.exit(1); });