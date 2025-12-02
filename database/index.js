//Configuração e conexão com o banco de dados PostgreSQL
//Criação das tabelas "Order" e "Items" se não existirem
const { Pool } = require("pg");

// Cria uma pool de conexões usando variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// Função para criar tabelas iniciais se não existirem

const criarTabelas = async () => {
  await pool.query(`  CREATE TABLE IF NOT EXISTS "Order" (
     orderId VARCHAR(50) PRIMARY KEY, -- ID do pedido
     value NUMERIC,                   -- Valor total do pedido
     creationDate TIMESTAMP           -- Data de criação do pedido
   );
   CREATE TABLE IF NOT EXISTS "Items" (
     id SERIAL PRIMARY KEY,           -- ID do item
     orderId VARCHAR(50) REFERENCES "Order"(orderId) ON DELETE CASCADE, -- FK para pedido
     productId INTEGER,               -- ID do produto
     quantity INTEGER,                -- Quantidade do item
     price NUMERIC                    -- Preço unitário do item
   );
    `);
};

// Executa a criação das tabelas automaticamente ao iniciar
criarTabelas();

// Exporta a pool para ser usada em outros módulos
module.exports = pool;
