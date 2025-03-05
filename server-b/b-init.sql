CREATE TABLE productos (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

/* Datos de prueba */
INSERT INTO productos (nombre, precio) VALUES
('Laptop Gamer', 1200.50),
('Mouse Inalámbrico', 25.99),
('Teclado Mecánico', 75.00),
('Monitor 27" 144Hz', 299.99),
('Auriculares Bluetooth', 49.90),
('Silla Ergonómica', 199.00),
('Disco SSD 1TB', 89.99),
('Tarjeta Gráfica RTX 4060', 499.99),
('Cargador Universal', 19.50),
('Webcam Full HD', 39.99);
