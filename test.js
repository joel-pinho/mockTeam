var http = require("http");

http.createServer(function (request, response){

    response.writeHead(200, {'Content-Type': 'text/plain'});

    response.end('Hello World from Server!!!');
}).listen(8081);

console.log("Server running at http://localhost:8081");