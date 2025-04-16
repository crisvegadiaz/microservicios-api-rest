import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/pedidos.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).pedidos;

const pedidos = new proto.Pedidos(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

/* pedidos.ObtenerTodosLosPedidos({}, (error, response) => {
  if (!error) {
    console.log("Respuesta del servidor:", JSON.stringify(response));
  } else {
    console.error("Error:", error);
  }
}); */

/* pedidos.ObtenerPedidoPorClienteId(
  { clienteId: "11111111-1111--111-1111-11111111111a" },
  (error, response) => {
    if (!error) {
      console.log("Respuesta del servidor:", JSON.stringify(response));
    } else {
      console.error("Error:", error);
    }
  }
); */

/* pedidos.CrearNuevoPedido(
  {
    clienteId: "11111111-1111--111-1111-11111111111e",
    productos: [
      { productoId: "33333333-3333-3333-3333-33333333333d", cantidad: 1 },
      { productoId: "33333333-3333-3333-3333-33333333333n", cantidad: 1 },
    ],
  },
  (error, response) => {
    if (!error) {
      console.log("Respuesta del servidor:", JSON.stringify(response));
    } else {
      console.error("Error:", error);
    }
  }
); */

/* pedidos.ActualizarDatosPedido(
  {
    pedidoId: "ca339c59-0a64-426e-ba1b-6cc3211ac1da",
    estado: "cancelado",
  },
  (error, response) => {
    if (!error) {
      console.log("Respuesta del servidor:", JSON.stringify(response));
    } else {
      console.error("Error:", error);
    }
  }
); */

/* pedidos.EliminarPedido( */
//   {
//     pedidoId: "22222222-2222-2222-2222-22222222222a",
//   },
//   (error, response) => {
//     if (!error) {
//       console.log("Respuesta del servidor:", JSON.stringify(response));
//     } else {
//       console.error("Error:", error);
//     }
//   }
// );

/* pedidos.EliminarTodosLosPedidos(
  {
    clienteId: "11111111-1111--111-1111-11111111111e",
  },
  (error, response) => {
    if (!error) {
      console.log("Respuesta del servidor:", JSON.stringify(response));
    } else {
      console.error("Error:", error);
    }
  }
); */