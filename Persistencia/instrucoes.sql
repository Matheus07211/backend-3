CREATE DATABASE sistema;

USE sistema;

-- Tabela autor
CREATE TABLE autor (
    aut_codigo INT NOT NULL AUTO_INCREMENT,
    aut_nome VARCHAR(100) NOT NULL,
    CONSTRAINT pk_autor PRIMARY KEY (aut_codigo)
);

-- Tabela livro
CREATE TABLE livro (
    liv_codigo INT NOT NULL AUTO_INCREMENT,
    liv_descricao VARCHAR(100) NOT NULL,
    liv_preco DECIMAL(10,2) NOT NULL DEFAULT 0,
    liv_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    CONSTRAINT pk_livro PRIMARY KEY (liv_codigo)
);

-- Tabela de relacionamento muitos para muitos entre livro e autor
CREATE TABLE livro_autor (
    liv_codigo INT,
    aut_codigo INT,
    PRIMARY KEY (liv_codigo, aut_codigo),
    FOREIGN KEY (liv_codigo) REFERENCES livro(liv_codigo),
    FOREIGN KEY (aut_codigo) REFERENCES autor(aut_codigo)
);
