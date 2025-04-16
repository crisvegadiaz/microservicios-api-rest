import response from "../../utils/response.js";
import pedidos from "../../utils/grpcConfigPedidos.js";

function obtenerTodosLosPedidos(_, res) {
  pedidos.ObtenerTodosLosPedidos({}, (error, data) => {
    if (error) {
      console.error("Error obtenerTodosLosPedidos: ", error);
      return res
        .status(500)
        .json(response(`Error al obtener la lista de pedidos api-rest`));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default obtenerTodosLosPedidos;
