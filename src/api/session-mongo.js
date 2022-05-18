//---------cokie parser & session ---------------------
import express from 'express'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { usersModel } from "../models/db.js"
import bcrypt from 'bcrypt';
import { generarToken, logger } from '../server/utils.js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
/* ------------------------------------------------*/
/*           Persistencia por MongoDB              */
/* ------------------------------------------------*/
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
/* ----------------------------------------------------- */
/*           Persistencia por mongo database             */
/* ----------------------------------------------------- */
const sessionStorage = {

    store: MongoStore.create({ 
        //En Atlas connect App :  Make sure to change the node version to 2.2.12:
        mongoUrl: config.env.CONECTION_STRING_MONGO,
        mongoOptions: advancedOptions
    }),
    /* ----------------------------------------------------- */
    secret: 'CoderHouse2022',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: Number(config.env.USER_SESSION_MAXTIME) || 60000,
        sameSite: 'lax',
        secure: false
    }
}
/* ------------------------------------------------*/
/*           Session Router                        */
/* ------------------------------------------------*/
const { Router } = express
const sessionRouter = new Router()

logger(`Configuración de env: ${JSON.stringify(config.env)}`, 'info')

sessionRouter.use(cookieParser())
sessionRouter.use(session(
    sessionStorage
))

const getNameSession = req => req.session.name? req.session.name: ''
const getEmailSession = req => req.session?.email? req.session.email: ''

sessionRouter.get('/', (req,res) => {
    if(req.session.contador) {
        req.session.contador++
        logger(`${getEmailSession(req)} visitaste la página ${req.session.contador} veces.`, 'info')
        res.redirect('/index')
    }
    else {
        let { name } = req.query
        req.session.name = name
        req.session.contador = 1
        logger(`Nuevo ingreso: ${getEmailSession(req)}. Contador Visitas: ${req.session.contador}.`, 'info')
        res.redirect('/index')
    }
})

sessionRouter.get('/logout', (req,res) => {
    logger(`${getEmailSession(req)} cerró sesión.`, 'info')
    logger(`${req.session.email} cerró sesión.`, 'info')

    const email = req.session?.email
    if (email) {
        req.session.destroy(err => {
            if (!err) {
                logger(`Usuario: ${email} cerró sesión.`, 'info')
                res.render(('./logout'), { email })
            }
            else {
                logger(`Error al cerrar sesión: ${err}`, 'error')
                res.render(('./logout'), { email: 'Anonymus' })
            }
        })
    }
})

sessionRouter.get('/error-login', (req,res) => {
    req.session.destroy(err => {
        logger(`Usuario: ${getEmailSession(req)} intentó ingresar pero se produjo el error: ${err}.`, 'info')
        res.render('./error-login')
    })
})

sessionRouter.get('/login', (req,res) => {
    const email = req.session?.email
    if (email) {
        //si existe la session enviamos a index
        logger(`Usuario: ${email} ingresó al index.`, 'info')
        res.redirect('/index')
    } else {
        //Redirigimos a la página de login
        logger(`Usuario no autenticado, se lo redirecciona a login.`, 'info')
        res.render('./login')
    }
})

sessionRouter.post('/login', (req, res) => {
    logger(`Usuario: ${req.body.email} intentando ingresar. Password: ${req.body.password}`, 'info')
    usersModel.listByEmail(req.body.email).then(user => {
        if (user) {
            logger(`Usuario encontrado ${JSON.stringify(user)}`, 'info')
            //por cada usuario valido email y password
            logger(`Validando password ${req.body.password} vs. ${user.password}`, 'info')
            const passwordDecrypted = bcrypt.compareSync(req.body.password, user.password);
            logger(`Resultado check password: ${passwordDecrypted}.`, 'info')
            if ((user.email==req.body.email) && (passwordDecrypted)) {
                //seteamos la session
                logger(`Guardando datos en la session de mongo: ${JSON.stringify(user.name)}, ${JSON.stringify(user.rol)}`, 'info')
                req.session.email=req.body.email
                req.session.name=user.name
                req.session.phone=user.phone
                req.session.rol=user.rol
                //genero token con datos no sensibles
                const token = generarToken({email: user.email, name: user.name, rol: user.rol})
                // agregar token al header y redirigir a index
                {res
                    .cookie('token', encodeURIComponent(token), {encode: String})
                    .cookie('rol',encodeURIComponent(user.rol), {encode: String})
                    .cookie("name",encodeURIComponent(user.name), {encode: String})
                    .cookie("phone", encodeURIComponent(user.phone), {encode: String})
                    .cookie("email", encodeURIComponent(user.email), {encode: String})
                    .redirect('/index')}
                } else {
                logger(`Usuario: ${req.body.email} intentando ingresar pero no se encontró el usuario o password incorrecto.`, 'info')
                {res.redirect('/error-login')} 
            }
        } else {
            logger(`Usuario: ${req.body.email} intentando ingresar pero no se encontró el usuario o password incorrecto.`, 'info')
            {res.redirect('/error-login')}
        }
    })
})


sessionRouter.get('/loginAfterRegister',webAuth, (req,res) => {
    const email = req.session?.email
    if (email) {
        //si existe la session enviamos a index
        logger(`Usuario: ${email} ingresó al index.`, 'info')
        res.redirect('/index')
    } else {
        //Redirigimos a la página de login
        logger(`Usuario no autenticado, se lo redirecciona a login.`, 'info')
        res.render('./loginAfterRegister')
    }
})



export function webAuth(req, res, next) {

    const token = req.cookies.token
    logger( `[WEB AUTH] Cookies: ${JSON.stringify(req.cookies)}`, 'info')
    logger( `[WEB AUTH] Autenticando Usuario: ${getEmailSession(req)}. ${token}`, 'info')
    if (!token) return res.status(401).redirect('/error-login')
    //validado session en mongo + jwt
    jwt.verify(token, config.env.JWT_PRIVATE_KEY, (err, decoded) => {   
        if (err) {
            logger(`[HTTP Status = 403] Usuario: ${getEmailSession(req)} intentó ingresar pero se produjo el error: ${err}. `, 'info')
            return res.status(403).redirect('/error-login')
        }
        logger(`[WEB AUTH] Usuario: ${getEmailSession(req)} autenticado.`, 'info')
        next() //si no hay error continua
    })
}

export function apiAuth(req, res, next) {
    const token = req.cookies.token
    logger( `[API AUTH] Cookies: ${JSON.stringify(req.cookies)}`, 'info')
    if (!token) return res.status(401).json({ status: 401, message: 'No autorizado', token: token })

    //validado session en mongo + jwt
    jwt.verify(token, config.env.JWT_PRIVATE_KEY, (err, decoded) => {   
        if (err) {
            logger(`[Api Auth - HTTP Status = 403] Usuario: ${req.body.email} intentó acceder a un servicio pero se produjo el error: ${err}. `, 'info')
            return res.status(403).json({ status: 403, message: 'No autorizado', token: token })
        }
        logger(`[API AUTH] Usuario: ${decoded.email} autenticado.`, 'info')
        next() //si no hay error continua
    })
}

export function validateRol(req, res, next) {
    logger(`[VALIDATE ROL] Validando rol: ${req.session?.rol}. ${req.cookies.rol}`, 'info')
    if (req.session?.rol == 'admin' || req.cookies.rol == 'admin') {
        next()
    }
    else {
        res.json({
            status: '401',
            message: 'No está autorizado para realizar esta acción'
        })
    }
}


export default sessionRouter
