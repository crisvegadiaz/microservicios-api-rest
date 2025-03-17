import { Router } from "express";
import listProductos from "../gRPC/productos/listProductos.js";
import productoPorId from "../gRPC/productos/ProductoPorId.js";

const productosRouter = Router();

productosRouter.get("/productos", listProductos);
productosRouter.get("/producto/:id", productoPorId);

export default productosRouter;
