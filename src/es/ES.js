const
path = require('path'),
AWS = require('../AWS.js'),
httpClient = new AWS.HttpClient(),
credentials = AWS.config.credentials,
sendRequest = function({ domain, httpMethod, requestPath, payload })
{
  const request = new AWS.HttpRequest(new AWS.Endpoint(domain), AWS.config.region)

  request.method = httpMethod
  request.path = path.join(request.path, requestPath)
  request.body = JSON.stringify(payload)
  request.headers['Content-Type'] = 'application/json'
  request.headers['Host'] = domain

  const signer = new AWS.Signers.V4(request, 'es')
  signer.addAuthorization(credentials, new Date())

  return new Promise((resolve, reject) => {
    httpClient.handleRequest(
      request,
      null,
      response =>
      {
        const { statusCode, statusMessage, headers } = response
        let body = ''
        response.on('data', chunk => { body += chunk })
        response.on('end', () =>
        {
          const data = { statusCode, statusMessage, headers }
          if (body)  data.body = JSON.parse(body)
          resolve(data)
        });
      },
      err => reject(err)
    );
  });
}

module.exports = sendRequest;
