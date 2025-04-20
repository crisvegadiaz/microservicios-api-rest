import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();
// Validacion de las variables de entorno.
if (!process.env.CLIENTES_GRPC_IP_PORT) {
  console.error(
    "Error: La variable de entorno CLIENTES_GRPC_IP_PORT no está definida."
  );
  process.exit(1);
}

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  process.env.CLIENTES_GRPC_IP_PORT,
  grpc.credentials.createInsecure()
);

export default clientes;
