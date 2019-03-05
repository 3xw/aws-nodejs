# aws-nodejs
Starter kit for aws complex tasks

## Install

	npm install aws-nodejs -g
	
## configure
be sure to have a .aws file in your user folder


## use
$ nodeaws help:

	$ nodeaws help
	nodeaws [command]

	Commands:
 		nodeaws backupEc2Volumes  creates fresh snapshots an deletes old ones
  		nodeaws backupRdsCluster  creates fresh snapshot of a db cluster an deletes old ones

	Options:
  		--version  Show version number                                       [boolean]
  		--help     Show help                                                 [boolean]
  		
$ nodeaws backupEc2Volumes:
	
	$ nodeaws backupEc2Volumes
	
	creates fresh snapshots an deletes old ones
	
	Options:
	  --version          Show version number                               [boolean]
	  --help             Show help                                         [boolean]
	  -u, --delayUnits   Delay units to use: seconds| minutes | hours | days | weeks
	                     | months | years                                 [required]
	  -a, --delayAmount  Delay amount 1, 2 etc                            [required]

$ nodeaws backupRdsCluster

	$ nodeaws backupRdsCluster
	
	creates fresh snapshot of a db cluster an deletes old ones
	
	Options:
	  --version          Show version number                               [boolean]
	  --help             Show help                                         [boolean]
	  -n, --name         Name of the cluster                              [required]
	  -u, --delayUnits   Delay units to use: seconds| minutes | hours | days | weeks
	                     | months | years                                 [required]
	  -a, --delayAmount  Delay amount 1, 2 etc                            [required]
  			
$ crontab -e:

	#######
	# aws #
	#######
	30 * * * * /data01/scripts/aws-nodejs/bin/nodeaws backupRdsCluster -n database03-cluster -a 24 -u hours > /data01/logs/aws-nodejs__backupRdsCluster.log 2>&1
	40 0 * * * /data01/scripts/aws-nodejs/bin/nodeaws backupEc2Volumes -a 1 -u weeks > /data01/logs/aws-nodejs__backupEc2Volumes.log 2>&1
	
## create you own
Go to files:
	
	bin/awsnode
	
add your new cmd and create it or copy one from for ex:

	src/cmd/backupRdsCluster.js
	
Have fun 👌


	
