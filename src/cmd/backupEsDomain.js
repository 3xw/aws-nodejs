const

// libs
{ createStore, applyMiddleware } = require('redux'),
thunk = require('redux-thunk').default,
chalk = require('chalk'),
moment = require('moment'),

// services
{createSnapshot} = require('../es/snapshot/create.js'),

// store
initialState = {
  domain: '',
  buket: '',
  role: '',
  path: '',
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
    return Object.assign({}, state, {
      domain: action.argv.domain,
      buket: action.argv.buket,
      role: action.argv.role,
      path: action.argv.path,
      delayAmount: action.argv.delayAmount,
      delayUnits: action.argv.delayUnits
    })

    case 'ES_SNAPSHOT_CREATE_ENDS':
    console.log(state.action.response);
    return state

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
      case 'ES_SNAPSHOT_CREATE_ENDS':
      return store
    }
  })

  // init
  store.dispatch({type: 'SET_ARGV',argv})
  store.dispatch(createSnapshot({
    domain: store.getState().domain,
    httpMethod: 'PUT',
    requestPath: '_snapshot/'+store.getState().path,
    payload:
    {
      type: 's3',
      settings: {
        bucket: store.getState().bucket,
        //region: "eu-central-1",
        role_arn: 'arn:aws:iam:::role/'+store.getState().role
      }
    }
  }))

}


// exports
exports.command = 'backupEsDomain'

exports.describe = 'creates fresh snapshot of a Elastcisearch domain'

exports.builder = (yargs) => {
  yargs
    .alias('d', 'domain')
    .describe('d', 'Name of the domain')
    .demandOption(['d'])

    .alias('b', 's3 buket')
    .describe('b', 'Name of the buket')
    .demandOption(['b'])

    .alias('r', 'role')
    .describe('r', 'Role to use')
    .demandOption(['r'])

    .alias('p', 'path')
    .describe('p', 'Path to use')
    .demandOption(['p'])

    .alias('u', 'delayUnits')
    .describe('u', 'Delay units to use: seconds| minutes | hours | days | weeks | months | years')
    .demandOption(['u'])

    .alias('a', 'delayAmount')
    .describe('a', 'Delay amount 1, 2 etc')
    .demandOption(['a'])
}

exports.handler = main
