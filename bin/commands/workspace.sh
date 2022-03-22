#!/bin/bash

case $2 in
  "client")
    cd ./apps/client
    ${@:3}
    ;;
  "server")
    cd ./apps/server
    ${@:3}
    ;;
  *)
    echo "Missing workspace $2"
    ;;
esac
