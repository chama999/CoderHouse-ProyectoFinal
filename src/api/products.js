import express from 'express'
import cookieParser from 'cookie-parser';
import { apiAuth, webAuth, validateRol } from './session-mongo.js';
import { fakerProducts } from '../server/utils.js';
import config from '../config/config.js';
import { productsModel } from "../models/db.js"
import upload from '../server/multer.js';
import { logger } from '../server/utils.js';

const { Router } = express
const productsRouter = new Router()
//const __dirname = path.dirname(__filename);

productsRouter.use(cookieParser())


//ruta GET /products: Devuelve lista de productos. Usa Middleware para validar session.
productsRouter.get('/products',webAuth,  (req, res) => {
    try {
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.render('./products', {list: products})
        }
        else {
            products=productsModel.listAll().then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.render('./products', {list: products})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
    }
})

// ruta GET /products/category. Devuelve la lista de productos de una categoría en particular.
productsRouter.get('/products/:category', (req, res) => {
    try {
        let category = req.params.category
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.json({list: products})
        }
        else {
            products=productsModel.listAll({category: category}).then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.render('./products',{list: products})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos por categoria:${category}. Error: ${err}`, 'error')
        res.json({
            status: '404',
            message: err
        })
    }
})


productsRouter.get('/newProduct',webAuth,validateRol, (req, res) => {
    logger('NEW GET /newProduct --> ejs/newProduct.ejs', 'trace')
    res.render('./newProduct')
})

productsRouter.post('/api/products', upload.single('file'), (req, res) => {
    logger('NEW POST /api/products --> productsModel.create()', 'trace')
    try{
        let product = req.body
        logger(`Datos del archivo: ${JSON.stringify(req.body)}`, 'trace')
        product.imageName = req.file.originalname;
    
        productsModel.save(product).then(() => {
            logger(`Producto añadido: ${JSON.stringify(product)} correctamente`, 'debug')
            res.send({status: '200', product: product})
        }).catch(err => {
            logger(`No se pudo guardar el producto: ${err}`, 'error')
            res.send({status: '404', err: err})
        })
    }
    catch (err) {
        logger(`Ocurrió un error al añadir producto: ${err}. `, 'error')
        throw new Error(err)
        res.send({status: '404', err: err})
    }
})

//ruta para obtener lista de productos. Si la variable ENV=test devuelve productos faker.
productsRouter.get('/api/products', (req, res) => {
    try {
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.json({list: products})
        }
        else {
            products=productsModel.listAll().then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.json({list: products})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
        res.json({
            status: '404',
            message: err
        })
    }
})

productsRouter.get('/api/products/category/:category', (req, res) => {
    try {
        let category = req.params.category
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.json({list: products})
        }
        else {
            products=productsModel.listAll({category: category}).then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.json({list: products})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar productos: ${err}`, 'error')
        res.json({
            status: '404',
            message: err
        })
    }
})

productsRouter.get('/api/products/id/:id', (req, res) => {
    try {
        let idToFind = req.params.id 
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.json(products[1])
        }
        else {
            products=productsModel.listById(idToFind).then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.json({list: products})
            })
        }
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar el producto de id: ${req.params.id}. Error: ${err}`, 'error')
        res.json({
            status: '404',
            id: req.params.id,
            message: err
        })
    }
})

productsRouter.put('/api/products/id/:id', (req, res) => {
    try {
        let idToFind = req.params.id
        let product = req.body
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.json(products[1])
        }
        else {
            products=productsModel.updateById(idToFind, product).then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.json({
                status: '200',
                message: 'Producto actualizado correctamente',
                list: products})
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

productsRouter.delete('/api/products/id/:id', (req, res) => {
    try {
        let idToFind = req.params.id
        let products = []
        if (config.env.ENV==='test') {
            products = fakerProducts()
            res.json({
                status: '200',
                message: 'Producto eliminado correctamente',
                list: products[1]
            })
        }
        else {
            products=productsModel.deleteById(idToFind).then(products => {
            logger(`Products: ${JSON.stringify(products)}`, 'info')
            res.json({
                status: '200',
                message: 'Producto eliminado correctamente',
                data: products})
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





export default productsRouter