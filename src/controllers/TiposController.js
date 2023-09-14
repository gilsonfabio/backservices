const connection = require('../database/connection');
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        const modalidades = await connection('tipServicos')
        .select('tsvId', 'tsvDescricao');
    
        return response.json(modalidades);
    },
    
};
