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

// Función para validar los datos de entrada
function validarDatos(id, nombre, email, telefonos) {
  if (!id) return "Falta el id: undefined";

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return `ID no válido: "${id}". Debe tener el formato UUID (8-4-4-4-12 caracteres hexadecimales con guiones).`;
  }

  if (nombre) {
    const nombreRegex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{2,}$/;
    if (typeof nombre !== "string" || !nombreRegex.test(nombre)) {
      return `El nombre ingresado no es válido. Debe ser tipo string y tener al menos dos letras y solo permite letras (incluyendo acentos y ñ) y espacios: {nombre: ${nombre}}`;
    }
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
      return `El correo electrónico debe ser tipo string y seguir el formato usuario@dominio.extensión, sin espacios ni caracteres especiales no permitidos: {email: ${email}}`;
    }
  }

  if (telefonos) {
    if (!Array.isArray(telefonos)) {
      return `El dato de telefonos debe ser de tipo Array`;
    }
    const telefonoRegex = /^(?:\+34|0034|34)?[679]\d{8}$/;
    const telefonoInvalido = telefonos.find(
      (telefono) =>
        !telefonoRegex.test(telefono) || typeof telefono !== "string"
    );

    if (telefonoInvalido) {
      return `El número de teléfono ${telefonoInvalido} no es válido. Debe ser de tipo string y tener 9 dígitos y comenzar con 6, 7 o 9 (opcionalmente +34, 0034 o 34 al inicio).`;
    }
  }

  return false;
}

// Función actualizar datos un cliente por su id
function actualizarDatosCliente(req, res) {
  const { id } = req.params;
  const { nombre, email, telefonos } = req.body;

  const validacion = validarDatos(id, nombre, email, telefonos);
  if (validacion) {
    return res.status(400).json(successResponse(validacion, 400));
  }

  clientes.PutActualizarDatosCliente(
    { id, data: { nombre, email, telefonos } },
    (error, data) => {
      if (error) {
        console.error("Error actualizarDatosCliente:", error);
        return res
          .status(500)
          .json(successResponse("Error al actualizar un cliente api-rest"));
      }
      const status = data?.header?.status || 200;
      return res.status(status).json(data);
    }
  );
}

export default actualizarDatosCliente;
