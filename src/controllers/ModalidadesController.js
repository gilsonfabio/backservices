const connection = require('../database/connection');
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        const modalidades = await connection('modServicos')
        .select('msvId', 'msvDescricao');
    
        return response.json(modalidades);
    },
    
};
