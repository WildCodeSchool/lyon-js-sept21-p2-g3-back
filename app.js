const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const favorites = [
  'recipe_0f6199b0c6a6283e57cf42056aaf6f1f',
  'recipe_7af45ab44d7a01aa241239c9cbac8884',
];

app.get('/favorites', (req, res) => {
  console.log('handling /favorites');
  res.send(favorites);
});

app.post('/add-favorites', (req, res) => {
  console.log(res);
});

app.listen(5000, () => console.log('server listening on port 5000'));
