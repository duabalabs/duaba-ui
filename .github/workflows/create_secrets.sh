#!/bin/bash

# Ensure GitHub CLI is installed
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) is not installed. Attempting to install..."

  # macOS (Homebrew)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v brew &> /dev/null; then
      brew install gh
    else
      echo "Homebrew not found. Please install Homebrew first: https://brew.sh"
      exit 1
    fi

  # Debian/Ubuntu (APT)
  elif [[ -f /etc/debian_version ]]; then
    sudo apt update
    sudo apt install -y gh

  # RedHat/CentOS/Fedora
  elif [[ -f /etc/redhat-release ]]; then
    sudo dnf install -y gh || sudo yum install -y gh

  else
    echo "Unsupported OS. Please install GitHub CLI manually: https://cli.github.com/"
    exit 1
  fi

else
  echo "✅ GitHub CLI is installed."
fi

# Paths
DEPLOY_YML="./deploy.yml"
ENV_FILE="./cred/.env"
SECRETS_FILE="./cred/.secrets"
PRIVATE_KEY_FILE="./cred/ssh_private_key.pem"

# NEW: Root-level .env file to store entire content as a single base64 secret
ROOT_ENV_FILE="../../.env"

# Check if deploy.yml exists
if [ ! -f "$DEPLOY_YML" ]; then
  echo "Error: $DEPLOY_YML does not exist!"
  exit 1
fi

# Check if cred/.env exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE does not exist! Make sure it is created and contains environment variables."
  exit 1
fi

# Check if cred/.secrets exists
if [ ! -f "$SECRETS_FILE" ]; then
  echo "Error: $SECRETS_FILE does not exist! Make sure it is created and contains secret variables."
  exit 1
fi

# Extract any 'secrets.*' references from deploy.yml
echo "Extracting secret variables from $DEPLOY_YML..."
SECRET_KEYS=$(grep -o '\${{ secrets\.[^}]*' "$DEPLOY_YML" | sed 's/\${{ secrets\.//')

# Check if 'SSH_PRIVATE_KEY_B64' is used in deploy.yml; if so, base64-encode & store
if grep -q "SSH_PRIVATE_KEY_B64" <<< "$SECRET_KEYS"; then
  echo "SSH_PRIVATE_KEY_B64 found in $DEPLOY_YML."
  if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo "Error: $PRIVATE_KEY_FILE is missing! Please add the private key file."
    exit 1
  else
    echo "$PRIVATE_KEY_FILE exists. Base64-encoding its content and adding as GitHub secret."
    # Base64 encode the private key (single-line) and store as 'SSH_PRIVATE_KEY_B64Y'
    B64_PRIVATE_KEY=$(base64 -i "$PRIVATE_KEY_FILE")
    gh secret set SSH_PRIVATE_KEY_B64 --body "$B64_PRIVATE_KEY"
  fi
else
  echo "SSH_PRIVATE_KEY_B64 not used in $DEPLOY_YML."
fi

# Process cred/.env file and set environment variables (line by line)
echo "Reading environment variables from $ENV_FILE..."
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  echo "Adding GitHub environment variable: $key"
  gh variable set "$key" --body "$value"
done < "$ENV_FILE"

# Process cred/.secrets file and set them as GitHub secrets (line by line)
echo "Reading secrets from $SECRETS_FILE..."
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  echo "Adding GitHub secret: $key"
  gh secret set "$key" --body "$value"
done < "$SECRETS_FILE"

# NEW: If root .env exists, base64-encode entire file and store as single-line secret: ENV_FILE_B64
if [ -f "$ROOT_ENV_FILE" ]; then
  echo "Found root-level .env at $ROOT_ENV_FILE."
  echo "Base64-encoding entire .env file content and adding to GitHub secret: ENV_FILE_B64"
  B64_ROOT_ENV=$(base64 -i "$ROOT_ENV_FILE")
  gh secret set ENV_FILE_B64 --body "$B64_ROOT_ENV"
else
  echo "No root-level .env file found at $ROOT_ENV_FILE. Skipping base64 secret creation."
fi

echo "All environment variables and secrets have been added to the GitHub repository."
