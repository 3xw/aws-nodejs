const
ec2 = require('../EC2.js'),
describeVolumes = function()
{
  return (dispatch, getState) => {

    ec2.describeVolumes({}, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'DESCRIBE_VOLUMES_ENDS',
        data
      })
    })
  }
}

module.exports = { describeVolumes }
