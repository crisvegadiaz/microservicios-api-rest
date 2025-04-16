CREATE TABLE productos (
    "productoId" UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- Con comillas dobles
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0
);

/* Datos de prueba */
INSERT INTO productos ("productoId", nombre, precio, cantidad) VALUES
('33333333-3333-3333-3333-33333333333a','Teclado Mecánico RGB', 49.99, 10),
('33333333-3333-3333-3333-33333333333b','Mouse Inalámbrico', 29.99, 15),
('33333333-3333-3333-3333-33333333333c','Monitor 24" Full HD', 199.99, 5),
('33333333-3333-3333-3333-33333333333d','Auriculares Bluetooth', 59.99, 20),
('33333333-3333-3333-3333-33333333333e','Silla Gamer', 249.99, 3);