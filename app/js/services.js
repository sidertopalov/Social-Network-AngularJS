'use strict';

angular.module('socialNetwork.services', [])


	.factory('auth', [ 
		'$http',
		'$cookies',
		'$q',
		'$location',
		'identity',
		'BASE_URL',
		function ($http, $cookies, $q, $location, identity, BASE_URL) {

			var AUTHENTICATION_COOKIE_KEY = '!_Authentication_Cookie_Key_!';

			function preserveUserData(data) {
				var accessToken = data.access_token;
				$http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
				$cookies.put(AUTHENTICATION_COOKIE_KEY, accessToken);
			}

			function loginUser (user) {
				var deferred = $q.defer();

				$http.post(BASE_URL + '/Users/Login', user)
					.then(function (response) {// success
						preserveUserData(response.data);

						identity.requestUserProfile()
							.then(function (){
								deferred.resolve(response.data);
							});

					});

				return deferred.promise;
			}

			function registerUser (user) {
				var deferred = $q.defer();

				$http.post(BASE_URL + '/Users/Register', user)
					.then(function (response) {// success
						preserveUserData(response.data);

						identity.requestUserProfile()
							.then(function (){
								deferred.resolve(response.data);
							});

					});

				return deferred.promise;
			}

			function isAuthenticated() {
				return !!$cookies.get(AUTHENTICATION_COOKIE_KEY);
			}

			function refreshCookie() {
				if (isAuthenticated()) {
					$http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get(AUTHENTICATION_COOKIE_KEY);
					identity.requestUserProfile();
				}
			}

			function logout () {
				$cookies.remove(AUTHENTICATION_COOKIE_KEY);
				$http.defaults.headers.common.Authorization = undefined;
				identity.removeUserProfile();
				$location.path('/');
			}

			return {
				loginUser: loginUser,
				registerUser: registerUser,
				isAuthenticated: isAuthenticated,
				refreshCookie: refreshCookie,
				logout: logout
			}
		}
	])


	.factory('identity', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {

			var deferred = $q.defer();

			var currentUser = undefined;

			return {
				getCurrentUser: function () {

					if (currentUser) {
						return $q.when(currentUser);
					} else {
						return deferred.promise;
					}
				},
				removeUserProfile: function () {
					currentUser = undefined;
				},
				requestUserProfile: function () {
					var userProfileDeferred = $q.defer();
					$http.get(BASE_URL + '/me')
						.then(function(response) {
							currentUser = response.data;
							deferred.resolve(currentUser);
							userProfileDeferred.resolve();
						});
					return userProfileDeferred.promise;
				}
			};
		}
	])


	.factory('feed', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL){

			function latest(pageSize) {
				var deferred = $q.defer();
				pageSize = pageSize || 10;

				$http.get(BASE_URL + '/me/feed?pageSize=' + pageSize)
					.then(function (feed) {
						deferred.resolve(feed);
					});

				return deferred.promise;
			}

			return {
				latest: latest
			}
		}
	])

