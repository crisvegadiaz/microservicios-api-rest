import { Router } from "express";
import listProductos from "../grpc/productos/listProductos.js";
import productoPorId from "../grpc/productos/ProductoPorId.js";
import crearNuevoProducto from "../grpc/productos/crearNuevoProducto.js";
import actualizarDatosProducto from "../grpc/productos/actualizarDatosProducto.js";
import eliminarProducto from "../grpc/productos/eliminarProducto.js";

const productosRouter = Router();

productosRouter.get("/productos", listProductos);
productosRouter.get("/producto/:id", productoPorId);
productosRouter.post("/productos", crearNuevoProducto);
productosRouter.put("/producto/:id", actualizarDatosProducto);
productosRouter.delete("/producto/:id", eliminarProducto);

export default productosRouter;
