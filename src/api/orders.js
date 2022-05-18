import express from 'express';
import cookieParser from 'cookie-parser';
import { ordersModel } from "../models/db.js";
import { logger } from '../server/utils.js';
import {sendEmail, renderOrderTable } from '../server/nodemailer.js'

const { Router } = express
const ordersRouter = new Router()

ordersRouter.use(cookieParser())

ordersRouter.get('/orders/:email', (req, res) => {
    try {
        let orders = []
        orders=ordersModel.listAll({"user.email": req.params.email}).then(orders => {
        logger(`Orders del mail ${req.params.email}: ${JSON.stringify(orders)}`, 'info')
        res.render("orders", {orders: orders})
        })
        .catch(err => {
            logger(`Ocurrió un error al mostrar ordenes: ${err}`, 'error')
            res.status(500).send({
                status: '500',
                message: 'Ocurrió un error al mostrar ordenes'
            })
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar orders: ${err}`, 'error')
        res.status(404).send({
            status: '404',
            message: 'Ocurrió un error al mostrar orders'
        })
    }
})


ordersRouter.get('/api/orders', (req, res) => {
    try {
        let orders = []
        orders=ordersModel.listAll().then(orders => {
        logger(`Orders: ${JSON.stringify(orders)}`, 'info')
        res.json({
            status: '200',
            message: 'OK',
            orders: orders})
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar orders: ${err}`, 'error')
    }
})

ordersRouter.get('/api/orders/:email', (req, res) => {
    try {
        let orders = []
        orders=ordersModel.listAll({"user.email": req.params.email}).then(orders => {
        logger(`Orders del mail ${req.params.email}: ${JSON.stringify(orders)}`, 'info')
        res.json({
            status: '200',
            message: 'OK',
            orders: orders})
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar orders: ${err}`, 'error')
    }
})

ordersRouter.get('/api/orders/:orderNumber', (req, res) => {
    try {
        let orders = []
        orders=ordersModel.listById(req.params.orderNumber).then(orders => {
        logger(`Order N°: ${req.params.orderNumber}: ${JSON.stringify(orders)}`, 'info')
        res.json({
            status: '200',
            message: 'OK',
            orders: orders})
        })
    }
    catch (err) {
        logger(`Ocurrió un error al mostrar orders: ${err}`, 'error')
    }
})

ordersRouter.post('/api/orders', (req, res) => {
    logger('NEW POST /api/orders --> ordersModel.create()', 'trace')
    try{
        let orders = req.body
        logger(`Datos del Carrito: ${JSON.stringify(req.body)}`, 'trace')

        ordersModel.save(orders).then(() => {
            logger(`Carrito creado: ${JSON.stringify(orders)} correctamente`, 'debug')
            //envio de mail confirmando la orden
            console.log("Enviando email de la orden a : " + orders.carts.user.email)
            sendEmail(orders.carts.user.email, 'Confirmación de orden', renderOrderTable(orders))
            res.send({status: '200', orders: orders})
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

export default ordersRouter;