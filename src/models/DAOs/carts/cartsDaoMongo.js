import DAOMongo from "../DAOMongo.js";
import { logger } from "../../../server/utils.js";
import cartsSchemaMongoose from "../../schemas/cartSchema.js";

class CartsDaoMongo extends DAOMongo {
    static #instance;
    
    constructor() {
        if (CartsDaoMongo.#instance) {return CartsDaoMongo.#instance;} // singleton
        super('carts', cartsSchemaMongoose)
        CartsDaoMongo.#instance = this;
    }

    async save(data = {product: []}) {
        
        //Calculamos total para el producto elegido.
        let total = 0;
        for (let i = 0; i < data.product.length; i++) {
            if (data.product[i]) {
                total += (Number(data.product[i].price) * Number(data.product[i].quantity));
                logger(`Total: ${total}`, 'debug');
            }
        }
        data.total = total;
        return super.save(data);
    }

    async listByUsername(user) {
        try{
            let userCart = await this.CollModel.findOne({username: user}, {__v: 0});
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
            let userCart = await this.CollModel.findOne({email: email}, {__v: 0});
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

    async listById(id) {
        try{
            let userCart = await this.CollModel.findOne({"_id": id}, {__v: 0});
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

    async deleteByIdAndIdProd(id, idProd) {
        try{
            let userCart = await this.CollModel.findOneAndUpdate({_id: id}, {$pull: {product: {_id: idProd}}}, {new: true});
            if (userCart) {
                return userCart;
            } else {
                logger(`No se encontró un carrito y/o producto para el usuario ${id}`, 'debug');
                return null;
            }
        }
        catch(error){
            logger(`Error al obtener el carrito del usuario ${id}: ${error}`, 'error');
            throw new Error(`Error al obtener el carrito del usuario ${id}: ${error}`);
        }
    }
}

export default CartsDaoMongo