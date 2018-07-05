* to install MongoDB on Cloud9:
* 
* 1. sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
* 2. echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
* 3. sudo apt-get update
* 4. sudo apt-get install -y mongodb-org
* 5. mongo --version (to check version)
* 6. mkdir data (if not already created. I made it all the way out in the root.)
* 7. echo "mongod --dbpath=data --nojournal" > mongod
* 8. chmod a+x mongod
* 9. ./mongod (from root)