# microservicios-api-rest
---

## Descripción general

Este proyecto provee una arquitectura de microservicios combinando:

- **API REST**: Un gateway HTTP que expone endpoints para operaciones sobre clientes, pedidos y productos.
- **gRPC**: Servicios backend encargados de la lógica de negocio y persistencia.
- **Podman Compose**: Orquestación contenedorizada para levantar los servicios y bases de datos.

El objetivo es ilustrar la comunicación entre una capa REST y múltiples microservicios gRPC, asegurando validación, consistencia de datos y manejo de errores.

---

## Estructura del proyecto

```bash
.
├── api-rest
│   ├── podman-compose.yaml
│   └── server
│       ├── package.json
│       ├── package-lock.json
│       ├── proto
│       │   ├── clientes.proto
│       │   ├── pedidos.proto
│       │   └── productos.proto
│       └── src
│           ├── api.js
│           ├── grpc
│           │   ├── clientes
│           │   │   ├── actualizarDatosCliente.js
│           │   │   ├── agregarTelefonoCliente.js
│           │   │   ├── clientePorId.js
│           │   │   ├── crearNuevoCliente.js
│           │   │   ├── eliminarCliente.js
│           │   │   ├── eliminarTelefonoCliente.js
│           │   │   └── listClientes.js
│           │   ├── pedidos
│           │   │   ├── actualizarDatosPedido.js
│           │   │   ├── crearNuevoPedido.js
│           │   │   ├── eliminarPedido.js
│           │   │   ├── eliminarTodosLosPedidos.js
│           │   │   └── obtenerPedidoPorClienteId.js
│           │   └── productos
│           │       ├── actualizarDatosProducto.js
│           │       ├── crearNuevoProducto.js
│           │       ├── eliminarProducto.js
│           │       ├── listProductos.js
│           │       └── ProductoPorId.js
│           ├── router
│           │   ├── clientes.routes.js
│           │   ├── error.routes.js
│           │   ├── pedidos.routes.js
│           │   └── productos.routes.js
│           └── utils
│               ├── grpcConfigClientes.js
│               ├── grpcConfigPedidos.js
│               ├── grpcConfigProductos.js
│               ├── response.js
│               ├── validarClientes.js
│               ├── validarPedidos.js
│               └── validarProductos.js
├── LICENSE
├── README.md
├── server-a
│   ├── a-init.sql
│   ├── podman-compose.yaml
│   └── server
│       ├── package.json
│       ├── package-lock.json
│       ├── proto
│       │   ├── clientes.proto
│       │   └── pedidos.proto
│       └── src
│           ├── api.js
│           ├── grpc
│           │   └── pedidos.js
│           └── model.js
├── server-b
│   ├── b-init.sql
│   ├── podman-compose.yaml
│   └── server
│       ├── package.json
│       ├── package-lock.json
│       ├── proto
│       │   ├── clientes.proto
│       │   ├── pedidos.proto
│       │   └── productos.proto
│       └── src
│           ├── api.js
│           ├── grpc
│           │   ├── clientes.js
│           │   └── productos.js
│           └── model.js
└── server-c
    ├── c-init.sql
    ├── podman-compose.yaml
    └── server
        ├── package.json
        ├── package-lock.json
        ├── proto
        │   ├── pedidos.proto
        │   └── productos.proto
        └── src
            ├── api.js
            ├── grpc
            │   └── pedidos.js
            └── model.js
```


---