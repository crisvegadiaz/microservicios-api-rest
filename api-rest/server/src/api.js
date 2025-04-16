import express from "express";
import errorRouter from "./router/error.routes.js";
import clientesRouter from "./router/clientes.routes.js";
import productosRouter from "./router/productos.routes.js";
import pedidosRouter from "./router/pedidos.routes.js";

const app = express();
const port = 3000;

app.disable("x-powered-by");
app.use(express.json());

// Routes
app.use(clientesRouter);
app.use(productosRouter);
app.use(pedidosRouter);

// Router Default
app.use(errorRouter);

app.listen(port, (error) => {
  if (error) {
    console.error("Error: ", error);
  } else {
    console.log(`Server running on http://localhost:${port}`);
  }
});
