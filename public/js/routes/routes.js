var module = angular.module('myapp', ['dndLists', 'ngRoute']);
module.config(
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'part/notes.html',
            controller: 'NotesController'
        }).otherwise({
            redirectTo: '/'
        });
    });
