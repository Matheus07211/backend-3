// Controle/Auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export function authenticateUser(username, password) {
    if (username === 'admin' && password === '123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return { token };
    } else {
        throw new Error('Credenciais inválidas');
    }
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        throw new Error('Token inválido');
    }
}
