#!/bin/bash

if [ ! -e server.js ]
then
  echo "Error: could not find main application server.js file"
  echo "You should run the generate-ssl-certs.sh script from the main MEAN application root directory"
  echo "i.e: bash scripts/generate-ssl-certs.sh"
  exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ./server/config/sslcerts
openssl genrsa -out ./server/config/sslcerts/key.pem 4096
openssl req -new -key ./server/config/sslcerts/key.pem -out ./server/config/sslcerts/csr.pem
openssl x509 -req -days 365 -in ./server/config/sslcerts/csr.pem -signkey ./server/config/sslcerts/key.pem -out ./server/config/sslcerts/cert.pem
rm ./server/config/sslcerts/csr.pem
chmod 600 ./server/config/sslcerts/key.pem ./server/config/sslcerts/cert.pem
