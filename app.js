require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const setupSwagger = require("./swagger"); // importando Swagger

const app = express();

app.use(bodyParser.json());

// Rotas da API
app.use("/", authRoutes); // rota de login
app.use("/", orderRoutes); // rotas de pedidos

// Swagger
setupSwagger(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
