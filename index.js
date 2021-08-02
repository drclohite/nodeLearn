/* 
 * primary file for the API //
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
var fs = require('fs');
var _data = require('./lib/data');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

// instantiating the HTTP server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

// Start the http server
httpServer.listen(config.httpPort, function(){
    console.log("The HTTP server is listening on port " + config.httpPort);
});

// instantiating the HTTPS server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function(){
    console.log("The HTTPS server is listening on port " + config.httpsPort);
});

// All the server logic for both the http and https server
var unifiedServer = function(req,res){
    // get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,"");

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers= req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();
        //console.log('buffer',buffer)

        // Choose the handler this request should go to. If one is not found goto notfound 
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };
        console.log('chosenHandler data',data)
        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode,payload){
            //console.log('chosenHandler',data)
            // use the statuscode called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString); 

            // log the request path
            console.log('Returning this\'d response: ',statusCode,payloadString);

        });

    })
};



// define a request router
var router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'hello': handlers.hello
}
