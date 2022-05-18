import mongoose from "mongoose";
import config from "../../config/config.js";
import { logger, asPOJO, renameField, removeField, getDate } from "../../server/utils.js";

// CONEXIÓN A BASE DE DATOS. PERSISTENCIA MONGODB
try {
    switch (config.PERS) {
        case "mongoAtlas":
        await mongoose.connect(
            config.mongodbAtlas.cnxStr,
            config.mongodbAtlas.options
        );
        logger("Conectado con MongoDB Atlas", "info");
        break;

        case "mongo":
        default:
            await mongoose.connect(
                config.mongodb.cnxStr,
                config.mongodb.options
            );
            mongoose.set('debug', config.env.MONGO_DEBUG || false);
        logger("Conectado con MongoDB local", "info");
        break;
}

mongoose.connection.on("disconnected", () =>
    logger("MongoDB perdió conexión", "error")
);
} catch (error) {
    logger(`Error al conectar con MongoDb: ${error}`, "error");
    process.exit(1);
}


class DAOMongo {
    constructor(collection, schema) {
        this.CollModel = mongoose.model(collection, schema);
    }

    //init
    async init() {}

    //Metodo que retorna todos los elementos. Si hay una condición cómo argumento se ejecuta.
    async listAll(conditions = {}) {
        try {
            logger(`----------Listando documentos de la colección: ${this.CollModel}-----`, 'trace')
            //obtener todos los documentos de la coleccion en mongo
            let docs = await this.CollModel.find(conditions, { __v: 0 }).sort({ _id: 1 }).lean()
            //convertir los documentos a objetos
            logger(`Documentos encontrados: ${JSON.stringify(docs)}`, 'trace')
            docs = docs.map(asPOJO)
            docs = docs.map(d => renameField(d, '_id', 'id'))
            return docs
        } catch (error) {
            logger(`Error al listar todos: ${error}`, 'error')
            throw new Error(`Error al listar todo: ${error}`)
        }
    }

    //Devuelve el elemento con ID que viene por argumento.
    async listById(id) {
        try {
            logger(`Buscando y listando registro por ${id}`, 'trace')
            const docs = await this.CollModel.find({ '_id': id }, { __v: 0 })
            logger(`Registro encontrado: ${docs}`, 'trace')
            if (docs.length == 0) {
                throw new Error('Error al listar por id: no encontrado')
            } else {
                const result = renameField(asPOJO(docs[0]), '_id', 'id')
                return result
            }
        } catch (error) {
            logger(`Error al listar por id: ${error}`, 'error')
            throw new Error(`Error al listar por id: ${error}`)
        }
    }

    //Guardo el elemento
    async save(data) {
        try {
        //Seteo fecha de creación y de actualización
        let now = getDate();
        let nuevoElem = { ...data, createdDate: now, updatedDate: now };
        logger(`Intentando guardar el registro: ${JSON.stringify(nuevoElem)}`, 'trace')
        this.CollModel.create([nuevoElem]).then(nuevoElem => {
            logger(`Probandooooo ${JSON.stringify(nuevoElem)}`, 'info')
            nuevoElem = asPOJO(nuevoElem)
            renameField(nuevoElem, '_id', 'id')
            removeField(nuevoElem, '__v')
            logger(`Saved ${JSON.stringify(nuevoElem)}`, 'info')
            return nuevoElem
            }).catch(err => {
                logger(`Error al guardar registro: ${err}`, 'error')
                throw new Error(`Error al guardar: ${err}`)
            })
        } catch (error) {
            logger(`Error al guardar registro: ${error}`, 'error')
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    //actualizo un elemento por su id
    async updateById(id, data) {
        try {
            renameField(data, 'id', '_id')
            data.updatedDate = getDate()
            
            // construyo el objeto para actualizar, segun la data que vino en los args.
            const dataToUpdate = {};
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== "")
                dataToUpdate[key] = data[key];
            }
            let updateElement = await this.CollModel.findOneAndUpdate(
                { _id: id },
                { $set: dataToUpdate },
                { returnOriginal: false, projection: { __v: 0 } }
            );
            if (updateElement) {
                renameField(data, '_id', 'id')
                removeField(data, '__v')
                logger(`Actualizado: ${JSON.stringify(data)}`, 'info')
                return asPOJO(data)
            } else {
                logger(`Error al actualizar: registro no encontrado`, 'error')
                throw new Error('Error al actualizar: no encontrado')
            }
        } catch (error) {
            logger(`Error al actualizar registro: ${error}`, 'error')
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    // borrar todos los elemntos
    async deleteAll() {
        try {
            logger(`----------Borrando todos los documentos de la colección: ${this.CollModel.modelName}-----`, 'trace')
            await this.CollModel.deleteMany({})
        } catch (error) {
            logger(`Se produjo un error al eliminar todos los registros: ${error}`, 'error')
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    // eliminar registro por ID
    async deleteById(id) {
        try {
            const deleted = await this.CollModel.findOneAndDelete({ _id: id });
            if (deleted) {
                logger(`El elemento con id: ${id} se eliminó con éxito`);
                return id;
            }
            else {
                logger(`Error al eliminar: registro no encontrado`, 'error')
                throw new Error('Error al intentar borrar por Id: no encontrado')
            }
        } catch (error) {
            logger(`Se produjo un error al intentar eliminar registro: ${error}`, 'error')
            throw new Error(`Error al intentar borrar por Id: ${error}`)
        }
    }
}

export default DAOMongo;