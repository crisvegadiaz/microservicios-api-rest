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

function clientePorId(req, res) {
  try {
    clientes.GetClientePorId({ id: req.params.id }, (error, data) => {
      if (!error) {
        let status = data.header.status || 200;
        res.status(status).json(data);
      } else {
        console.error("Error clientePorId: ", error);
        res.status(500).json(successResponse("Error al obtener el cliente api-rest"));
      }
    });
  } catch (error) {
    console.error("Error clientePorId: ", error);
    res.status(500).json(successResponse("Error interno del servidor"));
  }
}

export default clientePorId;
