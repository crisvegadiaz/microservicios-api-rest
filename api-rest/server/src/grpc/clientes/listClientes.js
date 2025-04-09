import clientes from "../../utils/grpcConfigClientes.js";
import response from "../../utils/response.js";

// Función para obtener clientes
function listClientes(_, res) {
  clientes.ListarClientes({}, (error, data) => {
    if (error) {
      console.error("Error listClientes: ", error);
      return res
        .status(500)
        .json(
          response(`Error al obtener la lista de clientes api-rest`)
        );
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default listClientes;
