const
rds = require('../../RDS.js'),
describeDBClusterSnapshots = function(params)
{
  return (dispatch, getState) => {

    rds.describeDBClusterSnapshots(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'RDS_DB_CLUSTER_SNAPSHOTS_DESCRIBE_ENDS',
        data
      })
    })
  }
}

module.exports = { describeDBClusterSnapshots }
