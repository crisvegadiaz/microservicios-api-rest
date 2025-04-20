import dotenv from "dotenv";
import Modelo from "./model.js";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();

// Validacion de las variables de entorno.
if (!process.env.SERVER_GRPC_PORT) {
  console.error(
    "Error: La variable de entorno SERVER_GRPC_PORT no está definida."
  );
  process.exit(1);
}

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
    const res = await Modelo.obtenerClientePorId(call.request.clienteId);
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
      call.request.clienteId,
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
      call.request.clienteId,
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
      call.request.clienteId,
      call.request.telefono
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function eliminarCliente(call, callback) {
  try {
    const res = await Modelo.eliminarCliente(call.request.clienteId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function clienteExiste(call, callback) {
  try {
    const res = await Modelo.clienteExiste(call.request.clienteId);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function nombreCliente(call, callback) {
  try {
    const res = await Modelo.nombreCliente(call.request.clienteId);
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

server.addService(proto.ClientesPedidos.service, {
  ClienteExiste: clienteExiste,
  NombreCliente: nombreCliente,
});

server.bindAsync(
  "0.0.0.0:" + process.env.SERVER_GRPC_PORT,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(
      "Server-A corriendo en el puerto " + process.env.SERVER_GRPC_PORT
    );
  }
);
