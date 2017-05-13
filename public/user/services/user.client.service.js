/**
 * Created by 晖莹 on 2017/4/2.
 */
angular.module('user').factory('User', ['$resource', function ($resource) {
    return $resource('api/user/:userId', {
        userId: '@_id'
    },{
        update: {method: 'PUT'}
    });
}]);