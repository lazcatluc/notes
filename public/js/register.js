module.controller('RegistrationController', function($scope, $http, $location, $rootScope) {
    $scope.user = {};

    $scope.submitForm = function() {
        console.log("Posting user: "+$scope.user);
        $http.post("/users", $scope.user).success(function(data) {
            $rootScope.user = $scope.user;
            $location.path('/');
        }, function(error) {
            $scope.error = error;
        });
    };
});

module.directive('uniqueUser', function($http, $timeout) {
    var timer;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngModel, function(value) {
                if (timer) $timeout.cancel(timer);
                timer = $timeout(function(){
                    $http.get('/users?username='+value)
                        .success(function(result) {
                            ctrl.$setValidity('unique', false);
                        }).error(function(result) {
                            ctrl.$setValidity('unique', true);
                        });
                }, 200);
            });
        }
    }
});
;