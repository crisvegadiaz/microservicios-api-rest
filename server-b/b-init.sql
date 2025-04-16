CREATE TABLE pedidos (
    pedidoId CHAR(36) NOT NULL DEFAULT (UUID()),
    clienteId CHAR(36) NOT NULL,
    estado ENUM('pendiente', 'cancelado', 'entregado') NOT NULL DEFAULT 'pendiente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (pedidoId), 
    INDEX idx_clienteId (clienteId)
) ENGINE=InnoDB;

CREATE TABLE pedido_productos (
    pedidoId CHAR(36) NOT NULL,
    productoId CHAR(36) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    PRIMARY KEY (pedidoId, productoId),
    INDEX idx_productoId (productoId),
    CONSTRAINT fk_pedido_productos_pedido
        FOREIGN KEY (pedidoId)
        REFERENCES pedidos(pedidoId)
        ON DELETE CASCADE 
) ENGINE=InnoDB;

-- Datos de prueba
-- Pedido 1 para Juan Cortez (cliente con id: "1a546ef7-f445-11ef-94f8-b64139c65e8a")
INSERT INTO pedidos (pedidoId, clienteId, estado)
VALUES ('22222222-2222-2222-2222-22222222222a', '11111111-1111-1111-1111-11111111111a', 'pendiente');

-- Pedido 2 para Laura Fernández (cliente con id: "1a54775f-f445-11ef-94f8-b64139c65e8a")
INSERT INTO pedidos (pedidoId, clienteId, estado)
VALUES ('22222222-2222-2222-2222-22222222222b', '11111111-1111-1111-1111-11111111111a', 'entregado');


-- Asociamos productos al Pedido 1:
-- Se agrega "Teclado Mecánico RGB" y "Auriculares Bluetooth"
INSERT INTO pedido_productos (pedidoId, productoId, cantidad)
VALUES 
('22222222-2222-2222-2222-22222222222a', '33333333-3333-3333-3333-33333333333d', 1),
('22222222-2222-2222-2222-22222222222a', '33333333-3333-3333-3333-33333333333a', 2);

-- Asociamos productos al Pedido 2:
-- Se agrega "Mouse Inalámbrico" y "Silla Gamer"
INSERT INTO pedido_productos (pedidoId, productoId, cantidad)
VALUES 
('22222222-2222-2222-2222-22222222222b', '33333333-3333-3333-3333-33333333333b', 1),
('22222222-2222-2222-2222-22222222222b', '33333333-3333-3333-3333-33333333333e', 1);