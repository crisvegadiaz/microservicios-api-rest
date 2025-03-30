import Joi from "joi";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import response from "../../utils/response.js";
import { uuidSchema } from "../../utils/validarClientes.js";

// Cargar el archivo proto y extraer el paquete "clientes"
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Validar el formato UUID
const schema = Joi.object({
  id: uuidSchema,
});

// Función para obtener un cliente por su id
function clientePorId(req, res) {
  const id = req.params;
  const { error } = schema.validate(id);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.ObtenerClientePorId(id, (error, data) => {
    if (error) {
      console.error("Error en clientePorId:", error);
      return res
        .status(500)
        .json(response("Error al obtener el cliente api-rest"));
    }

    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default clientePorId;
