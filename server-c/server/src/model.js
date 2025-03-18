import pg from "pg";
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

// Configuración del pool de conexiones a la base de datos
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  max: 5,
  idleTimeoutMillis: 30000,
});

//
class Modelo {
  /**
   * Obtiene todos los Productos.
   * @returns {Promise<Array>} Lista de Productos.
   */
  static async obtenerTodosLosProductos() {
    try {
      const { rowCount, rows } = await pool.query("SELECT * FROM productos");

      console.log(rowCount);
      return rowCount === 0
        ? successResponse("No hay Productos", 404, false)
        : successResponse("Productos obtenidos", 200, true, rows);
    } catch (error) {
      console.error("Error en obtenerTodosLosProductos:", error);
      throw successResponse("Error al obtener todos los productos server-c");
    }
  }

  /**
   * Obtiene un Producto por su ID.
   * @param {string} id - ID del Producto.
   * @returns {Promise<Object>} Producto encontrado.
   */
  static async obtenerProductoPorId(id) {
    try {
      const { rowCount, rows } = await pool.query(
        `SELECT * FROM productos WHERE id = $1`,
        [id]
      );

      return rowCount === 0
        ? successResponse("El Producto no existe", 404, false, undefined)
        : successResponse("Producto obtenido", 200, true, rows[0]);
    } catch (error) {
      console.error("Error en obtenerProductoPorId:", error);
      throw successResponse("Error al obtener el producto server-c");
    }
  }

  /**
   * Crea un nuevo producto.
   * @param {string} nombre - Nombre del producto.
   * @param {number} precio - Precio del producto.
   * @param {number} cantidad - Cantidad del producto.
   * @returns {Object} Respuesta de éxito.
   */
  static async crearNuevoProducto(nombre, precio, cantidad) {
    try {
      await pool.query(
        `INSERT INTO productos (nombre, precio, cantidad)
        VALUES ($1,$2,$3)`,
        [nombre, precio, cantidad]
      );

      return successResponse("Producto creado", 200, true);
    } catch (error) {
      console.error("Error en crearNuevoProducto:", error);
      throw successResponse("Error al crear el producto server-c");
    }
  }

  /**
   * Actualiza los datos de un producto.
   * @param {string} id - ID del producto.
   * @param {Object} data - Datos a actualizar.
   * @returns {Object} Respuesta de éxito.
   */
  static async actualizarDatosProducto(id, data) {
    const camposActualizacion = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const valores = Object.values(data);

    try {
      const { rowCount } = await pool.query(
        `UPDATE productos SET ${camposActualizacion} WHERE id = $${
          valores.length + 1
        }`,
        [...valores, id]
      );

      console.log(rowCount);
      return rowCount === 0
        ? successResponse("El Producto no existe", 404, false)
        : successResponse("Producto actualizado", 200, true);
    } catch (error) {
      console.error("Error en actualizarDatosProducto:", error);
      throw successResponse("Error al actualizar el producto server-c");
    }
  }

  /**
   * Elimina un Producto.
   * @param {string} id - ID del producto.
   * @returns {Object} Respuesta de éxito.
   */
  static async eliminarProducto(id) {
    try {
      const { rowCount } = await pool.query(
        `DELETE FROM productos WHERE id = $1`,
        [id]
      );

      return rowCount === 0
        ? successResponse("El Producto no existe", 404, false)
        : successResponse("Producto eliminado", 200, true);
    } catch (error) {
      console.error("Error en eliminarProducto:", error);
      throw successResponse("Error al eliminar el producto server-c");
    }
  }
}

export default Modelo;
