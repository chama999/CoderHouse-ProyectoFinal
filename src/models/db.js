import config from "../config/config.js"
import CartsDAOFactory from "./DAOs/carts/cartsDAOFactory.js";
import MessagesDAOFactory from "./DAOs/messages/messagesDAOFactory.js";
import OrdersDAOFactory from "./DAOs/orders/ordersDAOFactory.js";
import ProductsDAOFactory from "./DAOs/products/productsDAOFactory.js";
import UsersDAOFactory from "./DAOs/users/usersDAOFactory.js";
import { logger } from "../server/utils.js";

const PERS = config.env.PERS;

//Obtendo por factory los DAOs.
const cartsModel = await CartsDAOFactory.get(PERS);
const messagesModel = await MessagesDAOFactory.get(PERS);
const ordersModel = await OrdersDAOFactory.get(PERS);
const productsModel = await ProductsDAOFactory.get(PERS);
const usersModel = await UsersDAOFactory.get(PERS);

//Se inicializan lo modelos DAO. La persistencia se determina en el factory.
try {
    await cartsModel.init();
    await messagesModel.init();
    await ordersModel.init();
    await productsModel.init();
    await usersModel.init();
    logger(`Persistencia [${config.PERS}] inicializada`, 'info');
} catch (error) {
    logger(error, 'error');
    process.exit(1);
}

export { cartsModel, messagesModel, ordersModel, productsModel, usersModel };