import Joi from "joi";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import successResponse from "../../utils/success.js";
import {
  uuidSchema,
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
  id: uuidSchema,
  nombre: usernameSchema,
  email: emailSchema,
  telefono: phoneSchema,
});

// Función actualizar datos un cliente por su id
function actualizarDatosCliente(req, res) {
  const { error } = schema.validate({ ...req.params, ...req.body });

  if (error) {
    const message = successResponse(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.ActualizarCliente(
    { ...req.params, data: { ...req.body } },
    (error, data) => {
      if (error) {
        console.error("Error actualizarDatosCliente:", error);
        return res
          .status(500)
          .json(successResponse("Error al actualizar un cliente api-rest"));
      }
      const status = data?.header?.status || 200;
      return res.status(status).json(data);
    }
  );
}

export default actualizarDatosCliente;
