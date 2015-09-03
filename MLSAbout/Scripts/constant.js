
'use strict';

var webAPI = "https://localhost:8089";
var environment = {
    'Prod': 'Production',
    'QA': 'QA',
    'INT': 'INT'
};
// Need to configure Splunk http://dev.splunk.com/view/webframework-splunkjsstack/SP-CAAAEW6
// May need to edit as administrator

// initialization ---------------------------------------------------------------
angular.module('app.constant', []).constant("Base",{"WebAPI": webAPI,"Environment": environment});


