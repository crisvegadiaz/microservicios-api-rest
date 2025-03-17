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

// Crear un cliente gRPC para el Servicio A
const productos = new proto.Productos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

//

const schema = Joi.object({
  nombre: producTnameSchema.required(),
  precio: priceSchema.required(),
  cantidad: amountSchema.required(),
});

// Función para obtener clientes
function crearNuevoProducto(req, res) {
  const { error } = schema.validate();

  if (error) {
    const messaje = successResponse("", 400);
    return res.status(messaje.header.status).json(messaje);
  }

  productos.CrearProducto({}, (error, data) => {
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
