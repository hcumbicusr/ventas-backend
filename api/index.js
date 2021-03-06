const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');

const config = require('../config.js');
const user = require('./components/user/network');
const auth = require('./components/auth/network');
const jornada = require('./components/jornada/network');
const venta = require('./components/venta/network');
const producto = require('./components/producto/network');

const errors = require('../network/errors');

const app = express();

app.use(bodyParser.json());

const swaggerDoc = require('./swagger.json');

// Router
app.use('/api/v1/user', user);
app.use('/api/v1/auth', auth);
app.use('/api/v1/jornada', jornada);
app.use('/api/v1/venta', venta);
app.use('/api/v1/producto', producto);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errors); // midleware

app.listen(config.api.port, () => {
    console.log('Api escuchando en el puerto ', config.api.port)
});