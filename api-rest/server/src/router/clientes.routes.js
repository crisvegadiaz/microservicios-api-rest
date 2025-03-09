import { Router } from "express";
import listClientes from "../gRPC/clientes/listClientes.js";
import clientePorId from "../gRPC/clientes/clientePorId.js";
import crearNuevoCliente from "../gRPC/clientes/crearNuevoCliente.js";
import actualizarDatosCliente from "../gRPC/clientes/actualizarDatosCliente.js";
import agregarTelefonoCliente from "../gRPC/clientes/agregarTelefonoCliente.js";
import eliminarTelefonoCliente from "../gRPC/clientes/eliminarTelefonoCliente.js";
import eliminarCliente from "../gRPC/clientes/eliminarCliente.js";

const clientesRouter = Router();

clientesRouter.get("/clientes", listClientes);
clientesRouter.get("/cliente/:id", clientePorId);
clientesRouter.post("/clientes", crearNuevoCliente);
clientesRouter.put("/cliente/:id", actualizarDatosCliente);
clientesRouter.put("/cliente/telefonos/:id", agregarTelefonoCliente);
clientesRouter.delete("/cliente/telefonos/:id",eliminarTelefonoCliente)
clientesRouter.delete("/cliente/:id",eliminarCliente)

export default clientesRouter;
