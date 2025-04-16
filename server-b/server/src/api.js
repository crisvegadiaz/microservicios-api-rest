import Modelo from "./model.js";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/pedidos.proto");
// Cargar el paquete gRPC
const proto = grpc.loadPackageDefinition(packageDefinition).pedidos;

async function obtenerTodosLosPedidos(_, callback) {
  try {
    const res = await Modelo.obtenerTodosLosPedidos();
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function obtenerPedidoPorClienteId(call, callback) {
  try {
    const res = await Modelo.obtenerPedidoPorClienteId(call.request.clienteId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function crearNuevoPedido(call, callback) {
  try {
    const res = await Modelo.crearNuevoPedido(
      call.request.clienteId,
      call.request.productos
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function actualizarDatosPedido(call, callback) {
  try {
    const res = await Modelo.actualizarDatosPedido(
      call.request.estado,
      call.request.pedidoId
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarPedido(call, callback) {
  try {
    const res = await Modelo.eliminarPedido(call.request.pedidoId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarTodosLosPedidos(call, callback) {
  try {
    const res = await Modelo.eliminarTodosLosPedidos(call.request.clienteId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

// Crear el servidor gRPC
const server = new grpc.Server();
server.addService(proto.Pedidos.service, {
  ObtenerTodosLosPedidos: obtenerTodosLosPedidos,
  ObtenerPedidoPorClienteId: obtenerPedidoPorClienteId,
  CrearNuevoPedido: crearNuevoPedido,
  ActualizarDatosPedido: actualizarDatosPedido,
  EliminarPedido: eliminarPedido,
  EliminarTodosLosPedidos: eliminarTodosLosPedidos,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server-B corriendo en el puerto 50051");
  }
);
