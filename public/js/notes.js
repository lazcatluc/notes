module.controller('NotesController',
    function($scope, $http, $routeParams, $location) {
        $scope.notes = [];

        if ($routeParams.section) {
            $scope.activeSection = {title: $routeParams.section};
        }

        var update = function() {
            $location.path($scope.activeSection?$scope.activeSection.title:'/');
        };

        $scope.add = function() {
            $http.post("/notes", {text: $scope.text, section: $scope.activeSection.title})
                .success(update);
        };
        
        $scope.remove = function (noteId) {
            $http.delete("/notes", {params: {id:noteId}}).success(update);
        };

        var readSections = function() {
            $http.get("/sections")
                .success(function(sections) {
                    $scope.sections = sections;
                    $scope.activeSection = $scope.activeSection||sections[0];
                });
        };

        $scope.showSection = function(section) {
            $location.path(section.title);
        };

        $scope.writeSections = function() {
            $http.post("/sections/replace", $scope.sections).success(update);
        };

        $scope.removeSection = function(section) {
            var sections = [];
            angular.forEach($scope.sections, function(oldSection){
                if (oldSection.title !== section.title) {
                    sections.push(oldSection);
                }
            });
            $scope.sections = sections;
            if ($scope.activeSection.title === section.title) {
                $scope.activeSection = $scope.sections[0];
            }
            $scope.writeSections();
        }

        $scope.addSection = function() {
            if ($scope.newSection.length==0) return;

            // check for duplicates
            for (var i=0;i<$scope.sections.length;i++) {
                if ($scope.sections[i].title==$scope.newSection) {
                    return;
                }
            }

            var section = {title: $scope.newSection};
            $scope.sections.unshift(section);
            $scope.activeSection = section;
            $scope.newSection = "";
            $scope.writeSections();
        }

        readSections();
    });
