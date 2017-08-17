/**
 * Created by 晖莹 on 2017/3/22.
 */
angular.module('user')
    .controller('UserController', ['$scope', '$routeParams', '$location', 'Authentication', 'User',
        function ($scope, $routeParams, $location, Authentication, User) {
            $scope.authentication = Authentication;
            $scope.params = {

            };

            $scope.create = function () {
                console.log('create哈哈')
            };
            $scope.find = function () {
                $scope.userList = User.query($scope.params);
            };
            $scope.findOne = function () {
                console.log('findOne...')
                $scope.user = User.get({userId: $routeParams.userId}, function (data) {
                    console.log(data)
                });
            };
            $scope.update = function () {
                $scope.user.$update(function () { // 使用了user资源的$update()方法将修改后的product对象发送给后端REST接口
                    $location.path('user/' + $scope.user._id);
                }, function (errRes) {
                    $scope.error = errRes.data.message;
                });
            };

            // var getUser = function (userId) {
            //     return User.get({
            //         productId: userId
            //     });
            // };

            // 用户信息
            // $scope.getMyCount = function () {
            //     $scope.user = getUser($routeParams.userId);
            // }
            // $scope.updateMyCount = function () {
            //     $scope.user.$update(function () {
            //         $location.path('user/' + $scope.user._id);
            //     }, function (errResponse) {
            //         alert('修改失败！原因：' + errResponse.data.message);
            //         // $scope.error = errorResponse.data.message;
            //     });
            // }
}]);