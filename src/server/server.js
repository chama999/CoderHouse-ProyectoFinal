import express from 'express';
import productsRouter from '../api/products.js';
import cartsRouter from '../api/carts.js';
import mainRouter from '../api/main.js';
import sessionRouter from '../api/session-mongo.js';
import registerRouter from '../api/register.js';
import contactsRouter from '../api/contacts.js';
import ordersRouter from '../api/orders.js'
import path from 'path';
import {fileURLToPath} from 'url';
import {logger} from './utils.js';

//------------------------------------------------------------------------
// instancio app express y configuramos paths
// Cookie Parser
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathViews = path.join(__dirname, '../views')
const publcPath = path.join(__dirname, '../server/public')

// console modo debug para nombre de directorio
logger(`directory-name: ${__dirname}`, 'trace');
logger(`publicPath: ${publcPath}`, 'trace');
logger(`pathViews: ${pathViews}`, 'trace');

//--------------------------------------------
// configuro el servidor -- Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(publcPath))
app.use('/uploads',express.static('uploads'))
app.use(productsRouter)
app.use(cartsRouter)
app.use(sessionRouter)
app.use(mainRouter)
app.use(registerRouter)
app.use(contactsRouter)
app.use(ordersRouter)

//contabilizador de visitas
app.use(function(req, res, next) {
    logger(`Checking date time: ${Date.now()}`, 'trace');
    next()
    })

//configuración de views -- motor de plantilla: ejs
app.set('views', pathViews)
app.set('view engine', 'ejs')

//middleware para manejar errores
app.use(function(err, req, res, next) {
    //res.status(400).send("Pagina no disponible en este momento. Por favor, intente más tarde.")
    logger(`Servicio no encontrado: ${err}. Enviando status 404 al cliente`, 'error');
    res.status(err.status || 404).send({
        err: {
        status: err.status || 404,
        message: err.message || "Servicio no encontrado."
        }
    })  
})

export default app
