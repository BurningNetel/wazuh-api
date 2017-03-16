/**
 * Created by joep on 3/16/17.
 */

fs = require('fs');

var config = require('../config.js');

exports.read_ossec_conf = function(callback){
    fs.readFile(config.ossec_conf_path, 'utf8', function read(err, data) {
        if (err) {
            data = {'error':90, 'data': '', 'message': "Error reading file"};
            callback(data);
        }
        r_data = {'error':0, 'data': data, 'message': ""};
        callback(r_data);
    });
}