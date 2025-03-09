import grpc from "@grpc/grpc-js";
import successResponse from "../seccess.js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto y extraer el paquete "clientes"
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Validar el formato UUID
function validarDatos(id) {
  if (!id) return "Falta el id: undefined";

  const uuidRegex = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
  return uuidRegex.test(id)
    ? false
    : `ID no válido: "${id}". Debe tener el formato UUID (8-4-4-4-12 caracteres hexadecimales con guiones).`;
}

// Función para eliminar un cliente por su id
function eliminarCliente(req, res) {
  const { id } = req.params;
  const validacion = validarDatos(id);

  if (validacion) {
    return res.status(400).json(successResponse(validacion, 400));
  }

  clientes.DeleteEliminarCliente({ id }, (error, data) => {
    if (error) {
      console.error("Error en eliminarCliente:", error);
      return res
        .status(500)
        .json(successResponse("Error al obtener el cliente api-rest"));
    }

    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default eliminarCliente;
