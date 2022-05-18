import DAOMemory from "../DAOMemory.js";
import { logger } from "../../../server/utils.js";

class CartsDAOMemory extends DAOMemory {
    static #instance;

    constructor() {
        if (CartsDAOMemory.#instance) {return CartsDAOMemory.#instance;} // singleton
        super();
        CartsDAOMemory.#instance = this;
    }

    async save(data = {products: []}) {
        return super.save(data);
    }

    async listByUsername(user) {
        try{
            const userCart = this.elements.slice().reverse().find(cart => cart.username === user);
            if (userCart) {
                return userCart;
            } else {
                logger(`No se encontró un carrito para el usuario ${user}`, 'debug');
                return null;
            }
        }
        catch(error){
            logger(`Error al obtener el carrito del usuario ${user}: ${error}`, 'error');
            throw new Error(`Error al obtener el carrito del usuario ${user}: ${error}`);
        }
    }

    async listByEmail(email) {
        try{
            const userCart = this.elements.slice().reverse().find(cart => cart.email === email);
            if (userCart) {
                return userCart;
            } else {
                logger(`No se encontró un carrito para el usuario ${email}`, 'debug');
                return null;
            }
        }
        catch(error){
            logger(`Error al obtener el carrito del usuario ${email}: ${error}`, 'error');
            throw new Error(`Error al obtener el carrito del usuario ${email}: ${error}`);
        }
    }


}

export default CartsDAOMemory