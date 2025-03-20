import Joi from "joi";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import response from "../../utils/response.js";
import { uuidSchema } from "../../utils/validarProductos.js";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

// Crear un cliente gRPC para el Servicio C
const productos = new proto.Productos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

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
