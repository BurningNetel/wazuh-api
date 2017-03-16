
var config = {};

// Port
config.port = "55000";

// Security
config.https = "yes"; // Values: yes, no
config.basic_auth = "yes"; // Values: yes, no
config.BehindProxyServer = "no"; // Values: yes, no
config.cors = "yes"; // Values: yes, no

// Paths
config.ossec_path = "/var/ossec";
config.log_path = config.ossec_path + "slogs/api.log";
config.api_path = __dirname;
config.ossec_conf_path = config.ossec_path + "/etc/ossec.conf";

// Logs
config.logs = "info";  // Values: disabled, info, warning, error, debug (each level includes the previous level).
config.logs_tag = "WazuhAPI";

module.exports = config;
