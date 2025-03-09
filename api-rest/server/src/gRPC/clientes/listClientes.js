import grpc from "@grpc/grpc-js";
import successResponse from "../seccess.js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Función para obtener clientes
function listClientes(_, res) {
  clientes.GetListClientes({}, (error, data) => {
    if (error) {
      console.error("Error listClientes: ", error);
      return res
        .status(500)
        .json(
          successResponse("Error al obtener la lista de clientes api-rest")
        );
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default listClientes;
