import Joi from "joi";

export const uuidClienteIdSchema = Joi.string().uuid().required().messages({
  "string.guid": "El ClienteId no es UUID válido",
  "any.required": "El ClienteId es requerido",
});

export const usernameSchema = Joi.string().alphanum().min(3).max(30).messages({
  "string.min": "El nombre de usuario debe tener al menos 3 caracteres",
  "string.max": "El nombre de usuario no puede tener más de 30 caracteres",
  "string.alphanum":
    "El nombre de usuario solo puede contener letras y números",
  "string.base": "El nombre de usuario debe ser texto",
  "string.empty": "El nombre de usuario no puede estar vacío",
  "any.required": "El nombre de usuario es requerido",
});

export const emailSchema = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "org", "edu"] },
  })
  .messages({
    "string.email": "El correo electrónico no es válido (ej: user@example.com)",
    "any.required": "El correo electrónico es requerido",
    "string.base": "El correo electrónico debe ser texto",
    "string.empty": "El correo electrónico no puede estar vacío",
  });

export const phoneSchema = Joi.string()
  .pattern(/^\+?[1-9]\d{6,14}$/)
  .messages({
    "string.pattern.base":
      "El número de teléfono debe contener entre 7 y 15 dígitos y puede comenzar con un '+'",
    "any.required": "El número de teléfono es requerido",
    "string.empty": "El número de teléfono no puede estar vacío",
    "string.base": "El número de teléfono debe ser texto",
  });
