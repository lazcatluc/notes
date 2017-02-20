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

        $scope.signin = function() {
            console.log("Signing in "+$scope.username);
            var user = {username: $scope.username, password: $scope.password};
            $http.post('/users/current', user).success(function(user){
                $rootScope.user = user;
                $location.path('/');
            }).error(function(error) {
                alert(error.error);
            });
        };

        $scope.logout = function() {
            $http.delete('/users/current').success(function() {
                $rootScope.user = undefined;
                $location.path('/');
            });
        };

        $http.get('/users/current').success(function(user) {
            $rootScope.user = user;
            console.log("Found user " + user);
        });
    });