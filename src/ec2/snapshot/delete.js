const
ec2 = require('../EC2.js'),
deleteSnapshot = function(params)
{
  return (dispatch, getState) => {

    ec2.deleteSnapshot(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'EC2_SNAPSHOT_DELETE_ENDS',
        data
      })
    })
  }
}

module.exports = { deleteSnapshot }
