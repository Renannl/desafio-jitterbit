const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const autenticarToken = require("../middleware/auth");

/**
@route POST /order
@desc Cria um novo pedido no banco de dados.
@access Público (ou privado dependendo do projeto)
*/
router.post("/order", autenticarToken, orderController.criarPedido);

/**
@route GET /order/list
@desc Lista todos os pedidos cadastrados no banco de dados.
@access Público
*/
router.get("/order/list", autenticarToken, orderController.listarPedidos);

/**
@route GET /order/:orderId
@desc Retorna os detalhes de um pedido específico pelo ID.
@access Público
*/
router.get("/order/:orderId", autenticarToken, orderController.obterPedido);

/**
@route PUT /order/:orderId
@desc Atualiza um pedido existente pelo ID, substituindo os itens e dados.
@access Público
*/
router.put("/order/:orderId", autenticarToken, orderController.atualizarPedido);

/**
@route DELETE /order/:orderId
@desc Remove um pedido do banco de dados pelo ID.
@access Público
*/
router.delete(
  "/order/:orderId",
  autenticarToken,
  orderController.deletarPedido
);

module.exports = router;
