const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());

module.exports.app = app;
