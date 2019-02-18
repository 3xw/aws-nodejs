const
ec2 = require('../EC2.js'),
deleteSnapshot = function(params)
{
  return (dispatch, getState) => {

    ec2.deleteSnapshot(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'DELETE_SNAPSHOT_ENDS',
        data
      })
    })
  }
}

module.exports = { deleteSnapshot }
