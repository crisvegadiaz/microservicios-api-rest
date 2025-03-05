import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import Modelo from "./model.js";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

async function getListClientes(_, callback) {
  try {
    const res = await Modelo.obtenerTodosLosClientes();
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function getClientePorId(call, callback) {
  try {
    const res = await Modelo.obtenerClientePorId(call.request.id);
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

async function postCrearNuevoCliente(call, callback) {
  try {
    const res = await Modelo.crearNuevoCliente(
      call.request.nombre,
      call.request.email,
      call.request.telefonos
    );
    callback(null, res);
  } catch (error) {
    callback(null, error);
  }
}

// Crear el servidor y registrar ambos métodos en el servicio "Clientes"
const server = new grpc.Server();
server.addService(proto.Clientes.service, {
  GetListClientes: getListClientes,
  GetClientePorId: getClientePorId,
  PostCrearNuevoCliente: postCrearNuevoCliente,
});

server.bindAsync(
  "0.0.0.0:50050",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server-A corriendo en el puerto 50050");
  }
);
