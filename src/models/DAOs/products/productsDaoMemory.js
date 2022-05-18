import DAOMemory from "../DAOMemory.js"

class ProductsDaoMemory extends DAOMemory {
    static #instance;

    constructor() {
        if (ProductsDaoMemory.#instance) {return ProductsDaoMemory.#instance;} // singleton
        super()
        ProductsDaoMemory.#instance = this;
    }
}

export default ProductsDaoMemory