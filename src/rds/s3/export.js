const
rds = require('../../RDS.js'),
startExportTask = function(params)
{
  return (dispatch, getState) => {

    rds.startExportTask(params, function(err, data)
    {
      if(err) throw new Error(err)
      dispatch({
        type: 'RDS_S3_EXPORT_ENDS',
        data
      })
    })
  }
}

module.exports = { startExportTask }
