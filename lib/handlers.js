/*
 * Request handlers ..
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = function(data,callback){
    console.log('handlers.users data',data);
    var acceptableMethods = ['post','get','put','delete']
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for users submethods
handlers._users = {};

// Users - post
// required data: firstName, lastName, phone, password, tosAgreement
// optional data: none
handlers._users.post = function(data,callback){
    // check that all required fields are filled out
    //console.log('data',data);
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    
    //console.log('firstName',firstName);

    if(firstName && lastName && phone && password && tosAgreement) {
        // make sure the user does not already exist
        _data.read('users',phone,function(err,data){
            if(!err){
                //hash the password
                var hashedPassword = helpers.hash(password);

                // create the user object
                if (hashedPassword) {
                    var userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    }
    
                    // store the user
                    _data.create('users',phone,userObject,function(err){
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err)
                            callback(500,{'Error': 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500,{'Error':'Could not hash the user\'s password'});
                } 
                

            } else {
                callback(400,{'Error':'A user with that phone number already exists'})
            }
        })
    } else {
        callback(400,{'Error':'Missing required fields'})
    }
}

// Users - Get
handlers._users.get = function(data,callback){
    
}

// Users - Put
handlers._users.put = function(data,callback){
    
}

// Users - Delete
handlers._users.delete = function(data,callback){
    
}




// ping handler
handlers.ping = function(data, callback){
    callback(200);
};

// hello handler
handlers.hello = function(data, callback){
    callback(200,{'message':'Hello World'});
};

// Not found handler
handlers.notFound = function(data, callback){
    callback(404,{'message':'Home Page'});
};

// Export the module
module.exports = handlers