const express = require('express');
let apiRouter = express.Router();
const endpoint = '/';

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const knex = require('knex')({
  client: 'pg',
  debug: true,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});

//Authentication middlewware
const checkToken = (req, res, next) => {
  let authToken = req.headers['authorization'];
  if (!authToken) {
    res.status(401).json({ message: 'Token de acesso requerida' });
  } else {
    let token = authToken.split(' ')[1];
    req.token = token;
  }
  jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
    if (err) {
      res.status(401).json({ message: 'Acesso negado' });
      return;
    }
    req.usuarioId = decodeToken.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  knex
    .select('*')
    .from('usuario')
    .where({ id: req.usuarioId })
    .then((usuarios) => {
      if (usuarios.length) {
        let usuario = usuarios[0];
        let roles = usuario.roles.split(';');
        let adminRole = roles.find((i) => i === 'ADMIN');
        if (adminRole === 'ADMIN') {
          next();
          return;
        } else {
          res.status(403).json({ message: 'Role de ADMIN requerida' });
          return;
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Erro ao verificar roles de usuário - ' + err.message,
      });
    });
};

// Request all foods
apiRouter.get(endpoint + 'food', checkToken, (req, res) => {
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
apiRouter.get(endpoint + 'food/:id', checkToken, (req, res) => {
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
apiRouter.post(endpoint + 'food', checkToken, isAdmin, (req, res) => {
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
apiRouter.put(endpoint + 'food/:id', checkToken, isAdmin, (req, res) => {
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
apiRouter.delete(endpoint + 'food/:id', checkToken, isAdmin, (req, res) => {
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

// Create user
apiRouter.post(endpoint + 'seguranca/register', (req, res) => {
  knex('usuario')
    .insert(
      {
        nome: req.body.nome,
        login: req.body.login,
        senha: bcrypt.hashSync(req.body.senha, 8),
        email: req.body.email,
      },
      ['id']
    )
    .then((result) => {
      let usuario = result[0];
      res.status(200).json({ id: usuario.id });
      return;
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Erro ao registrar usuario - ' + err.message,
      });
    });
});

// login
apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
  knex
    .select('*')
    .from('usuario')
    .where({ login: req.body.login })
    .then((usuarios) => {
      if (usuarios.length) {
        let usuario = usuarios[0];
        let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha);
        console.log(checkSenha);
        if (checkSenha) {
          var tokenJWT = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
            expiresIn: 3600,
          });
          res.status(200).json({
            id: usuario.id,
            login: usuario.login,
            nome: usuario.nome,
            roles: usuario.roles,
            token: tokenJWT,
          });
          return;
        }
      }

      res.status(400).json({ message: 'Login ou senha incorretos' });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Erro ao verificar login - ' + err.message,
      });
    });
});

module.exports = apiRouter;
