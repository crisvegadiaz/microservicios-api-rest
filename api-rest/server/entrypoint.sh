#!/bin/sh
set -e

# (Opcional) 
export EXPRESS_PORT="${EXPRESS_PORT:-3000}"

# Validar sólo las GRPC (o las que necesites)
: "${CLIENTES_GRPC_IP_PORT:?Error: CLIENTES_GRPC_IP_PORT no definida}"
: "${PEDIDOS_GRPC_IP_PORT:?Error: PEDIDOS_GRPC_IP_PORT no definida}"
: "${PRODUCTOS_GRPC_IP_PORT:?Error: PRODUCTOS_GRPC_IP_PORT no definida}"

exec "$@"

