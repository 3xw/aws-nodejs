const
  AWS = require('aws-sdk'),
  config = require('../config/main.js').aws.config

AWS.config.update(config)

module.exports = AWS
