process.env.PORT = 8080;
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/messages"] = requestHandlers.messages;
handle["/run"] = requestHandlers.run;
handle["/stop"] = requestHandlers.stop;


server.start(router.route, handle);