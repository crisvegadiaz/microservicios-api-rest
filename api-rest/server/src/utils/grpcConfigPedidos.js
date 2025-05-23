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

// Crear un cliente gRPC para el Servicio B
const pedidos = new proto.Pedidos(
  process.env.PEDIDOS_GRPC_IP_PORT,
  grpc.credentials.createInsecure()
);
export default pedidos;
