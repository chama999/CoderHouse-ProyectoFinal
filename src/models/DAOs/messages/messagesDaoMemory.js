import DAOMemory from "../DAOMemory.js"

class MessagesDaoMemory extends DAOMemory {
    static #instance;

    constructor() {
        if (MessagesDaoMemory.#instance) {return MessagesDaoMemory.#instance;} // singleton
        super()
        MessagesDaoMemory.#instance = this;
    }
}

export default MessagesDaoMemory