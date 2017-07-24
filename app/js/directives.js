'use strict';

angular.module('socialNetwork.directives', [])

	.directive('footer' , function(){
		return {
			restrict: 'A',
			templateUrl: 'templates/common/footer.html'
		};
	})
