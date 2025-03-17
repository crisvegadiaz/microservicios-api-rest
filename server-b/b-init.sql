CREATE TABLE pedidos (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    cliente_id CHAR(36) NOT NULL, 
    estado ENUM('pendiente', 'cancelado', 'entregado') NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_cliente_id (cliente_id)
) ENGINE=InnoDB;

CREATE TABLE pedido_productos (
    pedido_id CHAR(36) NOT NULL,
    producto_id CHAR(36) NOT NULL DEFAULT (UUID()), 
    cantidad INT NOT NULL DEFAULT 1,
    PRIMARY KEY (pedido_id, producto_id),
    INDEX idx_pedido_id (pedido_id),  
    INDEX idx_producto_id (producto_id)
) ENGINE=InnoDB;


/* Datos de prueba */
INSERT INTO pedidos (cliente_id, estado) VALUES
('1a546ef7-f445-11ef-94f8-b64139c65e8a', 'pendiente'), -- Juan Pérez
('1a547509-f445-11ef-94f8-b64139c65e8a', 'entregado'), -- María López
('1a54769d-f445-11ef-94f8-b64139c65e8a', 'cancelado'), -- Carlos Gómez
('1a54775f-f445-11ef-94f8-b64139c65e8a', 'pendiente'), -- Laura Fernández
('1a5477fd-f445-11ef-94f8-b64139c65e8a', 'entregado'); -- Martín Rodríguez


INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES
-- Pedido 1 (Juan Pérez - pendiente)
("4d7a2d51-f44a-11ef-9d64-1e35bfcb41ae", "2a07b442-f446-11ef-bad7-96d16a9d9487", 1), -- Laptop Gamer
("4d7a2d51-f44a-11ef-9d64-1e35bfcb41ae", "2a07b749-f446-11ef-bad7-96d16a9d9487", 2), -- Teclado Mecánico

-- Pedido 2 (María López - entregado)
("4d7a36c8-f44a-11ef-9d64-1e35bfcb41ae", "2a07b6d8-f446-11ef-bad7-96d16a9d9487", 1), -- Mouse Inalámbrico
("4d7a36c8-f44a-11ef-9d64-1e35bfcb41ae", "2a07b76a-f446-11ef-bad7-96d16a9d9487", 1), -- Monitor 27

-- Pedido 3 (Carlos Gómez - cancelado)
("4d7a3ab0-f44a-11ef-9d64-1e35bfcb41ae", "2a07b7b8-f446-11ef-bad7-96d16a9d9487", 1), -- Disco SSD 1TB
("4d7a3ab0-f44a-11ef-9d64-1e35bfcb41ae", "2a07b7cf-f446-11ef-bad7-96d16a9d9487", 1), -- Tarjeta Gráfica RTX 4060

-- Pedido 4 (Laura Fernández - pendiente)
("4d7a3b7b-f44a-11ef-9d64-1e35bfcb41ae", "2a07b805-f446-11ef-bad7-96d16a9d9487", 3), -- Webcam Full HD
("4d7a3b7b-f44a-11ef-9d64-1e35bfcb41ae", "2a07b785-f446-11ef-bad7-96d16a9d9487", 1), -- Auriculares Bluetooth

-- Pedido 5 (Martín Rodríguez - entregado)
("4d7a3c16-f44a-11ef-9d64-1e35bfcb41ae", "2a07b79f-f446-11ef-bad7-96d16a9d9487", 2), -- Silla Ergonómica
("4d7a3c16-f44a-11ef-9d64-1e35bfcb41ae", "2a07b7ee-f446-11ef-bad7-96d16a9d9487", 1); -- Cargador Universal
