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
import { watch } from "fs";

dotenv.config();

// Función para generar respuestas estándar.
function response(message, status = 503, success = false, data = undefined) {
  return { header: { message, status, success }, data };
}

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
   * Obtiene todos los Pedidos.
   * @returns {Promise<Object>} Lista de Pedidos.
   */
  static async obtenerTodosLosPedidos() {
    try {
      const [rows] = await pool.query(
        `SELECT
          pc.cliente_id,
          pc.estado,
          pc.created_at,
          pc.updated_at,
          IFNULL(
              JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'producto_id', pp.producto_id,
                      'cantidad', pp.cantidad
                  )
              ),
              JSON_ARRAY()
          ) AS productos
        FROM
          pedidos AS pc
        LEFT JOIN
          pedido_productos AS pp ON pc.id = pp.pedido_id
        GROUP BY
          pc.cliente_id, pc.estado, pc.created_at, pc.updated_at`
      );

      // Caché para evitar múltiples llamadas a servicios externos.
      const clienteCache = new Map();
      const productoCache = new Map();

      // Procesar cada pedido y enriquecerlo con la información del cliente y de los productos.
      const pedidosConDatos = await Promise.all(
        rows.map(async (row) => {
          // Obtener nombre del cliente usando caché.
          if (!clienteCache.has(row.cliente_id)) {
            const resCliente = await nombreCliente(row.cliente_id);
            clienteCache.set(row.cliente_id, resCliente.data);
          }
          row.nombre = clienteCache.get(row.cliente_id);

          // Validar que 'productos' sea un arreglo.
          if (!Array.isArray(row.productos)) {
            row.productos = [];
          }

          // Enriquecer cada producto con nombre y precio usando caché.
          row.productos = await Promise.all(
            row.productos.map(async (producto) => {
              if (!productoCache.has(producto.producto_id)) {
                const resProducto = await obtenerProductoPorId(
                  producto.producto_id
                );
                productoCache.set(producto.producto_id, resProducto.data);
              }
              const productoData = productoCache.get(producto.producto_id);
              producto.nombre = productoData.nombre;
              producto.precioIndividual = productoData.precio;
              return producto;
            })
          );

          return row;
        })
      );

      return response(
        "Pedidos obtenidos correctamente",
        200,
        true,
        pedidosConDatos
      );
    } catch (error) {
      console.error("Error en obtenerTodosLosPedidos:", error);
      throw response("Error al obtener todos los pedidos", 500, false);
    }
  }

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
          pc.created_at,
          pc.updated_at,
          IFNULL(
              JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'producto_id', pp.producto_id,
                      'cantidad', pp.cantidad
                  )
              ),
              JSON_ARRAY()
          ) AS productos
        FROM
          pedidos AS pc
        LEFT JOIN
          pedido_productos AS pp ON pc.id = pp.pedido_id
        WHERE pc.cliente_id = ?
        GROUP BY
          pc.cliente_id, pc.estado, pc.created_at, pc.updated_at`,
        [clienteId]
      );

      // Validar si se encontraron pedidos.
      if (rows.length === 0) {
        return response(
          "No se encontraron pedidos para el cliente especificado",
          404,
          false
        );
      }

      // Obtener el nombre del cliente.
      const resCliente = await nombreCliente(clienteId);

      // Caché para evitar llamadas repetitivas a obtenerProductoPorId.
      const productoCache = new Map();

      // Enriquecer cada pedido con la información de los productos.
      const pedidosConProductos = await Promise.all(
        rows.map(async (row) => {
          if (!Array.isArray(row.productos)) {
            row.productos = [];
          }
          row.productos = await Promise.all(
            row.productos.map(async (producto) => {
              if (!productoCache.has(producto.producto_id)) {
                const resProducto = await obtenerProductoPorId(
                  producto.producto_id
                );
                productoCache.set(producto.producto_id, resProducto.data);
              }
              const productoData = productoCache.get(producto.producto_id);
              producto.nombre = productoData.nombre;
              producto.precioIndividual = productoData.precio;
              return producto;
            })
          );
          return row;
        })
      );

      const resultado = {
        id: clienteId,
        nombre: resCliente.data,
        pedidos: pedidosConProductos,
      };

      return response("Pedidos obtenidos correctamente", 200, true, resultado);
    } catch (error) {
      console.error("Error en obtenerPedidoPorClienteId:", error);
      throw response(
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
    const id = crypto.randomUUID();

    try {
      // Verificar existencia del cliente.
      const clienteResp = await clienteExiste(clienteId);
      if (!clienteResp.data) {
        return response("El cliente no existe", 404, false);
      }

      // Validar existencia de productos y disponibilidad de stock.
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

      if (productosNoExistentes.length > 0) {
        return response(
          `Los siguientes productos no existen: ${productosNoExistentes.join(
            ", "
          )}`,
          404,
          false
        );
      }

      if (productosSinStock.length > 0) {
        return response(
          `Stock insuficiente para los productos: ${productosSinStock.join(
            ", "
          )}`,
          400,
          false
        );
      }

      // Insertar el pedido.
      await pool.query(
        `INSERT INTO pedidos (id, cliente_id, estado) VALUES (?, ?, ?)`,
        [id, clienteId, "pendiente"]
      );

      // Insertar los productos asociados en una sola consulta en lote.
      const values = productos.map(({ productoId, cantidad }) => [
        id,
        productoId,
        cantidad,
      ]);
      await pool.query(
        `INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES ?`,
        [values]
      );

      // Actualizar el stock de cada producto.
      await Promise.all(
        productos.map(async ({ productoId, cantidad }) => {
          await restarCantidadProducto(productoId, cantidad);
        })
      );

      return response("Pedido creado exitosamente", 200, true, { id });
    } catch (error) {
      console.error("Error en crearNuevoPedido:", error);
      throw response("Error al crear un nuevo pedido", 500, false);
    }
  }

  /**
   * Actualiza el estado de un pedido.
   * @param {String} estado - Los estados permitidos: cancelado, entregado.
   * @param {String} id - ID del pedido.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async actualizarDatosPedido(estado, id) {
    // Consultar el estado actual del pedido usando un método privado (#estadoPedido).
    const estadoActual = await this.#estadoPedido(id);

    // Validaciones según el estado actual.
    switch (estadoActual) {
      case "cancelado":
        return response("El pedido ya fue cancelado", 400, false);
      case "entregado":
        return response("El pedido ya fue entregado", 400, false);
      case null:
        return response("No se encontró el pedido para actualizar", 404, false);
    }

    // Formatear la fecha actual para el campo 'updated_at'
    const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
      // Validar que el nuevo estado sea uno de los permitidos.
      if (!["cancelado", "entregado"].includes(estado)) {
        return response(
          "Estado inválido. Los estados permitidos son: [cancelado, entregado]",
          400,
          false
        );
      }

      // Si se solicita cancelar el pedido, se actualiza el stock de cada producto.
      if (estado === "cancelado") {
        const [productos] = await pool.query(
          `SELECT producto_id, cantidad FROM pedido_productos WHERE pedido_id = ?`,
          [id]
        );
        await Promise.all(
          productos.map(({ producto_id, cantidad }) =>
            sumarCantidadProducto(producto_id, cantidad)
          )
        );
      }

      // Actualizar el estado y la fecha de modificación del pedido.
      const [result] = await pool.query(
        `UPDATE pedidos SET estado = ?, updated_at = ? WHERE id = ?`,
        [estado, updatedAt, id]
      );

      if (result.affectedRows === 0) {
        return response("No se encontró el pedido para actualizar", 404, false);
      }

      return response("Pedido actualizado correctamente", 200, true);
    } catch (error) {
      console.error("Error actualizarDatosPedido:", error);
      throw response("Error al actualizar los datos del pedido", 500, false);
    }
  }

  /**
   * Elimina un pedido por su ID.
   * @param {String} id - ID del pedido.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async eliminarPedido(id) {
    try {
      // Eliminar primero los productos asociados.
      await pool.query(`DELETE FROM pedido_productos WHERE pedido_id = ?`, [
        id,
      ]);
      // Eliminar el pedido.
      const [result] = await pool.query(`DELETE FROM pedidos WHERE id = ?`, [
        id,
      ]);

      if (result.affectedRows === 0) {
        return response("No se encontró el pedido para eliminar", 404, false);
      }

      return response("Pedido eliminado correctamente", 200, true);
    } catch (error) {
      console.error("Error eliminarPedido:", error);
      throw response("Error al eliminar el pedido", 500, false);
    }
  }

  /**
   * Elimina todos los pedidos de un cliente.
   * @param {String} clienteId - ID del cliente.
   * @returns {Object} Respuesta de éxito o error.
   */
  static async eliminarTodosLosPedidos(clienteId) {
    try {
      // Eliminar los productos asociados a los pedidos del cliente.
      const [{ affectedRows }] = await pool.query(
        `DELETE FROM pedido_productos WHERE pedido_id IN (SELECT id FROM pedidos WHERE cliente_id = ?)`,
        [clienteId]
      );

      if (affectedRows === 0) {
        return response(
          "No se encontraron pedidos para el cliente especificado.",
          404,
          false
        );
      }

      // Eliminar los pedidos del cliente.
      await pool.query(`DELETE FROM pedidos WHERE cliente_id = ?`, [clienteId]);

      return response(
        "Todos los pedidos del cliente se eliminaron correctamente",
        200,
        true
      );
    } catch (error) {
      console.error("Error eliminarTodosLosPedidos:", error);
      throw response(
        "Error al eliminar todos los pedidos del cliente",
        500,
        false
      );
    }
  }

  static async #estadoPedido(id) {
    try {
      const [rows] = await pool.query(
        `SELECT estado FROM pedidos WHERE id = ?`,
        [id]
      );

      return rows.length === 0 ? null : rows[0].estado;
    } catch (error) {
      console.error("Error en estadoPedido:", error);
      throw response("Error al obtener el estado del pedido", 500, false);
    }
  }
}

export default Modelo;

// Example usage of obtenerPedidoPorId
(async () => {
  try {
    const result = await Modelo.actualizarDatosPedido(
      "cancelado",
      "44444444-4444-4444-4444-444444444444"
    );
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
})();
