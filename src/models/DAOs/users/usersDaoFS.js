import DAOFS from "../model/DAOFileSystem.js"
import { logger } from "../../../server/utils.js"
class UsersDaoFS extends DAOFS {
    static #instance;

    constructor() {
        if (UsersDaoFS.#instance) {return UsersDaoFS.#instance;} // singleton
        super('users.json')
        UsersDaoFS.#instance = this;
    }

    async getByUsername(username) {
        try{
            const users = await this.getAll()
            return users.find(user => user.username === username)
        } catch (error) {
            logger(`Ocurrió un error al obtener el usuario por ${username}: ${error}` , "error")
            throw new Error(`Ocurrió un error al obtener el usuario por ${username}: ${error} `, 'error')
        }
    }

    async getByEmail(email) {
        try{
            const users = await this.getAll()
            return users.find(user => user.email === email)
        } catch (error) {
            logger(`Ocurrió un error al obtener el usuario por ${email}: ${error}` , "error")
            throw new Error(`Ocurrió un error al obtener el usuario por ${email}: ${error} `, 'error')
        }
    }

}

export default UsersDaoFS