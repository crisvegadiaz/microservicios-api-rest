import Joi from "joi";

export const uuidProductoSchema = Joi.string()
  .uuid() // Validación de UUID
  .required() // Campo obligatorio
  .messages({
    "string.guid": "El ID del producto no es válido",
    "any.required": "El ID del producto es obligatorio",
  });

export const productOnameSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9 ]+$/) // Permite letras, números y espacios
  .min(3) // Mínimo 3 caracteres
  .max(60) // Máximo 60 caracteres
  .trim() // Elimina espacios en blanco al inicio y al final
  .required() // Added required as names are usually mandatory
  .messages({
    "string.pattern.base":
      "El nombre del producto solo puede contener letras, números y espacios",
    "string.min":
      "El nombre del producto debe tener al menos {#limit} caracteres",
    "string.max":
      "El nombre del producto no puede exceder los {#limit} caracteres",
    "string.empty": "El nombre del producto no puede estar vacío",
    "any.required": "El nombre del producto es obligatorio",
  });

export const preciOSchema = Joi.number()
  .min(0) // Permite precios desde cero
  .precision(2) // Permite hasta 2 decimales
  .required() // Added required as price is usually mandatory
  .messages({
    "number.base": "El precio del producto debe ser un número",
    "number.min": "El precio del producto no puede ser negativo",
    "number.precision":
      "El precio del producto debe tener hasta {#limit} decimales",
    "any.required": "El precio del producto es obligatorio",
  });

export const cantidaDSchema = Joi.number()
  .min(0) // Permite cantidades desde cero
  .integer() // Permite solo números enteros
  .required() // Added required as quantity is usually mandatory
  .messages({
    "number.base": "La cantidad del producto debe ser un número",
    "number.min": "La cantidad del producto no puede ser negativa",
    "number.integer": "La cantidad del producto debe ser un número entero",
    "any.required": "La cantidad del producto es obligatoria",
  });
