'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', [])

.factory('AuthenticationService', ['Base64', '$http', '$cookies', '$rootScope', '$timeout', 'Base', 'x2js', function (Base64, $http, $cookies, $rootScope, $timeout, Base, x2js) {
    var service = {};

    $http.defaults.headers.common.Authorization = 'Splunk ' + $rootScope.sessionKey; // jshint ignore:line

    $http.defaults.transformResponse = function (data) {
        // convert the data to JSON and provide it to the success function below
        var json = x2js.xml_str2json(data);
        return json;
    };

    service.Login = function (username, password, callback) {
        var authdata = Base64.encode(username + ':' + password);
        $http.defaults.headers.common.Authorization = 'Basic ' + authdata;
        $http.defaults.transformRequest = function (data) {
            return Base64.serializeData(data);
        }

        /* Use this for real authentication
            ----------------------------------------------*/
        $http.post(Base.WebAPI + '/services/auth/login', { username: username, password: password },
            {
                headers: { "Content-Type":undefined } 
            })
            .success(function (response) {
                callback(response);
            });

    };

    service.SetCredentials = function (sessionKey) {
        $rootScope.globals =  { sessionKey: sessionKey,currentUser:'Name' };
        $http.defaults.headers.common['Authorization'] = 'Splunk ' + sessionKey; // jshint ignore:line
        $cookies.put('globals', $rootScope.globals);
    };

    service.ClearCredentials = function () {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    };

    return service;
}])

.factory('LogService', ['Base64', 'Base', '$http', '$cookies', '$rootScope', 'x2js', function (Base64, Base, $http, $cookies, $rootScope, x2js) {

    var service = {};

    $http.defaults.headers.common.Authorization = 'Splunk ' + $rootScope.sessionKey; // jshint ignore:line
    $http.defaults.transformResponse = function (data) {
        // convert the data to JSON and provide
        // it to the success function below
        var json = x2js.xml_str2json(data);
        return json;
    };

    $http.defaults.transformRequest = function (data) {
        return Base64.serializeData(data);
    }

    service.Search = function(environment, endTime, startTime, callback) {

    /* Search
    ----------------------------------------------*/
    $http.post(Base.WebAPI + '/services/search/jobs', { search: 'search *' }, {
            headers: { "Content-Type": undefined }
        })
        .success(function(response) {
            service.PollStatus(response,callback)
        });
    };

    /* 
     * Polling Status of Search
     */
    service.PollStatus = function(response,callback) {
        $http.get(Base.WebAPI + '/services/search/jobs/' + response.response.sid, {
                headers: { "Content-Type": undefined }
            })
            .success(function(response) {
                alert(JSON.stringify(response));
                callback(JSON.stringify(response));
            });
    };


    return service;
}])

.factory('x2js', [function () {
    return new X2JS();
}])

.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        },
        serializeData: function(data) {
            // If this is not an object, defer to native stringification.
            if ( ! angular.isObject( data ) ) {

                return( ( data == null ) ? "" : data.toString() );

            }

            var buffer = [];

            // Serialize each key in the object.
            for ( var name in data ) {

                if ( ! data.hasOwnProperty( name ) ) {

                    continue;

                }

                var value = data[ name ];

                buffer.push(
                    encodeURIComponent( name ) +
                    "=" +
                    encodeURIComponent( ( value == null ) ? "" : value )
                );

            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                .join( "&" )
                .replace( /%20/g, "+" )
            ;

            return( source );
        }
    };

    /* jshint ignore:end */
});