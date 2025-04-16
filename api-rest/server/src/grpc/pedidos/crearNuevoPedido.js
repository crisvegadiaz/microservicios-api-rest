import Joi from "joi";
import response from "../../utils/response.js";
import pedidos from "../../utils/grpcConfigPedidos.js";
import {
  uuidClienteSchema,
  arrayProductosSchema,
} from "../../utils/validarPedidos.js";

// Validar el clienteId y los productos
const schema = Joi.object({
  clienteId: uuidClienteSchema,
  productos: arrayProductosSchema,
});

// Función para crear un nuevo pedido
function crearNuevoPedido(req, res) {
  const clienteId = req.params.clienteId;
  const productos = req.body.productos;

  // Validar el clienteId y los productos
  const { error } = schema.validate({ clienteId, productos });
  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  // Llamar al servicio gRPC para crear un nuevo pedido
  pedidos.CrearNuevoPedido({ clienteId, productos }, (error, data) => {
    if (error) {
      console.error("Error al llamar a CrearNuevoPedido gRPC: ", error);
      return res
        .status(500)
        .json(response(`Error al crear el pedido via gRPC`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default crearNuevoPedido;
