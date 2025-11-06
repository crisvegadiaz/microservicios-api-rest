# microservicios-api-rest

## Descripción General

Este proyecto implementa una arquitectura de microservicios con las siguientes tecnologías:

- **API REST**: Un gateway HTTP que expone endpoints para gestionar clientes, pedidos y productos.
- **gRPC**: Servicios backend responsables de la lógica de negocio y la persistencia de datos.
- **Podman Compose**: Herramienta para orquestar el despliegue de los servicios en contenedores.

---
## Diagrama de Arquitectura

![Diagrama de Arquitectura](./diagrama.svg)

El diagrama anterior ofrece una visión general de la arquitectura del proyecto, mostrando las conexiones entre los diferentes microservicios.

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
## Instalación y Despliegue

Sigue estos pasos para configurar y levantar los servicios:

1.  **Clonar el Repositorio:** Clona este repositorio en tu máquina local.

1.  **Imágenes de Contenedor:** Las imágenes necesarias para los microservicios y la API REST están disponibles públicamente en Docker Hub:
    *   API REST: `docker pull cristiandv/api-rest:latest`
    *   Servicio Clientes (Server A): `docker pull cristiandv/server-a:latest`
    *   Servicio Pedidos (Server B): `docker pull cristiandv/server-b:latest`
    *   Servicio Productos (Server C): `docker pull cristiandv/server-c:latest`

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
