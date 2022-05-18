import log4js from 'log4js';

/*configurar all para que se muestre en consola y en archivo
levels: trace, debug, info, warn, error, fatal
*/
//Configuración de logs
export default log4js.configure({
    appenders: {
        loggerConsole: { type: 'console', layout: { type: 'pattern', pattern: '%[ [%d] [%p] [%c] [%f{1}:%l:%o] %] %m%n' } },
        loggerFile: { type: 'file', layout: { type: 'pattern', pattern: '%[ [%d] [%p] [%c] [%f{1}:%l:%o] %] %m%n' }, filename: './src/logs/logger.log' }
    },
    categories: {
        default: { appenders: ['loggerConsole'], level: 'trace',enableCallStack: true },
        file: { appenders: ['loggerFile'], level: 'debug',enableCallStack: true },

        all: { appenders: ['loggerConsole', 'loggerFile'], level: 'trace' ,enableCallStack: true}
    }
})