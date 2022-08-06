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

const lista_produtos = {
  produtos: [
    { id: 1, descricao: 'Produto 1', valor: 5.0, marca: 'marca ' },
    { id: 2, descricao: 'Produto 2', valor: 5.0, marca: 'marca ' },
    { id: 3, descricao: 'Produto 3', valor: 5.0, marca: 'marca ' },
  ],
};

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

apiRouter.get(endpoint + 'produtos/:id', (req, res) => { ... })
apiRouter.post(endpoint + 'produtos', (req, res) => { ... })
apiRouter.put(endpoint + 'produtos/:id', (req, res) => { ... })
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { ... })

module.exports = apiRouter;
