const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

/**
@route POST /order
@desc Cria um novo pedido no banco de dados.
@access Público (ou privado dependendo do projeto)
*/
router.post("/order", orderController.criarPedido);

/**
@route GET /order/list
@desc Lista todos os pedidos cadastrados no banco de dados.
@access Público
*/
router.get("/order/list", orderController.listarPedidos);

/**
@route GET /order/:orderId
@desc Retorna os detalhes de um pedido específico pelo ID.
@access Público
*/
router.get("/order/:orderId", orderController.obterPedido);

/**
@route PUT /order/:orderId
@desc Atualiza um pedido existente pelo ID, substituindo os itens e dados.
@access Público
*/
router.put("/order/:orderId", orderController.atualizarPedido);

/**
@route DELETE /order/:orderId
@desc Remove um pedido do banco de dados pelo ID.
@access Público
*/
router.delete("/order/:orderId", orderController.deletarPedido);

module.exports = router;
