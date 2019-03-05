const
ec2 = require('../EC2.js')
describeSnapshots = function(params)
{
  return (dispatch, getState) => {

    ec2.describeSnapshots(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'EC2_SNAPSHOT_DESCRIBE_ENDS',
        data
      })
    })
  }
}

module.exports = { describeSnapshots }
