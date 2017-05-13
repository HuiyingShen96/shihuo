/**
 * Created by 晖莹 on 2017/5/1.
 */
angular.module('product').factory('Product', ['$resource', function ($resource) {
    return $resource('api/product/:productId', // 后端资源的基础URL
        {
            productId: '@_id'// 指定文档_id字段为值的路由参数
        },
        {
            update: {method: 'PUT'}, // 一个通过使用update()方法对资源方法进行扩展的动作参数
            post: {
                method:'POST',
                headers: {'Content-Type':undefined},
                transformRequest: angular.identity
            }
        }
    );
}])