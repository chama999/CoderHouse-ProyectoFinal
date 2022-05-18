class CartsDaoFactory {
    static async get(PERS) {
            switch (PERS) {
                case "fs": {
                const { default: CartsDaoFS } = await import("./cartsDAOFS.js");
                return new CartsDaoFS();
                }
                case "mongo":
                case "mongodb_atlas": {
                const { default: CartsDaoMongo } = await import("./cartsDAOMongo.js");
                return new CartsDaoMongo();
                }
                case "mem":
                default: {
                const { default: CartsDAOMemory } = await import("./cartsDAOMemory.js");
                return new CartsDAOMemory();
                }
            }
        }
    }

export default CartsDaoFactory;