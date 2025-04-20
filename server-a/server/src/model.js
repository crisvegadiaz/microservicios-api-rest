import dotenv from "dotenv";
import mariadb from "mariadb";
import {
  clienteTienePedidoPendiente,
  eliminarTodosLosPedidos,
} from "./grpc/pedidos.js";

dotenv.config();

// Validacion de las variables de entorno.
if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PORT ||
  !process.env.DB_NAME ||
  !process.env.DB_PASSWORD
) {
  console.error(
    "Error: Variables de entorno de la base de datos no configuradas."
  );
  process.exit(1);
}

// Configuración del pool de conexiones a la base de datos
let pool;

function createPool() {
  pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
    acquireTimeout: 30000,
  });

  pool.on("error", (err) => {
    console.error("Error inesperado en la conexión de Mariadb:", err);
  });
}

createPool();

class Modelo {
  /**
   * Obtiene todos los clientes.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async obtenerTodosLosClientes() {
    try {
      const res = await pool.query("SELECT * FROM clientes");

      if (res.length === 0) {
        return this.#response("No hay clientes", 404, false);
      }

      res.forEach((cliente) => this.#fecha(cliente));

      return this.#response("Clientes obtenidos", 200, true, res);
    } catch (error) {
      console.error("Error obtenerTodosLosClientes: " + error);
      throw this.#response("Error al obtener todos los clientes server-a");
    }
  }

  /**
   * Obtiene un cliente por su ID.
   * @param {string} clienteId - ID del cliente.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async obtenerClientePorId(clienteId) {
    try {
      const [res] = await pool.query(
        "SELECT * FROM clientes WHERE clienteId = ?",
        [clienteId]
      );

      if (!res) {
        return this.#response("Cliente no encontrado", 404, false);
      }

      this.#fecha(res);

      return this.#response("Cliente obtenido", 200, true, res);
    } catch (error) {
      console.error("Error obtenerClientePorId: " + error);
      throw this.#response("Error al obtener el cliente server-a");
    }
  }

  /**
   * Crea un nuevo cliente.
   * @param {string} nombre - Nombre del cliente.
   * @param {string} email - Email del cliente.
   * @param {string} telefono - Teléfonos del cliente.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async crearNuevoCliente(nombre, email, telefono) {
    try {
      if (await this.#revisarEmail(email)) {
        return this.#response("El email ya está registrado", 400, false);
      }

      await pool.query(
        `INSERT INTO clientes (nombre, email, telefonos) 
         VALUES (?, ?, JSON_ARRAY(?))`,
        [nombre, email, telefono]
      );
      return this.#response("Cliente creado", 200, true);
    } catch (error) {
      console.error("Error crearNuevoCliente: " + error);
      throw this.#response("Error al crear el cliente server-a");
    }
  }

  /**
   * Actualiza los datos de un cliente.
   * @param {string} clienteId - ID del cliente.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async actualizarDatosCliente(clienteId, data) {
    if (data.telefono) {
      data.telefonos = JSON.stringify([data.telefono]);
      delete data.telefono;
    }

    const camposActualizacion = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const valores = Object.values(data);
    const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
      if (await this.#revisarEmail(data.email)) {
        return this.#response("El email ya está registrado", 400, false);
      }

      const { affectedRows } = await pool.query(
        `UPDATE clientes SET ${camposActualizacion}, updatedAt = ? WHERE clienteId = ?`,
        [...valores, updatedAt, clienteId]
      );

      return affectedRows === 1
        ? this.#response("Cliente actualizado", 200, true)
        : this.#response("El cliente no existe", 404, false);
    } catch (error) {
      console.error("Error actualizarDatosCliente: " + error);
      throw this.#response(
        "Error al actualizar el cliente en el servidor server-a",
        500,
        false
      );
    }
  }

  /**
   * Agrega un teléfono al cliente.
   * @param {string} clienteId - ID del cliente.
   * @param {string} telefono - Teléfono a agregar.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async agregarTelefonoCliente(clienteId, telefono) {
    try {
      if (await this.#revisarTelefono(clienteId, telefono)) {
        return this.#response("El teléfono ya existe", 400, false);
      }

      const { affectedRows } = await pool.query(
        `UPDATE clientes
         SET telefonos = JSON_ARRAY_APPEND(telefonos, '$', ?)
         WHERE clienteId = ?`,
        [telefono, clienteId]
      );

      return affectedRows === 0
        ? this.#response("El clientes no existe", 404, false)
        : this.#response("Teléfono agregado", 200, true);
    } catch (error) {
      console.error("Error agregarTelefonoCliente: " + error);
      throw this.#response("Error al agregar el teléfon server-a");
    }
  }

  /**
   * Elimina un teléfono del cliente.
   * @param {number} clienteId - ID del cliente.
   * @param {string} telefono - Teléfono a eliminar.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async eliminarTelefonoCliente(clienteId, telefono) {
    try {
      if (!(await this.#revisarTelefono(clienteId, telefono))) {
        return this.#response("El teléfono no existe", 404, false);
      }

      const { affectedRows } = await pool.query(
        `UPDATE clientes
         SET telefonos = JSON_REMOVE(
           telefonos, 
           JSON_UNQUOTE(JSON_SEARCH(telefonos, 'one', ?))
         )
         WHERE clienteId = ?`,
        [telefono, clienteId]
      );
      return affectedRows === 0
        ? this.#response("El clientes no existe", 404, false)
        : this.#response("Teléfono eliminado", 200, true);
    } catch (error) {
      console.error("Error eliminarTelefonoCliente: " + error);
      throw this.#response("Error al eliminar el teléfono server-a");
    }
  }

  /**
   * Elimina un cliente.
   * @param {string} clienteId - ID del cliente.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async eliminarCliente(clienteId) {
    try {
      // Verifica si el cliente tiene pedidos pendientes
      const { data } = await clienteTienePedidoPendiente(clienteId);
      if (data) {
        return this.#response(
          "El cliente tiene pedidos pendientes no se puede eliminar",
          400,
          false
        );
      }

      // Elimina todos los pedidos del cliente
      const grpcResponse = await eliminarTodosLosPedidos(clienteId);
      if (
        !grpcResponse ||
        !grpcResponse.header ||
        !grpcResponse.header.success
      ) {
        console.error(
          `Error en gRPC eliminarTodosLosPedidos para clienteId ${clienteId}:`,
          grpcResponse?.header?.message || "Error desconocido en gRPC"
        );
        return this.#response(
          "Error al eliminar los pedidos del cliente",
          503,
          false
        );
      }

      // Elimina el cliente
      const { affectedRows } = await pool.query(
        "DELETE FROM clientes WHERE clienteId = ?",
        [clienteId]
      );
      return affectedRows === 0
        ? this.#response("El clientes no existe", 404, false)
        : this.#response("Cliente eliminado", 200, true);
    } catch (error) {
      console.error("Error eliminarCliente: " + error);
      throw this.#response("Error al eliminar el cliente server-a");
    }
  }

  /**
   * Verifica si un cliente existe.
   * @param {string} id - ID del cliente.
   * @returns {object} Respuesta de éxito.
   */
  static async clienteExiste(clienteId) {
    try {
      const [{ existe }] = await pool.query(
        "SELECT EXISTS(SELECT 1 FROM clientes WHERE clienteId = ?) AS existe",
        [clienteId]
      );
      return this.#response("Cliente verificado", 200, true, existe === 1);
    } catch (error) {
      console.error("Error clienteExiste: " + error);
      throw this.#response("Error al verificar si el cliente existe server-a");
    }
  }

