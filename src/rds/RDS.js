const
AWS = require('../AWS.js'),
rds = new AWS.RDS({apiVersion: '2014-10-31'})

module.exports = rds
