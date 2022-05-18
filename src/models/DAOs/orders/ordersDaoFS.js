import DAOFS from "../model/DAOFileSystem.js"

class OrdersDaoFS extends DAOFS {
    static #instance;

    constructor() {
        if (OrdersDaoFS.#instance) {return OrdersDaoFS.#instance;} // singleton
        super('orders.json')
        OrdersDaoFS.#instance = this;
    }
}

export default OrdersDaoFS