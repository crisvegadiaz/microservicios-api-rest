import Joi from "joi";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import successResponse from "../../utils/success.js";
import {
  uuidSchema,
  producTnameSchema,
  priceSchema,
  amountSchema,
} from "../../utils/validarProductos.js";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

// Crear un cliente gRPC para el Servicio C
const productos = new proto.Productos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Schema para validar los datos de entrada
const schema = Joi.object({
  id: uuidSchema,
  nombre: producTnameSchema,
  precio: priceSchema,
  cantidad: amountSchema,
});

// Función actualizar datos de producto por su id
function actualizarDatosProducto(req, res) {
  const { error } = schema.validate({ ...req.params, ...req.body });

  if (error) {
    const message = successResponse(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  productos.ActualizarProducto(
    { ...req.params, data: { ...req.body } },
    (error, data) => {
      if (error) {
        console.error("Error actualizarDatosProducto:", error);
        return res
          .status(500)
          .json(successResponse("Error al actualizar un producto api-rest"));
      }
      const status = data?.header?.status || 200;
      return res.status(status).json(data);
    }
  );
}

export default actualizarDatosProducto;
