import Autor from "../Modelo/autor.js";
import conectar from "./conexao.js";
//DAO = Data Access Object -> Objeto de acesso aos dados
export default class AutorDAO{

    constructor() {
        this.init();
    }
    
    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS autor(
                    aut_codigo INT NOT NULL AUTO_INCREMENT,
                    aut_nome VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_autor PRIMARY KEY(aut_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }
    async gravar(autor){
        if (autor instanceof Autor){
            const sql = "INSERT INTO autor(aut_nome) VALUES(?)"; 
            const parametros = [autor.nome];
            const conexao = await conectar(); //retorna uma conexão
            const retorno = await conexao.execute(sql,parametros); //prepara a sql e depois executa
            autor.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(autor){
        if (autor instanceof Autor){
            const sql = "UPDATE autor SET aut_nome = ? WHERE aut_codigo = ?"; 
            const parametros = [autor.nome, autor.codigo];
            const conexao = await conectar(); //retorna uma conexão
            await conexao.execute(sql,parametros); //prepara a sql e depois executa
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(autor){
        if (autor instanceof Autor){
            const sql = "DELETE FROM autor WHERE aut_codigo = ?"; 
            const parametros = [autor.codigo];
            const conexao = await conectar(); //retorna uma conexão
            await conexao.execute(sql,parametros); //prepara a sql e depois executa
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta){
        let sql='';
        let parametros=[];
        //é um número inteiro?
        if (!isNaN(parseInt(parametroConsulta))){
            //consultar pelo código do autor
            sql='SELECT * FROM autor WHERE aut_codigo = ? order by aut_nome';
            parametros = [parametroConsulta];
        }
        else{
            //consultar pela descricao
            if (!parametroConsulta){
                parametroConsulta = '';
            }
            sql = "SELECT * FROM autor WHERE aut_nome like ?";
            parametros = ['%'+parametroConsulta+'%'];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql,parametros);
        let listaAutores = [];
        for (const registro of registros){
            const autor = new Autor(registro.aut_codigo,registro.aut_nome);
            listaAutores.push(autor);
        }
        return listaAutores;
    }

    async possuiLivros(autor){
        if (autor instanceof Autor){
            const sql = `SELECT count(*) FROM livro l
                         INNER JOIN autor a ON l.aut_codigo = a.aut_codigo
                         WHERE a.aut_codigo = ?`;
            const parametros = [autor.codigo];
            const [registros] = await global.poolConexoes.execute(sql, parametros);
            return registros[0].qtd > 0;
        }
    }

}