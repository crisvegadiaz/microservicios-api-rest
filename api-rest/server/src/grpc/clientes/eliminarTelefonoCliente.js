import Joi from "joi";
import response from "../../utils/response.js";
import clientes from "../../utils/grpcConfigClientes.js";
import { uuidSchema, phoneSchema } from "../../utils/validarClientes.js";

//schema  para validar los datos de entrada
const schema = Joi.object({
  id: uuidSchema,
  telefono: phoneSchema.required(),
});

// Función elimina un numero de telefono un cliente por su id
function eliminarTelefonoCliente(req, res) {
  const { id } = req.params;
  const { telefono } = req.body;

  const { error } = schema.validate({ id, telefono });

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.EliminarTelefonoCliente({ id, telefono }, (error, data) => {
    if (error) {
      console.error("Error eliminarTelefonoCliente:", error);
      return res
        .status(500)
        .json(response("Error al actualizar un cliente api-rest"));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default eliminarTelefonoCliente;
