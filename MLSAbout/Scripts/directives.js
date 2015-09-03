'use strict';

angular.module('app.directives', [])

    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('lineTitle', function () {
        return {
            restrict: 'E',
            scope: {
                text: '='
            },
            link: function titlePostLink(scope, elem, attrs) {
                var html = scope.text.replace(".", " ");
                elem.html(html);
            }
        };
    });
;