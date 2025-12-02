require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(bodyParser.json());

// Rotas da API
app.use("/", orderRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
