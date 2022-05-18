import { logger } from "../../../server/utils.js";
import DAOMemory from "../DAOMemory.js"

class UsersDaoMemory extends DAOMemory {
    static #instance;

    constructor() {
        if (UsersDaoMemory.#instance) {return UsersDaoMemory.#instance;} // singleton
        super()
        this.elements = [
            {
                id: 1,
                email: "admin@admin.com",
                name: "Administrador",
                age: "99",
                address: "Calle falsa 123",
                createdDate: "2020-01-01",
                updatedDate: "2020-01-01"
            }
        ];
        this.nextId = 2;

        UsersDaoMemory.#instance = this;
    }

    async getByEmail(email) {
        try{
            return this.elements.find(user => user.email === email)
        } catch (error) {
            logger(`Ocurrió un error al obtener el usuario por ${email}: ${error}` , "error")
            throw new Error(`Ocurrió un error al obtener el usuario por ${email}: ${error} `, 'error')
        }
    }
}

export default UsersDaoMemory