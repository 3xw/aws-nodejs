const
es = require('../ES.js'),
createSnapshot = function(params)
{
  return (dispatch, getState) =>
  {
    es(params)
    .catch(error => { /*throw new Error(error)*/ console.log(error) })
    .then(response => dispatch({type: 'ES_SNAPSHOT_CREATE_ENDS', response }))
  }
}

module.exports = { createSnapshot }
