import Joi from "joi";
import response from "../../utils/response.js";
import pedidos from "../../utils/grpcConfigPedidos.js";
import { uuidClienteSchema } from "../../utils/validarPedidos.js";

// Validar el formato UUID
const schema = Joi.object({
  clienteId: uuidClienteSchema,
});

// Función para eliminar todos los pedidos de un cliente
function eliminarTodosLosPedidos(req, res) {
  const clienteId = req.params;

  const { error } = schema.validate(clienteId);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  // Llamar al servicio gRPC para eliminar todos los pedidos
  pedidos.EliminarTodosLosPedidos(clienteId, (error, data) => {
    if (error) {
      console.error("Error eliminarTodosLosPedidos: ", error);
      return res
        .status(500)
        .json(response(`Error al eliminar todo los pedidos api-rest`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default eliminarTodosLosPedidos;
