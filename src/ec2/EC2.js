const
AWS = require('../AWS.js'),
ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

module.exports = ec2
