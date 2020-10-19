printf "Enter your DB Password (Hidden): "
read -s password

eval typeorm-model-generator -h awsdb.cvvakyb1rjzp.eu-central-1.rds.amazonaws.com -d empero -p 3306 -u root -x $password -e mysql