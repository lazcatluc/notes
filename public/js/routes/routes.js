var module = angular.module('myapp', ['dndLists', 'ngRoute']);
module.config(
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'part/notes.html',
            controller: 'NotesController'
        }).when('/section/:name', {
            templateUrl: 'part/section.html',
            controller: 'ViewSectionController'
        }).otherwise({
            redirectTo: '/'
        });
    });
