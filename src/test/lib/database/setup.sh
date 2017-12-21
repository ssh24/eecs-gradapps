#!/bin/bash

### Shell script to spin up a docker container for mysql.

## color codes
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
PLAIN='\033[0m'

## variables
MYSQL_CONTAINER="mysql_c"
HOST="localhost"
USER="root"
PASSWORD="pass"
PORT=3306
FILE_PATH="test/lib/database/seed.sql"

if [ "$1" ]; then
    FILE_PATH=$1
fi
if [ "$2" ]; then
    HOST=$2
fi
if [ "$3" ]; then
    PORT=$3
fi
if [ "$4" ]; then
    USER=$4
fi
if [ "$5" ]; then
    PASSWORD=$5
fi

## check if docker exists
printf "\n${RED}>> Checking for docker${PLAIN} ${GREEN}...${PLAIN}"
docker -v > /dev/null 2>&1
DOCKER_EXISTS=$?
if [ "$DOCKER_EXISTS" -ne 0 ]; then
    printf "\n\n${CYAN}Status: ${PLAIN}${RED}Docker not found. Terminating setup.${PLAIN}\n\n"
    exit 1
fi
printf "\n${CYAN}Found docker. Moving on with the setup.${PLAIN}\n"


## cleaning up previous builds
printf "\n${RED}>> Finding old builds and cleaning up${PLAIN} ${GREEN}...${PLAIN}"
docker rm -f $MYSQL_CONTAINER > /dev/null 2>&1
printf "\n${CYAN}Clean up complete.${PLAIN}\n"

## pull latest mysql image
printf "\n${RED}>> Pulling latest mysql image${PLAIN} ${GREEN}...${PLAIN}"
docker pull mysql:latest > /dev/null 2>&1
printf "\n${CYAN}Image successfully built.${PLAIN}\n"

## run the mysql container
printf "\n${RED}>> Starting the mysql container${PLAIN} ${GREEN}...${PLAIN}"
CONTAINER_STATUS=$(docker run --name $MYSQL_CONTAINER -e MYSQL_ROOT_USER=$USER -e MYSQL_ROOT_PASSWORD=$PASSWORD -p $PORT:3306 -d mysql:latest 2>&1)
if [[ "$CONTAINER_STATUS" == *"Error"* ]]; then
    printf "\n\n${CYAN}Status: ${PLAIN}${RED}Error starting container.
    Terminating setup.${PLAIN}\n\n"
    exit 1
fi
docker cp $FILE_PATH $MYSQL_CONTAINER:/home/ > /dev/null 2>&1
printf "\n${CYAN}Container is up and running.${PLAIN}\n"

## export the schema to the mysql database
printf "\n${RED}>> Exporting default schema${PLAIN} ${GREEN}...${PLAIN}\n"

## command to export schema
docker exec -it $MYSQL_CONTAINER /bin/sh -c "mysql -u$USER -p$PASSWORD < /home/seed.sql" > /dev/null 2>&1

## variables needed to health check export schema
OUTPUT=$?
TIMEOUT=120
TIME_PASSED=0
WAIT_STRING="."

printf "${GREEN}Waiting for mysql to respond with updated schema $WAIT_STRING${PLAIN}"
while [ "$OUTPUT" -ne 0 ] && [ "$TIMEOUT" -gt 0 ]
    do
        docker exec -it $MYSQL_CONTAINER /bin/sh -c "mysql -u$USER -p$PASSWORD < /home/seed.sql" > /dev/null 2>&1
        OUTPUT=$?
        sleep 1s
        TIMEOUT=$((TIMEOUT - 1))
        TIME_PASSED=$((TIME_PASSED + 1))

        if [ "$TIME_PASSED" -eq 5 ]; then
            printf "${GREEN}.${PLAIN}"
            TIME_PASSED=0
        fi
    done

if [ "$TIMEOUT" -le 0 ]; then
    printf "\n\n${CYAN}Status: ${PLAIN}${RED}Failed to export schema. Terminating setup.${PLAIN}\n\n"
    exit 1
fi
printf "\n${CYAN}Successfully exported schema to database.${PLAIN}\n"

printf "\n${CYAN}Status: ${PLAIN}${GREEN}Set up completed successfully.${PLAIN}\n"
