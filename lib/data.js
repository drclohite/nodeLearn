/*
 * library for stroing and editing data //
 *
 */


// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module
var lib={}

// define base directory of the data flder
lib.baseDir = path.join(__dirname,'/../.data/')

lib.create = function(dir,file,data,callback) {
    // open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor) {
            // convert data to string
            var stringData = JSON.stringify(data)

            // write to file and close it
            fs.writeFile(fileDescriptor,stringData, function(err){
                if (!err) {
                    fs.close(fileDescriptor,function(err){
                        if(!err) {
                            callback(false)
                        } else {
                            callback('Error closing new file')
                        }
                    })
                } else {
                    callback('Error writing to new file')
                } 
            })
        } else {
            callback('Could not create new file, it may already exist')
        }
    })
}

// read data froma  file
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8', function(err,data){
        callback(err,data)
    })
}

// update data inside a file
lib.update = function(dir,file,data,callback){
    // open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data)
        } else {
            callback ('Could not open the file for updating, it may not exist yet')
        }

        //truncate the file
        fs.ftruncate(fileDescriptor,function(err){
            if(!err) {
                // write to the file and close it
                fs.writeFile(fileDescriptor,stringData, function(err){
                    if(!err) {
                        fs.close(fileDescriptor,function(err){
                            if(!err) {
                                callback(false)
                            } else {
                                callback('Error closing existing file')
                            }
                        })
                    } else {
                        callback('Error writing to existing file')
                    }
                })
            } else {
                callback('Error truncating file')
            }
        })
    
    })
}

// delete a file
lib.delete= function(dir,file,callback){
    // unlink the file from the filesystem
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false)
        } else {
            callback('Error deleting file')
        }
    })
};

module.exports = lib