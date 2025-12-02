# API de Pedidos com Autenticação JWT

Esta é uma API para gerenciar pedidos, com suporte a **autenticação via JWT (JSON Web Token)**, criada com **Node.js**, **Express** e **PostgreSQL**. Possui rotas para criar, listar, atualizar, obter detalhes e deletar pedidos. Além disso, a documentação interativa é fornecida via **Swagger**.

---

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Token) para autenticação
- bcrypt para hash de senhas
- Swagger para documentação e testes interativos

---

## Estrutura do Projeto

```
.
├── app.js                # Arquivo principal da API
├── controllers/
│   └── orderController.js
├── routes/
│   ├── orderRoutes.js
│   └── authRoutes.js
├── middleware/
│   └── auth.js           # Middleware de autenticação JWT
├── swagger.json          # Documentação Swagger
├── package.json
└── .env                  # Variáveis de ambiente (ex: JWT_SECRET, PORT)
```

---

## Instalação e Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/desafio-jitter.git
cd desafio-jitter
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados PostgreSQL:  
Crie um usuário no banco de dados e dê as permissões necessárias (Pode logar, Superuser, Criar databases, etc)
```
Nome: teste
Senha: 1234
```
Depois de criar o usuário, crie o banco que será usado pela aplicação:
```
Nome do banco: ordersdb
Proprietário: teste
```

4. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis caso não haja:

```
DB_USER=teste
DB_HOST=localhost
DB_DATABASE=ordersdb
DB_PASSWORD=1234
DB_PORT=5432
PORT=3000
JWT_SECRET=1234
```

5. Inicie a API:

```bash
node app.js
```

A API estará rodando em: `http://localhost:3000`

A documentação pode ser acessada em `http://localhost:3000/api-docs/`

---

## Rotas Principais

### Autenticação

- **POST /login**  
  Realiza login e retorna o token JWT.

**Exemplo de body**:

```json
{
  "username": "admin",
  "password": "1234"
}
```

**Resposta**:

```json
{
  "token": "SEU_TOKEN_JWT_AQUI"
}
```

### Pedidos (protegidas por JWT)

- **POST /order** – Cria um novo pedido  
- **GET /order/list** – Lista todos os pedidos  
- **GET /order/:orderId** – Obtém detalhes de um pedido  
- **PUT /order/:orderId** – Atualiza um pedido  
- **DELETE /order/:orderId** – Deleta um pedido  

Todas essas rotas exigem que o **token JWT** seja enviado no header `Authorization`:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## Usando o Swagger para Testar

A documentação interativa do Swagger está disponível em:

```
http://localhost:3000/api-docs
```

### Como usar o token no Swagger

1. Clique no botão **Authorize** no canto superior direito da tela do Swagger.
2. Insira o token JWT retornado no login no campo:

```
Bearer SEU_TOKEN_AQUI
```

3. Clique em **Authorize** e depois em **Close**.
4. Agora você pode testar todas as rotas protegidas sem precisar inserir o token manualmente.

---

## Exemplo de JSON para criar um pedido

```json
{
  "numeroPedido": "PED1234567",
  "valorTotal": 150,
  "dataCriacao": "2025-12-02T08:00:00Z",
  "items": [
    {
      "idItem": "1",
      "quantidadeItem": 2,
      "valorItem": 75
    }
  ]
}
```

---

## Observações

- O projeto utiliza **JWT com validade de 1 hora**.
- As rotas estão preparadas para serem facilmente integradas com front-end ou testes via Postman/Swagger.

---


