'use strict';


const express = require("express");
const api = require('./routes')
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1 ', api);



module.exports = app;