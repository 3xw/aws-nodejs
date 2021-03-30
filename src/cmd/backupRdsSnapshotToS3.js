const

// libs
{ createStore, applyMiddleware } = require('redux'),
thunk = require('redux-thunk').default,
chalk = require('chalk'),
moment = require('moment'),

// services
{ describeExportTasks } = require('../rds/s3/describe.js'),

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

    case 'RDS_S3_DESCRIBE_ENDS':
    console.log(action);
    return Object.assign({}, state)

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
      return store

    }
  })

  // init
  store.dispatch({type: 'SET_ARGV',argv})
  store.dispatch(describeExportTasks())

}


// exports
exports.command = 'backupRdsSnapshotToS3'

exports.describe = 'Exports a rs snap to S3'

exports.builder = (yargs) => {
  yargs
    /*
    .alias('n', 'name')
    .describe('n', 'Name of the cluster')
    .demandOption(['n'])
    .alias('u', 'delayUnits')
    .describe('u', 'Delay units to use: seconds| minutes | hours | days | weeks | months | years')
    .demandOption(['u'])
    .alias('a', 'delayAmount')
    .describe('a', 'Delay amount 1, 2 etc')
    .demandOption(['a'])
    */
}

exports.handler = main
