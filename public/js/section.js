module.controller("ViewSectionController",
    function($scope, $http, $routeParams) {

        $scope.section = {title: $routeParams.name};

        var params = {params: {section:$routeParams.name}};

        $scope.add = function() {
            $http.post("/notes", {text: $scope.text, section: $scope.section.title})
                .success(update);
        };

        $scope.remove = function (noteId) {
            $http.delete("/notes", {params: {id:noteId}}).success(update);
        };

        var update = function() {
            $scope.text = "";
            $http.get("/notes", params)
                .success(function (notes) {
                    $scope.notes = notes;
                });
        };

        $scope.moveToTop = function (note) {
            $http.post("/top", note);
            update();
        };

        update();

    });
