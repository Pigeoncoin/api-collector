var http = require('http')
const server = http.createServer();
const config = require('../config/config.json')

function BlockNotify(callback){
  server.listen(
    config.http
  );

  console.log(`listening on http://${config.http.host}:${config.http.port}/ for block notifications`)

  server.on('request', (request, response) => {
    callback(request.url.replace("/",""))
    // the same kind of magic happens here!
    response.end()
  });
}

module.exports = BlockNotify
