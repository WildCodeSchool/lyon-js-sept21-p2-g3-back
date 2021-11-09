// Importation
require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const router = express.Router();

// const corsOptions = {
//   origin: 'http://localhost:3000',
// };

// 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f',
// 'recipe_7af45ab44d7a01aa241239c9cbac8884',

let favorites = [];
let planning = [
  {
    date: 'Mercredi 03 2021',
    lunch: true,
    diner: false,
    title: 'lasagne',
    img: 'https://assets.afcdn.com/recipe/20200408/109520_w1024h1024c1cx1866cy2800.jpg',
    id: 'recipe_0f6199b0c6a6283e57cf42056aaf6f1f',
  },
];

const cors = require('cors');

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
// Initialisation of the app
const app = express();
app.use(cors(corsOptions));
// add function to the app
app.use('/', router);

app.use(express.json());

// FAVORITES
app.get('/favorites', (req, res) => {
  console.log('handling /favorites');
  res.send(favorites);
});

app.post('/favorites/:id', (req, res) => {
  if (req.body.isfavorite === false) {
    favorites.push(req.params.id);
  } else favorites = favorites.filter((id) => id !== req.params.id);
  console.log(favorites);
  res.send('ok');
});

// PLANNING

app.get('/planning', (req, res) => {
  console.log('On planning');
  res.send(planning);
});

app.post('/addtoplanning/', (req, res) => {
  planning.push({
    id: req.body.id,
    date: req.body.date,
    lunch: req.body.lunch,
    diner: req.body.diner,
    img: req.body.image,
    title: req.body.title,
  });
  console.log(planning);
});

app.listen(5000, () => console.log('server listening on port 5000'));
