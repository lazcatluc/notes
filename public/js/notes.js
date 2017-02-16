module.controller('NotesController',
    function($scope, $http) {
        $scope.notes = [];

        var update = function() {
            var params = {params:{section:$scope.activeSection.title}};
            $http.get("/notes", params)
                .success(function(notes) {
                    $scope.notes = notes;
                });
        };

        $scope.add = function() {
            $http.post("/notes", {text: $scope.text, section: $scope.activeSection.title})
                .success(function() {
                    $scope.text = "";
                    update();
                });
        };
        
        $scope.remove = function (noteId) {
            $http.delete("/notes", {params: {id:noteId}});
            update();
        };

        $scope.moveToTop = function (note) {
            $http.post("/top", note);
            update();
        };

        var readSections = function() {
            $http.get("/sections")
                .success(function(sections) {
                    $scope.sections = sections;
                    $scope.activeSection = $scope.activeSection||sections[0];
                    update();
                });
        };

        $scope.showSection = function(section) {
            $scope.activeSection = section;
            update();
        };

        $scope.writeSections = function() {
            $http.post("/sections/replace", $scope.sections);
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
            update();
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
            update();
        }


        readSections();
    });
