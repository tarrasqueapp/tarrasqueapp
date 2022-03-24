#!/bin/bash

arch=$(uname -m)
getopt=getopt
if [[ "$arch" == "arm64" ]]; then
  getopt=$(brew --prefix gnu-getopt)/bin/getopt
fi

echo "📂  Pruning docker containers..."
docker container prune -f

ARGS=$($getopt -a --options a --long "all" -- "$@")
eval set -- "$ARGS"

while true; do
  case "$1" in
    -a|--all)
      all="true"
      shift;;
    --)
      break;;
    *)
      printf "Unknown option %s\n" "$1"
      exit 1;;
  esac
done

if [ $all ]; then
  echo "📂  Pruning docker volumes..."
  docker volume prune -f
  echo "📂  Pruning docker system..."
  docker system prune -a -f
fi

echo "✅  Pruned!"
