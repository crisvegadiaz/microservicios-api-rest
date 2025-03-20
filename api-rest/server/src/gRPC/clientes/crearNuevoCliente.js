import Joi from "joi";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import response from "../../utils/response.js";
import {
  usernameSchema,
  emailSchema,
  phoneSchema,
} from "../../utils/validarClientes.js";

// Cargar el archivo proto y extraer el paquete "clientes"
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Schema para validar los datos de entrada
const schema = Joi.object({
  nombre: usernameSchema.required(),
  email: emailSchema.required(),
  telefono: phoneSchema.required(),
});

// Función para crear un nuevo cliente mediante gRPC
function crearNuevoCliente(req, res) {
  const { error } = schema.validate(req.body);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.CrearCliente(req.body, (error, data) => {
    if (error) {
      console.error("Error crearNuevoCliente:", error);
      return res
        .status(500)
        .json(response("Error al crear un cliente api-rest"));
    }

    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default crearNuevoCliente;
