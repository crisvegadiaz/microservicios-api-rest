import Joi from "joi";
import response from "../../utils/response.js";
import pedidos from "../../utils/grpcConfigPedidos.js";
import { uuidClienteSchema } from "../../utils/validarPedidos.js";

// Validar el formato UUID
const schema = Joi.object({
  clienteId: uuidClienteSchema,
});

// Función para obtener pedido por clienteId
function obtenerPedidoPorClienteId(req, res) {
  const clienteId = req.params;

  const { error } = schema.validate(clienteId);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  pedidos.ObtenerPedidoPorClienteId(clienteId, (error, data) => {
    if (error) {
      console.error("Error obtenerPedidoPorClienteId: ", error);
      return res
        .status(500)
        .json(response(`Error al obtener el pedido api-rest`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default obtenerPedidoPorClienteId;
