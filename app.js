const express = require('express');

const app = express();

const favorites = [];

app.get('/favorites', (req, res) => {
  console.log('handling /favorites');
  res.send(favorites);
});

app.post('/add-favorites', (req, res) => {
  console.log(res);
});

app.listen(5000, () => console.log('server listening on port 5000'));
