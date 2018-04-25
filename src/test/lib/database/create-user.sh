#!/bin/bash

### Shell script to create all EECS user with a default password.
### <username>:<password> are put into htpasswd file using bycrypted encryption.

if [ "$1" ]; then
    HTPASSWD_FILE=$1
fi

declare -a arr=("aan" # DONE
    "aboelaze" # DONE
    "aeckford" # DONE
    "allison" # DONE
    "asn" # DONE
    "bil" # DONE
    "burton" # DONE
    "datta" # DONE
    "egz" # DONE
    "franck" # DONE
    "godfrey" # DONE
    "grau" # DONE
    "gt" # DONE
    "hefarag" # DONE
    "hj" # DONE
    "hooshyar" # DONE
    "hornsey" # DONE
    "hossein" # DONE
    "jarek" # DONE
    "jeff" # DONE
    "jelder" # DONE
    "jenkin" # DONE
    "jhuang" # DONE
    "johnlam" # DONE
    "jonathan" # DONE
    "jxu" # DONE
    "lesperan" # DONE
    "mab" # DONE
    "mack" # DONE
    "magiero" #DONE
    "mb" # DONE
    "mbrown" # DONE
    "mkyan" # DONE
    "papaggel" # DONE
    "patrick" # DONE
    "peterlian" # DONE
    "pfal" # DONE
    "pisana" # DONE
    "rezaei" # DONE
    "ruppert" # DONE
    "ruth" # DONE
    "sodagar" # DONE
    "tsotsos" # DONE
    "utn" # DONE
    "vlajic" # DONE
    "wildes" # DONE
    "zbigniew" # DONE
    "zmjiang" # DONE
    "mlitoiu" # DONE
    "xhyu" # DONE
    "liaskos" # DONE
    "grrrwaaa" # DONE
    "hmkim" # DONE
    "ifruend") # DONE

for i in "${arr[@]}"
do
   echo ">> $i"
    ./node_modules/.bin/htpasswd -b ${HTPASSWD_FILE} $i $i
done
