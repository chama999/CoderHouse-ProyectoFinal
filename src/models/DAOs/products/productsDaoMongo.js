import DAOMongo from "../DAOMongo.js";
import { productSchema } from "../../schemas/productSchema.js";

class ProductsDaoMongo extends DAOMongo {
    static #instance;

    constructor() {
        if (ProductsDaoMongo.#instance) {return ProductsDaoMongo.#instance;} // singleton
        super('products', productSchema)
        ProductsDaoMongo.#instance = this;
    }
}

export default ProductsDaoMongo