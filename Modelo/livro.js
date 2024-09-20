import Autor from "./autor.js";
import livroDAO from '../Persistencia/livroDAO.js';

export default class Livro {
    #codigo;
    #descricao;
    #preco;
    #qtdEstoque;
    #autores; // Lista de autores

    constructor(codigo = 0, descricao = "", preco = 0, qtdEstoque = 0, autores = []) {
        this.#codigo = codigo;
        this.#descricao = descricao;
        this.#preco = preco;
        this.#qtdEstoque = qtdEstoque;
        this.#autores = autores; // Inicializa a lista de autores como um array
    }

    addAutor(autor) {
        if (autor instanceof Autor) {
            if (!this.#autores) {
                this.#autores = []; // Garantir que #autores é um array
            }
            this.#autores.push(autor); // Adiciona o autor à lista de autores
        }
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDesc) {
        this.#descricao = novaDesc;
    }

    get preco() {
        return this.#preco;
    }

    set preco(novoPreco) {
        this.#preco = novoPreco;
    }

    get qtdEstoque() {
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtd) {
        this.#qtdEstoque = novaQtd;
    }

    get autores() {
        return this.#autores;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            descricao: this.#descricao,
            preco: this.#preco,
            qtdEstoque: this.#qtdEstoque,
            autores: this.#autores ? this.#autores.map(autor => autor.toJSON()) : [], // Prevenção de undefined
        };
    }

    async gravar() {
        const livDAO = new livroDAO();
        await livDAO.gravar(this);
    }

    async excluir() {
        const livDAO = new livroDAO();
        await livDAO.excluir(this);
    }

    async alterar() {
        const livDAO = new livroDAO();
        await livDAO.atualizar(this);
    }

    async consultar(termo) {
        const livDAO = new livroDAO();
        return await livDAO.consultar(termo);
    }
}
