import { logger } from "../../server/utils.js";

class BaseDAOMem {
    constructor() {
        this.elements = [];
        this.nextId = 1;
    }   

    //listAll: retorna todos los elementos. Recibe cómo parámetro las condiciones para filtrar la búsqueda.
    listAll(conditions = {}) {
        try {
            let elements = [...this.elements];
            for (const [key, value] of Object.entries(conditions)) {
                if (value !== undefined) {
                console.log(key, value);
                elements = elements.filter(element => element[key] == value);
                }
            }
            return elements;
        } catch (error) {
            throw new Error(`Error: No se pudo obtener los elementos. Detalle: ${error}`);
        }
    }

  //Obtengo un elemento por su id
    listById(id) {
        try {
            id = parseInt(id);
            const match = this.elements.find(elem => elem.id === id);
            return match;
        } catch (error) {
            throw new Error(`Error: No se pudo obtener elemento id: '${id}': ${error}`);
        }
    }

    //Guardo el elemento
    save(data) {
        try {
            const id = this.nextId;
            const timestamp = new Date().toISOString();
            const element = { ...data, id, timestamp };
            this.elements.push(element);
            this.nextId++;
            logger.debug("Elemento guardado con éxito");
            return element;
        } catch (error) {
            throw new Error(`Error al guardar el elemento: ${error}`);
        }
    }

  //actualizo un elemento por su id
  updateById(id, data) {
    try {
      id = parseInt(id);
      const match = this.elements.find(elem => elem.id === id);
      if (match) {
        for (const key in data) {
          if (!data[key]) data[key] = match[key];
        }
        const newElement = { ...match, ...data };
        const newContent = this.elements.map(elem =>
          elem.id !== id ? elem : newElement
        );
        this.elements = newContent;
        logger.debug(`El elemento con id: ${id} se actualizó con éxito`);
        return newElement;
      } else {
        logger.debug(`No se encontró el elemento con el id: ${id}`);
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al actualizar el elemento con id '${id}': ${error}`
      );
    }
  }

  //borro todos los elementos
  deleteAll() {
    try {
      this.elements = [];
      logger("Todos los elementos borrados con éxito", "info");
      return true;
    } catch (error) {
      throw new Error(`Error al borrar todos los elementos: ${error}`);
    }
  }

  //borro un elemento por su id
  deleteById(id) {
    try {
      id = parseInt(id);
      const match = this.elements.find(elem => elem.id === id);
      if (match) {
        const newContent = this.elements.filter(elem => elem.id !== id);
        this.elements = newContent;
        logger(`El elemento con id: ${id} se eliminó con éxito`, "info");
        return id;
      } else {
        logger(`No se encontró el elemento con el id: ${id}`, "info");
        return null;
      }
    } catch (error) {
      throw new Error(`Error al borrar el elemento con id '${id}': ${error}`);
    }
  }
}

export default BaseDAOMem;