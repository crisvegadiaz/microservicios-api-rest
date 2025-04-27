#!/bin/sh

set -e
# (Opcional)
export SERVER_GRPC_PORT="${SERVER_GRPC_PORT:-50051}"

# Validar sólo las GRPC (o las que necesites)
: "${DB_HOST:?Error: DB_HOST no definida}"
: "${DB_PORT:?Error: DB_PORT no definida}"
: "${DB_USER:?Error: DB_USER no definida}"
: "${DB_PASSWORD:?Error: DB_PASSWORD no definida}"
: "${DB_NAME:?Error: DB_NAME no definida}"
: "${CLIENTES_GRPC_IP_PORT:?Error: CLIENTES_GRPC_IP_PORT no definida}"
: "${PRODUCTOS_GRPC_IP_PORT:?Error: PRODUCTOS_GRPC_IP_PORT no definida}"

exec "$@"