class MessagesDaoFactory {
    static async get(PERS) {
            switch (PERS) {
                case "fs": {
                const { default: MessagesDaoFS } = await import("./messagesDAOFS.js");
                return new MessagesDaoFS();
                }
                case "mongo":
                case "mongo_atlas": {
                const { default: MessagesDaoMongo } = await import("./messagesDAOMongo.js");
                return new MessagesDaoMongo();
                }
                case "mem":
                default: {
                const { default: MessagesDAOMemory } = await import("./messagesDAOMemory.js");
                return new MessagesDAOMemory();
                }
            }
        }
    }

export default MessagesDaoFactory;