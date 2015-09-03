'use strict';
// Google Analytics Collection APIs Reference:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

angular.module('app.controllers', [])

    // Path: /
    .controller('HomeController', ['$scope', '$location', '$window',  function ($scope, $location, $window) {
        $scope.$root.title = 'MLS About';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /about
    .controller('AboutController', ['$scope', '$location', '$window', '$state', function ($scope, $location, $window, $state) {
        $scope.$root.title = 'About';
        if ($state.current.name.split(".").length==1){
            var transitionTo = $state.current.name.split(".")[0] + ".logs";
            console.log(transitionTo);
            $state.transitionTo(transitionTo);
        } else
            console.log($state.current.name);
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /.logs
    .controller('LogsController', ['$scope', '$location', '$window','$modal','$log','$http', 'LogService', '$state', function ($scope, $location, $window, $modal, $log, $http, LogService, $state) {
        $scope.$root.title = 'Logs';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
        $scope.content = '';
        $scope.today = function() {
            var start = new Date();
            start.setDate(start.getDate() - 1);
            $scope.log = {
                dStartDate: start,
                dEndDate:new Date()
            }
        }
        $scope.today();
        $scope.open = function(type) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: "/views/datepicker",
                controller: "DateController",
                scope:$scope,
                size: 'dt',
                resolve: {
                    log: function() {
                        return {
                            dStartDate: $scope.log.dStartDate,
                            dEndDate: $scope.log.dEndDate,
                            type: type
                        }
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if ("start"===type) 
                    $scope.log.dStartDate = selectedItem;
                else
                    $scope.log.dEndDate = selectedItem;
                $log.info("Modal first function dismissed at: " + new Date());
            }, function () {
                $log.info("Modal dismissed at: " + new Date());
            });

        };
        $scope.showLogs = function() {
            LogService.Search($state.current.name, $scope.log.dEndDate, $scope.log.dStartDate, function (response) {
                $scope.content = response;
                /*
                if (response.success) {
                    $scope.content = response.value;
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }*/
            });
        }
    }])

    .controller('DateController', ['$scope','$modalInstance','log', function($scope,$modalInstance,log) {
        
        $scope.log = log;
        $scope.initValue = function () {
            if ($scope.log.type === 'start')
                $scope.dDate = $scope.log.dStartDate;
            else 
                $scope.dDate = $scope.log.dEndDate;
        }
        $scope.initValue();


        
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.ok = function () {
            $modalInstance.close($scope.dDate);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])

    // Path: /.logs
    .controller('DatabaseController', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Database';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /team
    .controller('TeamController', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Team';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /login
    .controller('LoginController', ['$scope', '$state', '$window', 'AuthenticationService','$location', function ($scope, $state, $window, AuthenticationService,$location) {
        $scope.$root.title = 'AngularJS SPA | Sign In';
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function (user,pass) {
            $scope.dataLoading = true;
            AuthenticationService.Login(user, pass, function (response) {
                if (response.response.sessionKey) {
                    console.log("Success:"+JSON.stringify(response));
                    AuthenticationService.SetCredentials(response.sessionKey);
                    $state.go('Home');
                } else {
                    console.log("Failure:"+JSON.stringify(response));
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
        /*
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });*/
    }])

    // Path: /error/404
    .controller('Error404Controller', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Error 404: Page Not Found';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }]);