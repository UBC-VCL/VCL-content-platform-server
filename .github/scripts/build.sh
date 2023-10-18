#!/bin/bash
set -xe
#gp to the app foler
cd ~/app/VCL-content-platform-server/

#clone the lastest version of the branch
git checkout master
git pull origin master

#delete the old image and create the new one
image_id=$(docker images --format "{{.ID}}" vcl_content_platform_backend_https)
if docker ps -a --filter "ancestor=$image_id" -q | grep -q .; then
    # Stop and remove the running containers
    docker ps -a --filter "ancestor=$image_id" -q | xargs -r docker stop
    docker ps -a --filter "ancestor=$image_id" -q | xargs -r docker rm
fi
docker rmi "$image_id"
docker build -t vcl_content_platform_backend_https .
docker run -d -p 5000:5000 \
-e IS_WIP="production" \
-e PORT=5000 \
vcl_content_platform_backend_https 

#add testing line





