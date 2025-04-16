import Joi from "joi";
import response from "../../utils/response.js";
import productos from "../../utils/grpcConfigProductos.js";
import {
  productOnameSchema,
  preciOSchema,
  cantidaDSchema,
} from "../../utils/validarProductos.js";

// Schema para validar los datos de entrada
const schema = Joi.object({
  nombre: productOnameSchema.required(),
  precio: preciOSchema.required(),
  cantidad: cantidaDSchema.required(),
});

// Función crear un producto
function crearNuevoProducto(req, res) {
  const { error } = schema.validate(req.body);

  if (error) {
    const message = response(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  productos.CrearProducto(req.body, (error, data) => {
    if (error) {
      console.error("Error crearNuevoProducto: ", error);
      const messaje = response(`Error al crear un productos api-rest`);
      return res.status(messaje.header.status).json(messaje);
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default crearNuevoProducto;
