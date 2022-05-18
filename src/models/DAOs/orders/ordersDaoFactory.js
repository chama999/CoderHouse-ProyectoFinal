class OrdersDaoFactory {
    static async get(PERS) {
            switch (PERS) {
                case "fs": {
                const { default: OrdersDaoFS } = await import("./ordersDAOFS.js");
                return new OrdersDaoFS();
                }
                case "mongo":
                case "mongo_atlas": {
                const { default: OrdersDaoMongo } = await import("./ordersDAOMongo.js");
                return new OrdersDaoMongo();
                }
                case "mem":
                default: {
                const { default: OrdersDAOMemory } = await import("./ordersDAOMemory.js");
                return new OrdersDAOMemory();
                }
            }
        }
    }

export default OrdersDaoFactory;