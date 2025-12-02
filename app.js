require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());

// Rotas da API
app.use("/", authRoutes); // rota de login
app.use("/", orderRoutes); // rotas de pedidos

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    requestInterceptor: (req) => {
      const token = req.headers["Authorization"] || localStorage.getItem("jwtToken");
      if (token) req.headers["Authorization"] = token;
      return req;
    },
  },
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
