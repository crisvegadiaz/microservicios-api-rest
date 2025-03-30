import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

const productos = new proto.ProductosPedidos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

export function productoExiste(id) {
  return new Promise((resolve, reject) => {
    productos.ProductoExiste({ id }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error productoExiste: ", error);
        reject(error);
      }
    });
  });
}

export function obtenerProductoPorId(id) {
  return new Promise((resolve, reject) => {
    productos.ObtenerProductoPorId({ id }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error obtenerProductoPorId: ", error);
        reject(error);
      }
    });
  });
}

export function revisarCantidadProducto(id, cantidad) {
  return new Promise((resolve, reject) => {
    productos.RevisarCantidadProducto({ id, cantidad }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error revisarCantidadProducto: ", error);
        reject(error);
      }
    });
  });
}

export function restarCantidadProducto(id, cantidad) {
  return new Promise((resolve, reject) => {
    productos.RestarCantidadProducto({ id, cantidad }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error restarCantidadProducto: ", error);
        reject(error);
      }
    });
  });
}

export function sumarCantidadProducto(id, cantidad) {
  return new Promise((resolve, reject) => {
    productos.SumarCantidadProducto({ id, cantidad }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error sumarCantidadProducto: ", error);
        reject(error);
      }
    });
  });
}