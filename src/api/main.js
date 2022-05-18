import express from 'express'
import cookieParser from 'cookie-parser';
import { webAuth } from './session-mongo.js';
import { logger } from '../server/utils.js';
const { Router } = express
const mainRouter = new Router()
mainRouter.use(cookieParser())
//rutas main
mainRouter.get('/index',webAuth, (req, res) => {
    logger('NEW GET index page --> ejs/main.ejs', 'trace')
    if (req.session.email) {res.render('./main' , {role: req.session.rol})}
    else {res.redirect('/login')}
})

mainRouter.get('/list',webAuth, (req, res) => {
    logger('NEW GET /list --> ejs/list.ejs', 'trace')
    res.render('./list', {list: products})
})

export default mainRouter