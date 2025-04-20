import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();
// Validacion de las variables de entorno.
if (!process.env.PEDIDOS_GRPC_IP_PORT) {
  console.error(
    "Error: La variable de entorno PEDIDOS_GRPC_IP_PORT no está definida."
  );
  process.exit(1);
}

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/pedidos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).pedidos;

const pedidos = new proto.PedidosClientes(
  process.env.PEDIDOS_GRPC_IP_PORT,
  grpc.credentials.createInsecure()
);

export function clienteTienePedidoPendiente(clienteId) {
  return new Promise((resolve, reject) => {
    pedidos.ClienteTienePedidoPendiente({ clienteId }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error clienteTienePedidoPendiente: ", error);
        reject(error);
      }
    });
  });
}

export function eliminarTodosLosPedidos(clienteId) {
  return new Promise((resolve, reject) => {
    pedidos.EliminarTodosLosPedidos({ clienteId }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error EliminarTodosLosPedidos: ", error);
        reject(error);
      }
    });
  });
}
