#!/bin/bash

printf "${LBLUE}Welcome${NC} to the simple TYPEORM migrations creator.\n"

isOkay="n"

while [ $isOkay = "n" ]
do
    printf "\nEnter migration name: "
    read migrationName;

    printf "\e[1mEnter description: "   
    read description

    printf "\nMigration name: $migrationName \n" 
    printf "Description: $description \n" 

    printf "\nIs this okay ? (Y/n): "
    read isOkay

    if [ $isOkay = "n"] 
    printf "\033c"
done

printf "\nGenerating migration...\n"

printf "\nMigration generated successfully "
#/ts-node ./node_modules/typeorm/cli.js migration:generate -n
