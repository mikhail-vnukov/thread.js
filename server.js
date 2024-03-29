var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);

  }

  http.createServer(onRequest).listen(process.env.PORT);
  console.log("Server has started on port " + process.env.PORT);
}

exports.start = start;
