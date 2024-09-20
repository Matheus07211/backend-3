import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // Use import em vez de require
import rotaAutor from './Rotas/rotaAutor.js';
import rotaLivro from './Rotas/rotaLivro.js';
import rotaAuth from './Rotas/rotaAuth.js';
import { authenticateToken } from './Mid/Auth.js'; // Certifique-se de que o caminho está correto

const host = '0.0.0.0';
const porta = 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas públicas
app.use('/login', rotaAuth); // Rota para autenticação

// Rotas protegidas
app.use('/autor',  rotaAutor);
app.use('/livro', rotaLivro);

app.listen(porta, host, () => {
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
});
