import app from './server/server.js'
import config from './config/config.js'
import Chat from './server/chat.js'
import cluster from 'cluster';
import os from 'os';
import { logger } from './server/utils.js';
const numCpus = os.cpus().length;

/* Print arguments - comentado para no imprimir
process.argv.forEach((val, index) => {
    console.log(`Arg: ${index}: ${val}`);
});
*/

const PORT = parseInt(process.argv[2]) || config.env.PORT;
const MODE=process.argv[3] || 'FORK';

// iniciar el servidor en modo FORK o CLUSTER
if (cluster.isPrimary && MODE=='CLUSTER') {
    logger(`Master running on:\n PORT: ${PORT}\n PID: ${process.pid}`, 'info');

    //for workers
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger( `worker on \n PORT: ${worker.process.PORT} \n PID: ${worker.process.pid} died`,'warn');
    });
} else {
    const server = app.listen(PORT, () => {
        //iniciamos chat con web socket
        const chat = new Chat(server)
    })
    //Si hay error imprimimos en consola
    server.on('error', error => logger(`Error en servidor ${error}`,'error'));
    logger(`Worker running on: PORT: ${PORT} PID: ${process.pid}`, 'debug');        
}



