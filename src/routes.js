const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');

const UsersController = require('./controllers/UsersController');
const ModalidadesController = require('./controllers/ModalidadesController');
const TiposController = require('./controllers/TiposController');
const ServicesController = require('./controllers/ServicesController');
const SecretariasController = require('./controllers/SecretariasController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Serviços!',
    });
});

function verifyJWT(req, res, next){
    //console.log('verificando token...')
    const token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.'});

    jwt.verify(token, process.env.SECRET_JWT, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Token invalid!'});
        }                
        next();            
    });
}

async function verifyRefreshJWT(req, res, next){
    //console.log('verificando refresh token...')
    const refreshTokenJWT = req.headers["x-access-token"];
    if (!refreshTokenJWT) return res.status(401).send({ auth: false, message: 'No refresh token provided.' });
    
    jwt.verify(refreshTokenJWT, process.env.SECRET_JWT_REFRESH, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Refresh Token invalid!' });
        }
        next();            
    });
}


routes.post('/signIn', UsersController.signIn);

routes.get('/modalidades', ModalidadesController.index);

routes.get('/tipos', TiposController.index);
routes.get('/secretarias', SecretariasController.index);

routes.post('/servicos', ServicesController.index);
routes.post('/newservicos', ServicesController.create);
routes.get('/searchServ/:idSrv', ServicesController.search);

module.exports = routes;
