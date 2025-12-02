const pool = require("../database");

/**

* Valida se o JSON recebido possui os campos obrigatórios
* @param {Object} data - Objeto representando o pedido
* @returns {boolean} - Retorna true se válido, false caso contrário
  */
function validarPedido(data) {
  if (
    !data.numeroPedido ||
    !data.valorTotal ||
    !data.dataCriacao ||
    !Array.isArray(data.items)
  )
    return false;
  for (const item of data.items) {
    if (!item.idItem || !item.quantidadeItem || !item.valorItem) return false;
  }
  return true;
}

/**

* Cria um novo pedido
* @route POST /order
* @param {Request} req - Contém os dados do pedido no corpo
* @param {Response} res - Resposta HTTP
  */
async function criarPedido(req, res) {
  try {
    const data = req.body;

    // Validação do JSON
    if (!validarPedido(data)) {
      return res
        .status(400)
        .json({ error: "JSON inválido ou campos faltando" });
    }

    // Mapear dados do pedido
    const orderId = data.numeroPedido;
    const value = data.valorTotal;
    const creationDate = new Date(data.dataCriacao);
    const items = data.items.map((i) => ({
      productId: Number(i.idItem),
      quantity: i.quantidadeItem,
      price: i.valorItem,
    }));

    // Inserir pedido na tabela "Order"
    await pool.query(
      `INSERT INTO "Order" (orderId, value, creationDate) VALUES ($1, $2, $3)`,
      [orderId, value, creationDate]
    );

    // Inserir itens relacionados
    for (const item of items) {
      await pool.query(
        `INSERT INTO "Items" (orderId, productId, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Pedido criado com sucesso",
      order: { orderId, value, creationDate, items },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**

* Obtém os detalhes de um pedido específico
* @route GET /order/:orderId
  */
async function obterPedido(req, res) {
  try {
    const { orderId } = req.params;

    // Buscar pedido
    const orderResult = await pool.query(
      `SELECT * FROM "Order" WHERE orderId = $1`,
      [orderId]
    );
    if (orderResult.rowCount === 0)
      return res.status(404).json({ error: "Pedido não encontrado" });

    // Buscar itens do pedido
    const itemsResult = await pool.query(
      `SELECT productId, quantity, price FROM "Items" WHERE orderId = $1`,
      [orderId]
    );

    res.json({
      orderId: orderResult.rows[0].orderid,
      value: orderResult.rows[0].value,
      creationDate: orderResult.rows[0].creationdate,
      items: itemsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**

* Lista todos os pedidos cadastrados
* @route GET /order/list
  */
async function listarPedidos(req, res) {
  try {
    // Buscar todos os pedidos
    const ordersResult = await pool.query(`SELECT * FROM "Order"`);

    // Se não houver pedidos, retorna array vazio
    if (ordersResult.rowCount === 0) return res.json([]);

    const pedidos = [];

    // Para cada pedido, buscar os itens correspondentes
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT productId, quantity, price FROM "Items" WHERE orderId = $1`,
        [order.orderid]
      );

      pedidos.push({
        orderId: order.orderid,
        value: order.value,
        creationDate: order.creationdate,
        items: itemsResult.rows,
      });
    }

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
Atualiza um pedido existente
@route PUT /order/:orderId
*/
async function atualizarPedido(req, res) {
  try {
    const { orderId } = req.params;
    const data = req.body;

    if (!validarPedido(data))
      return res
        .status(400)
        .json({ error: "JSON inválido ou campos faltando" });

    // Atualiza dados do pedido
    const orderUpdate = await pool.query(
      `UPDATE "Order" SET value = $1, creationDate = $2 WHERE orderId = $3 RETURNING *`,
      [data.valorTotal, new Date(data.dataCriacao), orderId]
    );

    if (orderUpdate.rowCount === 0)
      return res.status(404).json({ error: "Pedido não encontrado" });

    // Remove itens antigos
    await pool.query(`DELETE FROM "Items" WHERE orderId = $1`, [orderId]);

    // Insere novos itens
    const items = data.items.map((i) => ({
      productId: Number(i.idItem),
      quantity: i.quantidadeItem,
      price: i.valorItem,
    }));

    for (const item of items) {
      await pool.query(
        `INSERT INTO "Items" (orderId, productId, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    res.json({
      message: "Pedido atualizado com sucesso",
      order: {
        orderId,
        value: data.valorTotal,
        creationDate: data.dataCriacao,
        items,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**

* Deleta um pedido existente
* @route DELETE /order/:orderId
  */
async function deletarPedido(req, res) {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `DELETE FROM "Order" WHERE orderId = $1 RETURNING *`,
      [orderId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Pedido não encontrado" });

    res.json({ message: "Pedido deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  criarPedido,
  obterPedido,
  listarPedidos,
  atualizarPedido,
  deletarPedido,
};
