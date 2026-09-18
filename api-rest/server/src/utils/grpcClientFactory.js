import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();

/**
 * Factoría genérica para inicializar un cliente gRPC.
 * @param {string} protoPath - Ruta al archivo .proto.
 * @param {string} packageName - Nombre del paquete gRPC definido en el .proto.
 * @param {string} serviceName - Nombre del servicio gRPC.
 * @param {string} envVarName - Nombre de la variable de entorno con la dirección 'host:port'.
 * @returns {Object} Cliente gRPC instanciado.
 */
export function createGrpcClient(protoPath, packageName, serviceName, envVarName) {
  const address = process.env[envVarName];
  if (!address) {
    console.error(
      `Error: La variable de entorno ${envVarName} no está definida.`
    );
    process.exit(1);
  }

  const packageDefinition = protoLoader.loadSync(protoPath);
  const proto = grpc.loadPackageDefinition(packageDefinition)[packageName];

  return new proto[serviceName](
    address,
    grpc.credentials.createInsecure()
  );
}
