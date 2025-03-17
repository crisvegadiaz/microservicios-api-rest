import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/productos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).productos;

const productos = new proto.Productos(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

/* productos.GetProductoPorId({id:"f3664b2a-d1bd-45ef-920a-471b397c7cac"}, (error, response) => {
  if (!error) {
    console.log("Respuesta del servidor:", response);
  } else {
    console.error("Error:", error);
  }
}); */

/* productos.PostNuevoProducto({nombre:"pera",precio:150.98,cantidad:100}, (error, response) => {
  if (!error) {
    console.log("Respuesta del servidor:", response);
  } else {
    console.error("Error:", error);
  }
}); */

/* productos.EliminarProducto(
  { id: "ddf85b69-6ac3-4998-8a03-8483629ea894"},
  (error, response) => {
    if (!error) {
      console.log("Respuesta del servidor:", response);
    } else {
      console.error("Error:", error);
    }
  }
); */

productos.ListarProductos({}, (error, response) => {
  if (!error) {
    console.log("Respuesta del servidor:", response);
  } else {
    console.error("Error:", error);
  }
});
