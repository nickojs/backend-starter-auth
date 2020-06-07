require('dotenv').config();
const express = require('express');
const Server = require('./server');
const server = new Server(express);

server.initDatabase()
  .then(() => {
    server.setMiddlewares();
    server.setRoutes();
    server.run(process.env.SERVER_PORT || 5000);
  })
  .catch((err) => console.log('error: ', err));
