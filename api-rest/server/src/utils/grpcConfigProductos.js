import { createGrpcClient } from "./grpcClientFactory.js";

const productos = createGrpcClient(
  "./proto/productos.proto",
  "productos",
  "Productos",
  "PRODUCTOS_GRPC_IP_PORT"
);

export default productos;