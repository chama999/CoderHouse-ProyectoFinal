import DAOFS from "../model/DAOFileSystem.js"

class MessagesDaoFS extends DAOFS {
    static #instance;

    constructor() {
        if (MessagesDaoFS.#instance) {return MessagesDaoFS.#instance;} // singleton
        super('messages.json')
        MessagesDaoFS.#instance = this;
    }
}

export default MessagesDaoFS