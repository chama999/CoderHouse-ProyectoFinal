import dotenv, { config }  from "dotenv"
import { logger } from "../server/utils.js"
import {fileURLToPath} from 'url';
import path from 'path';
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.join(__filename);
const result= await dotenv.config({ path: './src/config/.env' })
if (result.error) {
    throw result.error
}


logger(`Configuración cargada en .env: ${JSON.stringify(result.parsed)}`, 'debug')

//Configuración de la aplicación
export default {
    //importamos configuración en .env
    env: result.parsed,
    //config para envio de mails
    nodemailer: 
            {config: {
                service: "gmail",
                port: 587,
                auth: {
                user: result.parsed.NODEMAILER_SENDER,
                pass: result.parsed.NODEMAILER_PASS
                }
            }},
    //configuración de paths
    fileSystem: {
        pathImg: '../../uploads',
        pathviews: './src/views/',
        filename: __filename,
        dirname: path.join(__filename),
        pathViews: path.join(__dirname, '../views'),
        publcPath: path.join(__dirname, '../server/public')
    },
    mongodbAtlas:{
        cnxStr: result.parsed.CONECTION_STRING_MONGODB,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    mongodb:{
        cnxStr: result.parsed.CONECTION_STRING_MONGO,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        }
    }
}


