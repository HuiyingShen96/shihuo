/**
 * Created by 晖莹 on 2017/5/2.
 */
angular.module('tradeOrder').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/tradeOrder/:username',{
            templateUrl: 'tradeOrder/views/my-tradeOrder.client.view.html'
        })
        .when('/tradeOrder/:username/:tradeOrderId',{
            templateUrl: 'tradeOrder/views/view-tradeOrder.client.view.html'
        })
        .otherwise({
            redirectTo: '/products/offer'
        });
}]);