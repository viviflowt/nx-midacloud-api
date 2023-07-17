#!/bin/bash

CLOUD_HOST=midacloud
CLOUD_USER=midacloud
SSH_HOST=$CLOUD_USER@$CLOUD_HOST

CLOUD_DIR=/home/$CLOUD_USER/midacloud

echo -e "Setting permissions on ci scripts \n"
chmod +x -R ./ci/*.sh

echo -e "Creating $CLOUD_HOST:$CLOUD_DIR \n"
ssh $SSH_HOST <<EOF
  mkdir -p $CLOUD_DIR
  cd $CLOUD_DIR
  rm -rf tmp dist 2>/dev/null
EOF

echo -e "Syncing files to $SSH_HOST:$CLOUD_DIR \n"
rsync -avz --exclude="node_modules" --exclude="tmp" --exclude="dist" ./ $SSH_HOST:$CLOUD_DIR/

echo -e "Installing dependencies on $SSH_HOST:$CLOUD_DIR \n"
ssh $SSH_HOST <<EOF
  cd $CLOUD_DIR
  ./ci/bootstrap.sh
EOF

ssh $SSH_HOST <<EOF
  cd $CLOUD_DIR
  docker compose -f ci/midacloud.yml down
  docker compose -f ci/midacloud.yml up --force-recreate --detach
EOF

docker compose pull --ignore-pull-failures

# echo -e "Building docker images and pushing to $SSH_HOST:$CLOUD_DIR \n"
# npm run build:docker

# echo -e "Restarting docker containers on $SSH_HOST:$CLOUD_DIR \n"
# ssh $SSH_HOST <<EOF
#   cd $CLOUD_DIR
#   docker compose down
#   docker compose up --force-recreate --detach
# EOF

echo
echo "Portainer UI:"
echo "https://$CLOUD_HOST:9443/"
echo

# viviflowt
# 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

# https://github.com/viviflowt/nx-mida-sandbox
# refs/heads/develop
# ci/midacloud.yml
