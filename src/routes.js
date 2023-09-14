const express = require('express');

const routes = express.Router();

const ModalidadesController = require('./controllers/ModalidadesController');
const TiposController = require('./controllers/TiposController');
const ServicesController = require('./controllers/ServicesController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Serviços!',
    });
});

routes.get('/modalidades', ModalidadesController.index);

routes.get('/tipos', TiposController.index);

routes.post('/servicos', ServicesController.index);
routes.post('/newservicos', ServicesController.create);

module.exports = routes;
