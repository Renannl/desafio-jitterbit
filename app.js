require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());

// Rotas da API
app.use("/", authRoutes); // rota de login
app.use("/", orderRoutes); // rotas de pedidos

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
