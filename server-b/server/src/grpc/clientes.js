import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

const clientes = new proto.ClientesPedidos(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

export function clienteExiste(id) {
  return new Promise((resolve, reject) => {
    clientes.ClienteExiste({ id }, (error, res) => {
      if (!error) {
        console.log("clienteExiste: ", res);
        resolve(res);
      } else {
        console.error("Error clienteExiste: ", error);
        reject(error);
      }
    });
  });
}

export function nombreCliente(id) {
  return new Promise((resolve, reject) => {
    clientes.NombreCliente({ id }, (error, res) => {
      if (!error) {
        resolve(res);
      } else {
        console.error("Error nombreCliente: ", error);
        reject(error);
      }
    });
  });
}