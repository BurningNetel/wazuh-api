/**
 * Created by joep on 3/16/17.
 */

var fs = require('fs');
var config = require('../config.js');
var logger = require('../helpers/logger');
var libxml = require("libxmljs");

exports.read_ossec_conf = function (callback) {
    var r_data = "";
    fs.readFile(config.ossec_conf_path, 'utf8', function read(err, data) {
        if (err) {
            r_data = {'error': 90, 'data': '', 'message': "Error reading file"};
        } else {
            data = data.trim().replace(/(\r\n|\n|\r)/gm, "");
            r_data = {'error': 0, 'data': data, 'message': ""};
        }
        callback(r_data);
    });
};

exports.write_ossec_conf = function (xml, callback) {
    var r_data = "";
    fs.writeFile(config.ossec_conf_path + ".new", xml, function write(err) {
        if (err) {
            r_data = {'error': 91, 'data': "", 'message': "Error writing file"};
        } else {
            r_data = {'error': 0, 'data': "", 'message': ""}
        }
        callback(r_data);
    });
};

exports.is_valid_xml = function (xml) {
    try {
        libxml.parseXml(xml)
    } catch (e) {
        logger.debug("XML string is not valid XML!");
        return false;
    }
    return true;
};

exports.read_global_agent_conf = function (callback) {
    var r_data = "";
    fs.readFile(config.ossec_agentconf_path, 'utf8', function read(err, data) {
        if (err) {
            logger.warning("Global agent config cannot be read!");
            r_data = {'error': 90, 'data': '', 'message': 'Error reading file'};
        } else {
            data = data.trim().replace(/(\r\n|\n|\r)/gm, "");
            r_data = {'error': 0, 'data': data, 'message': ""};
        }
        callback(r_data);
    })
};