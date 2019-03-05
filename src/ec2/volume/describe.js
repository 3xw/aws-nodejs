const
ec2 = require('../EC2.js'),
describeVolumes = function(params)
{
  return (dispatch, getState) => {

    ec2.describeVolumes(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'EC2_VOLUMES_DESCRIBE_ENDS',
        data
      })
    })
  }
}

module.exports = { describeVolumes }
