const connection = require('../database/connection');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;

        //console.log('Email:', email)
        //console.log('Password:', senha)

        const dados = await connection('usuarios')
            .where('usrEmail', email)
            .select('usrId', 'usrNome', 'usrEmail', 'usrNivAcesso', 'usrPassword')
            .first();
         
        if (!dados) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        //console.log(user.usrPassword)
        let pass = dados.usrPassword;
        const match = await bcrypt.compare(senha, pass)

        if(!match) {
            return response.status(403).send({ auth: false, message: 'User invalid!' });
        }
        const user = {
            id: dados.usrId,
            email: dados.usrEmail,
            name: dados.usrNome
        }

        //let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
        //    expiresIn: '1h'
        //});
        //let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
        //    expiresIn: '2h'
        //});

        console.log(user);

        return response.json({user});

    },
    
    async index (request, response) {
        const users = await connection('usuarios')
        .orderBy('usrNome')
        .select('usrId', 'usrNome', 'usrNivAcesso', 'usrEmail');
    
        return response.json(users);
    }, 

    async create(request, response) {
        //console.log(request.body);
        const {nome, cpf, nascimento, email, celular , password, nivAcesso} = request.body;
        let status = 'A'; 
        let snhCrypt = await bcrypt.hash(password, saltRounds);

        const [usrId] = await connection('usuarios').insert({
            usrNome: nome, 
            usrEmail: email, 
            usrPassword: snhCrypt,
            usrCelular: celular, 
            usrCpf: cpf, 
            usrNascimento: nascimento, 
            usrNivAcesso: nivAcesso,
            usrStatus: status
        });
           
        return response.json({usrId});
    },
    
    async refreshToken(request, response) {
        let id = request.body.idUsr;
    
        const user = await connection('usuarios')
            .where('usrId', id)
            .select('usrId', 'usrNome', 'usrEmail', 'usrNivAcesso')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
            expiresIn: process.env.EXPIREIN_JWT
        });
        let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
            expiresIn: process.env.EXPIREIN_JWT_REFRESH
        });

        return response.json({user, token, refreshToken});

    },

    //...........................................................................................................................

};
