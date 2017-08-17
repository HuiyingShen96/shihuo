/**
 * Created by 晖莹 on 2017/5/1.
 */
angular.module('product')
    .controller('ProductController', ['$scope', '$routeParams', '$location', '$http', '$filter', 'Authentication', 'Product',
        // ProductsController使用了四个注入服务：
        // $routeParams： 由ngRoute模块提供，存储了后面要定义的AngularJS路由的路由参数
        // $location：用于控制应用的导航
        // Authentication：该服务创建于public/user/services/authentication.client.service.js，用于提供用户身份验证信息
        // Product：该服务创建于public/product/services/product.client.service.js，用于提供一系列用于同REST风格后端通信的方法
        function ($scope, $routeParams, $location, $http, $filter, Authentication, Product) {
            $scope.params = {
                queryParams: {
                    status: '上架',
                    offer_or_get: $routeParams.offer_or_get,
                },
                page: 1,
                pageSize: 200,
            };
            $scope.allChecked = true;
            $scope.selectAll = function (all) {
                for(var i=0;i<$scope._productList.length;i++){
                    if(all===true){
                        $scope._productList[i].state=true;
                    }else {
                        $scope._productList[i].state=false;
                    }
                }
            };
            $scope.filter = {};
            // search()方法
            $scope.search = function () {
                var filter = {};
                if($scope.filter.name && $scope.filter.name != '') {
                    filter.name = $scope.filter.name;
                }
                if($scope.filter.category && $scope.filter.category != '') {
                    filter.category = $scope.filter.category;
                }
                $scope.productList = $filter('filter')($scope._productList, filter);
            };

            $scope.authentication = Authentication; // 将Authentication服务绑定到控制器的$scope上，这样才能在视图中使用它

            $scope.renderCreate = function () {
                console.log(Authentication.user)
                if(Authentication.user) {
                    $location.path('products/create');
                }else {
                    alert('请先登录')
                }
            };

            //以下实现控制器的增删改查方法

            // create()方法
            $scope.create = function () {
                var data = new FormData($('#create_product')[0]);
                if(!$('[name="image"]').val()){ // 如果没有上传图片
                    data.delete('image');
                }

                Product.post(
                    {},
                    data,
                    function (res) {
                        $location.path('products/' + res.offer_or_get + '/' + res._id);
                    },
                    function (errRes) {
                        console.log(errRes)
                        console.log('err!!')
                    }
                )
            };

            // find() 和 findOne() 方法
            // 查找符合条件params的product列表
            $scope.find = function () {
                if($routeParams.username) {
                    delete $scope.params.queryParams.status;
                }
                Product.query($scope.params, function (data) {
                    $scope._productList = data; // 不能修改的物品列表
                    $scope.productList = data; // 页面上的物品列表（查询的时候会改变）
                });
            };
            // 根据路由参数productId来检索单个product
            $scope.findOne = function () {
                $scope.product = Product.get({
                    productId: $routeParams.productId
                });
            };

            // update() 方法
            $scope.update = function () {
                $scope.product.$update(function () { // 使用了product资源的$update()方法将修改后的product对象发送给后端REST接口
                    console.log('update callback')
                    // 请求服务器成功后的回调
                    $location.path('products/' + $scope.product.offer_or_get + '/' + $scope.product._id);
                }, function (errRes) {
                    // 请求服务器失败后的回调
                    $scope.error = errRes.data.message;
                });
            };

            // delete() 方法
            $scope.delete = function (product) {
                if(product) {
                    product.$remove(function () {
                        // 在列表中执行“删除”
                        for (var i in $scope._productList) {
                            if($scope._productList[i] === product) {
                                $scope._productList.splice(i, 1);
                            }
                        }
                    });
                }else {
                    // 在查看详情中执行“删除”
                    $scope.product.$remove(function () {
                        $location.path('user/' + Authentication.user.username +'/'+$scope.product.offer_or_get);
                        // TODO: 这里应该导航到其它页面，比如“我的求购物品”页面
                    })
                }
            }
        }])