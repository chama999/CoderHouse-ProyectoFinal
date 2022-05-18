# CoderHouse-ProyectoFinal
Repositorio donde se almacena la entrega del proyecto final realizado en CoderHouse.

## ¿De que se trata? 
El sistema se refiere a una Ecommerce de Cervezas.

# Configuración. 
* Dentro del archivo Config.js se permite la configuración de: Paths, String Connection a Base de datos Mongo o Mongo Atlas y datos para Nodemailer.
* Se entrega archivo .env que contiene los parámetros de inicialización del server: Port, Tiempos de expiración de Cookies, Persistencia y NODE_ENV.

# Arbol de archivos
- src
  - api (Contiene todas las rutas + servicios)
    - carts.js - API RESTFUL de Carritos.
    - products.ejs - API RESTFUL de Productos.
    - session-mongo.ejs - Maneja las rutas de Login, Logout, Sessions y Middlware de Authenticación.
    - contacts.ejs - API RESTFUL para el Chat.
    - main.ejs - Contiene las rutas para el index de la aplicación.
    - orders.ejs - API RESTFUL para la creación, modificación y delete de Ordenes.
    - register.ejs  - Maneja los registros de Usuarios.
  - config (Contiene las configuraciones)
    - .env: Contiene información sensible para el funcionamiento de la aplicación.
    - config.js: Se genera a partir del .env, adicionando otras configuraciones necesarias para el funcionamiento de la app.
    - ecosystem.config.cjs: Nos permite ejecutando "pm2 start ecosystem.config.cjs" iniciar en modo FORK/CLLUSTER la aplicación. Contiene configuración para watch, ports, etc.
  - db (Persitencia filesystem)
  - logs (registro de logs, se puede configurar el modo dentro de config/logger.js)
  - server
    - public/scripts
      - fetch.js (script del lado de cliente)
      - socket.js (script de lado del cliente para websocket) 
    - chat.js (implementar un chat con el cliente)
    - multer.js (lógica para la subida de imágenes)
    - nodemailer.js (lógica para envío de mails)
    - server.js (Seteo de rutas y middlewares)
    - utils.js (Distintas funciones que ayudan a la aplicación) 
  - models (Contiene schemas + DAOs)
    - DAOs (Contiene DAOs y DAOs Base. Se divide por funcionalidad.)
      - carts (Implementa los DAOs para la funcionalidad de Carrito. Usa una Factory para switchear la persistencia) 
        - cartsDaoFactory.js
        - cartsDaoFS.js
        - cartsDaoMemory.js
        - cartsDaoMongo.js 
      - messages (Implementa los DAOs para la funcionalidad de Mensajes. Usa una Factory para switchear la persistencia) 
        - messagesDaoFactory.js
        - messagesDaoFS.js
        - messagesDaoMemory.js
        - messagesDaoMongo.js  
      - orders (Implementa los DAOs para la funcionalidad de Ordenes. Usa una Factory para switchear la persistencia) 
        - ordersDaoFactory.js
        - ordersDaoFS.js
        - ordersDaoMemory.js
        - ordersDaoMongo.js  
      - products (Implementa los DAOs para la funcionalidad de Productos. Usa una Factory para switchear la persistencia) 
        - productsDaoFactory.js
        - productsDaoFS.js
        - productsDaoMemory.js
        - productsDaoMongo.js 
      - users (Implementa los DAOs para la funcionalidad de Usuarios. Usa una Factory para switchear la persistencia) 
        - usersDaoFactory.js
        - usersDaoFS.js
        - usersDaoMemory.js
        - usersDaoMongo.js 
      - DAOFileSystem.js
      - DAOMemory.js
      - DAOMongo.js
    - schemas (Contiene los modelos de datos, tipos, entidades, etc)
      - cartSchema.js
      - messageSchema.js
      - messageSchemaNormalizr.js
      - orderSchema.js
      - productSchema.js
      - userSchema.js
    -db.js (Inicia los modelos. Punto de partida de la base)
  - views (Se utilizó EJS cómo motor de plantillas, adicionando scripts en JavaScript, JQuery. Los estilos un mix entre CSS y Bootstrap.)
    - partials
      - footer
      - headers
      - nav
    - main.ejs
    - products.ejs
    - carts.ejs
    - contacts.ejs
    - error-login.ejs
    - info.ejs
    - list.ejs
    - loginAfterRegister.ejs
    - logout.ejs
    - newProduct.ejs
    - register.ejs
  - app.js (aplicación de inicio. Iniciar usando nodemon o node ./src/app.js)
