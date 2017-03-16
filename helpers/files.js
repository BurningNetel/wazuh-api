/**
 * Created by joep on 3/16/17.
 */

var fs = require('fs');
var libxmljs = require('libxmljs');
var config = require('../config.js');
var logger = require('../helpers/logger');

exports.read_ossec_conf = function(callback){
    var r_data = "";
    fs.readFile(config.ossec_conf_path, 'utf8', function read(err, data) {
        if (err) {
            r_data = {'error':90, 'data': '', 'message': "Error reading file"};
        }
        else {
            data = data.replace('\n','');
            r_data = {'error': 0, 'data': data, 'message': ""};
        }
        callback(r_data);
    });
};

exports.write_ossec_conf = function (xml, callback) {
    logger.debug("trying to write xml to file...");
    var r_data = "";
    fs.writeFile(config.ossec_conf_path + ".new", xml, function write(err){
        if(err) {
            r_data = {'error':91, 'data': "", 'message': "Error writing file"};
        } else {
            r_data = {'error': 1, 'data':"", 'message':""}
        }
        callback(data);
    });
    // TODO: Test config before writing
};

exports.is_valid_xml = function(xml) {
    try{
        libxml.parseXml(xml)
    } catch (e) {
        logger.debug("XML string is not valid XML!");
        return false;
    }
    return true;
};