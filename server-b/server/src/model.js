import crypto from "crypto";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { nombreCliente, clienteExiste } from "./grpc/clientes.js";
import {
  productoExiste,
  obtenerProductoPorId,
  revisarCantidadProducto,
  restarCantidadProducto,
  sumarCantidadProducto,
} from "./grpc/productos.js";

dotenv.config();

// Validación de las variables de entorno.
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

// Configuración del pool de conexiones a la base de datos.
let pool;
function createPool() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });
}
createPool();

class Modelo {
  /**
   * Obtiene los pedidos asociados a un cliente.
   * @param {string} clienteId - ID del Cliente.
   * @returns {Promise<Object>} Pedidos encontrados.
   */
  static async obtenerPedidoPorClienteId(clienteId) {
    try {
      const [rows] = await pool.query(
        `SELECT
          pc.estado,
          pc.pedidoId,
          pc.createdAt,
          pc.updatedAt,
          IFNULL(
              JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'productoId', pp.productoId,
                      'cantidad', pp.cantidad
                  )
              ),
              JSON_ARRAY()
          ) AS productos
        FROM pedidos AS pc
        LEFT JOIN pedido_productos AS pp ON pc.pedidoId = pp.pedidoId
        WHERE pc.clienteId = ?
        GROUP BY pc.pedidoId;`,
        [clienteId]
      );

      if (rows.length === 0) {
        return this.#response(
          "No se encontraron pedidos para el cliente especificado",
          404,
          false
        );
      }

      const clienteRes = await nombreCliente(clienteId);
      if (!clienteRes.data) {
        return this.#response(
          "El cliente no existe",
          404,
          false
        );
      }

      const pedidos = await Promise.all(
        rows.map(async (pedido) => {
          pedido.productos = await this.#procesarProductos(pedido.productos);
          return pedido;
        })
      );

      const resultado = {
        nombre: clienteRes.data,
        clienteId,
        pedidos,
      };

