import { createGrpcClient } from "./grpcClientFactory.js";

const clientes = createGrpcClient(
  "./proto/clientes.proto",
  "clientes",
  "Clientes",
  "CLIENTES_GRPC_IP_PORT"
);

export default clientes;

