#!/bin/bash
ENV_FILE=.env
if [ -f "$ENV_FILE" ]; then
  echo "$ENV_FILE is already exists."
else
  echo "copy env"
  cp .env-example .env
fi

if [ `npm list -g | grep -c pm2` -eq 0 ]; then
  npm i -g pm2
  echo "pm2 is installed"
else
  echo "pm2 is already installed"
fi
