const http = require('http');
const routes = require('./routes');
const url = require('url');
const bodyParser = require('./helpers/body-parser')

const server = http.createServer((request, response) => {
  console.log(`Request method: ${request.method} | Endpoint: ${request.url}`);

  const parsedUrl = url.parse(request.url, true);
  let { pathname } = parsedUrl

  const splitEndpoint = pathname.split('/').filter(Boolean)

  let id = null
  if(splitEndpoint.length > 1){
    pathname = `/${splitEndpoint[0]}/:id`
    id = splitEndpoint[1]
  }

  const route = routes.find((r) => (
    r.path === pathname && r.method === request.method
  ))

  if(route) {
    request.query = parsedUrl.query
    request.params = { id }

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(body));
    }

    if(['POST', 'PUT'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response))
    }else {
      route.handler(request, response)
    }

  }

  else {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
})


server.listen(3000, () => {
  console.log('Listening on port http://localhost:3000');
})