      return this.#response(
        "Pedidos obtenidos correctamente",
        200,
        true,
        resultado
      );
    } catch (error) {
      console.error("Error en obtenerPedidoPorClienteId:", error);
      throw this.#response(
        "Error al obtener el pedido por ID del cliente",
        500,
        false
      );
    }
  }

  /**
   * Crea un nuevo pedido.
   * @param {string} clienteId - ID del cliente.
   * @param {Array} productos - Lista de productos con { productoId, cantidad }.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async crearNuevoPedido(clienteId, productos) {
    const pedidoId = crypto.randomUUID();
    try {
      // Verificar existencia del cliente.
      const clienteResp = await clienteExiste(clienteId);
      if (!clienteResp.data) {
        return this.#response("El cliente no existe", 404, false);
      }

      // Validar existencia de productos y disponibilidad de stock.
      const { productosNoExistentes, productosSinStock } =
        await this.#validarProductos(productos);

      if (productosNoExistentes.length > 0) {
        return this.#response(
          `Los siguientes productos no existen: ${productosNoExistentes.join(
            ", "
          )}`,
          404,
          false
        );
      }

      if (productosSinStock.length > 0) {
        return this.#response(
          `Stock insuficiente para los productos: ${productosSinStock.join(
            ", "
          )}`,
          400,
          false
        );
      }

      // Insertar el pedido.
      await pool.query(
        `INSERT INTO pedidos (pedidoId, clienteId, estado) VALUES (?, ?, ?)`,
        [pedidoId, clienteId, "pendiente"]
      );

      // Insertar los productos asociados en una sola consulta en lote.
      const values = productos.map(({ productoId, cantidad }) => [
        pedidoId,
        productoId,
        cantidad,
      ]);
      await pool.query(
        `INSERT INTO pedido_productos (pedidoId, productoId, cantidad) VALUES ?`,
        [values]
      );

      // Actualizar el stock de cada producto restando la cantidad solicitada.
      await Promise.all(
        productos.map(async ({ productoId, cantidad }) => {
          await restarCantidadProducto(productoId, cantidad);
        })
      );

      return this.#response("Pedido creado exitosamente", 200, true, {
        pedidoId,
      });
    } catch (error) {
      console.error("Error en crearNuevoPedido:", error);
      throw this.#response("Error al crear un nuevo pedido", 500, false);
    }
  }

  /**
   * Actualiza el estado de un pedido.
   * @param {String} estado - Los estados permitidos: cancelado, entregado.
   * @param {String} pedidoId - ID del pedido.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async actualizarDatosPedido(estado, pedidoId) {
    // Validar que el nuevo estado sea uno de los permitidos.
    if (!["cancelado", "entregado"].includes(estado)) {
      return this.#response(
        "Estado inválido. Los estados permitidos son: [cancelado, entregado]",
        400,
        false
      );
    }

    // Consultar el estado actual del pedido.
    const estadoActual = await this.#estadoPedido(pedidoId);
    switch (estadoActual) {
      case "cancelado":
        return this.#response("El pedido ya fue cancelado", 400, false);
      case "entregado":
        return this.#response("El pedido ya fue entregado", 400, false);
      case null:
        return this.#response(
          "No se encontró el pedido para actualizar",
          404,
          false
        );
    }

    const updatedAt = this.#formatCurrentDate();

    try {
      // Si se solicita cancelar el pedido, actualizar el stock de cada producto.
      if (estado === "cancelado") {
        await this.#actualizarStockAlCancelar(pedidoId);
      }

      // Actualizar el estado y la fecha de modificación del pedido.
      const [result] = await pool.query(
        `UPDATE pedidos SET estado = ?, updatedAt = ? WHERE pedidoId = ?`,
        [estado, updatedAt, pedidoId]
      );

      if (result.affectedRows === 0) {
        return this.#response(
          "No se encontró el pedido para actualizar",
          404,
          false
        );
      }

      return this.#response("Pedido actualizado correctamente", 200, true);
    } catch (error) {
      console.error("Error actualizarDatosPedido:", error);
      throw this.#response(
        "Error al actualizar los datos del pedido",
        500,
        false
      );
    }
  }

  /**
   * Elimina un pedido por su ID.
   * @param {String} pedidoId - ID del pedido.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async eliminarPedido(pedidoId) {
    try {
      const estadoActual = await this.#estadoPedido(pedidoId);
      if (estadoActual === null) {
        return this.#response(
          "No se encontró el pedido para eliminar",
          404,
          false
        );
      }
      if (estadoActual === "pendiente") {
        return this.#response(
          "No se puede eliminar un pedido pendiente",
          400,
          false
        );
      }

      const [{ affectedRows }] = await pool.query(
        `DELETE FROM pedidos WHERE pedidoId = ?`,
        [pedidoId]
      );

      if (affectedRows === 0) {
        return this.#response(
          "No se encontró el pedido para eliminar",
          404,
          false
        );
      }

      return this.#response("Pedido eliminado correctamente", 200, true);
    } catch (error) {
      console.error("Error eliminarPedido:", error);
      throw this.#response("Error al eliminar el pedido", 500, false);
    }
  }

  /**
   * Elimina todos los pedidos de un cliente.
   * @param {String} clienteId - ID del cliente.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async eliminarTodosLosPedidos(clienteId) {
    try {
      // Verificar si el cliente tiene pedidos pendientes.
      const { data } = await this.clienteTienePedidoPendiente(clienteId);
      if (data) {
        return this.#response(
          "No se puede eliminar todos los pedidos si hay uno pendiente",
          400,
          false
        );
      }

      const [{ affectedRows }] = await pool.query(
        `DELETE FROM pedidos WHERE clienteId = ?`,
        [clienteId]
      );

      if (affectedRows === 0) {
        return this.#response(
          "No se encontraron pedidos para eliminar",
          404,
          false
        );
      }

      return this.#response(
        "Todos los pedidos del cliente se eliminaron correctamente",
        200,
        true
      );
    } catch (error) {
      console.error("Error eliminarTodosLosPedidos:", error);
      throw this.#response(
        "Error al eliminar todos los pedidos del cliente",
        500,
        false
      );
    }
  }

  /**
   * Verifica si un cliente tiene un pedido pendiente.
   * @param {String} clienteId - ID del cliente.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async clienteTienePedidoPendiente(clienteId) {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS total FROM pedidos WHERE clienteId = ? AND estado = 'pendiente'`,
        [clienteId]
      );
      return this.#response(
        "Cliente tiene pedido pendiente",
        200,
        true,
        rows[0].total > 0
      );
    } catch (error) {
      console.error("Error clienteTienePedidoPendiente:", error);
      throw this.#response(
        "Error al verificar si el cliente tiene un pedido pendiente",
        500,
        false
      );
    }
  }

  /**
   * Elimina un producto de todos los pedidos.
   * @param {String} productoId - ID del producto.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async eliminarProductoDeTodosLosPedidos(productoId) {
    try {
      const [{ affectedRows }] = await pool.query(
        `DELETE FROM pedido_productos WHERE productoId = ?`,
        [productoId]
      );

      if (affectedRows === 0) {
        return this.#response(
          "No se encontraron productos para eliminar",
          404,
          false
        );
      }

      return this.#response(
        "Producto eliminado de todos los pedidos correctamente",
        200,
        true
      );
    } catch (error) {
      console.error("Error eliminarProductoDeTodosLosPedidos:", error);
      throw this.#response(
        "Error al eliminar el producto de todos los pedidos",
        500,
        false
      );
    }
  }

  /* MÉTODOS PRIVADOS */

  /**
   * Procesa y enriquece la lista de productos usando cache para evitar llamadas repetitivas.
   * @param {Array<Object>} productos - Lista de productos a procesar.
   * @returns {Promise<Array<Object>>} Lista de productos enriquecidos.
   */
  static async #procesarProductos(productos) {
    const productoCache = new Map();
    return Promise.all(
      productos.map(async (producto) => {
        if (!productoCache.has(producto.productoId)) {
          productoCache.set(
            producto.productoId,
            obtenerProductoPorId(producto.productoId)
          );
        }
        const productoRes = await productoCache.get(producto.productoId);
        return {
          ...producto,
          nombre: productoRes.data.nombre,
          precio: productoRes.data.precio,
        };
      })
    );
  }

  /**
   * Valida la existencia y disponibilidad de stock para una lista de productos.
   * @param {Array} productos - Lista de productos con { productoId, cantidad }.
   * @returns {Promise<Object>} Objeto con arrays:
   *   - productosNoExistentes: IDs de productos que no existen.
   *   - productosSinStock: IDs de productos sin stock suficiente.
   */
  static async #validarProductos(productos) {
    const productosNoExistentes = [];
    const productosSinStock = [];

    await Promise.all(
      productos.map(async ({ productoId, cantidad }) => {
        const prodResp = await productoExiste(productoId);
        if (!prodResp.data) {
          productosNoExistentes.push(productoId);
          return;
        }
        const cantidadResp = await revisarCantidadProducto(
          productoId,
          cantidad
        );
        if (!cantidadResp.data) {
          productosSinStock.push(productoId);
        }
      })
    );

    return { productosNoExistentes, productosSinStock };
  }

  /**
   * Actualiza el stock de cada producto asociado a un pedido al cancelarlo.
   * @param {String} pedidoId - ID del pedido.
   * @returns {Promise<void>}
   */
  static async #actualizarStockAlCancelar(pedidoId) {
    const [productos] = await pool.query(
      `SELECT productoId, cantidad FROM pedido_productos WHERE pedidoId = ?`,
      [pedidoId]
    );
    await Promise.all(
      productos.map(({ productoId, cantidad }) =>
        sumarCantidadProducto(productoId, cantidad)
      )
    );
  }

  /**
   * Obtiene el estado actual de un pedido.
   * @param {String} pedidoId - ID del pedido.
   * @returns {Promise<String|null>} Estado actual del pedido o null si no existe.
   */
  static async #estadoPedido(pedidoId) {
    const [rows] = await pool.query(
      "SELECT estado FROM pedidos WHERE pedidoId = ?",
      [pedidoId]
    );
    return rows.length > 0 ? rows[0].estado : null;
  }

  /**
   * Devuelve la fecha y hora actual formateada para la base de datos.
   * @returns {String} Fecha y hora en formato "YYYY-MM-DD HH:MM:SS".
   */
  static #formatCurrentDate() {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
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
