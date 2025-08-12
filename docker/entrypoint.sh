#!/bin/sh

set -e

echo "Starting Book Club Backend..."

# yarn seed
yarn start

# exec "$@"
# echo "Holding container for debugging..."
# tail -f /dev/null
