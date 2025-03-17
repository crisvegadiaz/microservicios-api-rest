import Joi from "joi";

export const uuidSchema = Joi.string().uuid().required();

export const usernameSchema = Joi.string()
  .alphanum() // Solo letras y números
  .min(3) // Mínimo 3 caracteres
  .max(30) // Máximo 30 caracteres

export const emailSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "org", "edu"] },
  }) // TLDs permitidos

export const phoneSchema = Joi.string()
  .pattern(/^\+?[1-9]\d{6,14}$/)
