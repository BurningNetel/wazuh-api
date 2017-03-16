/**
 * API RESTful for OSSEC
 * Copyright (C) 2015-2016 Wazuh, Inc.All rights reserved.
 * Wazuh.com
 *
 * This program is a free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License (version 2) as published by the FSF - Free Software
 * Foundation.
 */

var libxmljs = require('libxmljs');
var execute = require('../helpers/execute');
var errors = require('../helpers/errors');
var files = require('../helpers/files');
var config = require('../config.js');

var cmd_ossec_control = config.ossec_path + "/bin/ossec-control";

exports.status = function(callback){
    var args = ['-j', 'status'];
    execute.exec(cmd_ossec_control, args, callback);
};

exports.start = function(callback){
    var args = ['-j', 'start'];
    execute.exec(cmd_ossec_control, args, callback);
};

exports.stop = function(callback){
    var args = ['-j', 'stop'];
    execute.exec(cmd_ossec_control, args, callback);
};

exports.restart = function(callback){
    var args = ['-j', 'restart'];
    execute.exec(cmd_ossec_control, args, callback);
};

exports.config = function(filter, callback){
    var cmd = config.api_path + "/scripts/get_conf.py";
    execute.exec(cmd, [], function (json_output) {

        if (json_output.error == 0 && filter != null){

            if(filter.section && filter.field)
                data_filtered = json_output.data[filter.section][filter.field];
            else
                data_filtered = json_output.data[filter.section];

            r_data_filtered = {'error': 0, 'data': data_filtered, 'message': ""};

            callback(r_data_filtered);
        }
        else{
            callback(json_output);
        }
    });
};

exports.config_xml = function (callback) {
    files.read_ossec_conf(callback);
};

exports.config_xml_agent = function (callback) {
    files.read_global_agent_conf(callback);
};

exports.update_config_xml = function (xml_string, callback) {
    if(xml_string != null) {
        files.write_ossec_conf(xml_string, callback);
    }
};

exports.testconfig = function(callback){
    var cmd = config.api_path + "/scripts/check_config.py";
    execute.exec(cmd, [], callback);
};

exports.stats = function(date, callback){
    var cmd = config.api_path + "/scripts/stats.py";
    var args = [];

    switch(date) {
        case "today":
            var moment = require('moment');
            date = moment().format('YYYYMMDD');
            args = ['-t', '-y', date.substring(0, 4), '-m', date.substring(4, 6), '-d', date.substring(6, 8)];
            break;
        case "hourly":
            args = ['-h'];
            break;
        case "weekly":
            args = ['-w'];
            break;
        default:
            args = ['-t', '-y', date.substring(0, 4), '-m', date.substring(4, 6), '-d', date.substring(6, 8)];
    }

    execute.exec(cmd, args, callback);
};
