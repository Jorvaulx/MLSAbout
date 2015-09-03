'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
angular.module('app', ['ui.router','ui.bootstrap', 'app.filters', 'app.services', 'app.directives', 'app.controllers', 'app.constant', 'ngAnimate', 'ngCookies'])

    // Gets executed during the provider registrations and configuration phase. Only providers and constants can be
    // injected here. This is to prevent accidental instantiation of services before they have been fully configured.
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$sceDelegateProvider',  function ($stateProvider, $locationProvider, $urlRouterProvider, $sceDelegateProvider) {

        // UI States, URL Routing & Mapping. For more info see: https://github.com/angular-ui/ui-router
        // ------------------------------------------------------------------------------------------------------------
        
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('Home', {
                url: '/',
                template: '<div id="home" class="view text-center ng-scope">' + 
                            '<span class="fa-stack" style="font-size: 5em; color: #FFAC00;">'+
                            '<i class="fa fa-square-o fa-stack-2x"></i>'+
                            '<i class="fa fa-gears fa-stack-1x" style="top: -5px;"></i></span>'+
                            '<h1>MetLife Solutions Health Check</h1>'+
                            '<h4>Tools to diagnose performance issues.</h4></div>',
                controller: 'HomeController'
            })
            .state('Team', {
                url: '/team',
                templateUrl: '/Views/Team',
                controller: 'TeamController'
            })
            .state('login', {
                url: '/login',
                layout: 'basic',
                templateUrl: '/Views/Login',
                controller: 'LoginController'
            })
            .state('Production', {
                url: '/production',
                templateUrl: '/Views/About',
                controller: 'AboutController'
            })
            .state('Production.logs', {
                url: '/logs',
                parent: 'Production',
                templateUrl: '/Views/Logs',
                controller: 'LogsController'
            })
            .state('Production.database', {
                url: '/database',
                parent: 'Production',
                templateUrl: '/Views/Database',
                controller: 'DatabaseController'
            })
            .state('Production.portal', {
                url: '/database',
                parent: 'Production',
                templateUrl: '/Views/Database',
                controller: 'DatabaseController'
            })
            .state('QA', {
                url: '/qa',
                templateUrl: '/Views/About',
                controller: 'AboutController'
            })
            .state('QA.logs', {
                url: '/logs',
                templateUrl: '/Views/Logs',
                controller: 'LogsController'
            })
            .state('QA.database', {
                url: '/database',
                templateUrl: '/Views/Database',
                controller: 'DatabaseController'
            })
            .state('INT', {
                url: '/int',
                templateUrl: '/Views/About',
                controller: 'AboutController'
            })
            .state('INT.logs', {
                url: '/logs',
                templateUrl: '/Views/Logs',
                controller: 'LogsController'
            })
            .state('INT.database', {
                url: '/database',
                templateUrl: '/Views/Database',
                controller: 'DatabaseController'
            });

        $locationProvider.html5Mode(true);

        
        // sets the whitelist of trusted URLs so we can load templates from external domains
        $sceDelegateProvider.resourceUrlWhitelist([
          // Allow same origin resource loads.
          'self',
          // Allow loading from our any page within our dev server.
          'http://localhost:8080/**',
          'https://localhost:8082/**'
        ]);
    }])

    // Gets executed after the injector is created and are used to kickstart the application. Only instances and constants
    // can be injected here. This is to prevent further system configuration during application run time.
    .run(['$templateCache', '$templateRequest', '$rootScope', '$state', '$stateParams', '$location', '$cookies', function ($templateCache, $templateRequest, $rootScope, $state, $stateParams, $location, $cookies) {

        // <ui-view> contains a pre-rendered template for the current view
        // caching it will prevent a round-trip to a server at the first page load
        //var view = angular.element('#ui-view');
        //$templateCache.put(view.data('tmpl-url'), view.html());

        // Allows to retrieve UI Router state information from inside templates
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {

            // Sets the layout name, which can be used to display different layouts (header, footer etc.)
            // based on which page the user is located
            $rootScope.layout = toState.layout;
        });

        if (!$rootScope.globals)
            $rootScope.globals = $cookies.get('globals') || undefined;

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals) {
                $location.path('/login');
            }
        });
    }]);