  /**
   * Obtiene el nombre de un cliente.
   * @param {string} id - ID del cliente.
   * @returns {Promise<Object>} Respuesta de éxito
   */
  static async nombreCliente(clienteId) {
    try {
      const [{ nombre }] = await pool.query(
        "SELECT nombre FROM clientes WHERE clienteId = ?",
        [clienteId]
      );

      return !nombre
        ? this.#response("Cliente no encontrado", 404, false)
        : this.#response("Cliente obtenido", 200, true, nombre);
    } catch (error) {
      console.error("Error obtenerClientePorId: " + error);
      throw this.#response("Error al obtener el cliente server-a");
    }
  }

  /* MÉTODOS PRIVADOS */

  /**
   * Revisa si un email ya está registrado en la base de datos.
   * @param {string} email - Email a verificar.
   * @returns {Promise<boolean>} Indica si el email ya existe.
   */
  static async #revisarEmail(email) {
    try {
      const [{ existe }] = await pool.query(
        `SELECT EXISTS (
        SELECT 1
        FROM clientes
        WHERE email = ?) AS existe;`,
        [email]
      );
      return existe === 1;
    } catch (error) {
      console.error("Error revisarEmail: " + error);
      throw this.#response("Error al revisar el email server-a");
    }
  }

  /**
   * Revisa si un teléfono ya está registrado en la base de datos.
   * @param {string} telefono - Teléfono a verificar.
   * @returns {Promise<boolean>} Indica si el teléfono ya existe.
   */
  static async #revisarTelefono(clienteId, telefono) {
    try {
      const [{ existe }] = await pool.query(
        `SELECT EXISTS (
          SELECT 1
          FROM clientes
          WHERE
              clienteId = ?
              AND JSON_CONTAINS(telefonos, '?')
        ) AS telefono;`,
        [clienteId, telefono]
      );
      return existe === 1;
    } catch (error) {
      console.error("Error revisarTelefono: " + error);
      throw this.#response("Error al revisar el telefono server-a");
    }
  }

  /**
   * Convierte las fechas de un cliente a un formato legible.
   * @param {Object} cliente - Objeto cliente.
   */
  static #fecha(cliente) {
    let f = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    cliente.createdAt = cliente.createdAt.toLocaleString("es-ES", f);
    cliente.updatedAt = cliente.updatedAt.toLocaleString("es-ES", f);
  }

  /**
   * Genera una respuesta estándar para las operaciones.
   * @param {String} message - Mensaje de respuesta.
   * @param {Number} status - Código de estado HTTP.
   * @param {Boolean} success - Indica si la operación fue exitosa.
   * @param {Object} data - Datos adicionales de la respuesta.
   * @returns {Object} Objeto de respuesta estándar.
   */
  static #response(message, status = 503, success = false, data = undefined) {
    return { header: { message, status, success }, data };
  }
}

export default Modelo;
