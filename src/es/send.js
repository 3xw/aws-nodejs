const es = require('./ES.js')

module.exports = function(type, params)
{
  return (dispatch, getState) =>
  {
    // tell it starts
    dispatch({type})

    es(params)
    .catch(error => { console.log(error) })
    .then(response => dispatch({type: type + '_ENDS', response }))
  }
}
