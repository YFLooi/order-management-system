USER_NAME=$(git config user.name)

if [ -z "$USER_NAME" ]; then
  echo "Push Failed. Please sign in your git account"
    exit 1
fi

set -e
yarn run docker-build-dev

# Valid format for Docker image tags
COMMIT_TAG="${USER_NAME}-dev"

echo "Tagging with ${COMMIT_TAG}"

# These tag the docker image then push it to GCP's container registry
# Tag as "latest"
docker tag operations-portal asia.gcr.io/order-management-system/operations-portal:COMMIT_TAG 
docker push asia.gcr.io/order-management-system/operations-portal:COMMIT_TAG 

echo -e "\033[1;33m\033[1mTagged with ${COMMIT_TAG}\033[0m"