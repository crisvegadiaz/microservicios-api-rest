import { Router } from "express";
import eliminarPedido from "../grpc/pedidos/eliminarPedido.js";
import crearNuevoPedido from "../grpc/pedidos/crearNuevoPedido.js";
import actualizarDatosPedido from "../grpc/pedidos/actualizarDatosPedido.js";
import obtenerTodosLosPedidos from "../grpc/pedidos/obtenerTodosLosPedidos.js";
import eliminarTodosLosPedidos from "../grpc/pedidos/eliminarTodosLosPedidos.js";
import obtenerPedidoPorClienteId from "../grpc/pedidos/obtenerPedidoPorClienteId.js";

const pedidosRouter = Router();

pedidosRouter.get("/pedidos", obtenerTodosLosPedidos);
pedidosRouter.delete("/pedido/:pedidoId", eliminarPedido);
pedidosRouter.post("/pedido/:clienteId", crearNuevoPedido);
pedidosRouter.put("/pedido/:pedidoId", actualizarDatosPedido);
pedidosRouter.get("/pedidos/:clienteId", obtenerPedidoPorClienteId);
pedidosRouter.delete("/pedidos/:clienteId", eliminarTodosLosPedidos);

export default pedidosRouter;
