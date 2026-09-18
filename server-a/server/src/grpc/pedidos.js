import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { promisify } from "util";

dotenv.config();

// Validación de las variables de entorno.
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

const clienteTienePedidoPendienteGrpc = promisify(
  pedidos.ClienteTienePedidoPendiente.bind(pedidos)
);
const eliminarTodosLosPedidosGrpc = promisify(
  pedidos.EliminarTodosLosPedidos.bind(pedidos)
);

export async function clienteTienePedidoPendiente(clienteId) {
  try {
    return await clienteTienePedidoPendienteGrpc({ clienteId });
  } catch (error) {
    console.error("Error clienteTienePedidoPendiente: ", error);
    throw error;
  }
}

export async function eliminarTodosLosPedidos(clienteId) {
  try {
    return await eliminarTodosLosPedidosGrpc({ clienteId });
  } catch (error) {
    console.error("Error eliminarTodosLosPedidos: ", error);
    throw error;
  }
}
