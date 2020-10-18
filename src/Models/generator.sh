printf "Enter your DB Password: "
read password

eval typeorm-model-generator -h awsdb.cvvakyb1rjzp.eu-central-1.rds.amazonaws.com -d empero -p 3306 -u root -x $password -e mysql