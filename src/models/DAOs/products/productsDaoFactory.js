class ProductsDaoFactory {
    static async get(PERS) {
            switch (PERS) {
                case "fs": {
                const { default: ProductsDaoFS } = await import("./productsDAOFS.js");
                return new ProductsDaoFS();
                }
                case "mongo":
                case "mongo_atlas": {
                const { default: ProductsDaoMongo } = await import("./productsDAOMongo.js");
                return new ProductsDaoMongo();
                }
                case "mem":
                default: {
                const { default: ProductsDAOMemory } = await import("./productsDAOMemory.js");
                return new ProductsDAOMemory();
                }
            }
        }
    }

export default ProductsDaoFactory;