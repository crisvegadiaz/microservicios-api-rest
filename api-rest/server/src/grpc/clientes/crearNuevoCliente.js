import Joi from "joi";
import response from "../../utils/response.js";
import clientes from "../../utils/grpcConfigClientes.js";
import {
  usernameSchema,
  emailSchema,
  phoneSchema,
} from "../../utils/validarClientes.js";

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
