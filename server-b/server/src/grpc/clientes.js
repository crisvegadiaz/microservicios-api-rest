import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

const clientes = new proto.ClientesPedidos(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

export function clienteExiste(clienteId) {
  return new Promise((resolve, reject) => {
    clientes.ClienteExiste({ clienteId }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error clienteExiste: ", error);
        reject(error);
      }
    });
  });
}

export function nombreCliente(clienteId) {
  return new Promise((resolve, reject) => {
    clientes.NombreCliente({ clienteId }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error nombreCliente: ", error);
        reject(error);
      }
    });
  });
}


// (async () => {
//   try {
//     const res = await nombreCliente("1a546ef7-f445-11ef-94f8-b64139c65e8a");
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// })();