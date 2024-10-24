import express from 'express';
import cors from 'cors';
import { router } from './routes';

const server = express();
server.use(cors());

server.use(express.json());


/**Configurando o roteador */
server.use(router);

/**Exportando o servidor */
export {server};