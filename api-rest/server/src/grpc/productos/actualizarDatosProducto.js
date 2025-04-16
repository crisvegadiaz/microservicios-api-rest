import Joi from "joi";
import response from "../../utils/response.js";
import productos from "../../utils/grpcConfigProductos.js";
import {
  uuidProductoSchema,
  productOnameSchema,
  preciOSchema,
  cantidaDSchema,
} from "../../utils/validarProductos.js";

// Schema para validar los datos de entrada
const schema = Joi.object({
  productoId: uuidProductoSchema,
  nombre: productOnameSchema,
  precio: preciOSchema,
  cantidad: cantidaDSchema,
});

// Función actualizar datos de producto por su id
function actualizarDatosProducto(req, res) {
  const { error } = schema.validate({ ...req.params, ...req.body });

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  productos.ActualizarProducto(
    { ...req.params, data: { ...req.body } },
    (error, data) => {
      if (error) {
        console.error("Error actualizarDatosProducto:", error);
        return res
          .status(500)
          .json(response("Error al actualizar un producto api-rest"));
      }
      const status = data?.header?.status || 200;
      return res.status(status).json(data);
    }
  );
}

export default actualizarDatosProducto;
