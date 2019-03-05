const
rds = require('../../RDS.js'),
deleteDBClusterSnapshot = function(params)
{
  return (dispatch, getState) => {

    rds.deleteDBClusterSnapshot(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'RDS_DB_CLUSTER_SNAPSHOTS_DELETE_ENDS',
        data
      })
    })
  }
}

module.exports = { deleteDBClusterSnapshot }
