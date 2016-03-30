(function(){
	var app = angular.module("docsBuilder.web", ['ui.router', 'ui.bootstrap']);
	
	function DocsNavigationController($sce){
		var me = this;
		me.searchValues = window.autoComplete;

		me.searchValues.forEach(function(item){
			item.value = $sce.trustAsHtml(item.value);
		});
	}

	app.controller("DocsNavigationController", ['$sce', DocsNavigationController]);

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/'
		});
	}])
	.config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode({
			requireBase: false
		});
	}]);

	angular.bootstrap(document, ["docsBuilder.web"]);
})();