import response from "../../utils/response.js";
import productos from "../../utils/grpcConfigProductos.js";

// Función para obtener clientes
function listProductos(_, res) {
    productos.ListarProductos({}, (error, data) => {
    if (error) {
      console.error("Error listClientes: ", error);
      return res
        .status(500)
        .json(
          response(`Error al obtener la lista de productos api-rest`)
        );
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default listProductos;
