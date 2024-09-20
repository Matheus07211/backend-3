import Livro from '../Modelo/livro.js';
import Autor from '../Modelo/autor.js';
import conectar from './conexao.js';

export default class LivroDAO {

    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS livro(
                liv_codigo INT NOT NULL AUTO_INCREMENT,
                liv_descricao VARCHAR(100) NOT NULL,
                liv_preco DECIMAL(10,2) NOT NULL DEFAULT 0,
                liv_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
                aut_codigo INT NOT NULL,
                CONSTRAINT pk_livro PRIMARY KEY(liv_codigo),
                CONSTRAINT fk_autor FOREIGN KEY(aut_codigo) REFERENCES autor(aut_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }


    async gravar(livro) {
        if (livro instanceof Livro) {
            const sql = `INSERT INTO livro(liv_descricao, liv_preco, liv_qtdEstoque)
                VALUES(?,?,?)`;
            const parametros = [livro.descricao, livro.preco, livro.qtdEstoque];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            livro.codigo = retorno[0].insertId;
            console.log(livro.codigo);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async gravarLivroAutor(livro) {
        if (livro instanceof Livro && livro.codigo && livro.autor.codigo) {
            const sql = `INSERT INTO livro_autor(liv_codigo, aut_codigo) VALUES (?, ?)`;
            const parametros = [livro.codigo, livro.autor.codigo];
    
            try {
                const conexao = await conectar();
                await conexao.execute(sql, parametros);
                global.poolConexoes.releaseConnection(conexao);
            } catch (erro) {
                console.error('Erro ao gravar na tabela livro_autor:', erro);
                throw erro;
            }
        } else {
            throw new Error("Livro ou autor não definidos corretamente.");
        }
    }
    



    //-------------------------------------------------------------------------------------------------------------


    async atualizar(livro) {
        if (livro instanceof Livro) {
            const sql = `UPDATE livro SET liv_descricao = ?, liv_preco = ?, liv_qtdEstoque = ?
            WHERE liv_codigo = ?`;
            const parametros = [livro.descricao, livro.preco, livro.qtdEstoque, livro.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(livro) {
        if (livro instanceof Livro) {
            const sql = `DELETE FROM livro WHERE liv_codigo = ?`;
            const parametros = [livro.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        const conexao = await conectar();
        let listaLivros = [];
    
        // Consulta todos os livros
        const sql = `SELECT l.liv_codigo, l.liv_descricao, l.liv_preco, l.liv_qtdEstoque, 
                            a.aut_codigo, a.aut_nome
                     FROM livro l
                     LEFT JOIN livro_autor la ON l.liv_codigo = la.liv_codigo
                     LEFT JOIN autor a ON la.aut_codigo = a.aut_codigo
                     ORDER BY l.liv_descricao;`;
    
        try {
            const [registros] = await conexao.execute(sql);
    
            
    
            const livrosMap = new Map();
    
            for (const registro of registros) {
                // Verifica se o livro já está na lista
                if (!livrosMap.has(registro.liv_codigo)) {
                    const livro = new Livro(
                        registro.liv_codigo,
                        registro.liv_descricao,
                        registro.liv_preco,
                        registro.liv_qtdEstoque
                    );
                    livrosMap.set(registro.liv_codigo, livro);
                }
    
                // Adiciona o autor ao livro, se existir
                if (registro.aut_codigo && registro.aut_nome) {
                    const livro = livrosMap.get(registro.liv_codigo);
                    const autor = new Autor(registro.aut_codigo, registro.aut_nome);
                    livro.addAutor(autor); // Adiciona o autor ao livro
                }
            }
    
            listaLivros = Array.from(livrosMap.values());
    
        } catch (error) {
            console.error('Erro ao consultar livros:', error);
            return {
                status: false,
                mensagem: 'Não foi possível obter os livros.',
            };
        }
    
        
    
        return {
            status: true,
            listaLivros,
        };
    }
    
    
}