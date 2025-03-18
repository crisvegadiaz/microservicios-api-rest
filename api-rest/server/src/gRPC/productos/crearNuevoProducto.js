import Joi from "joi";
import grpc from "@grpc/grpc-js";
import successResponse from "../../utils/success.js";
import protoLoader from "@grpc/proto-loader";
import {
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
  nombre: producTnameSchema.required(),
  precio: priceSchema.required(),
  cantidad: amountSchema.required(),
});

// Función crear un producto
function crearNuevoProducto(req, res) {
  const { error } = schema.validate(req.body);

  if (error) {
    const message = successResponse(error.details[0].message, 400);
    return res.status(message.header.status).json(message);
  }

  productos.CrearProducto(req.body, (error, data) => {
    if (error) {
      console.error("Error crearNuevoProducto: ", error);
      const messaje = successResponse(`Error al crear un productos api-rest`);
      return res.status(messaje.header.status).json(messaje);
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default crearNuevoProducto;
