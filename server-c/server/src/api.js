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
    const res = await Modelo.obtenerProductoPorId(call.request.id);
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
      call.request.id,
      call.request.data
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarProducto(call, callback) {
  try {
    const res = await Modelo.eliminarProducto(call.request.id);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

// Crear el servidor y registrar ambos métodos en el servicio "Productos"
const server = new grpc.Server();
server.addService(proto.Productos.service, {
  ListarProductos: listarProductos,
  ObtenerProductoPorId: obtenerProductoPorId,
  CrearProducto: crearProducto,
  ActualizarProducto: actualizarProducto,
  EliminarProducto: eliminarProducto
});

server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server-C corriendo en el puerto 50052");
  }
);
