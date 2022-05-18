import DAOMemory from "../DAOMemory.js"

class OrdersDaoMemory extends DAOMemory {
    static #instance;

    constructor() {
        if (OrdersDaoMemory.#instance) {return OrdersDaoMemory.#instance;} // singleton
        super()
        OrdersDaoMemory.#instance = this;
    }
}

export default OrdersDaoMemory