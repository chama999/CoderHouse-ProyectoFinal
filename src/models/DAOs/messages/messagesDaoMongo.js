import DAOMongo from "../DAOMongo.js"
import { messageSchemaMongoose } from "../../schemas/messageSchema.js"

class MessagesDaoMongo extends DAOMongo {
    static #instance;
    
    constructor() {
        if (MessagesDaoMongo.#instance) {return MessagesDaoMongo.#instance;} // singleton
        super('messages', messageSchemaMongoose)
        MessagesDaoMongo.#instance = this;
    }
}

export default MessagesDaoMongo