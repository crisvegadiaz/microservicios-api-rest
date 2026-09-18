import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { promisify } from "util";

dotenv.config();

// Validación de las variables de entorno.
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

const clienteExisteGrpc = promisify(clientes.ClienteExiste.bind(clientes));
const nombreClienteGrpc = promisify(clientes.NombreCliente.bind(clientes));

export async function clienteExiste(clienteId) {
  try {
    return await clienteExisteGrpc({ clienteId });
  } catch (error) {
    console.error("Error clienteExiste: ", error);
    throw error;
  }
}

export async function nombreCliente(clienteId) {
  try {
    return await nombreClienteGrpc({ clienteId });
  } catch (error) {
    console.error("Error nombreCliente: ", error);
    throw error;
  }
}
