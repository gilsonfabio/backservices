const connection = require('../database/connection');
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        const secretarias = await connection('secretarias')
        .select('*');
    
        return response.json(secretarias);
    },
    
};
