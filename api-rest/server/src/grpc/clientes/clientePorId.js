import Joi from "joi";
import response from "../../utils/response.js";
import clientes from "../../utils/grpcConfigClientes.js";
import { uuidClienteIdSchema } from "../../utils/validarClientes.js";

// Validar el formato UUID
const schema = Joi.object({
  clienteId: uuidClienteIdSchema,
});

// Función para obtener un cliente por su id
function clientePorId(req, res) {
  const clienteId = req.params;
  const { error } = schema.validate(clienteId);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  clientes.ObtenerClientePorId(clienteId, (error, data) => {
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
