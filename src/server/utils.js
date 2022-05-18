import util from 'util';
import faker from 'faker';
import log4js from '../../src/config/logger.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import config from '../../src/config/config.js';

// asPOJO - para convertir objeto en texto plano
export const asPOJO = obj => JSON.parse(JSON.stringify(obj))

// renameField - para renombrar un campo de un objeto
export const renameField = (record, from, to) => {
    record[to] = record[from]
    delete record[from]
    return record
}

// removeField - para eliminar un campo de un objeto
export const removeField = (record, field) => {
    const value = record[field]
    delete record[field]
    return value
}


// print - para imprimir en consola
export const print = (obj) => {
        logger(`${util.inspect(obj, false, 12, true)}`, 'trace')
}

// fakerProducts - para generar productos usando faker
export function fakerProducts(){
        let products = []
        for (let i = 0; i < 10; i++) {
            products.push({
            id: faker.datatype.number(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.lorem.sentence(),
            image: faker.image.imageUrl(),
            category: faker.commerce.department(),
            type: faker.commerce.productAdjective(),
        })
        }
        return products
    }

// getDate - para obtener la fecha actual formato DD/MM/YYYY HH:MM:SS
export function getDate(){
    let date = new Date()
    let datetimeString = ("00" + date.getDate()).slice(-2) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + " " + ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2)
    return datetimeString
}

export function logger(logMessage, logLevel='warn', loggerName='all'){
    if (logMessage){
        switch (logLevel) {
            case 'trace':
                log4js.getLogger(loggerName).trace(logMessage)
                break;
            case 'debug':
                log4js.getLogger(loggerName).debug(logMessage)
                break;
            case 'info':
                log4js.getLogger(loggerName).info(logMessage)
                break;
            case 'warn':
                log4js.getLogger(loggerName).warn(logMessage)
                break;
            case 'error':
                log4js.getLogger(loggerName).error(logMessage)
                break;
            case 'fatal':
                log4js.getLogger(loggerName).fatal(logMessage)
                break;
            default:
                log4js.getLogger(loggerName).trace(logMessage)
                break;
        }
    }
}

export function base64_encode(file) {
    // convertimos el archivo a binario
    var bitmap = fs.readFileSync(file, {encoding: 'base64'});
    // convert binary data to base64 encoded string
    return bitmap;
}

export function generarToken(data){
    let token = jwt.sign(data, config.env.JWT_PRIVATE_KEY, { expiresIn: '1h' })
    if (token) return token
    else return false
}

export function formatoPrecio(num) {
        // Función para dar formato de precio con separadores de miles (.) y decimales (,)
        num = num.toFixed(2);
        let entero, decimales;
        if (num.indexOf(".") >= 0) {
        entero = num.slice(0, num.indexOf("."));
        decimales = num.slice(num.indexOf(".")).replace(".", ",");
        }
        let enteroFormateado = "";
        for (let i = 1; i <= entero.length; i++) {
        if (i % 3 == 0) {
            if (i == entero.length) {
            enteroFormateado =
                entero.substr(entero.length - i, 3) + enteroFormateado;
            break;
            }
            enteroFormateado =
            ".".concat(entero.substr(entero.length - i, 3)) + enteroFormateado;
        }
        }
        enteroFormateado = entero.slice(0, entero.length % 3) + enteroFormateado;
        num = enteroFormateado.concat(decimales);
        return num;
    };