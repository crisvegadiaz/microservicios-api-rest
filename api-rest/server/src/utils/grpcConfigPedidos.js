import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/pedidos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).pedidos;

// Crear un cliente gRPC para el Servicio B
const pedidos = new proto.Pedidos(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
export default pedidos;