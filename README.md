# aws-nodejs
Starter kit for aws complex tasks

This packages is build on top of

- aws-sdk
- redux
- yargs

It offers you a solid start point to create bin taks using the power of js, args/command managemnt wrap by popuplar yargs lib and the [flux](https://medium.com/hacking-and-gonzo/flux-vs-mvc-design-patterns-57b28c0f71b7) architecture:

## Install
### via git
	
	git clone https://github.com/3xw/aws-nodejs.git

### via npm

	npm install aws-nodejs -g
	
## configure

Be sure to have a .aws folder in your user folder [Configuration and Credential Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

Then create the file config/main.js with following.
	
	const
		AWS = require('aws-sdk'),
		creds = new AWS.SharedIniFileCredentials({profile: 'default'}) // or custom...
		
	module.exports = {
	  ownerId: 'xxxx-your-id',
	  region: 'eu-central-1', // your own
	  credentials: creds
	}


## use
$ nodeaws help:

	$ bin/nodeaws help
	nodeaws [command]

	Commands:
	  nodeaws backupEc2Volumes  creates fresh snapshots an deletes old ones
	  nodeaws backupRdsCluster  creates fresh snapshot of a db cluster an deletes old ones
	  nodeaws backupEsDomain    creates fresh snapshot of a Elastcisearch domain
	
	Options:
	  --version  Show version number                                       [boolean]
	  --help     Show help                                                 [boolean]
  		
$ nodeaws backupEc2Volumes:
	
	$ bin/nodeaws backupEc2Volumes
	
	creates fresh snapshots an deletes old ones
	
	Options:
	  --version          Show version number                               [boolean]
	  --help             Show help                                         [boolean]
	  -u, --delayUnits   Delay units to use: seconds| minutes | hours | days | weeks
	                     | months | years                                 [required]
	  -a, --delayAmount  Delay amount 1, 2 etc                            [required]

$ nodeaws backupRdsCluster

	$ bin/nodeaws backupRdsCluster
	
	creates fresh snapshot of a db cluster an deletes old ones
	
	Options:
	  --version          Show version number                               [boolean]
	  --help             Show help                                         [boolean]
	  -n, --name         Name of the cluster                              [required]
	  -u, --delayUnits   Delay units to use: seconds| minutes | hours | days | weeks
	                     | months | years                                 [required]
	  -a, --delayAmount  Delay amount 1, 2 etc                            [required]
	  
$ nodeaws backupEsDomain

	$ bin/nodeaws backupEsDomain
	
	creates fresh snapshot of a Elastcisearch domain

	Options:
	  --version          Show version number                               [boolean]
	  --help             Show help                                         [boolean]
	  -n, --name         repo setting name                                [required]
	  -d, --domain       Name of the domain                               [required]
	  -b, --bucket       Name of the s3 bucket                            [required]
	  -r, --role         Role to use                                      [required]
	  -u, --delayUnits   Delay units to use: seconds| minutes | hours | days | weeks
	                     | months | years                                 [required]
	  -a, --delayAmount  Delay amount 1, 2 etc                            [required]
  			
$ crontab -e:

	#######
	# aws #
	#######
	30 * * * * /data01/scripts/aws-nodejs/bin/nodeaws backupRdsCluster -n database03-cluster -a 24 -u hours > /data01/logs/aws-nodejs__backupRdsCluster.log 2>&1
	40 0 * * * /data01/scripts/aws-nodejs/bin/nodeaws backupEc2Volumes -a 1 -u weeks > /data01/logs/aws-nodejs__backupEc2Volumes.log 2>&1
	40 0 * * * /data01/scripts/aws-nodejs/bin/nodeaws backupEsDomain -a 1 -u weeks -r arn:aws:iam::<USER-ID>:role/<role-name> -b <bucket name> -d <xxxxx.eu-central-1.es.amazonaws.com> -n <custom_es_snap_config_name> > /data01/logs/aws-nodejs__backupEsDomain.log 2>&1
	
## create your own
Go to files:
	
	bin/awsnode
	
add your new cmd and create it or copy one from for ex:

	src/cmd/backupRdsCluster.js
	
Have fun 👌


	
