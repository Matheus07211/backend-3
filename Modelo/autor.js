import AutorDAO from "../Persistencia/autorDAO.js";
//não esqueça do .js no final da importação

export default class Autor {
    //definição dos atributos privados
    #codigo;
    #nome;

    constructor(codigo=0, nome=''){
        this.#codigo=codigo;
        this.#nome=nome;
    }

    //métodos de acesso públicos

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novaNome){
        this.#nome = novaNome;
    }

    //override do método toJSON
    toJSON()     
    {
        return {
            codigo:this.#codigo,
            nome:this.#nome
        }
    }

    //camada de modelo acessa a camada de persistencia
    async gravar(){
        const autDAO = new AutorDAO();
        await autDAO.gravar(this);
    }

    async excluir(){
        const autDAO = new AutorDAO();
        await autDAO.excluir(this);
    }

    async atualizar(){
        const autDAO = new AutorDAO();
        await autDAO.atualizar(this);

    }

    async consultar(parametro){
        const autDAO = new AutorDAO();
        return await autDAO.consultar(parametro);
    }

    async possuiLivros(){
        const autDAO = new AutorDAO();
        return await autDAO.possuiLivros(this);
    }
}