'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('socialNetwork', [ 
	'ngRoute',
	'ngCookies',
	'socialNetwork.controllers',
	'socialNetwork.services',
	'socialNetwork.directives',
	'socialNetwork.filters'
	]);

myApp.config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
		// $locationProvider.hashPrefix('!');
		var routeChecks = {
			authenticated: ['$q', 'auth', function ($q, auth){
						if (auth.isAuthenticated()) {
							return $q.when(true);
						}
						return $q.reject('Unauthorized Access');
					}],
		};

		$routeProvider.when('/', {
			templateUrl: 'templates/home/home.html',
			controller: 'HomeCtrl'
		});

		$routeProvider.when('/newsFeed', {
			templateUrl: 'templates/newsFeed/newsFeed.html',
			controller: 'NewsFeedCtrl',
			resolve: routeChecks.authenticated
		});

		$routeProvider.when('/test',{
			templateUrl: 'templates/test/test.html',
			controller: 'TestCtrl'
		});

		$routeProvider.otherwise({redirectTo: '/'});

		$httpProvider.interceptors.push(['$q', 'toastr', function($q, toastr) {
			return {
				'response': function (response) {
					return response;
				},
				'responseError': function (rejection) {

					if (rejection.data && rejection.data.error_description) {
						toastr.error(rejection.data.error_description);
					
					} else if (rejection.data && rejection.data.modelState && rejection.data.modelState['']) {
						var errors = rejection.data.modelState[''];
						if (errors.length > 0) {
							toastr.error(errors[0]);
						}
					}

					return $q.reject(rejection);
				}
			}
		}])
	}])
	.run(['$rootScope', '$location', 'auth', function ($rootScope, $location, auth) {
		$rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
			if (rejection == 'Unauthorized Access') {
				$location.path('/');
			}
		});

		auth.refreshCookie();

	}])
	.constant('jQuery', $)
	.constant('toastr', toastr)
	.constant('BASE_URL', 'http://softuni-social-network.azurewebsites.net/api')

