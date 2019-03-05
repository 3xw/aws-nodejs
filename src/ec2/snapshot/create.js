const
ec2 = require('../EC2.js'),
createSnapshot = function(params)
{
  return (dispatch, getState) => {

    ec2.createSnapshot(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'EC2_SNAPSHOT_CREATE_ENDS',
        data
      })
    })
  }
}

module.exports = { createSnapshot }
