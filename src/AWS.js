const
  AWS = require('aws-sdk'),
  config = require('../config/main.js')

AWS.config.update(config)

module.exports = AWS
