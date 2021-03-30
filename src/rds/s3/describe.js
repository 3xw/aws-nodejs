const
rds = require('../RDS.js'),
describeExportTasks = function(params)
{
  return (dispatch, getState) => {

    console.log(rds.startExportTask);

    rds.describeExportTasks(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'RDS_S3_DESCRIBE_ENDS',
        data
      })
    })
  }
}

module.exports = { describeExportTasks }
