/**
 * Created by 晖莹 on 2017/4/2.
 */
angular.module('user').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/user/:userId',{
            templateUrl: 'user/views/view-user.client.view.html'
        })
        .when('/user/:userId/edit',{
            templateUrl: 'user/views/edit-user.client.view.html'
        })

        .otherwise({
            redirectTo: '/products/offer'
        });
}]);