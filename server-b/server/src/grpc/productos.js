import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();

// Validacion de las variables de entorno.
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

export function productoExiste(productoId) {
  return new Promise((resolve, reject) => {
    productos.ProductoExiste({ productoId }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error productoExiste: ", error);
        reject(error);
      }
    });
  });
}

export function obtenerProductoPorId(productoId) {
  return new Promise((resolve, reject) => {
    productos.ObtenerProductoPorId({ productoId }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error obtenerProductoPorId: ", error);
        reject(error);
      }
    });
  });
}

export function revisarCantidadProducto(productoId, cantidad) {
  return new Promise((resolve, reject) => {
    productos.RevisarCantidadProducto(
      { productoId, cantidad },
      (error, res) => {
        if (!error) {
          resolve(res);
        } else {
          console.error("Error revisarCantidadProducto: ", error);
          reject(error);
        }
      }
    );
  });
}

export function restarCantidadProducto(productoId, cantidad) {
  return new Promise((resolve, reject) => {
    productos.RestarCantidadProducto({ productoId, cantidad }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error restarCantidadProducto: ", error);
        reject(error);
      }
    });
  });
}

export function sumarCantidadProducto(productoId, cantidad) {
  return new Promise((resolve, reject) => {
    productos.SumarCantidadProducto({ productoId, cantidad }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error sumarCantidadProducto: ", error);
        reject(error);
      }
    });
  });
}
