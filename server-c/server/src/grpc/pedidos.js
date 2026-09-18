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

const pedidos = new proto.PedidosProductos(
  process.env.PEDIDOS_GRPC_IP_PORT,
  grpc.credentials.createInsecure()
);

const eliminarProductoDeTodosLosPedidosGrpc = promisify(
  pedidos.EliminarProductoDeTodosLosPedidos.bind(pedidos)
);

export async function eliminarProductoDeTodosLosPedidos(productoId) {
  try {
    return await eliminarProductoDeTodosLosPedidosGrpc({ productoId });
  } catch (error) {
    console.error("Error eliminarProductoDeTodosLosPedidos: ", error);
    throw error;
  }
}
