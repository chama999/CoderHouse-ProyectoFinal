import DAOMongo from "../DAOMongo.js";
import { registerSchemaMongoose } from "../../schemas/userSchema.js"
import { logger } from "../../../server/utils.js";
class UsersDaoMongo extends DAOMongo {
    static #instance;

    constructor() {
        if (UsersDaoMongo.#instance) {return UsersDaoMongo.#instance;} // singleton
        super('users', registerSchemaMongoose)
        UsersDaoMongo.#instance = this;
    }

    async listByEmail(email) {
        try{
            let user = await this.CollModel.findOne({email}, {__v: 0})
            if (user) {
                logger(`Se encontró un usuario con email ${email}`, 'info')
                return user;
            }
            else {
                logger(`No se encontró un usuario con email ${email}`, 'info')
                return null;
            }
            
        } catch (error) {
            logger(`Ocurrió un error al obtener el usuario por ${email}: ${error}` , "error")
            throw new Error(`Ocurrió un error al obtener el usuario por ${email}: ${error} `, 'error')
        }
    }

}

export default UsersDaoMongo