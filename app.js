// Importation
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();

// Initialisation of the app
const app = express();

// add function to the app
app.use('/', router);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const favorites = [
  'recipe_0f6199b0c6a6283e57cf42056aaf6f1f',
  'recipe_7af45ab44d7a01aa241239c9cbac8884',
];

app.get('/favorites', (req, res) => {
  console.log('handling /favorites');
  res.send(favorites);
});

router.post('/add-favorites', (req, res) => {
  if (req.body.isFavorite === true) {
    favorites.push(req.body.id);
  } else favorites.remove(req.body.id);
});

app.listen(5000, () => console.log('server listening on port 5000'));
