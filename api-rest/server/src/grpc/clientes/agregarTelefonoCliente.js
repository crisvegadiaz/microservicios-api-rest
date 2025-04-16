import Joi from "joi";
import response from "../../utils/response.js";
import clientes from "../../utils/grpcConfigClientes.js";
import {
  uuidClienteIdSchema,
  phoneSchema,
} from "../../utils/validarClientes.js";

//schema  para validar los datos de entrada
const schema = Joi.object({
  clienteId: uuidClienteIdSchema,
  telefono: phoneSchema.required(),
});

// Función agrega un numero de telefono a un cliente por su id
function agregarTelefonoCliente(req, res) {
  const { clienteId } = req.params;
  const { telefono } = req.body;

  const { error } = schema.validate({ clienteId, telefono });

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.AgregarTelefonoCliente({ clienteId, telefono }, (error, data) => {
    if (error) {
      console.error("Error agregarTelefonoCliente:", error);
      return res
        .status(500)
        .json(response("Error al actualizar un cliente api-rest"));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default agregarTelefonoCliente;
