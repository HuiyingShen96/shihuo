/**
 * Created by 晖莹 on 2017/3/21.
 */
var mainApplicationModuleName = 'mean';
var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngResource','ngRoute','user','product','tradeOrder']);

mainApplicationModule.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');
}])

angular.element(document).ready(function() {
    angular.bootstrap(document, [mainApplicationModuleName]);
});