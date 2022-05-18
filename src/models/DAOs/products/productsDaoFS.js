import DAOFS from "../model/DAOFileSystem.js"

class ProductsDaoFS extends DAOFS {
    static #instance;

    constructor() {
        if (ProductsDaoFS.#instance) {return ProductsDaoFS.#instance;} // singleton
        super('products.json')
        ProductsDaoFS.#instance = this;
    }
}

export default ProductsDaoFS