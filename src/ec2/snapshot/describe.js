const
ec2 = require('../EC2.js')
describeSnapshots = function()
{
  return (dispatch, getState) => {

    ec2.describeSnapshots({OwnerIds:['self']}, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'DESCRIBE_SNAPSHOTS_ENDS',
        data
      })
    })
  }
}

module.exports = { describeSnapshots }
