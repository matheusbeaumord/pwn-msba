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

// Request all products
apiRouter.get(endpoint + 'produtos', (req, res) => {
  knex
    .select('*')
    .from('produto')
    .then((produtos) => res.status(200).json(produtos))
    .catch((err) => {
      res.status(500).json({
        message: 'Erro ao recuperar produtos - ' + err.message,
      });
    });
});

// Request a product by id
apiRouter.get(endpoint + 'produtos/:id', (req, res) => {
  let id = parseInt(req.params.id);

  knex
    .select('*')
    .from('produto')
    .where('id', id)
    .then((produtos) => res.json(produtos))
    .catch((err) =>
      res.json({
        message: `Erro ao recuperar o produto - ${res.status}: ${err.message}`,
      })
    );
});

// Add a new product
apiRouter.post(endpoint + 'produtos', (req, res) => {
  knex('produto')
    .insert(
      {
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca,
      },
      ['id', 'descricao', 'valor', 'marca']
    )
    .then((produtos) => {
      let produto = produtos[0];
      res.status(201).json({ produto });
    })
    .catch((err) =>
      res.json({
        message: `Erro ao inserir produto - ${res.status}: ${err.message}`,
      })
    );
});

// Updade a product by id
apiRouter.put(endpoint + 'produtos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  knex('produto')
    .where('id', id)
    .update(
      {
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca,
      },
      ['id', 'descricao', 'valor', 'marca']
    )
    .then((produtos) => {
      let produto = produtos[0];
      res.status(200).json({ produto });
    })
    .catch((err) =>
      res.json({
        message: `Erro ao atualizar produto - ${res.status}: ${err.message}`,
      })
    );
});

// Delete a product by id
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  knex('produto')
    .where('id', id)
    .del()
    .then(
      res.status(200).json({ message: `Produto ${id} excluído com sucesso` })
    )
    .catch((err) =>
      res.json({
        message: `Erro ao deletar produto - ${res.status}: ${err.message}`,
      })
    );
});

module.exports = apiRouter;
