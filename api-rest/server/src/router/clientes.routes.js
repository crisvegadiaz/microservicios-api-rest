import { Router } from "express";
import listClientes from "../gRPC/clientes/listClientes.js";
import clientePorId from "../gRPC/clientes/clientePorId.js";
import crearNuevoCliente from "../gRPC/clientes/crearNuevoCliente.js";

const clientesRouter = Router();

clientesRouter.get("/clientes", listClientes);
clientesRouter.get("/cliente/:id", clientePorId);
clientesRouter.post("/clientes", crearNuevoCliente);


export default clientesRouter;
