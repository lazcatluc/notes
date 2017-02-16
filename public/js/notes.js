module.controller('NotesController',
    function($scope, $rootScope, $http, $routeParams, $location) {
        $scope.notes = [];

        if ($routeParams.section) {
            $scope.myActiveSession = {title: $routeParams.section};
        }

        $scope.activeSection = function() {
            $scope.myActiveSession = $scope.myActiveSession||$rootScope.sections[0];
            return $scope.myActiveSession;
        };

        $scope.showSection = function(section) {
            if (section === undefined) {
                section = $scope.activeSection();
            }
            $location.path(section.title);
        };

        $scope.writeSections = function() {
            $http.post("/sections/replace", $rootScope.sections).success($scope.showSection);
        };

        $scope.removeSection = function(section) {
            var sections = [];
            angular.forEach($rootScope.sections, function(oldSection){
                if (oldSection.title !== section.title) {
                    sections.push(oldSection);
                }
            });
            $rootScope.sections = sections;
            if ($scope.activeSection().title === section.title) {
                $scope.myActiveSession = $rootScope.sections[0];
            }
            $scope.writeSections();
        }

        $scope.addSection = function() {
            if ($scope.newSection.length==0) return;

            // check for duplicates
            for (var i=0;i<$rootScope.sections.length;i++) {
                if ($rootScope.sections[i].title==$scope.newSection) {
                    return;
                }
            }

            var section = {title: $scope.newSection};
            $rootScope.sections.unshift(section);
            $scope.myActiveSession = section;
            $scope.newSection = "";
            $scope.writeSections();
        }
    });
