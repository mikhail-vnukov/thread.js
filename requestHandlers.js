var fs = require("fs"),
    formidable = require("formidable");

var stream;
function messages(response) {
    console.log("Request handler 'message' was called.");
    stream = response;

    stream.writeHead(200, { 
        'Content-Type': 'text/html;charset=utf-8; boundary=boundary',
        'Access-Control-Allow-Origin' : '*',
        'Transfer-Encoding': 'chunked',
        'Connection': 'keep-alive'
});
    // stream.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8', 'Transfer-Encoding': 'chunked'});
}

function stop(response, request) {
    console.log("Request handler 'stop' was called.");
  stream.end();

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end("OK", 'utf-8');
}

function run(response, request) {
  console.log("Request handler 'run' was called.");
  var data = "";
  request.on('data', function (chunk) {
    data += chunk;
  });
  request.on('end', function () {
//    console.log("got data: " + data);
    var result = "var d = " + data;
    stream.write("<script>"+ result +"; d();</script>");
  });



  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end("OK", 'utf-8');
}

function start(response) {
    console.log("Request handler 'start' was called.");

    fs.readFile('./index.html', function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        }
    });
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    /* Possible error on Windows systems:
       tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response, postData) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}


exports.start = start;
exports.upload = upload;
exports.show = show;
exports.messages = messages;
exports.run = run;
exports.stop = stop;

