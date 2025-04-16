import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Validación de las variables de entorno para la base de datos
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
  pool = new pg.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    max: 5,
    idleTimeoutMillis: 30000,
  });

  pool.on("error", (err, _) => {
    console.error("Error inesperado en la conexión de Postgresql: ", err);
  });
}

createPool();

class Modelo {
  /**
   * Obtiene todos los productos.
   * @returns {Promise<Object>} Respuesta con la lista de productos o mensaje de error.
   */
  static async obtenerTodosLosProductos() {
    try {
      const { rowCount, rows } = await pool.query("SELECT * FROM productos");

      return rowCount === 0
        ? this.#response("No hay Productos", 404, false)
        : this.#response("Productos obtenidos", 200, true, rows);
    } catch (error) {
      console.error("Error en obtenerTodosLosProductos:", error);
      throw this.#response("Error al obtener todos los productos server-c");
    }
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} productoId - ID del producto.
   * @returns {Promise<Object>} Respuesta con el producto o mensaje de error.
   */
  static async obtenerProductoPorId(productoId) {
    try {
      const { rowCount, rows } = await pool.query(
        `SELECT * FROM productos WHERE "productoId" = $1`,
        [productoId]
      );

      return rowCount === 0
        ? this.#response("El Producto no existe", 404, false)
        : this.#response("Producto obtenido", 200, true, rows[0]);
    } catch (error) {
      console.error("Error en obtenerProductoPorId:", error);
      throw this.#response("Error al obtener el producto server-c");
    }
  }

  /**
   * Crea un nuevo producto.
   * @param {string} nombre - Nombre del producto.
   * @param {number} precio - Precio del producto.
   * @param {number} cantidad - Cantidad del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async crearNuevoProducto(nombre, precio, cantidad) {
    try {
      await pool.query(
        `INSERT INTO productos (nombre, precio, cantidad)
         VALUES ($1, $2, $3)`,
        [nombre, precio, cantidad]
      );

      return this.#response("Producto creado", 200, true);
    } catch (error) {
      console.error("Error en crearNuevoProducto:", error);
      throw this.#response("Error al crear el producto server-c");
    }
  }

  /**
   * Actualiza los datos de un producto.
   * @param {string} productoId - ID del producto.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async actualizarDatosProducto(productoId, data) {
    // Genera dinámicamente los campos a actualizar
    const camposActualizacion = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const valores = Object.values(data);

    try {
      const { rowCount } = await pool.query(
        `UPDATE productos SET ${camposActualizacion} WHERE "productoId" = $${
          valores.length + 1
        }`,
        [...valores, productoId]
      );

      return rowCount === 0
        ? this.#response("El Producto no existe", 404, false)
        : this.#response("Producto actualizado", 200, true);
    } catch (error) {
      console.error("Error en actualizarDatosProducto:", error);
      throw this.#response("Error al actualizar el producto server-c");
    }
  }

  /**
   * Elimina un producto por su ID.
   * @param {string} productoId - ID del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async eliminarProducto(productoId) {
    try {
      const { rowCount } = await pool.query(
        `DELETE FROM productos WHERE "productoId" = $1`,
        [productoId]
      );

      return rowCount === 0
        ? this.#response("El Producto no existe", 404, false)
        : this.#response("Producto eliminado", 200, true);
    } catch (error) {
      console.error("Error en eliminarProducto:", error);
      throw this.#response("Error al eliminar el producto server-c");
    }
  }

  /**
   * Verifica si un producto existe.
   * @param {string} productoId - ID del producto.
   * @returns {Promise<Object>} Respuesta indicando si existe o no.
   */
  static async productoExiste(productoId) {
    try {
      const { rows } = await pool.query(
        `SELECT COUNT(*) FROM productos WHERE "productoId" = $1`,
        [productoId]
      );
      const existe = Number(rows[0].count) > 0;
      return this.#response("Producto existe", 200, true, existe);
    } catch (error) {
      console.error("Error en productoExiste:", error);
      throw this.#response("Error al verificar si el producto existe server-c");
    }
  }

  /**
   * Revisa si hay suficiente cantidad de un producto.
   * @param {string} productoId - ID del producto.
   * @param {number} cantidad - Cantidad a revisar.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async revisarCantidadProducto(productoId, cantidad) {
    try {
      const { rows } = await pool.query(
        `SELECT cantidad FROM productos WHERE "productoId" = $1`,
        [productoId]
      );

      if (rows.length === 0) {
        return this.#response("Producto no encontrado", 404, false);
      }

      const availableCantidad = rows[0].cantidad;
      const existeCantidad = availableCantidad >= cantidad;
      return this.#response("Cantidad revisada", 200, true, existeCantidad);
    } catch (error) {
      console.error("Error en revisarCantidadProducto:", error);
      throw this.#response(
        "Error al revisar la cantidad del producto server-c"
      );
    }
  }

  /**
   * Resta una cantidad de un producto
   * @param {number} cantidad - Cantidad a restar.
   * @param {string} productoId - ID del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async restarCantidadProducto(productoId, cantidad) {
    try {
      await pool.query(
        `UPDATE productos SET cantidad = cantidad - $1 WHERE "productoId" = $2`,
        [cantidad, productoId]
      );
      return this.#response("Cantidad restada", 200, true);
    } catch (error) {
      console.error("Error en restarCantidadproducto:", error);
      throw this.#response("Error al restar la cantidad del producto server-c");
    }
  }

  /**
   * Suma una cantidad a un producto.
   * @param {number} cantidad - Cantidad a sumar.
   * @param {string} productoId - ID del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async sumarCantidadProducto(productoId, cantidad) {
    try {
      await pool.query(
        `UPDATE productos SET cantidad = cantidad + $1 WHERE "productoId" = $2`,
        [cantidad, productoId]
      );
      return this.#response("Cantidad sumada", 200, true);
    } catch (error) {
      console.error("Error en sumarCantidadproducto:", error);
      throw this.#response("Error al sumar la cantidad del producto server-c");
    }
  }

  /* MÉTODOS PRIVADOS */

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
