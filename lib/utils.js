/*
 Licensed to the StackStorm, Inc ('StackStorm') under one or more
 contributor license agreements.  See the NOTICE file distributed with
 this work for additional information regarding copyright ownership.
 The ASF licenses this file to You under the Apache License, Version 2.0
 (the "License"); you may not use this file except in compliance with
 the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var url = require('url'),
  util = require('util'),
  env = process.env;

var _ = require('lodash');

var WEBUI_EXECUTION_HISTORY_URL = '%s/#/history/%s/general';
var MESSAGE_EXECUTION_ID_REGEX = new RegExp('.*execution: (.+).*');
var CLI_EXECUTION_GET_CMD = 'st2 execution get %s';


function isNull(value) {
  return (!value) || value === 'null';
}

function getExecutionHistoryUrl(execution_id) {
  var url;

  if (isNull(env.ST2_WEBUI_URL)) {
    return null;
  }

  if (!execution_id) {
    return null;
  }

  url = util.format(WEBUI_EXECUTION_HISTORY_URL, env.ST2_WEBUI_URL, execution_id);
  return url;
}

function getExecutionCLICommand(execution_id) {
  if (!execution_id) {
    return null;
  }

  return util.format(CLI_EXECUTION_GET_CMD, execution_id);
}

function getExecutionIdFromMessage(message) {
  var match, execution_id = null;

  if (!message) {
    return null;
  }

  match = message.match(MESSAGE_EXECUTION_ID_REGEX);

  if (match) {
    execution_id = match[1];
    execution_id = _.trim(execution_id);
  }

  return execution_id;
}

function parseUrl(url_string) {
  var parsed, result;

  parsed = url.parse(url_string);

  result = {};
  result['hostname'] = parsed['hostname'];
  result['protocol'] = parsed['protocol'].substring(0, (parsed['protocol'].length - 1));

  if (parsed['port'] !== null) {
    result['port'] = parseInt(parsed['port'], 10);
  }
  else {
    if (result['protocol'] === 'http') {
      result['port'] = 80;
    }
    else {
      result['port'] = 443;
    }
  }

  result['path'] = parsed['path'];

  return result;
}


exports.isNull = isNull;
exports.getExecutionHistoryUrl = getExecutionHistoryUrl;
exports.getExecutionCLICommand = getExecutionCLICommand;
exports.getExecutionIdFromMessage = getExecutionIdFromMessage;
exports.parseUrl = parseUrl;
