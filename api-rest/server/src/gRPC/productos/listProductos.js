import grpc from "@grpc/grpc-js";
import successResponse from "../../utils/success.js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

// Crear un cliente gRPC para el Servicio A
const productos  = new proto.Productos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Función para obtener clientes
function listProductos(_, res) {
    productos.ListarProductos({}, (error, data) => {
    if (error) {
      console.error("Error listClientes: ", error);
      return res
        .status(500)
        .json(
          successResponse(`Error al obtener la lista de productos api-rest`)
        );
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default listProductos;
