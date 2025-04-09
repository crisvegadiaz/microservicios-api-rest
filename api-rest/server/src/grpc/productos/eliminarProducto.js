import Joi from "joi";
import response from "../../utils/response.js";
import productos from "../../utils/grpcConfigProductos.js";
import { uuidSchema } from "../../utils/validarProductos.js";

// Validar el formato UUID
const schema = Joi.object({
  id: uuidSchema,
});

// Función para eliminar producto
function eliminarProducto(req, res) {
  const id = req.params;
  const { error } = schema.validate(id);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  productos.EliminarProducto(id, (error, data) => {
    if (error) {
      console.error("Error eliminarProducto: ", error);
      return res
        .status(500)
        .json(response(`Error al eliminar el producto api-rest`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default eliminarProducto;
