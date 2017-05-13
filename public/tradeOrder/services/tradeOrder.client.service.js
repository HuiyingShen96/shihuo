/**
 * Created by 晖莹 on 2017/5/1.
 */
angular.module('tradeOrder').factory('TradeOrder', ['$resource', function ($resource) {
    return $resource('api/tradeOrder/:tradeOrderId', {
        tradeOrderId: '@_id'
    },{
        update: {method: 'PUT'}
    });
}]);