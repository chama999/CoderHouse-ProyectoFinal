import * as fs from "fs/promises";
import path from "path";
import config from "../../config.js";
import { logger } from "../../logger/index.js";

const dbDir = config.env.FILESYSTEM_DB_PATH;

class DAOFS {
    constructor(filename = "database.json") {
        this.path = path.join(dbDir, filename);
        this.nextId = null;
    }
    //Se inicializa el contenedor
    async init() {
        logger("Inicializando DAO Filesystem...",'debug');

        try {
        if (this.nextId) return; // para que no se inicialice más de una vez
        try {
            const content = await this.getAll();
            const lastId = content.reduce((acc, cur) => (cur.id > acc ? cur.id : acc), 0);
            this.nextId = lastId + 1;
            logger(`DAO inicializado con archivo preexistente '${path.basename(this.path)}'`,'debug');
        } catch (error) {
            await fs.writeFile(this.path, JSON.stringify([]));
            this.nextId = 1;
            logger(`DAO inicializado vacío '${path.basename(this.path)}'`, 'debug');
        }
        } catch (error) {
            throw new Error(`Error al inicializar: ${error}`);
        }
    }

    //devuelve lista según la condición que llega en el argumento
    async listAll(conditions = {}) {
        try {
        const content = await fs.readFile(this.path, "utf-8");
        let elements = JSON.parse(content);
        for (const [key, value] of Object.entries(conditions)) {
            if (value !== undefined) {
            elements = elements.filter(element => element[key] == value);
            }
        }
        logger(`Listado de elementos con éxito`, 'debug');
        return elements;
        } catch (error) {
          logger(`No se pudo recuperar archivo de datos: ${error}`, 'error');
          throw new Error(`No se pudo recuperar archivo de datos: ${error}`);
        }
    }

    //Obtengo un elemento por su id
    async listById(id) {
        try {
          id = parseInt(id);
          const content = await this.getAll();
          const match = content.find(elem => elem.id === id);
          if (match) {
            logger(`Elemento con id ${id} encontrado con éxito`, 'debug');
            return match;
          } else {
              logger(`Elemento con id ${id} no encontrado`, 'debug');
              return null;
          }
        } catch (error) {
          logger(`Error al obtener el elemento con id: ${error}`, 'error');
          throw new Error(`Error al obtener el elemento con id '${id}': ${error}`);
        }
    }

    //Guardo el elemento
    async save(data) {
        try {
            let now = getDate()
            const id = this.nextId;
            let element = { ...data,id, createdDate: now, updatedDate: now };
            const content = await this.getAll();
            content.push(element);
            await fs.writeFile(this.path, JSON.stringify(content, null, 2));
            this.nextId++;
            logger("Elemento guardado con éxito",'debug');
            return new this.DTO(element);
        } catch (error) {
            logger()
            throw new Error(`Error al guardar el elemento: ${error}`);
        }
    }

    //actualizo un elemento por su id
    async updateById(id, data) {
        try {
            id = parseInt(id);
            const content = await this.getAll();
            const match = content.find(elem => elem.id === id);
            if (match) {
                for (const key in data) {
                if (data[key] === undefined || data[key] === "")
                    data[key] = match[key];
                }
                const newElement = { ...match, ...data };
                const newContent = content.map(elem =>
                elem.id !== id ? elem : newElement
                );
                await fs.writeFile(this.path, JSON.stringify(newContent, null, 2));
                logger(`El elemento con id: ${id} se actualizó con éxito`);
                return newElement;
            } else {
                logger(`No se encontró el elemento con el id: ${id}`);
                return null;
            }
        } catch (error) {
            throw new Error(
            `Error al actualizar el elemento con id '${id}': ${error}`
        );
        }
    }

  //borro todos los elementos
  async deleteAll() {
    try {
      await fs.writeFile(this.path, JSON.stringify([]));
      logger("Todos los elementos borrados con éxito",'debug');
      return true;
    } catch (error) {
      logger(`Error al borrar todos los elementos: ${error}`, 'error');
      throw new Error(`Error al borrar todos los elementos: ${error}`);
    }
  }

  //borro un elemento por su id
  async deleteById(id) {
    try {
      id = parseInt(id);
      const content = await this.getAll();
      const match = content.find(elem => elem.id === id);
      if (match) {
        const newContent = content.filter(elem => elem.id !== id);
        await fs.writeFile(this.path, JSON.stringify(newContent, null, 2));
        logger(`El elemento con id: ${id} se eliminó con éxito`, 'debug');
        return id;
      } else {
        logger(`No se encontró el elemento con el id: ${id}`, 'debug');
        return null;
      }
    } catch (error) {
      logger(`Error al eliminar el elemento con id: ${error}`, 'error');
      throw new Error(`Error al eliminar el elemento con id '${id}': ${error}`);
    }
  }
}

export default DAOFS;