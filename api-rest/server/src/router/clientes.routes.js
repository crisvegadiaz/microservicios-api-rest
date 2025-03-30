import { Router } from "express";
import listClientes from "../grpc/clientes/listClientes.js";
import clientePorId from "../grpc/clientes/clientePorId.js";
import crearNuevoCliente from "../grpc/clientes/crearNuevoCliente.js";
import actualizarDatosCliente from "../grpc/clientes/actualizarDatosCliente.js";
import agregarTelefonoCliente from "../grpc/clientes/agregarTelefonoCliente.js";
import eliminarTelefonoCliente from "../grpc/clientes/eliminarTelefonoCliente.js";
import eliminarCliente from "../grpc/clientes/eliminarCliente.js";

const clientesRouter = Router();

clientesRouter.get("/clientes", listClientes);
clientesRouter.get("/cliente/:id", clientePorId);
clientesRouter.post("/clientes", crearNuevoCliente);
clientesRouter.put("/cliente/:id", actualizarDatosCliente);
clientesRouter.put("/cliente/telefonos/:id", agregarTelefonoCliente);
clientesRouter.delete("/cliente/telefonos/:id",eliminarTelefonoCliente)
clientesRouter.delete("/cliente/:id",eliminarCliente)

export default clientesRouter;
