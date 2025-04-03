#!/bin/bash
while true; do
    node server.js
    echo "Proxy crashed! Restarting..."
    sleep 2
done
