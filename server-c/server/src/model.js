import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Función para generar respuestas estandarizadas de éxito o error
function response(message, status = 503, success = false, data = undefined) {
  return { header: { message, status, success }, data };
}

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
    console.error("Error inesperado en el cliente inactivo: ", err);
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
        ? response("No hay Productos", 404, false)
        : response("Productos obtenidos", 200, true, rows);
    } catch (error) {
      console.error("Error en obtenerTodosLosProductos:", error);
      throw response("Error al obtener todos los productos server-c");
    }
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} id - ID del producto.
   * @returns {Promise<Object>} Respuesta con el producto o mensaje de error.
   */
  static async obtenerProductoPorId(id) {
    try {
      const { rowCount, rows } = await pool.query(
        `SELECT * FROM productos WHERE id = $1`,
        [id]
      );

      return rowCount === 0
        ? response("El Producto no existe", 404, false)
        : response("Producto obtenido", 200, true, rows[0]);
    } catch (error) {
      console.error("Error en obtenerProductoPorId:", error);
      throw response("Error al obtener el producto server-c");
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

      return response("Producto creado", 200, true);
    } catch (error) {
      console.error("Error en crearNuevoProducto:", error);
      throw response("Error al crear el producto server-c");
    }
  }

  /**
   * Actualiza los datos de un producto.
   * @param {string} id - ID del producto.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async actualizarDatosProducto(id, data) {
    // Genera dinámicamente los campos a actualizar
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

      return rowCount === 0
        ? response("El Producto no existe", 404, false)
        : response("Producto actualizado", 200, true);
    } catch (error) {
      console.error("Error en actualizarDatosProducto:", error);
      throw response("Error al actualizar el producto server-c");
    }
  }

  /**
   * Elimina un producto por su ID.
   * @param {string} id - ID del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async eliminarProducto(id) {
    try {
      const { rowCount } = await pool.query(
        `DELETE FROM productos WHERE id = $1`,
        [id]
      );

      return rowCount === 0
        ? response("El Producto no existe", 404, false)
        : response("Producto eliminado", 200, true);
    } catch (error) {
      console.error("Error en eliminarProducto:", error);
      throw response("Error al eliminar el producto server-c");
    }
  }

  /**
   * Verifica si un producto existe.
   * @param {string} id - ID del producto.
   * @returns {Promise<Object>} Respuesta indicando si existe o no.
   */
  static async productoExiste(id) {
    try {
      const { rows } = await pool.query(
        "SELECT COUNT(*) FROM productos WHERE id = $1",
        [id]
      );
      const existe = Number(rows[0].count) > 0;
      return response("Producto existe", 200, true, existe);
    } catch (error) {
      console.error("Error en productoExiste:", error);
      throw response("Error al verificar si el producto existe server-c");
    }
  }

  /**
   * Revisa si hay suficiente cantidad de un producto.
   * @param {string} id - ID del producto.
   * @param {number} cantidad - Cantidad a revisar.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async revisarCantidadProducto(id, cantidad) {
    try {
      const { rows } = await pool.query(
        `SELECT cantidad FROM productos WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return response("Producto no encontrado", 404, false);
      }

      const availableCantidad = rows[0].cantidad;
      const existeCantidad = availableCantidad >= cantidad;
      return response("Cantidad revisada", 200, true, existeCantidad);
    } catch (error) {
      console.error("Error en revisarCantidadProducto:", error);
      throw response("Error al revisar la cantidad del producto server-c");
    }
  }

  /**
   * Resta una cantidad de un producto
   * @param {number} cantidad - Cantidad a restar.
   * @param {string} id - ID del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async restarCantidadProducto(id, cantidad) {
    try {
      await pool.query(
        `UPDATE productos SET cantidad = cantidad - $1 WHERE id = $2`,
        [cantidad, id]
      );
      return response("Cantidad restada", 200, true);
    } catch (error) {
      console.error("Error en restarCantidadproducto:", error);
      throw response("Error al restar la cantidad del producto server-c");
    }
  }

  /**
   * Suma una cantidad a un producto.
   * @param {number} cantidad - Cantidad a sumar.
   * @param {string} id - ID del producto.
   * @returns {Promise<Object>} Respuesta de éxito o error.
   */
  static async sumarCantidadProducto(id, cantidad) {
    try {
      await pool.query(
        `UPDATE productos SET cantidad = cantidad + $1 WHERE id = $2`,
        [cantidad, id]
      );
      return response("Cantidad sumada", 200, true);
    } catch (error) {
      console.error("Error en sumarCantidadproducto:", error);
      throw response("Error al sumar la cantidad del producto server-c");
    }
  }
}

export default Modelo;
