import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();

// Validacion de las variables de entorno.
if (!process.env.CLIENTES_GRPC_IP_PORT) {
  console.error(
    "Error: La variable de entorno CLIENTES_GRPC_IP_PORT no está definida."
  );
  process.exit(1);
}

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

const clientes = new proto.ClientesPedidos(
  process.env.CLIENTES_GRPC_IP_PORT,
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

