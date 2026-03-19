#!/bin/bash

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

$COMPOSE_CMD -f docker-compose.production.yml logs -f --tail=100
