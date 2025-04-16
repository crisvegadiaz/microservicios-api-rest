import Modelo from "./model.js";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

async function listarProductos(_, callback) {
  try {
    const res = await Modelo.obtenerTodosLosProductos();
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function obtenerProductoPorId(call, callback) {
  try {
    const res = await Modelo.obtenerProductoPorId(call.request.productoId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function crearProducto(call, callback) {
  try {
    const res = await Modelo.crearNuevoProducto(
      call.request.nombre,
      call.request.precio,
      call.request.cantidad
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function actualizarProducto(call, callback) {
  try {
    const res = await Modelo.actualizarDatosProducto(
      call.request.productoId,
      call.request.data
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarProducto(call, callback) {
  try {
    const res = await Modelo.eliminarProducto(call.request.productoId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function productoExiste(call, callback) {
  try {
    const res = await Modelo.productoExiste(call.request.productoId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function revisarCantidadProducto(call, callback) {
  try {
    const res = await Modelo.revisarCantidadProducto(
      call.request.productoId,
      call.request.cantidad
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function restarCantidadProducto(call, callback) {
  try {
    const res = await Modelo.restarCantidadProducto(
      call.request.productoId,
      call.request.cantidad
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function sumarCantidadProducto(call, callback) {
  try {
    const res = await Modelo.sumarCantidadProducto(
      call.request.productoId,
      call.request.cantidad
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

// Crear el servidor gRPC
const server = new grpc.Server();
server.addService(proto.Productos.service, {
  ListarProductos: listarProductos,
  ObtenerProductoPorId: obtenerProductoPorId,
  CrearProducto: crearProducto,
  ActualizarProducto: actualizarProducto,
  EliminarProducto: eliminarProducto,
});

server.addService(proto.ProductosPedidos.service, {
  ObtenerProductoPorId: obtenerProductoPorId,
  ProductoExiste: productoExiste,
  RevisarCantidadProducto: revisarCantidadProducto,
  RestarCantidadProducto: restarCantidadProducto,
  SumarCantidadProducto: sumarCantidadProducto,
});

server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server-C corriendo en el puerto 50052");
  }
);
