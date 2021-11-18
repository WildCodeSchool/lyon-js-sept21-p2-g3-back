/* eslint-disable */
// Importation
require('dotenv').config();
const connection = require('./db-config');
const cors = require('cors');
const express = require('express');
const router = express.Router();
const moment = require('moment');
// Connection

console.log(moment().format());

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

const planningRouter = express.Router();
app.use('/planning', planningRouter);

const shoppingListRouter = express.Router();
app.use('/shopping-list', shoppingListRouter);

const suggestionRouter = express.Router();
app.use('/suggestions', suggestionRouter);

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

//Planning

planningRouter.post('/', async (req, res) => {
  try {
    const isInPlanning = await connection
      .promise()
      .query(
        'SELECT * FROM planning WHERE date = ? AND diner = ? AND lunch = ?',
        [req.body.date, req.body.diner, req.body.lunch]
      );
    console.log(isInPlanning);
    if (isInPlanning[0].length === 0) {
      connection
        .promise()
        .query(
          'INSERT INTO planning (user_id, date, lunch, diner, id_recipe, image, label) VALUES (?,?,?,?,?, ?,?); ',
          [
            1,
            req.body.date,
            req.body.lunch,
            req.body.diner,
            req.body.id,
            req.body.image,
            req.body.label,
          ]
        )
        .then(([results]) => {
          console.log('insert into planning', results);
          res.status(200).send('recipe insert into planning');
        });
    } else {
      res.status(409).send('A meal is already saved for this time !');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('error when adding recipe to planning');
  }
});

planningRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM planning WHERE date >= ?  ORDER BY date ASC', [
      moment().format(),
    ])
    .then(([results]) => {
      console.log('select all from planning');
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('error when get planning');
    });
});

planningRouter.delete('/', (req, res) => {
  console.log('req.body :', req.body);
  console.log('date : ', moment(req.body.date).format('YYYY-MM-DD'));
  connection
    .promise()
    .query(
      'DELETE FROM planning WHERE id_recipe = ? AND date = ? AND diner = ? AND lunch = ?',
      [
        req.body.id_recipe,
        moment(req.body.date).format('YYYY-MM-DD'),
        req.body.diner,
        req.body.lunch,
      ]
    )
    .then(() => {
      console.log('Meal deleted ');
      res.status(204).send('Meal deleted !');
    });
});

// Liste d'ingrédients

shoppingListRouter.get('/', (req, res) => {
  connection
    .promise()
    .query(
      'SELECT l.*, i.name, i.image, i.measure FROM listes AS l INNER JOIN ingredients AS i ON l.id_ingredient = i.id'
    )
    .then(([results]) => {
      console.log('select all from listes :', results);
      res.status(200).json(results);
    });
});

shoppingListRouter.put('/', async (req, res) => {
  try {
    const [listsInDB] = await connection
      .promise()
      .query('SELECT * FROM listes');
    console.log('list in DB :', listsInDB);
    const [ingredientsInDB] = await connection
      .promise()
      .query('SELECT * FROM ingredients');
    // console.log(ingredientsInDB);
    console.log('userIngredients before :', req.body.ingredients);
    const userIngredientsNotFiltered = req.body.ingredients;

    const userIngredients = userIngredientsNotFiltered.reduce(
      (filtered, ingredient) => {
        if (!filtered.find((i) => i.foodId === ingredient.foodId)) {
          return [...filtered, ingredient];
        }
        return filtered;
      },
      []
    );
    console.log('userIngredients after :', userIngredients);

    const ingredientsToInsert = userIngredients.filter(
      (i) => !ingredientsInDB.map((iDB) => iDB.id).includes(i.foodId)
    );

    const ingredientToInsertInList = userIngredients.filter(
      (i) => !listsInDB.map((iDB) => iDB.id_ingredient).includes(i.foodId)
    );

    const updateQuantityInList = userIngredients.filter((i) =>
      listsInDB.map((iDB) => iDB.id_ingredient).includes(i.foodId)
    );

    await Promise.all(
      ingredientsToInsert.map((i) =>
        connection
          .promise()
          .query(
            'INSERT INTO ingredients (id, name, measure, category, image) VALUES (?, ?, ?, ?, ?)',
            [i.foodId, i.food, i.measure, i.foodCategory, i.image]
          )
      )
    );

    await Promise.all(
      ingredientToInsertInList.map((i) =>
        connection
          .promise()
          .query(
            'INSERT INTO listes (date, user_id, id_ingredient, quantity) VALUES (?, ?, ?, ?)',
            ['2021-11-16', 1, i.foodId, i.quantity]
          )
      )
    );
    await Promise.all(
      updateQuantityInList.map((i) => {
        const iInDB = listsInDB.filter((j) => j.id_ingredient === i.foodId);
        const newQuantity = i.quantity + iInDB[0].quantity;
        return connection
          .promise()
          .query('UPDATE listes SET quantity = ? WHERE id_ingredient = ?', [
            newQuantity,
            i.foodId,
          ])
          .catch(console.error);
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

shoppingListRouter.delete('/', async (req, res) => {
  try {
    const ingredientToDelete = req.body.ingredientToDelete;
    console.log('ingredient to delete : ', req.body);
    await Promise.all(
      ingredientToDelete.map((id) => {
        return connection
          .promise()
          .query('DELETE FROM listes WHERE id_ingredient=?', [id])
          .then(([results]) => {
            res.status(200).json(results);
          });
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// SUGGESTION

suggestionRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM suggestions')
    .then(([results]) => {
      console.log('get suggestions of the day : ', results);
      res.status(200).send(results);
    });
});

app.listen(port, () => console.log(`server listening on port ${port}`));

// Function

// shoppingListRouter.put('/', (req, res) => {
//     console.log(req.body.ingredients);
//     connection
//       .promise()
//       .query('SELECT * FROM listes')
//       .then(([lists]) => {
//         console.log(lists);
//         const listIngredients = lists;
//         const newIngredients = [];
//         const updateQuantityInList = [];
//         const newList = [];
//         addToList(
//           newList,
//           listIngredients,
//           req.body.ingredients,
//           updateQuantityInList,
//           newIngredients
//         );
//         return Promise.all([
//             newIngredients.map((i) => {
//                 return connection.promise().query('')
//             })
//         ])
//       });
