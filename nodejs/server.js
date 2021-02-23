const http = require('http')
const routes = require('./routes')

const port = 3031
const publishPath = './publish'

http.createServer(async function (request, response) {
  routes.static(request, response, publishPath)
}).listen(port)

console.log(`Server running at http://127.0.0.1:${port}/`)
