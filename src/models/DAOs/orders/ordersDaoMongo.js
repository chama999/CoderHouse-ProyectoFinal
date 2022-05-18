import DAOMongo from '../DAOMongo.js';
import orderSchemaMongoose from "../../schemas/orderSchema.js"
import { logger } from '../../../server/utils.js';

class OrderDaoMongo extends DAOMongo {
    static #instance;

    constructor() {
        if (OrderDaoMongo.#instance) {return OrderDaoMongo.#instance;} // patrón: singleton
        super('orders', orderSchemaMongoose)
        OrderDaoMongo.#instance = this;
    }

    async save (order) {
        try{
            const number = await this.getCount() + 1;
            const newOrder = { ...order, orderNumber: number , status: 'Comprado'};
            return super.save(newOrder);
        }
        catch(error){
            logger(`Error al guardar el pedido: ${error}`, 'error');
            throw new Error(`Error al guardar el pedido: ${error}`);
        }
    }

    async getCount(){
        try {
            let OrdersQuantity = this.CollModel.estimatedDocumentCount();
            return OrdersQuantity;
        }
        catch(error){
            logger(`Error al obtener la cantidad de pedidos: ${error}`, 'error');
            throw new Error(`Error al obtener la cantidad de pedidos: ${error}`);
        }
    }

    async getOrdersByUser(user){
        try{
            let userOrders = await this.CollModel.find({username: user}, {__v:0}).sort({createdDate: -1}).lean();
            return userOrders;
        }
        catch(error){
            logger(`Error al obtener los pedidos del usuario ${user}: ${error}`, 'error');
            throw new Error(`Error al obtener los pedidos del usuario ${user}: ${error}`);
        }
    }

    async getOrdersByEmail(email){
        try{
            let emailOrders = await this.CollModel.find({email: email}, {__v:0}).sort({createdDate: -1}).lean();
            return emailOrders;
        }
        catch(error){
            logger(`Error al obtener los pedidos del usuario ${email}: ${error}`, 'error');
            throw new Error(`Error al obtener los pedidos del usuario ${email}: ${error}`);
        }
    }
    
}

export default OrderDaoMongo;