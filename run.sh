#!/usr/bin/env bash

IMAGE=rvizweb
docker run -it --rm -p 8001:8001 -p 8080:8080 "${IMAGE}"
