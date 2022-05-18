import express from 'express'
import cookieParser from 'cookie-parser';
import { apiAuth, webAuth } from './session-mongo.js';
import { fakerProducts } from '../server/utils.js';
import config from '../config/config.js';
import { cartsModel } from "../models/db.js"
import upload from '../server/multer.js';
import { logger } from '../server/utils.js';

const { Router } = express
const cartsRouter = new Router()
//const __dirname = path.dirname(__filename);

cartsRouter.use(cookieParser())

cartsRouter.get('/api/carts', (req, res) => {
    try {
            let carts = []
            carts=cartsModel.listAll().then(carts => {
            logger(`Carritos: ${JSON.stringify(carts)}`, 'info')
            res.json({carts: carts})
            //res.render('./carts', {carts: carts})
            })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
    }
})

cartsRouter.get('/carts', (req, res) => {
    try {
        let rol = req.cookies.rol

        if (rol === 'admin') {

            let carts = []
            carts=cartsModel.listAll().then(carts => {
            logger(`Carritos: ${JSON.stringify(carts)}`, 'info')
            //res.json({list: carts})
            res.render('./carts', {carts: carts})
            })
        } else {
            //res.json({status: '403', message: 'No tienes permisos para acceder a esta ruta'})
            res.status(403).redirect('/')
        }
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
    }
})

// get carts by email
cartsRouter.get('/carts/:email', (req, res) => {
    try {
        let user = req.params.email
        let carts=cartsModel.listAll({"user.email": req.params.email}).then(carts => {
        logger(`Carrito para el email: ${user}: ${JSON.stringify(carts)}`, 'info')
        res.render('./carts', {carts: carts})
        })
        .catch(err => {
            logger(`Ocurrió un error al mostrar carrito para el email: ${user}. Error: ${err}`, 'error')
            res.json({
                status: '404',
                message: err
            })
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
        res.render('./carts', {carts: []})
    }
})


// get carts by email
cartsRouter.get('/api/carts/:email', (req, res) => {
    try {
        let user = req.params.email
        let carts=cartsModel.listAll({"user.email": req.params.email}).then(carts => {
        logger(`Carrito para el email: ${user}: ${JSON.stringify(carts)}`, 'info')
        res.json({carts: carts})
        })
        .catch(err => {
            logger(`Ocurrió un error al mostrar carrito para el email: ${user}. Error: ${err}`, 'error')
            res.json({
                status: '404',
                message: err
            })
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
        res.render('./carts', {carts: []})
    }
})

// get carts by id
cartsRouter.get('/api/carts/id/:id', (req, res) => {
    try {
        let user = req.params.id
        let carts=cartsModel.listById({"_id": req.params.id}).then(carts => {
        logger(`Carrito para el email: ${user}: ${JSON.stringify(carts)}`, 'info')
        res.json({carts})
        })
        .catch(err => {
            logger(`Ocurrió un error al mostrar carrito para el email: ${user}. Error: ${err}`, 'error')
            res.json({
                status: '404',
                message: err
            })
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
        res.render('./carts', {carts: []})
    }
})

cartsRouter.post('/api/carts', (req, res) => {
    logger('NEW POST /api/carts --> cartsModel.create()', 'trace')
    try{
        let carts = req.body
        logger(`Datos del Carrito: ${JSON.stringify(req.body)}`, 'trace')
    
        cartsModel.save(carts).then(() => {
            logger(`Carrito creado: ${JSON.stringify(carts)} correctamente`, 'debug')
            res.send({status: '200', carts: carts})
        }).catch(err => {
            logger(`No se pudo guardar el carrito: ${err}`, 'error')
            res.send({status: '404', err: err})
        })
    }
    catch (err) {
        logger(`Ocurrió un error al añadir carrito: ${err}. `, 'error')
        throw new Error(err)
        res.send({status: '404', err: err})
    }
})


cartsRouter.post('/api/carts/:id/', (req, res) => {
    try {
        let idToFind = req.params.id
        let product = req.body
        let carts = []
        if (config.env.ENV==='test') {
            carts = fakerProducts()
            res.json(carts[1])
        }
        else {
            carts=cartsModel.updateById(idToFind, product).then(carts => {
            logger(`Products: ${JSON.stringify(carts)}`, 'info')
            res.json({
                status: '200',
                message: 'Producto actualizado correctamente',
                list: carts})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al actualizar el producto de id: ${req.params.id}. Error: ${err}`, 'error')
        res.json({
            status: '404',
            id: req.params.id,
            message: err
        })
    }
})

cartsRouter.delete('/api/carts/:id/:id_prod', (req, res) => {
    try {
        let idToFind = req.params.id
        let idProdToDelete = req.params.id_prod
        let carts = []
        if (config.env.ENV==='test') {
            carts = fakerProducts()
            res.json({
                status: '200',
                message: 'Producto eliminado correctamente',
                list: carts[1]
            })
        }
        else {
            carts=cartsModel.deleteByIdAndIdProd(idToFind,idProdToDelete).then(carts => {
            logger(`Products: ${JSON.stringify(carts)}`, 'info')
            res.json({
                status: '200',
                message: 'Producto eliminado correctamente',
                data: carts})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al eliminar el producto de id: ${req.params.id}. Error: ${err}`, 'error')
        res.json({
            status: '404',
            id: req.params.id,
            message: err
        })
    }
})


// ruta delete, para eliminar carrito completo

cartsRouter.delete('/api/carts/:id', (req, res) => {
    try {
        let idToFind = req.params.id
        let carts = []
        if (config.env.ENV==='test') {
            carts = fakerProducts()
            res.json({
                status: '200',
                message: 'Producto eliminado correctamente',
                list: carts[1]
            })
        }
        else {
            carts=cartsModel.deleteById(idToFind).then(carts => {
            logger(`Products: ${JSON.stringify(carts)}`, 'info')
            res.json({
                status: '200',
                message: 'Producto eliminado correctamente',
                data: carts})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al eliminar el producto de id: ${req.params.id}. Error: ${err}`, 'error')
        res.json({
            status: '404',
            id: req.params.id,
            message: err
        })
    }
})



export default cartsRouter