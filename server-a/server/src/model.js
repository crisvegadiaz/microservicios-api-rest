import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

// Respuestas estándar de éxito y error
function successResponse(
  message,
  status = 503,
  success = false,
  data = undefined
) {
  return { header: { message, status, success }, data };
}

function fecha(cliente) {
  let f = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  cliente.createdAt = cliente.created_at.toLocaleString("es-ES", f);
  cliente.updatedAt = cliente.updated_at.toLocaleString("es-ES", f);
  delete cliente.created_at;
  delete cliente.updated_at;
}

// Configuración del pool de conexiones a la base de datos
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  connectionLimit: 5,
  acquireTimeout: 30000,
});

class Modelo {
  /**
   * Obtiene todos los clientes.
   * @returns {Promise<Array>} Lista de clientes.
   */
  static async obtenerTodosLosClientes() {
    try {
      const res = await pool.query("SELECT * FROM clientes");

      if (res.length === 0) {
        return successResponse("No hay clientes", 404, false);
      }

      res.forEach((cliente) => fecha(cliente));

      return successResponse("Clientes obtenidos", 200, true, res);
    } catch (error) {
      console.error("Error obtenerTodosLosClientes: " + error);
      throw successResponse("Error al obtener todos los clientes server-a");
    }
  }

  /**
   * Obtiene un cliente por su ID.
   * @param {string} id - ID del cliente.
   * @returns {Promise<Object>} Cliente encontrado.
   */
  static async obtenerClientePorId(id) {
    try {
      const [res] = await pool.query("SELECT * FROM clientes WHERE id = ?", [
        id,
      ]);

      if (!res) {
        return successResponse("Cliente no encontrado", 404, false);
      }

      fecha(res);

      return successResponse("Cliente obtenido", 200, true, res);
    } catch (error) {
      console.error("Error obtenerClientePorId: " + error);
      throw successResponse("Error al obtener el cliente server-a");
    }
  }

  /**
   * Crea un nuevo cliente.
   * @param {string} nombre - Nombre del cliente.
   * @param {string} email - Email del cliente.
   * @param {string} telefono - Teléfonos del cliente.
   * @returns {Object} Respuesta de éxito.
   */
  static async crearNuevoCliente(nombre, email, telefono) {
    try {
      await pool.query(
        `INSERT INTO clientes (nombre, email, telefonos) 
         VALUES (?, ?, JSON_ARRAY(?))`,
        [nombre, email, telefono]
      );
      return successResponse("Cliente creado", 200, true);
    } catch (error) {
      console.error("Error crearNuevoCliente: " + error);
      throw successResponse("Error al crear el cliente server-a");
    }
  }

  /**
   * Actualiza los datos de un cliente.
   * @param {string} id - ID del cliente.
   * @param {Object} data - Datos a actualizar.
   * @returns {Object} Respuesta de éxito.
   */
  static async actualizarDatosCliente(id, data) {
    if (data.telefono) {
      data.telefonos = JSON.stringify([data.telefono]);
      delete data.telefono;
    }

    const camposActualizacion = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const valores = Object.values(data);

    try {
      const { affectedRows } = await pool.query(
        `UPDATE clientes SET ${camposActualizacion} WHERE id = ?`,
        [...valores, id]
      );

      return affectedRows === 1
        ? successResponse("Cliente actualizado", 200, true)
        : successResponse("El cliente no existe", 404, false);
    } catch (error) {
      console.error("Error actualizarDatosCliente: " + error);
      throw successResponse(
        "Error al actualizar el cliente en el servidor server-a",
        500,
        false
      );
    }
  }

  /**
   * Agrega un teléfono al cliente.
   * @param {string} id - ID del cliente.
   * @param {string} telefono - Teléfono a agregar.
   * @returns {Object} Respuesta de éxito.
   */
  static async agregarTelefonoCliente(id, telefono) {
    try {
      const { affectedRows } = await pool.query(
        `UPDATE clientes
         SET telefonos = JSON_ARRAY_APPEND(telefonos, '$', ?)
         WHERE id = ?`,
        [telefono, id]
      );

      return affectedRows === 0
        ? successResponse("El clientes no existe", 404, false)
        : successResponse("Teléfono agregado", 200, true);
    } catch (error) {
      console.error("Error agregarTelefonoCliente: " + error);
      throw successResponse("Error al agregar el teléfon server-a");
    }
  }

  /**
   * Elimina un teléfono del cliente.
   * @param {number} id - ID del cliente.
   * @param {string} telefono - Teléfono a eliminar.
   * @returns {Object} Respuesta de éxito.
   */
  static async eliminarTelefonoCliente(id, telefono) {
    try {
      const { affectedRows } = await pool.query(
        `UPDATE clientes
         SET telefonos = JSON_REMOVE(
           telefonos, 
           JSON_UNQUOTE(JSON_SEARCH(telefonos, 'one', ?))
         )
         WHERE id = ?`,
        [telefono, id]
      );
      return affectedRows === 0
        ? successResponse("El clientes no existe", 404, false)
        : successResponse("Teléfono eliminado", 200, true);
    } catch (error) {
      console.error("Error eliminarTelefonoCliente: " + error);
      throw successResponse("Error al eliminar el teléfono server-a");
    }
  }

  /**
   * Elimina un cliente.
   * @param {string} id - ID del cliente.
   * @returns {Object} Respuesta de éxito.
   */
  static async eliminarCliente(id) {
    try {
      const { affectedRows } = await pool.query(
        "DELETE FROM clientes WHERE id = ?",
        [id]
      );
      return affectedRows === 0
        ? successResponse("El clientes no existe", 404, false)
        : successResponse("Cliente eliminado", 200, true);
    } catch (error) {
      console.error("Error eliminarCliente: " + error);
      throw successResponse("Error al eliminar el cliente server-a");
    }
  }
}

export default Modelo;
