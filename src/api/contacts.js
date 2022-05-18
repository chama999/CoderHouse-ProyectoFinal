import express from 'express'
import cookieParser from 'cookie-parser';
import { webAuth } from './session-mongo.js';
import {logger} from '../server/utils.js';

const { Router } = express
const contactsRouter = new Router()
contactsRouter.use(cookieParser())

// ruta para mostrar todos los chats de clientes y admin.
contactsRouter.get('/contacts', webAuth, (req, res) => {
    logger(`${req.session.name} está intentando acceder a la lista de contactos`, 'info')
    res.render('./contacts')
})

//ruta que mostrará chats solo del :email que llega cómo args.
contactsRouter.get('/contacts/:email', webAuth, (req, res) => {
    logger(`${req.session.name} está intentando acceder a la lista de contactos`, 'info')
    res.render('./contactsByEmail', {email: req.params.email})
})

export default contactsRouter