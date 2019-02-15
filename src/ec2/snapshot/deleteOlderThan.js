const ec2 = require('../EC2.js')

// ec2.describeSnapshots
ec2.describeSnapshots({OwnerIds: ['self']}, function(err, data) {
  if(err) console.log(err, err.stack) // an error occurred
  else console.log(data) // successful response
})
