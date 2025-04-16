CREATE TABLE clientes (
    clienteId CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefonos JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (clienteId)
) ENGINE=InnoDB;

/* Datos de prueba */
INSERT INTO clientes (clienteId ,nombre, email, telefonos) VALUES
( '11111111-1111-1111-1111-11111111111a' ,'Juan Pérez', 'juan.perez@example.com', '["+54 11 1234-5678", "+54 9 11 8765-4321"]'),
( '11111111-1111-1111-1111-11111111111b' ,'María López', 'maria.lopez@example.com', '["+54 341 567-8901"]'),
( '11111111-1111-1111-1111-11111111111c' ,'Carlos Gómez', 'carlos.gomez@example.com', '["+54 261 345-6789", "+54 381 234-5678"]'),
( '11111111-1111-1111-1111-11111111111d' ,'Laura Fernández', 'laura.fernandez@example.com', '["+54 221 654-3210"]'),
( '11111111-1111-1111-1111-11111111111e' ,'Martín Rodríguez', 'martin.rodriguez@example.com', '["+54 11 4321-1234", "+54 299 987-6543"]');