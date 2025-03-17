import Joi from "joi";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import successResponse from "../../utils/success.js";
import { uuidSchema, phoneSchema } from "../../utils/validarClientes.js";

// Cargar el archivo proto y extraer el paquete "clientes"
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

//schema  para validar los datos de entrada
const schema = Joi.object({
  id: uuidSchema,
  telefono: phoneSchema.required(),
});

// Función agrega un numero de telefono a un cliente por su id
function agregarTelefonoCliente(req, res) {
  const { id } = req.params;
  const { telefono } = req.body;

  const { error } = schema.validate({ id, telefono });

  if (error) {
    const message = successResponse(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.AgregarTelefonoCliente({ id, telefono }, (error, data) => {
    if (error) {
      console.error("Error agregarTelefonoCliente:", error);
      return res
        .status(500)
        .json(successResponse("Error al actualizar un cliente api-rest"));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default agregarTelefonoCliente;
