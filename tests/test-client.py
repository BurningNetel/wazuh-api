#!/usr/bin/env python
###
#  API RESTful for OSSEC
#  Copyright (C) 2017, Acknowledge Benelux BV. All rights reserved.
#  acknowledge.nl
#
#  This program is a free software; you can redistribute it
#  and/or modify it under the terms of the GNU General Public
#  License (version 2) as published by the FSF - Free Software
#  Foundation.
##

import json
import sys
try:
    import requests
    from requests.auth import HTTPBasicAuth
except Exception as e:
    print("No module 'requests' found. Install: pip install requests")
    sys.exit()

valid_config = """{"data":"
<ossec_config>
<client>
<server-ip>1.2.3.4</server-ip>
</client>
</ossec_config>"}
"""

invalid_config = """{"data":"
>>>asdf<Sdf><ossec_config>
<client>
<server-ip>1.2.3.4</server-ip>
</client>
</ossec_config>
"}
"""

valid_agent_config = """{"data":"
<agent_config os="Linux">
    <localfile>
        <location>/var/log/my.log2</location>
        <log_format>syslog</log_format>
    </localfile>
</agent_config>
"}
"""

invalid_agent_config = """{"data":"
>>>asdf<ASDf><agent_config os="Linux">
    <localfile>
        <location>/var/log/my.log2</location>
        <log_format>syslog</log_format>
    </localfile>
</agent_config>
"}
"""

def req(method, resource, data=None):
    # Configuration
    base_url = 'https://$IPgit:55000'
    auth = HTTPBasicAuth('foo', 'bar')
    verify = False
    url = '{0}/{1}'.format(base_url, resource)
def req(method, resource, data=None):
    # Configuration
    base_url = 'https://joe001.security.acknowledge.nl:55000'
    auth = HTTPBasicAuth('foo', 'bar')
    verify = False
    url = '{0}/{1}'.format(base_url, resource)

    try:
        requests.packages.urllib3.disable_warnings()

        if method.lower() == 'post':
            r = requests.post(url, auth=auth, data=data, verify=verify)
        elif method.lower() == 'put':
            r = requests.put(url, auth=auth, data=data, verify=verify)
        elif method.lower() == 'delete':
            r = requests.delete(url, auth=auth, data=data, verify=verify)
        else:
            r = requests.get(url, auth=auth, params=data, verify=verify)

        code = r.status_code
        res_json = r.json()

    except Exception as exception:
        print("Error: {0}".format(exception))
        sys.exit(1)

    return code, res_json


def code_desc(http_status_code):
    return requests.status_codes._codes[http_status_code][0]

print("GET Configuration asxml:")
status_code, response = req('get', '/manager/configuration/asxml')
print(json.dumps(response, indent=4, sort_keys=True))
print("Status: {0} - {1}".format(status_code, code_desc(status_code)))

print("GET Agent Configuration asxml:")
status_code, response = req('get', '/manager/configuration/agent/asxml')
print(json.dumps(response, indent=4, sort_keys=True))
print("Status: {0} - {1}".format(status_code, code_desc(status_code)))

print("PUT invalid Configuration asxml:")
status_code, response = req('put', '/manager/configuration/asxml',data=invalid_config)
print(json.dumps(response, indent=4, sort_keys=True))
print("Status: {0} - {1}".format(status_code, code_desc(status_code)))

print("PUT valid Configuration asxml:")
status_code, response = req('put', '/manager/configuration/asxml',data=valid_config)
print(json.dumps(response, indent=4, sort_keys=True))
print("Status: {0} - {1}".format(status_code, code_desc(status_code)))

print("PUT invalid agent Configuration asxml:")
status_code, response = req('put', '/manager/configuration/agent/asxml',data=invalid_agent_config)
print(json.dumps(response, indent=4, sort_keys=True))
print("Status: {0} - {1}".format(status_code, code_desc(status_code)))

print("PUT valid agent Configuration asxml:")
status_code, response = req('put', '/manager/configuration/agent/asxml',data=valid_agentconfig)
print(json.dumps(response, indent=4, sort_keys=True))
print("Status: {0} - {1}".format(status_code, code_desc(status_code)))

print("\n\nDone")
