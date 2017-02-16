var module = angular.module('myapp', ['dndLists', 'ngRoute']);
module.config(
    function($routeProvider) {
        $routeProvider.when('/:section?', {
            templateUrl: 'part/notes.html',
            controller: 'NotesController'
        }).when('/sections/:name', {
            templateUrl: 'part/section.html',
            controller: 'ViewSectionController'
        }).otherwise({
            redirectTo: '/'
        });
    });
