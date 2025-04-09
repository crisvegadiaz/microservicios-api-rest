import Joi from "joi";
import response from "../../utils/response.js";
import clientes from "../../utils/grpcConfigClientes.js";
import {
  uuidSchema,
  usernameSchema,
  emailSchema,
  phoneSchema,
} from "../../utils/validarClientes.js";

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
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.ActualizarCliente(
    { ...req.params, data: { ...req.body } },
    (error, data) => {
      if (error) {
        console.error("Error actualizarDatosCliente:", error);
        return res
          .status(500)
          .json(response("Error al actualizar un cliente api-rest"));
      }
      const status = data?.header?.status || 200;
      return res.status(status).json(data);
    }
  );
}

export default actualizarDatosCliente;
