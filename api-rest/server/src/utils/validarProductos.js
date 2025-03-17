import Joi from "joi";

export const uuidSchema = Joi.string().uuid().required();

export const producTnameSchema = Joi.string()
  .alphanum() // Solo letras y números
  .min(3) // Mínimo 3 caracteres
  .max(60) // Máximo 30 caracteres
  .trim()

export const priceSchema = Joi.number()
  .min(0) // Permite precios desde cero
  .precision(2) // Asegura que haya como máximo 2 decimales

export const amountSchema = Joi.number()
  .min(0) // Permite cantidades desde cero
  .integer() // Asegura que sea un número entero (si aplica)