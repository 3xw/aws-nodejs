const
  AWS = require('aws-sdk'),
  ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

// ec2.describeSnapshots
console.log('yo');
