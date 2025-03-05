import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Llamar al método GetListClientes
clientes.PostCrearNuevoCliente(
  { nombre: "pepe", email: "pepe@gmail.com", telefonos: "+52 39 2090-3245"},
  (error, response) => {
    if (!error) {
      console.log("Respuesta del servidor:", response);
    } else {
      console.error("Error:", error);
    }
  }
);
