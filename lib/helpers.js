/*
 * Helpers for various tasks //
 *
 */

// Depedendencies
var config = require('./config');
var crypto = require('crypto');

// Container for all the helpers
var helpers = {}


// Create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256'.config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

// Parse a JSON string to an object str in all cases, without throwing
helpers.parseJsonToObject = function(str){
    try{
        console.log('helpers parseJsonToObject str',str);
        var payload = JSON.parse(str.toString().replace('\t','').replace('\r','').replace('\n','')); // Trim the sequence "\r\n" off the end of the string
        //var payload = JSON.parse(str);
        console.log('helpers payload',payload);
        return payload;
    }catch(e){
        return {};
    };
} 










// export the module
module.exports = helpers;