const

// credentials
AWS = require('../AWS.js'),

// libs
{ createStore, applyMiddleware } = require('redux'),
thunk = require('redux-thunk').default,
chalk = require('chalk'),
moment = require('moment'),

// services
send = require('../es/send.js'),

// store
initialState = {
  domain: '',
  bucket: '',
  role: '',
  repository: '',
  repositories: [],
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
      bucket: action.argv.bucket,
      role: action.argv.role,
      repository: action.argv.name,
      delayAmount: action.argv.delayAmount,
      delayUnits: action.argv.delayUnits
    })

    case 'ES_SNAPSHOT_ALL_ENDS':
    let repositories = []
    for (let r in state.action.response.body) repositories.push(r)
    return Object.assign({}, state, {repositories})

    case 'ES_SNAPSHOT_LIST_ENDS':
    let snapshotsToDelete = []
    for(let s in state.action.response.body.snapshots)
    {
      if(moment().subtract(state.delayAmount, state.delayUnits).isBefore(moment(state.action.response.body.snapshots[s].start_time))) continue
      snapshotsToDelete.push(state.action.response.body.snapshots[s].snapshot)
    }
    return Object.assign({}, state, {snapshotsToDelete})

    case 'ES_SNAPSHOT_DELETE_ENDS':
    case 'ES_SNAPSHOT_CREATE_ENDS':
    console.log(state.action.response)
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
      case 'ES_SNAPSHOT_ALL_ENDS':
      if(store.getState().repositories.indexOf(store.getState().repository) == -1) return store.dispatch({type: 'ES_SNAPSHOT_ADD_REPO'})
      return store.dispatch({type: 'ES_SNAPSHOT_CREATE_REPO_ENDS'})

      case 'ES_SNAPSHOT_ADD_REPO':
      return store.dispatch(send(
        'ES_SNAPSHOT_CREATE_REPO',
        {
          domain: store.getState().domain,
          httpMethod: 'PUT',
          requestPath: '_snapshot/'+store.getState().repository,
          payload:
          {
            type: 's3',
            settings: {
              bucket: store.getState().bucket,
              role_arn: store.getState().role
            }
          }
        }
      ))

      case 'ES_SNAPSHOT_CREATE_REPO_ENDS':
      return store.dispatch(send(
        'ES_SNAPSHOT_LIST',
        {
          domain: store.getState().domain,
          httpMethod: 'GET',
          requestPath: '_snapshot/'+store.getState().repository+'/_all'
        }
      ))

      case 'ES_SNAPSHOT_LIST_ENDS':
      case 'ES_SNAPSHOT_DELETE_ENDS':
      return store.dispatch({type: 'LOOP_DELETE'})

      case 'LOOP_DELETE':
      if(!store.getState().snapshotsToDelete.length) return store.dispatch({type: 'ALL_DELETED'})
      return store.dispatch(send(
        'ES_SNAPSHOT_DELETE',
        {
          domain: store.getState().domain,
          httpMethod: 'DELETE',
          requestPath: '_snapshot/'+store.getState().repository+'/'+store.getState().snapshotsToDelete.shift()
        }
      ))

      case 'ALL_DELETED':
      return store.dispatch(send(
        'ES_SNAPSHOT_CREATE',
        {
          domain: store.getState().domain,
          httpMethod: 'PUT',
          requestPath: '_snapshot/'+store.getState().repository+'/snapshot-'+moment().format('YY-MM-DD-HH-mm'),
          payload: { include_global_state: false }
        }
      ))

      case 'ES_SNAPSHOT_CREATE_ENDS':
      return
    }
  })

  // init
  store.dispatch({type: 'SET_ARGV',argv})
  store.dispatch(send(
    'ES_SNAPSHOT_ALL',
    {
      domain: store.getState().domain,
      httpMethod: 'GET',
      requestPath: '_snapshot/_all'
    }
  ))
}


// exports
exports.command = 'backupEsDomain'

exports.describe = 'creates fresh snapshot of a Elastcisearch domain'

exports.builder = (yargs) => {
  yargs
    .alias('n', 'name')
    .describe('n', 'repo setting name')
    .demandOption(['n'])

    .alias('d', 'domain')
    .describe('d', 'Name of the domain')
    .demandOption(['d'])

    .alias('b', 'bucket')
    .describe('b', 'Name of the s3 bucket')
    .demandOption(['b'])

    .alias('r', 'role')
    .describe('r', 'Role to use')
    .demandOption(['r'])

    .alias('u', 'delayUnits')
    .describe('u', 'Delay units to use: seconds| minutes | hours | days | weeks | months | years')
    .demandOption(['u'])

    .alias('a', 'delayAmount')
    .describe('a', 'Delay amount 1, 2 etc')
    .demandOption(['a'])
}

exports.handler = main
