CREATE TABLE pedidos (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    cliente_id CHAR(36) NOT NULL,  -- Referencia al cliente que se gestiona vía gRPC (Servidor-A: MariaDB)
    estado ENUM('pendiente', 'cancelado', 'entregado') NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_cliente_id (cliente_id)
) ENGINE=InnoDB;

CREATE TABLE pedido_productos (
    pedido_id CHAR(36) NOT NULL,     -- Referencia al pedido (tabla pedidos)
    producto_id CHAR(36) NOT NULL,   -- Referencia al producto, obtenido vía gRPC desde PostgreSQL
    cantidad INT NOT NULL DEFAULT 1,
    PRIMARY KEY (pedido_id, producto_id),
    INDEX idx_pedido_id (pedido_id),
    INDEX idx_producto_id (producto_id)
) ENGINE=InnoDB;


-- Datos de prueba
-- Pedido 1 para Juan Cortez (cliente con id: "1a546ef7-f445-11ef-94f8-b64139c65e8a")
INSERT INTO pedidos (id, cliente_id, estado)
VALUES ('11111111-1111-1111-1111-111111111111', '1a546ef7-f445-11ef-94f8-b64139c65e8a', 'pendiente');

-- Pedido 2 para Laura Fernández (cliente con id: "1a54775f-f445-11ef-94f8-b64139c65e8a")
INSERT INTO pedidos (id, cliente_id, estado)
VALUES ('22222222-2222-2222-2222-222222222222', '1a54775f-f445-11ef-94f8-b64139c65e8a', 'entregado');


-- Asociamos productos al Pedido 1:
-- Se agrega "Teclado Mecánico RGB" y "Auriculares Bluetooth"
INSERT INTO pedido_productos (pedido_id, producto_id, cantidad)
VALUES 
('11111111-1111-1111-1111-111111111111', '0b6f4e0e-f002-4b0e-afef-2fac54ad63b7', 1),
('11111111-1111-1111-1111-111111111111', 'f33d139d-fafd-4544-b08c-c0f5b4c8ccc0', 2);

-- Asociamos productos al Pedido 2:
-- Se agrega "Mouse Inalámbrico" y "Silla Gamer"
INSERT INTO pedido_productos (pedido_id, producto_id, cantidad)
VALUES 
('22222222-2222-2222-2222-222222222222', 'f3664b2a-d1bd-45ef-920a-471b397c7cac', 1),
('22222222-2222-2222-2222-222222222222', 'b9853cc2-e559-403f-9962-fbcf2fbda53e', 1);