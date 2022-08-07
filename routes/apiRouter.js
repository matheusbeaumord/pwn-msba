const express = require('express');
let apiRouter = express.Router();
const endpoint = '/';

const knex = require('knex')({
  client: 'pg',
  debug: true,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});

// Request all foods
apiRouter.get(endpoint + 'food', (req, res) => {
  knex
    .select('*')
    .from('food')
    .then((food) => res.status(200).json(food))
    .catch((err) => {
      res.status(500).json({
        message: 'Erro ao recuperar food - ' + err.message,
      });
    });
});

// Request a food by id
apiRouter.get(endpoint + 'food/:id', (req, res) => {
  let id = parseInt(req.params.id);

  knex
    .select('*')
    .from('food')
    .where('id', id)
    .then((food) => res.json(food))
    .catch((err) =>
      res.json({
        message: `Erro ao recuperar o food - ${res.status}: ${err.message}`,
      })
    );
});

// Add a new food
apiRouter.post(endpoint + 'food', (req, res) => {
  knex('food')
    .insert(
      {
        description: req.body.description,
        value: req.body.value,
        name: req.body.name,
      },
      ['id', 'description', 'value', 'name']
    )
    .then((food) => {
      let foodRecipe = food[0];
      res.status(201).json({ foodRecipe });
    })
    .catch((err) =>
      res.json({
        message: `Erro ao inserir food - ${res.status}: ${err.message}`,
      })
    );
});

// Updade a food by id
apiRouter.put(endpoint + 'food/:id', (req, res) => {
  let id = parseInt(req.params.id);
  knex('food')
    .where('id', id)
    .update(
      {
        description: req.body.description,
        value: req.body.value,
        name: req.body.name,
      },
      ['id', 'description', 'value', 'name']
    )
    .then((food) => {
      let foodRecipe = food[0];
      res.status(200).json({ foodRecipe });
    })
    .catch((err) =>
      res.json({
        message: `Erro ao atualizar food - ${res.status}: ${err.message}`,
      })
    );
});

// Delete a food by id
apiRouter.delete(endpoint + 'food/:id', (req, res) => {
  let id = parseInt(req.params.id);
  knex('food')
    .where('id', id)
    .del()
    .then(res.status(200).json({ message: `food ${id} excluído com sucesso` }))
    .catch((err) =>
      res.json({
        message: `Erro ao deletar food - ${res.status}: ${err.message}`,
      })
    );
});

module.exports = apiRouter;
