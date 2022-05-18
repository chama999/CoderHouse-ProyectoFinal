//--------- Imports --------------------
import express from 'express';
import cookieParser from 'cookie-parser';
import { usersModel } from "../models/db.js"
import { logger, generarToken } from '../server/utils.js';
import {sendEmail, renderRegisterTable} from '../server/nodemailer.js'
//---------- Encrypt --------------------
import bcrypt from 'bcrypt';
import { apiAuth, webAuth } from './session-mongo.js';
const saltRounds = 10;
/* ------------------------------------------------*/
/*           Session Router                        */
/* ------------------------------------------------*/
const { Router } = express
const registerRouter = new Router()

registerRouter.use(cookieParser())

registerRouter.get('/register', (req,res) => {
    logger('NEW GET /register --> ejs/register.ejs', 'trace')
    res.render('./register') 
})

registerRouter.post('/register-web', (req,res) => {
    logger('NEW POST /register', 'trace')
    let passwordEncrypted = bcrypt.hashSync(req.body.password, saltRounds)
    let user = {
        name : req.body.name,
        email : req.body.email,
        rol : req.body.rol || 'customer'
    }
    // genero tokwn jwt
    const token = generarToken(user)

    // agrego datos sensibles del user
    user.phone = req.body.phone || 'No especificado'
    user.age = Number(req.body.age) || 0
    user.password = passwordEncrypted
    user.address = req.body.address || "Sin dirección"
    
    //Guardamos el user en la base de datos
    usersModel.save(user).then(() => {
        logger(`Usuario [${req.body.email}] registrado exitosamente. Se redirige al home`, 'info')
        //alert(`User [${req.body.email}] registered succesfully`, 'Éxito')
        //envio de mail:
        sendEmail(user.email, 'Nuevo usuario registrado', renderRegisterTable(user))

        res.cookie('token', token).redirect('/loginAfterRegister')
    }).catch(err => {
        logger(`Error al registrar el usuario [${req.body.email}]: ${err}`, 'error')
    })
})

registerRouter.post('/register', (req,res) => {
    logger('NEW POST /register', 'trace')
    let passwordEncrypted = bcrypt.hashSync(req.body.password, saltRounds)
    let user = {
        name : req.body.name,
        email : req.body.email,
        rol : req.body.rol || 'customer',
    }
    // genero tokwn jwt
    const token = generarToken(user)
    user.phone = req.body.phone || 'No especificado'
    user.age = Number(req.body.age) || 0
    user.password = passwordEncrypted
    user.address = req.body.address || "Sin dirección"
    
    logger(`Creando usuario.... [${JSON.stringify(user)}]`, 'info')
    //Guardamos el user en la base de datos
    usersModel.save(user).then(() => {
        logger(`Usuario [${req.body.email}] registrado exitosamente. Se redirige al home`, 'info')
        //alert(`User [${req.body.email}] registered succesfully`, 'Éxito')
        //envio de mail:
        sendEmail(user.email, 'Nuevo usuario registrado', renderRegisterTable(user))
        res.json({
            status: '200',
            message: 'Usuario registrado exitosamente',
            token: token
        })
    }).catch(err => {
        logger(`Error al registrar el usuario [${req.body.email}]: ${err}`, 'error')
    })
})

export default registerRouter
