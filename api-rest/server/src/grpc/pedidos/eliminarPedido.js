import Joi from "joi";
import response from "../../utils/response.js";
import pedidos from "../../utils/grpcConfigPedidos.js";
import { uuidPedidoSchema } from "../../utils/validarPedidos.js";

// Validar el formato UUID
const schema = Joi.object({
  pedidoId: uuidPedidoSchema,
});

// Función para obtener pedido por clienteId
function eliminarPedido(req, res) {
  const pedidoId = req.params;
  
  const { error } = schema.validate(pedidoId);
  
  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  pedidos.EliminarPedido(pedidoId, (error, data) => {
    if (error) {
      console.error("Error eliminarPedido: ", error);
      return res
        .status(500)
        .json(response(`Error al eliminar el pedido api-rest`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default eliminarPedido;
