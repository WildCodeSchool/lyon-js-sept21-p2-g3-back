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

const planningRouter = express.Router();
app.use('/planning', planningRouter);

const shoppingListRouter = express.Router();
app.use('/shopping-list', shoppingListRouter);

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

planningRouter.post('/', (req, res) => {
  connection
    .promise()
    .query(
      'INSERT INTO planning (user_id, date, lunch, dinner, id_recipe, image, label) VALUES (?,?,?,?,?, ?,?); ',
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
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('error when adding recipe to planning');
    });
});

planningRouter.get('/', (req, res) => {
  connection
    .promise()
    .query('SELECT * FROM planning ORDER BY date ASC')
    .then(([results]) => {
      console.log('select all from planning');
      res.status(200).json(results);
      res.status(200).send('get recipe from planning');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('error when get planning');
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
      console.log('select all from listes :', results[0]);
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

    const userIngredients = req.body.ingredients;
    console.log(userIngredients);

    const ingredientsToInsert = userIngredients.filter(
      (i) => !ingredientsInDB.map((iDB) => iDB.id).includes(i.foodId)
    );

    console.log('ingredientsToInsert', ingredientsToInsert);

    const ingredientToInsertInList = userIngredients.filter(
      (i) => !listsInDB.map((iDB) => iDB.id_ingredient).includes(i.foodId)
    );

    console.log('ingredient TO insert in List :', ingredientToInsertInList);

    const updateQuantityInList = userIngredients.filter((i) =>
      listsInDB.map((iDB) => iDB.id_ingredient).includes(i.foodId)
    );

    // const newList = [];
    // const updateQuantityInList = [];
    // const newIngredients = [];
    // addToList(
    //   newList,
    //   listsInDB,
    //   req.body.ingredients,
    //   updateQuantityInList,
    //   newIngredients
    // );

    // const ingredientsToInsert = newIngredients.filter(
    //   (i) => !ingredientsInDB.map((iDB) => iDB.id).includes(i.id)
    // );
    // console.log('new ingredients : ', newIngredients);
    // console.log('ingredients To Insert : ', ingredientsToInsert);

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
        console.log('iINDB HEEEEEELLLLO WORLD : ', iInDB[0].quantity);
        const newQuantity = i.quantity + iInDB[0].quantity;
        console.log('QUAAAAANTITY : ', newQuantity);
        return connection
          .promise()
          .query('UPDATE listes SET quantity = ? WHERE id_ingredient = ?', [
            i.quantity + iInDB[0].quantity,
            i.id_ingredient,
          ]);
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`server listening on port ${port}`));

// Function

const addToList = (newList, oldList, reqBody, quantityList, newIngredients) => {
  for (let i = 0; i < reqBody.length; i++) {
    for (let oldI = 0; oldI < oldList.length; oldI++) {
      if (oldList[oldI].id_ingredient === reqBody[i].foodId) {
        quantityList.push({
          date: '2021-11-16',
          user_id: 1,
          id_ingredient: oldList[oldI].id_ingredient,
          quantity: oldList[oldI].quantity + reqBody[i].quantity,
        });
      } else {
        newList.push({
          date: '2021-11-16',
          user_id: 1,
          id_ingredient: reqBody[i].foodId,
          quantity: reqBody[i].quantity,
        });
        newIngredients.push({
          id: reqBody[i].foodId,
          name: reqBody[i].food,
          measure: reqBody[i].measure,
          category: reqBody[i].foodCategory,
          image: reqBody[i].image,
        });
      }
    }
  }
};

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
//   });
