import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { promisify } from "util";

dotenv.config();

// Validación de las variables de entorno.
if (!process.env.PRODUCTOS_GRPC_IP_PORT) {
  console.error(
    "Error: La variable de entorno PRODUCTOS_GRPC_IP_PORT no está definida."
  );
  process.exit(1);
}

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

const productos = new proto.ProductosPedidos(
  process.env.PRODUCTOS_GRPC_IP_PORT,
  grpc.credentials.createInsecure()
);

const productoExisteGrpc = promisify(productos.ProductoExiste.bind(productos));
const obtenerProductoPorIdGrpc = promisify(
  productos.ObtenerProductoPorId.bind(productos)
);
const revisarCantidadProductoGrpc = promisify(
  productos.RevisarCantidadProducto.bind(productos)
);
const restarCantidadProductoGrpc = promisify(
  productos.RestarCantidadProducto.bind(productos)
);
const sumarCantidadProductoGrpc = promisify(
  productos.SumarCantidadProducto.bind(productos)
);

export async function productoExiste(productoId) {
  try {
    return await productoExisteGrpc({ productoId });
  } catch (error) {
    console.error("Error productoExiste: ", error);
    throw error;
  }
}

export async function obtenerProductoPorId(productoId) {
  try {
    return await obtenerProductoPorIdGrpc({ productoId });
  } catch (error) {
    console.error("Error obtenerProductoPorId: ", error);
    throw error;
  }
}

export async function revisarCantidadProducto(productoId, cantidad) {
  try {
    return await revisarCantidadProductoGrpc({ productoId, cantidad });
  } catch (error) {
    console.error("Error revisarCantidadProducto: ", error);
    throw error;
  }
}

export async function restarCantidadProducto(productoId, cantidad) {
  try {
    return await restarCantidadProductoGrpc({ productoId, cantidad });
  } catch (error) {
    console.error("Error restarCantidadProducto: ", error);
    throw error;
  }
}

export async function sumarCantidadProducto(productoId, cantidad) {
  try {
    return await sumarCantidadProductoGrpc({ productoId, cantidad });
  } catch (error) {
    console.error("Error sumarCantidadProducto: ", error);
    throw error;
  }
}
