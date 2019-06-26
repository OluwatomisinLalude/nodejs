let http = require('http');
let fs = require('fs');
let path = require('path');
let API = require('./api.js'); 

const ip = '127.0.0.1';
const port = 3000;

http.createServer = ((request, response) => {
  let file = '.' + request.url; //Add . to URL to convert it to a local file path
  if (file== './') file = './index.html'; //Redirect / to serve index.html
  let extension = String(path.extname(file)).toLowerCase(); //Extract requested file's extension
  let mime = { '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.jpg': 'image/jpg',
                '.gif': 'image/gif' }; //Define acceptable file extensions
  let type = mime[extension] || 'application/octet-stream'; //If required file type is not mime, default to an arbitrary binary data

  fs.readFile(file, (error, content) => { //Read the file from the hard drive
    if(error) {
      if (error.code == 'ENOENT') {
        //Is this an API call? Or  should we serve a file?
        if (API.catchAPIrequest(request.url)) {
          response.end(API.exec(request.url), 'utf-8');
        } else
        //Not an API call. File just doesn't exist
        fs.readFile('./404.html', (error, content) => {
          response.writeHead(200, {'Content-Type': type});
          response.end(content, 'utf-8');
        });
      } else {
        response.writeHead(500);
        response.end('Error: ' + error.code + '\n');
        response.end();
      }
    } else {
      response.writeHead(200, {'Content-Type': type});
      response.end(content, 'utf-8');
    }
  });

}).listen(port, ip);

console.log('Running at ' + ip + ':' + port + '/');