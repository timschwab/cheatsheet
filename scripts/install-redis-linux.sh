#!/bin/bash

# Download tarball
# Extract source
# Make
# Run Redis Server

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
cd src
./redis-server
