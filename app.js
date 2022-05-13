const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const router = require('./api/routes');
const { connectDB } = require('./api');
const bc_server = require('./wallet_generator/server');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/', router);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB();
bc_server;

app.listen(3000, () => console.log('Started on port 3000'));
