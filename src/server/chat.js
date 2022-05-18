import { Server as io } from 'socket.io'
import { messageSchemaNormalizr } from '../models/schemas/messageSchemaNormalizr.js'
import normalizr from 'normalizr'
import { getDate, logger } from './utils.js'
import { messagesModel } from '../models/db.js'

export default class Chat {
    constructor(server) {
        this.normalize = normalizr.normalize
        this.messages = messagesModel;
        this.messageSchemaNormalizr = messageSchemaNormalizr
        this.welcomeMsg=[{
            user: {
                email: "admin@admin.com",
                name: "admin"
            }, 
            id: "1",
            message: "Bienvenido al chat",
            createdDate: getDate()
        }]
        this.chat = new io(server);
        this.chat.on('connection', (socket) => {
        // Se ejecuta una sola vez, cuando se conecta
        // el cliente
        this.messageDisplay = this.messages.listAll()
            .then(data => {
                //normalizamos mensajes y emitimos al socket
                let normalizedData = this.normalize(data, [this.messageSchemaNormalizr])
                this.chat.sockets.emit('message', normalizedData)
            })
            .catch(err => {
                logger(`Error al emitir mensajes: ${err}`, 'error')
            })
            
            // normalizamos mensaje de bienvenida.
            let normalizedData = this.normalize(this.welcomeMsg, [this.messageSchemaNormalizr])

            socket.emit('message', normalizedData)
            socket.on("message", data => {
            this.messages.save(data, (err, doc) => {
                if (err) {
                    logger(`Error al guardar mensaje: ${err}`, 'error')
                } else {
                    logger(`Mensaje guardado: ${doc}`, 'info')
                    this.chat.sockets.emit("message", doc)
                }
            })
        })
    })
}}