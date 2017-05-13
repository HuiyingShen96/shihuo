/**
 * Created by 晖莹 on 2017/5/1.
 */
angular.module('product').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/products/create', { // 发布新物品（出售/求购）
            templateUrl: 'product/views/create-product.client.view.html'
        })
        .when('/products/:offer_or_get', { // 物品列表
            templateUrl: 'product/views/list-product.client.view.html'
        })
        .when('/products/:offer_or_get/:productId', { // 物品详情
            templateUrl: 'product/views/view-product.client.view.html'
        })
        .when('/products/:offer_or_get/:productId/edit', { // 修改物品
            templateUrl: 'product/views/edit-product.client.view.html'
        })
        .when('/user/:username/:offer_or_get', { // 我的物品
            templateUrl: 'product/views/my-product.client.view.html'
        })

        .otherwise({ // 其他错误url
            redirectTo: '/products/offer'
        });
}]);