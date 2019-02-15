const

// libs
{ createStore, applyMiddleware } = require('redux'),
thunk = require('redux-thunk').default,
chalk = require('chalk'),

// services
{ describeVolumes } = require('../ec2/volume/describe.js'),
{ createSnapshot } = require('../ec2/snapshot/create.js'),

// store
initialState =
{
  volumeIds: []
},
rootReducer = function(state = initialState, action)
{
  state = Object.assign({}, state, { action: action})
  console.log(chalk.yellow(' - state action:',state.action.type))

  switch (action.type)
  {
    default:
    return state
  }
},
store = createStore(rootReducer, applyMiddleware(thunk)),

// boostrap
main = function (argv)
{
  // do something with argv.
  //console.log(argv.volumeName)
  store.dispatch(describeVolumes())
  let unsubscribe = store.subscribe(() =>
  {
    switch(store.getState().action.type)
    {
      case 'DESCRIBE_VOLUMES_ENDS':
        let vids = [];
        for(let v in store.getState().action.data.Volumes) store.dispatch(createSnapshot({
          Description: "Automated snap",
          VolumeId: store.getState().action.data.Volumes[v].VolumeId
        }))
        return store
    }
  })
}


// exports
exports.command = 'backupEc2 <volumeName>'

exports.describe = 'create fresh snapshot an deletes old if deleteDate is provided'

exports.builder =
{
  deleteOldOnes:{default: true}
}

exports.handler = main
