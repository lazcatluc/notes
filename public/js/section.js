module.controller("ViewSectionController",
    function($scope, $http, $routeParams) {

        $scope.section = {title: $routeParams.name};

        var params = {params: {section:$routeParams.name}};

        var update = function() {
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
