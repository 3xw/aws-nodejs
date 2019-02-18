const

// libs
{ createStore, applyMiddleware } = require('redux'),
thunk = require('redux-thunk').default,
chalk = require('chalk'),
moment = require('moment'),

// services
{ describeVolumes } = require('../ec2/volume/describe.js'),
{ describeSnapshots } = require('../ec2/snapshot/describe.js'),
{ createSnapshot } = require('../ec2/snapshot/create.js'),
{ deleteSnapshot } = require('../ec2/snapshot/delete.js'),

// store
initialState = {
  volumes: [],
  snapshots: [],
  snapshotsToDelete: [],
  delayUnits: 'weeks',
  delayAmount: 1
},
rootReducer = function(state = initialState, action)
{
  state = Object.assign({}, state, { action: action})
  console.log(chalk.yellow(' - state action:',state.action.type))

  switch (action.type)
  {
    case 'SET_ARGV':
    return Object.assign({}, state, { delayAmount: action.argv.delayAmount, delayUnits: action.argv.delayUnits})

    case 'DESCRIBE_VOLUMES_ENDS':
    return Object.assign({}, state, { volumes: action.data.Volumes})

    case 'DESCRIBE_SNAPSHOTS_ENDS':
    let snapshotsToDelete = []
    for(let s in action.data.Snapshots)
    {
      if(moment().subtract(state.delayAmount, state.delayUnits).isBefore(moment(action.data.Snapshots[s].StartTime))) continue
      for( let v in state.volumes) if(action.data.Snapshots[s].VolumeId == state.volumes[v].VolumeId) snapshotsToDelete.push(action.data.Snapshots[s].SnapshotId)
    }
    return Object.assign({}, state, { snapshots: action.data.Snapshots, snapshotsToDelete})

    default:
    return state
  }
},
store = createStore(rootReducer, applyMiddleware(thunk)),

// boostrap
main = function (argv)
{
  let unsubscribe = store.subscribe(() =>
  {
    switch(store.getState().action.type)
    {
      case 'DESCRIBE_VOLUMES_ENDS':
      store.dispatch(describeSnapshots())
      return store

      case 'DESCRIBE_SNAPSHOTS_ENDS':
      for(let v in store.getState().volumes) store.dispatch(createSnapshot({Description: "Automated snap",VolumeId: store.getState().volumes[v].VolumeId}))
      for(let s in store.getState().snapshotsToDelete) store.dispatch(deleteSnapshot({SnapshotId: store.getState().snapshotsToDelete[s]}))
      return store

    }
  })

  // init
  store.dispatch({type: 'SET_ARGV',argv})
  store.dispatch(describeVolumes())

}


// exports
exports.command = 'backupEc2Volumes'

exports.describe = 'creates fresh snapshots an deletes old ones'

exports.builder = (yargs) => {
  yargs
    .alias('du', 'delayUnits')
    .describe('du', 'Delay units to use: seconds| minutes | hours | weeks | months | years')
    .demandOption(['du'])
    .alias('da', 'delayAmount')
    .describe('da', 'Delay amount 1, 2 etc')
    .demandOption(['da'])
}

exports.handler = main