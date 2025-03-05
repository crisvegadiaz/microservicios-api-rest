CREATE TABLE clientes (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefonos JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

/* Datos de prueba */
INSERT INTO clientes (nombre, email, telefonos) VALUES
('Juan Pérez', 'juan.perez@example.com', '["+54 11 1234-5678", "+54 9 11 8765-4321"]'),
('María López', 'maria.lopez@example.com', '["+54 341 567-8901"]'),
('Carlos Gómez', 'carlos.gomez@example.com', '["+54 261 345-6789", "+54 381 234-5678"]'),
('Laura Fernández', 'laura.fernandez@example.com', '["+54 221 654-3210"]'),
('Martín Rodríguez', 'martin.rodriguez@example.com', '["+54 11 4321-1234", "+54 299 987-6543"]');
