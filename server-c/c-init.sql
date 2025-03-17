CREATE TABLE productos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0
);

/* Datos de prueba */
INSERT INTO productos (nombre, precio, cantidad) VALUES
('Teclado Mecánico RGB', 49.99, 10),
('Mouse Inalámbrico', 29.99, 15),
('Monitor 24" Full HD', 199.99, 5),
('Auriculares Bluetooth', 59.99, 20),
('Silla Gamer', 249.99, 3);

