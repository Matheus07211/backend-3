import { Router } from "express";
import LivroCtrl from "../Controle/livroCtrl.js";

const livCtrl = new LivroCtrl();
const rotaLivro = new Router();

rotaLivro
.get('/', livCtrl.consultar)
.get('/:termo', livCtrl.consultar)
.post('/', livCtrl.gravar)
.patch('/:codigo', livCtrl.atualizar)
.put('/:codigo', livCtrl.atualizar)
.delete('/:codigo', livCtrl.excluir);

export default rotaLivro;