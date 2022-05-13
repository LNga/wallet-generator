const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes');

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/voodoo.blockchain.com/', router);

const bc_server = app.listen(5000, () =>
  console.log('Blockchain server started on port 5000')
);

module.exports = bc_server;
