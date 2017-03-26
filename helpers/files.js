/**
 * API RESTful for OSSEC
 *
 * This program is a free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

var fs = require('fs');
var config = require('../config.js');
var logger = require('../helpers/logger');
var manager = require('../models/manager');
var libxml = require("libxmljs");
var execute = require("./execute.js");

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

// @TODO Test this
exports.write_ossec_conf = function (xml, callback) {
    var r_data = "";
    fs.writeFile(config.ossec_conf_path + ".new", xml, function write(err) {
        if (err) {
            r_data = {'error': 91, 'data': "", 'message': "Error writing file"};
            callback(r_data);
        }
    });

    // validate config
    var cmd = config.api_path + "/scripts/check_config.py";
    execute.exec(cmd, ['new'], function check_config(data){
        if(data['error'] !== "0"){
            callback(data);
        }
    });

    // overwrite old config
    fs.writeFile(config.ossec_conf_path, xml, function write(err) {
        if (err) {
            r_data = {'error': 91, 'data': "", 'message': "Error writing new config file"};
            callback(r_data);
        }
    });

    // restart ossec
    manager.restart(function (data) {
        callback(data);
    })
};

exports.write_ossec_agent_conf = function (xml, callback) {
    var r_data = "";
    fs.writeFile(config.ossec_agentconf_path + ".new", xml, function write(err) {
        if (err) {
            r_data = {'error': 91, 'data': "", 'message': "Error writing file"};
        } else {
            r_data = {'error': 0, 'data': "", 'message': ""}
        }
        callback(r_data);
    });

    // validate config
    var cmd = config.api_path + "/scripts/check_agent_config.py";
    execute.exec(cmd, ['new'], function check_config(data){
        if(data['error'] !== "0"){
            callback(data);
        }
    });

    // overwrite old config
    fs.writeFile(config.ossec_agentconf_path, xml, function write(err) {
        if (err) {
            r_data = {'error': 91, 'data': "", 'message': "Error writing new config file"};
            callback(r_data);
        }
    });

    // restart ossec
    manager.restart(function (data) {
        callback(data);
    })
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