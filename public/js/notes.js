var module = angular.module('myapp', []);
module.controller('NotesController',
    function($scope, $http) {
        $scope.notes = [];

        var update = function() {
            $http.get("/notes")
                .success(function(notes) {
                    $scope.notes = notes;
                });
        };

        $scope.add = function() {
            $http.post("/notes", {text: $scope.text})
                .success(function() {
                    $scope.text = "";
                    update();
                });
        };
        
        $scope.remove = function (noteId) {
            $http.delete("/notes", {params: {id:noteId}});
            update();
        };

        update();
    });