- uploads (se almacenan las imágenes státicas)
- .gitignore (archivos a ignorar al hacer push a git)
- package.json (instalar usando "npm install")


# Comandos para utilizar
1) git clone https://github.com/chama999/CoderHouse-ProyectoFinal.git
2) npm install
3) node ./src/app.js

# API:
Se añade colección de postman para validar APIs.

# ¿Que tecnologías utilicé?:
    -Node.js
    -MongoDB / Mongo Atlas
    -Passport JWT
    -Mongoose
    -Bcrypt
    -Websocket
    -Dotenv
    -Handlebars, Pug, Ejs
    -Nodemailer

# Se detallan los requerimientos a continuación:

Inicio: Al momento de requerir la ruta base ‘/’
Permitir un menú de ingreso al sistema con email y password así como también la posibilidad de registro de un nuevo usuario.
El menú de registro consta del nombre completo del cliente, número telefónico, email y campo de password duplicado para verificar coincidencia.
Si un usuario se loguea exitosamente o está en sesión activa, la ruta ‘/’ hará una re dirección a la ruta del carrito /productos 
La ruta /productos devolverá el listado de todos los productos disponibles para la compra.
La ruta /productos/:categoria devolverá los productos por la categoría requerida.
Los ítems podrán ser agregados al carrito de compras y listados a través de la ruta /carrito.
Se podrán modificar y borrar por su id a través de la ruta /carrito:id.

Flow: Se puede solicitar un producto específico con la ruta /productos/:id, donde id es el id del item generado por MongoDB y devolver la descripción del producto ( foto, precio, selector de cantidad). 
Si se ingresa a /productos/:id y el producto no existe en MongoDB, debemos responder un mensaje adecuado que indique algo relacionado a que el producto no existe.

MongoDB:
Implementar al menos estas colecciones:
usuarios: clientes registrados
productos: catálogo completo
Link para foto (puede almacenarse de modo estático en la página en una subruta /images/:productoid )
Precio unitario
Descripción
Categoría

mensajes: chat del usuario (preguntas y respuestas)
Email: del usuario que pregunta o al que se responde
Tipo (‘usuario’ para preguntas ó ‘sistema’ para respuestas)
Fecha y hora
Cuerpo del mensaje

carrito: orden temporal de compra
Email
Fecha y hora
Items con sus cantidades
Dirección de entrega

ordenes: las órdenes generadas, que deben incluir los productos, descripciones y los precios al momento de la compra. 
Ítems:  las órdenes deben poder tener productos surtidos, cada uno con su cantidad. Por ejemplo: remeras x 2 y gorra x 1
Número de orden: Se extrae de la cantidad de órdenes almacenadas
Fecha y hora
estado ( por defecto en ‘generada’)
Email de quién realizó la orden


Finalizada la orden, enviar un mail a la dirección de mi cuenta con los detalles de la orden.
Se dispondrá de un archivo de configuración externo con opciones para desarrollo y otras para producción, que serán visualizadas a través de una vista construida con handlebars. Como parámetros de configuración estará el puerto de escucha del servidor, la url de la base de datos, el mail que recibirá notificaciones del backend, tiempo de expiración de sesión y los que sea necesario incluir.
Vamos a contar con un canal de chat general donde el usuario enviará los mensajes en la ruta /chat y en /chat/:email podrá ver sólo los suyos. Se utilizará la colección mensajes en MongoDB.  La tecnología de comunicación a utilizar será Websockets. El servidor implementará una vista, utilizando handlebars, para visualizar todos los mensajes y poder responder individualmente a ellos, eligiendo el email de respuesta.




