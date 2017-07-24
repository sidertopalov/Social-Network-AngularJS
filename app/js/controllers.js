'use strict';

angular.module('socialNetwork.controllers', [])
	
	.controller('MainCtrl', [
		'$scope',
		'auth',
		'identity',
		function ($scope, auth, identity){

			identity.getCurrentUser()
				.then(function (user) {
					$scope.currentUser = user;
					$scope.isAuthenticated = true;
				});

			$scope.logout = function () {
				auth.logout();
			}
		}
	])


	.controller('HomeCtrl', [
		'$scope',
		'$location',
		'auth', 
		function($scope, $location, auth) {
			if (auth.isAuthenticated()) {
				$location.path('/newsFeed');
			}

			$scope.login = function (user) {
				auth.loginUser(user)
					.then(function(loggedInUser){
						$location.path('/newsFeed');
					
					});
			};

			$scope.register = function (user) {
				auth.registerUser(user)
					.then(function (registeredUser) {
						$location.path('/newsFeed');
					
					});
			};
		}
	])


	.controller('NewsFeedCtrl', [
		'$scope',
		'feed',
		function ($scope, feed) {
			$scope.userLogged = "user logged";
			feed.latest()
				.then(function(latestFeed) {
					$scope.latestFeed = latestFeed.data;
				});
		}
	])


	.controller('FooterCtrl', [
		'$scope',
		function($scope){
			$scope.version = "0.1";
		}
	])


	.controller('TestCtrl', [
		'$scope',
		function($scope){
			$scope.test = "Test";
		}
	])
