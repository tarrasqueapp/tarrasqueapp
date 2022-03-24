#!/bin/bash

case $2 in
  "client")
    cd ./apps/client
    yarn ${@:3}
    ;;
  "server")
    cd ./apps/server
    yarn ${@:3}
    ;;
  *)
    echo "Missing workspace $2"
    ;;
esac
