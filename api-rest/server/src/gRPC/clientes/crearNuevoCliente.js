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
function validarDatos(nombre, email, telefono) {
  const errores = {
    nombre: "Falta el nombre: {nombre : undefined}",
    email: "Falta el email: {email : undefined}",
    telefono: "Falta el teléfono: {telefono : undefined}",
  };

  if (!nombre) return errores.nombre;
  if (!email) return errores.email;
  if (!telefono) return errores.telefono;

  const nombreRegex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{2,}$/;
  if (typeof nombre !== "string" || !nombreRegex.test(nombre)) {
    return `El nombre ingresado no es válido. Debe ser tipo string y tener al menos dos letras y solo permite letras (incluyendo acentos y ñ) y espacios: {nombre: ${nombre}}`;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return `El correo electrónico debe ser tipo string y seguir el formato usuario@dominio.extensión, sin espacios ni caracteres especiales no permitidos: {email: ${email}}`;
  }

  const telefonoRegex = /^(?:\+34|0034|34)?[679]\d{8}$/;
  if (typeof telefono !== "string" || !telefonoRegex.test(telefono)) {
    return `El número de teléfono ${telefonoInvalido} no es válido. Debe ser tipo string y tener 9 dígitos y comenzar con 6, 7 o 9 (opcionalmente +34, 0034 o 34 al inicio).`;
  }

  return false;
}

// Función para crear un nuevo cliente mediante gRPC
function crearNuevoCliente(req, res) {
  const { nombre, email, telefono } = req.body;
  const validacion = validarDatos(nombre, email, telefono);

  if (validacion) {
    return res.status(400).json(successResponse(validacion, 400));
  }

  clientes.PostCrearNuevoCliente({ nombre, email, telefono }, (error, data) => {
    if (error) {
      console.error("Error crearNuevoCliente:", error);
      return res
        .status(500)
        .json(successResponse("Error al crear un cliente api-rest"));
    }

    const status = data?.header?.status || 200;
    return res.status(status).json(data);
  });
}

export default crearNuevoCliente;
