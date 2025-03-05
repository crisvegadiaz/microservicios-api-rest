import grpc from "@grpc/grpc-js";
import successResponse from "../seccess.js";
import protoLoader from "@grpc/proto-loader";

// Cargar el archivo proto
const packageDefinition = protoLoader.loadSync("./proto/clientes.proto");
const proto = grpc.loadPackageDefinition(packageDefinition).clientes;

// Crear un cliente gRPC para el Servicio A
const clientes = new proto.Clientes(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

function revisaData(data) {
  if (!data.nombre) {
    return "Falta el nombre: " + JSON.stringify(data);
  }
  if (!data.email) {
    return "Falta el email: " + JSON.stringify(data);
  }
  if (!data.telefonos) {
    return "Falta el telefono: " + JSON.stringify(data);
  }
  if (
    /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/.test(
      data.nombre
    )
  ) {
    return (
      `Formato de nombre no válido\n No se permiten números, caracteres especiales (excepto apóstrofos y guiones), ni espacios en blanco al principio o al final del nombre. Los apóstrofos y guiones deben usarse de manera limitada dentro de cada palabra. Por favor, revise su entrada. ` +
      JSON.stringify(data)
    );
  }
  return false;
}

function crearNuevoCliente(req, res) {
  const n = revisaData(req.body);

  if (n) {
    res.status(400).json(successResponse(n, 400));
    return;
  }
  console.log("crearNuevoCliente");

  try {
    clientes.PostCrearNuevoCliente(req.body, (error, data) => {
      if (!error) {
        let status = data.status || 200;
        res.status(status).json(data);
      } else {
        console.error("Error crearNuevoCliente: ", error);
        res
          .status(500)
          .json(successResponse("Error al crear un cliente api-rest"));
      }
    });
  } catch (error) {
    console.error("Error clientePorId: ", error);
    res.status(500).json(successResponse("Error interno del servidor"));
  }
}

export default crearNuevoCliente;
