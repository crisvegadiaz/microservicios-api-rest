import { Router } from "express";
import listClientes from "../grpc/clientes/listClientes.js";
import clientePorId from "../grpc/clientes/clientePorId.js";
import eliminarCliente from "../grpc/clientes/eliminarCliente.js";
import crearNuevoCliente from "../grpc/clientes/crearNuevoCliente.js";
import actualizarDatosCliente from "../grpc/clientes/actualizarDatosCliente.js";
import agregarTelefonoCliente from "../grpc/clientes/agregarTelefonoCliente.js";
import eliminarTelefonoCliente from "../grpc/clientes/eliminarTelefonoCliente.js";

const clientesRouter = Router();

clientesRouter.get("/clientes", listClientes);
clientesRouter.post("/clientes", crearNuevoCliente);
clientesRouter.get("/cliente/:clienteId", clientePorId);
clientesRouter.delete("/cliente/:clienteId",eliminarCliente)
clientesRouter.put("/cliente/:clienteId", actualizarDatosCliente);
clientesRouter.put("/cliente/telefonos/:clienteId", agregarTelefonoCliente);
clientesRouter.delete("/cliente/telefonos/:clienteId",eliminarTelefonoCliente)

export default clientesRouter;
