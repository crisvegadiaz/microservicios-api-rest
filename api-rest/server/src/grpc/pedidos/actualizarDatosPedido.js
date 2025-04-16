import Joi from "joi";
import response from "../../utils/response.js";
import pedidos from "../../utils/grpcConfigPedidos.js";
import { uuidPedidoSchema, estadoSchema } from "../../utils/validarPedidos.js";

// Validar el pedidoId y el estado
const schema = Joi.object({
  pedidoId: uuidPedidoSchema,
  estado: estadoSchema,
});

// Función para actualizar los datos de un pedido
function actualizarDatosPedido(req, res) {
  const pedidoId = req.params.pedidoId;
  const estado = req.body.estado;

  // Validar el pedidoId y el estado
  const { error } = schema.validate({ pedidoId, estado });
  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  // Llamar al servicio gRPC para actualizar el pedido
  pedidos.ActualizarDatosPedido({ pedidoId, estado }, (error, data) => {
    if (error) {
      console.error("Error al llamar a ActualizarDatosPedido gRPC: ", error);
      return res
        .status(500)
        .json(response(`Error al actualizar el pedido via gRPC`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default actualizarDatosPedido;
