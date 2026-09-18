import { createGrpcClient } from "./grpcClientFactory.js";

const pedidos = createGrpcClient(
  "./proto/pedidos.proto",
  "pedidos",
  "Pedidos",
  "PEDIDOS_GRPC_IP_PORT"
);

export default pedidos;

