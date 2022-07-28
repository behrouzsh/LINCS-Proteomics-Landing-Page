/**
 * Created by chojnasm on 11/9/15.
 * Modified by Behrouz on 8/22/16.
 */
var app = angular.module('plpApplication', ['ngRoute','ngTagsInput','ngTable','plpModule']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
    //when('/network-view', {templateUrl: 'partials/assay-view.html',   controller: 'MainCtrl' }).
    when('/download', {templateUrl: 'partials/download.html',
        controller: 'NavigationCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl' }).
    when('/error', {templateUrl: 'partials/lincserror.html',
        controller: 'NavigationCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl' }).
    when('/assays', {templateUrl: 'partials/assays.html',
        controller: 'NavigationCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl' }).
    when('/glossary', {templateUrl: 'partials/glossary.html',
        controller: 'GlossaryCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl' }).
    when('/tools', {templateUrl: 'partials/tools.html',
        controller: 'ToolsCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl' }).
    when('/explore', {templateUrl: 'partials/explore.html',
        reloadOnSearch: false,
        controller: 'assayViewCtrl',
        controllerAs: 'ctrl'}).
    when('/about', {templateUrl: 'partials/about.html',
        reloadOnSearch: false,
        controller: 'NavigationCtrl',
        controllerAs: 'ctrl'}).
    when('/about-with-two-tabs', {templateUrl: 'partials/about-with-two-tabs.html',
        reloadOnSearch: false,
        controller: 'NavigationCtrl',
        controllerAs: 'ctrl'}).
    when('/lincsproteomics', {templateUrl: 'partials/lincsproteomics.html',
        reloadOnSearch: false,
        controller: 'NavigationCtrl',
        controllerAs: 'ctrl'}).
    when('/', {templateUrl: 'partials/lincsproteomics.html',
        reloadOnSearch: false,
        controller: 'NavigationCtrl',
        controllerAs: 'ctrl'}).
    otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
    //$locationProvider.html5Mode({
        //enabled: true,
        //requireBase: false
    //});
}]);

