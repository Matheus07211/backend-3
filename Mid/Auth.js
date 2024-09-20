// middleware/authMiddleware.js
import { verifyToken } from '../Controle/Auth.js';
import bodyParser from 'body-parser';


export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato do cabeçalho: "Bearer TOKEN"

    if (token == null) return res.status(401).json({ status: false, mensagem: 'Token não fornecido' });

    try {
        const user = verifyToken(token);
        req.user = user; // Armazena as informações do usuário no request
        next();
    } catch (err) {
        res.status(403).json({ status: false, mensagem: 'Token inválido' });
    }
}
