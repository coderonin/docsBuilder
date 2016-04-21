(function(){
	var app = angular.module("docsBuilder.web", ['ui.router', 'ui.bootstrap', 'ngAnimate','RecursionHelper','TreeWidget']);
	
	function DocsNavigationController($sce, $scope){
		var me = this;
		me.searchValues = window.autoComplete;
		me.menuData = window.docsData;
		me.menuOpen = true;
		me.tabMaps = {};
		me.doctabs = [{
    		id: "home",
    		title: "Home",
    		contentUrl: "mds/home.html"
    	}];
		me.activeNavigationTabIndex = 0;

		me.menuOptions = {
			showIcon: true,
			expandOnClick: true
		};

		me.searchValues.forEach(function(item){
			item.value = $sce.trustAsHtml(item.value);
		});

		me.selectTab = function(tabId){
			me.activeNavigationTabIndex = me.tabMaps[tabId] || 0;
		};

		me.closeTab = function(e, tabId){
			e.preventDefault();
			e.stopPropagation();

			if(me.tabMaps[tabId] == me.activeNavigationTabIndex){
				var prevIndex = me.tabMaps[tabId] - 1;
				 me.activeNavigationTabIndex = prevIndex >= 0 ? prevIndex : 0;
			}else if(me.tabMaps[tabId] < me.activeNavigationTabIndex){
				me.activeNavigationTabIndex--;
			}

			me.doctabs.splice(me.tabMaps[tabId], 1);

			me.tabMaps = {};
			angular.forEach(me.doctabs, function(tab, index){
		    	me.tabMaps[tab.id] = index;
		    });
		};

		$scope.$on('selection-changed', function (e, node) {
			if(node.children && node.children.length && !node.singleton){
				node.selected = false;
				return;
			}

		    if(me.tabMaps[node.id] == null){
		    	me.tabMaps[node.id] = me.doctabs.length;
		    	me.doctabs.push({
		    		id: node.id,
		    		title: node.name,
		    		contentUrl: "mds/" + node.url + ".html"
		    	});
		    }
			me.activeNavigationTabIndex = me.tabMaps[node.id];
		});

		$scope.$on('expanded-state-changed', function (e, node) {
			if(!node.singleton){
		    	node.image = node.expanded ?
		    		"css/img/folder-open.png":
		    		"css/img/folder-closed.png";
		    }
		    if(!node.expanded) node.selected = false;
		});

	}

	app.controller("DocsNavigationController", ['$sce', '$scope', DocsNavigationController]);

	function DocumentContentController($sce, $scope, $timeout){
		var me = this;

		me.initAutoComplete = function(data){
			console.log(data);
		};
	}

	app.controller("DocumentContentController", ['$sce', '$scope', '$timeout', DocumentContentController]);

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