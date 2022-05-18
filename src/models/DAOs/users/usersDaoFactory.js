class UsersDaoFactory {
    static async get(PERS) {
            switch (PERS) {
                case "fs": {
                const { default: UsersDaoFS } = await import("./usersDaoFS.js");
                return new UsersDaoFS();
                }
                case "mongo":
                case "mongo_atlas": {
                const { default: UsersDaoMongo } = await import("./usersDAOMongo.js");
                return new UsersDaoMongo();
                }
                case "mem":
                default: {
                const { default: UsersDAOMemory } = await import("./usersDaoMemory.js");
                return new UsersDAOMemory();
                }
            }
        }
    }

export default UsersDaoFactory;