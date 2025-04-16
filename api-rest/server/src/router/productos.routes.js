import { Router } from "express";
import listProductos from "../grpc/productos/listProductos.js";
import productoPorId from "../grpc/productos/ProductoPorId.js";
import eliminarProducto from "../grpc/productos/eliminarProducto.js";
import crearNuevoProducto from "../grpc/productos/crearNuevoProducto.js";
import actualizarDatosProducto from "../grpc/productos/actualizarDatosProducto.js";

const productosRouter = Router();

productosRouter.get("/productos", listProductos);
productosRouter.post("/productos", crearNuevoProducto);
productosRouter.get("/producto/:productoId", productoPorId);
productosRouter.delete("/producto/:productoId", eliminarProducto);
productosRouter.put("/producto/:productoId", actualizarDatosProducto);

export default productosRouter;
