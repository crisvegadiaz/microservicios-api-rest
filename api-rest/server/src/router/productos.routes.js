import { Router } from "express";
import listProductos from "../gRPC/productos/listProductos.js";
import productoPorId from "../gRPC/productos/ProductoPorId.js";
import crearNuevoProducto from "../gRPC/productos/crearNuevoProducto.js";
import actualizarDatosProducto from "../gRPC/productos/actualizarDatosProducto.js";
import eliminarProducto from "../gRPC/productos/eliminarProducto.js";

const productosRouter = Router();

productosRouter.get("/productos", listProductos);
productosRouter.get("/producto/:id", productoPorId);
productosRouter.post("/productos", crearNuevoProducto);
productosRouter.put("/producto/:id", actualizarDatosProducto);
productosRouter.delete("/producto/:id", eliminarProducto);

export default productosRouter;
