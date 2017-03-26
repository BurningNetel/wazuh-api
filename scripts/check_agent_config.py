#!/usr/bin/env python
import subprocess
import json
import os
import sys

if __name__ == "__main__":
    ossec_path = "/var/ossec"
    r_error = 0
    r_message = ""
    r_data = ""

    output = ""
    err = ""
    try:
        if len(sys.argv) > 1 and sys.argv[1] == 'new':
            p = subprocess.Popen(["{0}/bin/verify-agent-conf".format(ossec_path), "{0}/etc/shared/agent.conf.new".format(ossec_path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        else:
            p = subprocess.Popen(["{0}/bin/verify-agent-conf".format(ossec_path), "{0}/etc/shared/agent.conf".format(ossec_path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        (output, err) = p.communicate()

        lines = err.split(os.linesep)
        error_line = 0
        for l in lines:
            if "error" in l.lower():
                break
            else:
                error_line += 1

        if err:
            if "Error" in err:
                r_error = 82
                r_message = "{0}".format(lines[error_line:-1])
            else:
                r_error = 81
                r_message = "Error unknown."
        else:
            r_error = 0
            r_data = "OK"
    except Exception as e:
        r_error = 80
        r_message = "Problem running command: {0}".format(e)

    # Response
    response = {'error': r_error}
    if r_error == 0:
        response['data'] = r_data
    else:
        response['message'] = r_message

    print(json.dumps(response))
