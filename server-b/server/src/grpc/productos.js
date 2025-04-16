import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

const productos = new proto.ProductosPedidos(
  "localhost:50052",
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
    productos.RevisarCantidadProducto({ productoId, cantidad }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error revisarCantidadProducto: ", error);
        reject(error);
      }
    });
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

// (async () => {
//   try {
//     const res = await obtenerProductoPorId("f3664b2a-d1bd-45ef-920a-471b397c7cac");
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// })();
