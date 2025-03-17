import Modelo from "./model.js";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

async function listarClientes(_, callback) {
  try {
    const res = await Modelo.obtenerTodosLosClientes();
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function obtenerClientePorId(call, callback) {
  try {
    const res = await Modelo.obtenerClientePorId(call.request.id);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function crearCliente(call, callback) {
  try {
    const res = await Modelo.crearNuevoCliente(
      call.request.nombre,
      call.request.email,
      call.request.telefono
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function actualizarCliente(call, callback) {
  try {
    const res = await Modelo.actualizarDatosCliente(
      call.request.id,
      call.request.data
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function agregarTelefonoCliente(call, callback) {
  try {
    const res = await Modelo.agregarTelefonoCliente(
      call.request.id,
      call.request.telefono
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarTelefonoCliente(call, callback) {
  try {
    const res = await Modelo.eliminarTelefonoCliente(
      call.request.id,
      call.request.telefono
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarCliente(call, callback) {
  try {
    const res = await Modelo.eliminarCliente(call.request.id);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

// Crear el servidor y registrar los métodos en el servicio "Clientes"
const server = new grpc.Server();
server.addService(proto.Clientes.service, {
  ListarClientes: listarClientes,
  ObtenerClientePorId: obtenerClientePorId,
  CrearCliente: crearCliente,
  ActualizarCliente: actualizarCliente,
  AgregarTelefonoCliente: agregarTelefonoCliente,
  EliminarTelefonoCliente: eliminarTelefonoCliente,
  EliminarCliente: eliminarCliente,
});

server.bindAsync(
  "0.0.0.0:50050",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server-A corriendo en el puerto 50050");
  }
);
