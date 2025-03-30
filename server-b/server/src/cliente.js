import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

const productos = new proto.ProductosPedidos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);


/* productos.ObtenerProductoPorId({id:"0b6f4e0e-f002-4b0e-afef-2fac54ad63b7"}, (error, response) => {
  if (!error) {
    console.log("Respuesta del servidor:", response);
  } else {
    console.error("Error:", error);
  }
}); */


productos.ProductoExiste({id:"0b6f4e0e-f002-4b0e-afef-2fac54ad62b7"}, (error, response) => {
  if (!error) {
    console.log("Respuesta del servidor:", response);
  } else {
    console.error("Error:", error);
  }
});
