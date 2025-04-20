import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();
// Validacion de las variables de entorno.
if (!process.env.PRODUCTOS_GRPC_IP_PORT) {
  console.error(
    "Error: La variable de entorno PRODUCTOS_GRPC_IP_PORT no está definida."
  );
  process.exit(1);
}

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

// Crear un cliente gRPC para el Servicio C
const productos  = new proto.Productos(
  process.env.PRODUCTOS_GRPC_IP_PORT,
  grpc.credentials.createInsecure()
);

export default productos;