const

// libs
{ createStore, applyMiddleware } = require('redux'),
thunk = require('redux-thunk').default,
chalk = require('chalk'),
moment = require('moment'),

// services
{ describeDBClusterSnapshots } = require('../rds/dbCluster/snapshot/describe.js'),
{ createDBClusterSnapshot } = require('../rds/dbCluster/snapshot/create.js'),
{ deleteDBClusterSnapshot } = require('../rds/dbCluster/snapshot/delete.js'),

// store
initialState = {
  name: '',
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
    return Object.assign({}, state, { name: action.argv.name, delayAmount: action.argv.delayAmount, delayUnits: action.argv.delayUnits})

    case 'RDS_DB_CLUSTER_SNAPSHOTS_DESCRIBE_ENDS':
    let snapshotsToDelete = []
    for(let s in action.data.DBClusterSnapshots)
    {
      if(moment().subtract(state.delayAmount, state.delayUnits).isBefore(moment(action.data.DBClusterSnapshots[s].SnapshotCreateTime))) continue
      snapshotsToDelete.push(action.data.DBClusterSnapshots[s].DBClusterSnapshotIdentifier)
    }
    return Object.assign({}, state, { snapshots: action.data.DBClusterSnapshots, snapshotsToDelete})

    default:
    return state
  }
},

// boostrap
main = function (argv)
{
  // kick it!
  store = createStore(rootReducer, applyMiddleware(thunk))

  let unsubscribe = store.subscribe(() =>
  {
    switch(store.getState().action.type)
    {
      case 'RDS_DB_CLUSTER_SNAPSHOTS_DESCRIBE_ENDS':
      console.log(store.getState().snapshotsToDelete)
      // create new one
      store.dispatch(createDBClusterSnapshot({DBClusterSnapshotIdentifier: store.getState().name+'-'+moment().format('YY-MM-DD-HH-mm'),DBClusterIdentifier: store.getState().name}))

      // delete old ones
      for(let s in store.getState().snapshotsToDelete) store.dispatch(deleteDBClusterSnapshot({DBClusterSnapshotIdentifier: store.getState().snapshotsToDelete[s]}))
      return store

    }
  })

  // init
  store.dispatch({type: 'SET_ARGV',argv})
  store.dispatch(describeDBClusterSnapshots({
    SnapshotType: 'manual',
    DBClusterIdentifier: store.getState().name
  }))

}


// exports
exports.command = 'backupRdsCuster'

exports.describe = 'creates fresh snapshot of a db cluster an deletes old ones'

exports.builder = (yargs) => {
  yargs
    .alias('n', 'name')
    .describe('n', 'Name of the cluster')
    .demandOption(['n'])
    .alias('u', 'delayUnits')
    .describe('u', 'Delay units to use: seconds| minutes | hours | days | weeks | months | years')
    .demandOption(['u'])
    .alias('a', 'delayAmount')
    .describe('a', 'Delay amount 1, 2 etc')
    .demandOption(['a'])
}

exports.handler = main
