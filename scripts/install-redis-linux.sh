#!/bin/bash

# https://redis.io/topics/quickstart
# This is the way to install on Linux, apparently...

# Download tarball
# Extract source
# Make
# Run Redis Server

wget http://download.redis.io/redis-stable.tar.gz
tar xzf redis-stable.tar.gz
cd redis-stable
make
cd src
./redis-server &
