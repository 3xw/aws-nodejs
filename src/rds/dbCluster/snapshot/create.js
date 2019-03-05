const
rds = require('../../RDS.js'),
createDBClusterSnapshot = function(params)
{
  return (dispatch, getState) => {

    rds.createDBClusterSnapshot(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'RDS_DB_CLUSTER_SNAPSHOTS_CREATE_ENDS',
        data
      })
    })
  }
}

module.exports = { createDBClusterSnapshot }
