#!/bin/bash

# Usage: ./fetch-secrets.sh <environment> <service>
# Example: ./fetch-secrets.sh dev backend

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <environment> <service>"
  echo "Example: $0 dev backend"
  exit 1
fi

ENV=$1
SERVICE=$2
AWS_REGION=${AWS_REGION:-us-east-1}

# The path in Parameter Store, e.g., /app/dev/backend/
PARAM_PATH="/app/$ENV/$SERVICE/"
ENV_FILE="$SERVICE/.env"

echo "Fetching secrets from AWS Parameter Store: $PARAM_PATH"

# Fetch parameters recursively
# Note: jq is required for parsing the JSON output
PARAMS=$(aws ssm get-parameters-by-path \
  --path "$PARAM_PATH" \
  --recursive \
  --with-decryption \
  --region "$AWS_REGION" \
  --output json)

if [ -z "$PARAMS" ] || [ "$PARAMS" == "null" ]; then
  echo "Failed to fetch parameters or path does not exist."
  exit 1
fi

echo "Writing to $ENV_FILE..."

# Clear existing .env or create new one
> "$ENV_FILE"

# Parse JSON and append to .env file
echo "$PARAMS" | jq -r '.Parameters[] | "\(.Name)=\(.Value)"' | while read -r line; do
  # Extract just the parameter name from the full path
  PARAM_NAME=$(echo "$line" | sed "s|^$PARAM_PATH||" | cut -d= -f1)
  PARAM_VALUE=$(echo "$line" | cut -d= -f2-)
  
  echo "$PARAM_NAME=$PARAM_VALUE" >> "$ENV_FILE"
done

echo "Successfully wrote secrets to $ENV_FILE"
