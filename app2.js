/* eslint-disable */
// Importation
require('dotenv').config();
const connection = require('./db-config');
const cors = require('cors');
const express = require('express');
const router = express.Router();

// Connection

const port = process.env.PORT || 3000;

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

// ROUTE

// Creation des routers :

const favoritesRouter = express.Router();
app.use('/favorites', favoritesRouter);

// Favorites :
//Get Favorites
favoritesRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM favorites')
    .then(([results]) => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('error retrieving favorites');
    });
});

// Post Favorites

favoritesRouter.post('/:id', (req, res) => {
  const id = req.params.id;
  const { image, label } = req.body;
  console.log('post favorites', req.body);
  connection
    .promise()
    .query(
      'INSERT INTO favorites (user_id, id_recipe, image, label) VALUES (?, ?, ?, ?)',
      [1, id, image, label]
    )
    .then(([results]) => {
      console.log('add favorite : ', results);
      res.status(200).send('favorites added');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('error when adding favorite');
    });
});

favoritesRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection
    .promise()
    .query('DELETE FROM favorites WHERE id_recipe = ?', [id])
    .then(([results]) => {
      console.log('delete favorites :', results);
      res.status(200).send('favorite deleted');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('error when deleting favorite');
    });
});

app.listen(port, () => console.log(`server listening on port ${port}`));
