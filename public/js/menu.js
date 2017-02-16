module.controller('MenuController',
    function($scope, $http, $location, $rootScope) {
        $http.get("/sections").success(function(sections) {
            $rootScope.sections = sections;
        });

        $scope.activeSections = function(){
            return $location.path().indexOf('/sections/') === -1;
        };

        $scope.active = function(section) {
            return $location.path().indexOf('/sections/' + section.title) > -1;
        };
    });