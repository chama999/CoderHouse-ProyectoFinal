import DAOFilesytem from "../DAOFileSystem.js";
import { logger } from "../../../server/utils.js";

class CartsDaoFS extends DAOFilesytem {
    static #instance;
    
    constructor() {
        if (CartsDaoFS.#instance) {return CartsDaoFS.#instance;} // singleton
        super("carts.json")
        CartsDaoFS.#instance = this;
    }

    async save(data = {products: []}) {
        return super.save(data);
    }

    async listByUsername(user) {
        try{
            let carts = await this.listAll();
            const userCart = carts.reverse().find(cart => cart.username === user);
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
            let carts = await this.listAll();
            const userCart = carts.reverse().find(cart => cart.email === email);
            if (userCart) {
                return userCart;
            } else {
                logger(`No se encontró un carrito para el usuario ${email}`, 'debug');
                return null;
            }
        }
        catch(error){
            logger(`Error al obtener el carrito del usuario ${user}: ${error}`, 'error');
            throw new Error(`Error al obtener el carrito del usuario ${email}: ${error}`);
        }
    }
}

export default CartsDaoFS