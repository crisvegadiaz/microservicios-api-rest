import grpc from "@grpc/grpc-js";
import successResponse from "../seccess.js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto y extraer el paquete "clientes"
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

// Función para validar los datos de entrada
function validarDatos(id, telefono) {
  if (!id) return "Falta el id: undefined";
  if (!telefono) return "Falta el teléfono: {telefono : undefined}";

  const uuidRegex = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
  if (!uuidRegex.test(id)) {
    return `ID no válido: "${id}". Debe tener el formato UUID (8-4-4-4-12 caracteres hexadecimales con guiones).`;
  }

  const telefonoRegex = /^(?:\+34|0034|34)?[679]\d{8}$/;
  if (typeof telefono !== "string" || !telefonoRegex.test(telefono)) {
    return `El número de teléfono ${telefono} no es válido. Debe ser tipo string y tener 9 dígitos y comenzar con 6, 7 o 9 (opcionalmente +34, 0034 o 34 al inicio).`;
  }

  return false;
}

// Función agrega un numero de telefono a un cliente por su id
function agregarTelefonoCliente(req, res) {
  const { id } = req.params;
  const { telefono } = req.body;

  const validacion = validarDatos(id, telefono);
  if (validacion) {
    return res.status(400).json(successResponse(validacion, 400));
  }

  clientes.PutAgregarTelefonoCliente({ id, telefono }, (error, data) => {
    if (error) {
      console.error("Error agregarTelefonoCliente:", error);
      return res
        .status(500)
        .json(successResponse("Error al actualizar un cliente api-rest"));
    }
    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default agregarTelefonoCliente;
