import Livro from "../Modelo/livro.js";
import Autor from "../Modelo/autor.js";
import  conectar  from '../Persistencia/conexao.js'; // Ajuste o caminho conforme necessário

export default class LivroCtrl {


    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const descricao = dados.descricao;
            const preco = dados.preco;
            const qtdEstoque = dados.qtdEstoque;
            const aut_codigo = dados.autor.codigo;

            if (descricao && preco > 0 && qtdEstoque >= 0 && aut_codigo > 0) {
                const livro = new Livro(0, descricao, preco, qtdEstoque);

                try {
                    // Grava o livro e obtém o código gerado
                    await livro.gravar();
                    const codigolivro = livro.codigo;

                    // Grava a relação com o autor diretamente aqui
                    const sql = `INSERT INTO livro_autor(liv_codigo, aut_codigo) VALUES (?, ?)`;
                    const parametros = [codigolivro, aut_codigo];

                    const conexao = await conectar();
                    await conexao.execute(sql, parametros);
                    global.poolConexoes.releaseConnection(conexao);

                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": codigolivro,
                        "mensagem": "Livro incluído com sucesso e associação com autor registrada!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o livro ou a associação livro/autor: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, preencha os dados do livro corretamente conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST e o formato application/json para cadastrar um livro!"
            });
        }
    }



    
    

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = requisicao.params.codigo; // Obtém o código da URL
            const descricao = dados.descricao;
            const preco = dados.preco;
            const qtdEstoque = dados.qtdEstoque;
            const aut_codigo = dados.autor.codigo;
    
            if (codigo && descricao && preco > 0 && qtdEstoque >= 0 && aut_codigo > 0) {
                const autor = new Autor(aut_codigo);
                const livro = new Livro(codigo, descricao, preco, qtdEstoque, autor);
                
                const conexao = await conectar();
    
                try {
                    // Atualiza o livro
                    await livro.alterar();
                    
                    // Atualiza a relação entre o livro e o autor
                    const atualizarSql = `UPDATE livro_autor SET aut_codigo = ? WHERE liv_codigo = ?`;
                    const parametrosAtualizar = [aut_codigo, livro.codigo];
    
                    const [resultado] = await conexao.execute(atualizarSql, parametrosAtualizar);
                    
                    // Verifica se a relação foi atualizada, se não, insere a relação
                    if (resultado.affectedRows === 0) {
                        const inserirSql = `INSERT INTO livro_autor(liv_codigo, aut_codigo) VALUES (?, ?)`;
                        await conexao.execute(inserirSql, [codigo, aut_codigo]);
                    }
                    
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Livro atualizado com sucesso e associação com autor registrada!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o livro ou a associação livro/autor: " + erro.message
                    });
                } finally {
                    global.poolConexoes.releaseConnection(conexao);
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do livro segundo a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um livro!"
            });
        }
    }
    
    
    
    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE') {
            const codigo = requisicao.params.codigo; // Obtém o código da URL
            console.log("delete", codigo);
    
            if (codigo) {
                const livro = new Livro(codigo);
                const conexao = await conectar();
    
                try {
                    // Exclui a associação entre livro e autor primeiro
                    const excluirAssociacaoSql = `DELETE FROM livro_autor WHERE liv_codigo = ?`;
                    await conexao.execute(excluirAssociacaoSql, [codigo]);
    
                    // Exclui o livro
                    await livro.excluir();
    
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Livro e associação com autor excluídos com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o livro ou a associação livro/autor: " + erro.message
                    });
                } finally {
                    global.poolConexoes.releaseConnection(conexao);
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do livro!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um livro!"
            });
        }
    }
    
    


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const livro = new Livro();
            livro.consultar(termo).then((resultado) => {
                if (resultado.status) {
                    resposta.json({
                        status: true,
                        listaLivros: resultado.listaLivros,
                    });
                } else {
                    resposta.json({
                        status: false,
                        mensagem: resultado.mensagem
                    });
                }
            }).catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os livros: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método GET para consultar livros!"
            });
        }
    }
    
    
}