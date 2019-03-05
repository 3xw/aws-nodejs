# aws-nodejs
Starter kit for aws tasks

## Install

	npm install aws-nodejs -g


## use
help

	$ bin/nodeaws help
	nodeaws [command]

	Commands:
 		nodeaws backupEc2Volumes  creates fresh snapshots an deletes old ones
  		nodeaws backupRdsCluster  creates fresh snapshot of a db cluster an deletes old ones

	Options:
  		--version  Show version number                                       [boolean]
  		--help     Show help                                                 [boolean]
  			
crontab -e

	#######
	# aws #
	#######
	30 * * * * /data01/scripts/aws-nodejs/bin/nodeaws backupRdsCluster -n database03-cluster -a 24 -u hours > /data01/logs/aws-nodejs__backupRdsCluster.log 2>&1
	40 0 * * * /data01/scripts/aws-nodejs/bin/nodeaws backupEc2Volumes -a 1 -u weeks > /data01/logs/aws-nodejs__backupEc2Volumes.log 2>&1
