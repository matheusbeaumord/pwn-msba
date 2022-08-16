const express = require('express');
const routesClient = express.Router();

routesClient.use(express.static('public'));

module.exports = routesClient;
