const express = require('express');

const app = express();

const favoris = [];

app.get('/myroute', (req, res) => {
  console.log('handling /myroute');
  res.send(items);
});

app.listen(5000, () => console.log('server listening on port 5000'));
