const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();

const items = [
  { id: 1, name: 'item1' },
  { id: 2, name: 'item2' },
];

app.get('/myroute', (req, res) => {
  console.log('handling /myroute');
  res.send(items);
});

app.get('/getdata', (req, res) => {
  axios
    .get(
      `https://api.edamam.com/api/recipes/v2?type=public&q=lasagne&app_id=f3601de5&app_key=960c7d96572cfedbc3eb6bffbfaf24c9`
    )
    .then((response) => response.data)
    .then((data) => {
      console.log(data.hits);
      fs.writeFile('data.json', JSON.parse(data.hits), 'utf-8', (err) => {
        if (err) {
          console.log('An error occured while writing JSON Object to File.');
          return console.log(err);
        }

        console.log('JSON file has been saved.');
      });
    });
});

app.listen(5000, () => console.log('server listening on port 5000'));
