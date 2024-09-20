// Rotas/rotaAuth.js
import express from 'express';
import { authenticateUser } from '../Controle/Auth.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;
    console.log('Recebendo solicitação de login...');

    try {
        const { token } = authenticateUser(username, password);
        res.json({
            status: true,
            token
        });
    } catch (error) {
        res.status(401).json({
            status: false,
            mensagem: error.message
        });
    }
});

export default router;
