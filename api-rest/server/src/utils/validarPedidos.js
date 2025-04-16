import Joi from "joi";

export const uuidClienteSchema = Joi.string().uuid().required().messages({
  "string.guid": "El clienteId no es un UUID válido",
  "any.required": "El clienteId es requerido",
});

const uuidProductoSchema = Joi.string().uuid().required().messages({
  "string.guid": "El productoId no es un UUID válido",
  "any.required": "El productoId es requerido",
});

export const uuidPedidoSchema = Joi.string().uuid().required().messages({
  "string.guid": "El pedidoId no es un UUID válido",
  "any.required": "El pedidoId es requerido",
});

const cantidadSchema = Joi.number()
  .integer()
  .min(1)
  .max(100)
  .required()
  .messages({
    "number.base": "La cantidad debe ser un número",
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad mínima es {#limit}",
    "number.max": "La cantidad máxima es {#limit}",
    "any.required": "La cantidad es requerida",
  });

// el array de productos debe contener un objeto con productoId y cantidad no vacio
export const arrayProductosSchema = Joi.array()
  .items(
    Joi.object({
      productoId: uuidProductoSchema,
      cantidad: cantidadSchema,
    })
  )
  .min(1)
  .required()
  .messages({
    "array.base": "El cuerpo de la solicitud debe contener un array de 'productos'",
    "array.min": "El array de productos no puede estar vacío",
    "any.required": "El array de productos es requerido",
  });

export const estadoSchema = Joi.string()
  .valid("cancelado", "entregado")
  .required()
  .messages({
    "any.only": "El estado debe ser uno de los siguientes: cancelado, entregado",
    "any.required": "El estado es requerido",
  });
