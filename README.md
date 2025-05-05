# microservicios-api-rest
---

## Descripción General

Este proyecto implementa una arquitectura basada en microservicios que combina las siguientes tecnologías:

- **API REST**: Un gateway HTTP que expone endpoints para gestionar clientes, pedidos y productos.
- **gRPC**: Servicios backend responsables de la lógica de negocio y la persistencia de datos.
- **Podman Compose**: Herramienta de orquestación para desplegar los servicios y las bases de datos PostgreSQL en contenedores.

El objetivo principal es demostrar cómo una capa REST puede interactuar con múltiples microservicios gRPC, garantizando validación, consistencia de datos y manejo adecuado de errores.

---
## Diagrama de Arquitectura

![Diagrama de Arquitectura](./diagrama.svg)

El diagrama anterior ofrece una visión general de la arquitectura del proyecto, mostrando las conexiones entre los diferentes microservicios.

---
## Bases de Datos de los Microservicios

Cada microservicio utiliza una base de datos independiente para garantizar su autonomía y escalabilidad. A continuación, se describen las bases de datos y sus respectivas tablas.

### Base de Datos de Clientes (MariaDB)
#### Tabla: `clientes`

| Columna     | Tipo            | Restricciones                                                  | Descripción                                 |
|-------------|-----------------|----------------------------------------------------------------|---------------------------------------------|
| clienteId   | CHAR(36)        | NOT NULL, DEFAULT (UUID()), PRIMARY KEY                        | Identificador único del cliente (UUID).     |
| nombre      | VARCHAR(100)    | NOT NULL                                                       | Nombre del cliente.                         |
| email       | VARCHAR(255)    | NOT NULL, UNIQUE                                               | Correo electrónico del cliente.             |
| telefonos   | JSON            | NOT NULL                                                       | Números de teléfono en formato JSON.        |
| createdAt   | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP                                      | Fecha y hora de creación del registro.      |
| updatedAt   | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP          | Fecha y hora de última actualización.       |

---
### Base de Datos de Pedidos (MySQL)

#### Tabla: `pedidos`

| Columna     | Tipo                                      | Restricciones                                        | Descripción                                 |
|-------------|-------------------------------------------|------------------------------------------------------|---------------------------------------------|
| pedidoId    | CHAR(36)                                  | NOT NULL, PRIMARY KEY, DEFAULT (UUID())              | Identificador único del pedido.             |
| clienteId   | CHAR(36)                                  | NOT NULL, INDEX (idx_clienteId)                      | Identificador único del cliente.            |
| estado      | ENUM('pendiente', 'cancelado', 'entregado') | NOT NULL, DEFAULT 'pendiente'                        | Estado del pedido.                          |
| createdAt   | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP                            | Fecha y hora de creación.                   |
| updatedAt   | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Fecha y hora de última actualización.       |

---

#### Tabla: `pedido_productos`

| Columna     | Tipo      | Restricciones                                  | Descripción                                 |
|-------------|-----------|------------------------------------------------|---------------------------------------------|
| pedidoId    | CHAR(36)  | NOT NULL, PRIMARY KEY (compuesto), FOREIGN KEY | Identificador del pedido.                   |
| productoId  | CHAR(36)  | NOT NULL, PRIMARY KEY (compuesto), INDEX       | Identificador del producto.                 |
| cantidad    | INT       | NOT NULL, DEFAULT 1                            | Cantidad de producto en el pedido.          |

---
### Base de Datos de Productos (PostgreSQL)

#### Tabla: `productos`

| Columna      | Tipo            | Restricciones                          | Descripción                        |
|--------------|-----------------|----------------------------------------|------------------------------------|
| productoId   | UUID            | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del producto.  |
| nombre       | VARCHAR(150)    | NOT NULL                               | Nombre del producto.               |
| precio       | DECIMAL(10,2)   | NOT NULL                               | Precio del producto.               |
| cantidad     | INT             | NOT NULL, DEFAULT 0                    | Cantidad disponible en inventario. |

---

## Requisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- [Node.js](https://nodejs.org/es) (v18 o superior).
- [npm](https://www.npmjs.com/).
- [Podman](https://podman.io/).
- [Podman Compose](https://docs.podman.io/en/latest/markdown/podman-compose.1.html).
- [Protoc](https://grpc.io/docs/protoc-installation/).
- [grpcurl](https://github.com/fullstorydev/grpcurl) (opcional).

---
## Configuración y Despliegue

La forma recomendada para desplegar este proyecto es mediante Podman Compose (o alternativamente Docker Compose). Asegúrate de que Podman esté instalado y funcionando en tu sistema.

Sigue estos pasos para configurar y levantar los servicios:

1.  **Imágenes de Contenedor:** Las imágenes necesarias para los microservicios y la API REST están disponibles públicamente en Docker Hub:
    *   API REST: `docker.io/cristiandv/api-rest`
    *   Servicio Clientes (Server A): `docker.io/cristiandv/server-a`
    *   Servicio Pedidos (Server B): `docker.io/cristiandv/server-b`
    *   Servicio Productos (Server C): `docker.io/cristiandv/server-c`

2.  **Estructura de Directorios:** Crea la siguiente estructura de carpetas. Copia los archivos `.sql` de inicialización y los archivos `podman-compose.yaml` desde este repositorio a sus respectivos directorios:

```bash
.
├── api-rest
│   └── podman-compose.yaml
├── server-a
│   ├── a-init.sql
│   └── podman-compose.yaml
├── server-b
│   ├── b-init.sql
│   └── podman-compose.yaml
└── server-c
    ├── c-init.sql
    └── podman-compose.yaml
```

3. **Configuración de Variables de Entorno:** En los archivos `podman-compose.yaml` de cada microservicio, verifica que las variables de entorno para las conexiones a las bases de datos sean correctas. Por ejemplo, en `server-a/podman-compose.yaml`, asegúrate de configurar el nombre de la imagen y la base de datos en la variable `DB_NAME`:

```yaml
node-server-a:
    image: docker.io/cristiandv/server-a
    working_dir: /app
    environment:
      DB_HOST: db-server-a
      DB_PORT: 3306
      DB_USER: user-a
      DB_PASSWORD: 12345
      DB_NAME: db-a
      # Puerto gRPC del servidor (opcional, por defecto es 50050)
      SERVER_GRPC_PORT: 50055
      # Dirección IP y puerto de los servicios gRPC en localhost
      PEDIDOS_GRPC_IP_PORT: localhost:50051
    ports:
      - "50050:50055"
    depends_on:
      - db-server-a
```
4. **Iniciar los Servicios:** Navega a cada directorio de microservicio y ejecuta el siguiente comando para iniciar los contenedores:

```bash
podman-compose up -d
```
Esto levantará los contenedores de las bases de datos y los microservicios. Puedes verificar el estado de los contenedores con:

```bash
podman ps
```
