/**
 * Created by 晖莹 on 2017/5/1.
 */
angular.module('tradeOrder')
    .controller('TradeOrderController', ['$scope', '$routeParams', '$location', '$filter', 'Authentication', 'TradeOrder', 'Product',
        // TradeOrderController使用了四个注入服务：
        // $routeParams： 由ngRoute模块提供，存储了后面要定义的AngularJS路由的路由参数
        // $location：用于控制应用的导航
        // Authentication：该服务创建于public/user/services/authentication.client.service.js，用于提供用户身份验证信息
        // TradeOrder：该服务创建于public/tradeOrder/services/tradeOrder.client.service.js，用于提供一系列用于同REST风格后端通信的方法
        function ($scope, $routeParams, $location, $filter, Authentication, TradeOrder, Product) {
            $scope.authentication = Authentication; // 将Authentication服务绑定到控制器的$scope上，这样才能在视图中使用它
            $scope.params = {
                queryParams: {

                },
                page: 1,
                pageSize: 200,
            };
            $scope.filter = {};
            $scope.newsCtrl = function () {
                TradeOrder.query({}, function (data) {
                    $scope.news = $filter('filter')(data, {status:'pending'});
                    $scope.news = $scope.news.concat($filter('filter')(data, {status:'agree',creator:{_id:Authentication.user._id}}));
                });
            }

            //以下实现控制器的增删改查方法
            // create()方法
            $scope.create = function () {
                if(Authentication.user) {

                }else{
                    $scope.error = '登录后才能进行交易';
                    console.log($scope.error);
                    return;
                }
                if($scope.product.creator._id == Authentication.user._id) {
                    $scope.error = '用户不得与自己的物品做交易';
                    console.log($scope.error);
                    return;
                }
                var tradeOrder = new TradeOrder({
                    receiver: $scope.product.creator._id,
                    status: 'pending',
                    offer_or_get: $scope.product.offer_or_get,
                    product: $scope.product._id,
                    creator_message: '未做该功能',
                })
                tradeOrder.$save(function (res) {
                    alert('交易订单已提交');
                }, function (errRes) {
                    $scope.error = errRes.data.message;
                })
            };

            // find() 和 findOne() 方法
            // 查找符合条件params的tradeOrder列表
            $scope.find = function () {
                console.log('find....................');
                TradeOrder.query({}, function (data) {
                    console.log('data', data);
                    $scope.tradeOrderList = data;
                });
            };
            // 根据路由参数tradeOrderId来检索单个tradeOrder
            $scope.findOne = function () {
                $scope.tradeOrder = TradeOrder.get({
                    tradeOrderId: $routeParams.tradeOrderId,
                }, function (data) {
                    console.log(data)
                })
            };

            // update() 方法
            $scope.update = function () {
                $scope.tradeOrder.$update(function () {
                    $location.path('/user/' + Authentication.user.username + '/tradeOrder');
                }, function (errRes) {
                    $scope.error = errRes.data.message;
                });
            };

            // 是否同意交易
            $scope.agreeTrade = function (tradeOrder, isAgree) {
                console.log(Authentication.user);
                console.log(tradeOrder);
                console.log(tradeOrder.creator);
                console.log(tradeOrder.receiver);
                tradeOrder.status = isAgree ? 'agree' : 'cancel';
                tradeOrder.$update(function (data) {
                    console.log(data)
                })
            };
            // 发起方确认交易（交易结束）todo:交易结束后修改物品的状态为“下架”
            $scope.finishTrade = function (tradeOrder) {
                tradeOrder.status = 'finished';

                tradeOrder.$update(function (data) {
                    console.log(data);
                    var product = Product.get({
                        productId: data.product._id
                    });
                    console.log(product);
                    product.status = "已处理";
                    console.log('product: ', product);
                    product.update(function (data) {
                        console.log(data);
                    });
                })
            };

            // delete() 方法
            $scope.delete = function (tradeOrder) {
                if(tradeOrder) {
                    tradeOrder.$remove(function () {
                        // 在列表中执行“删除”
                        for (var i in $scope.tradeOrderList) {
                            if($scope.tradeOrderList[i] === tradeOrder) {
                                $scope.tradeOrderList.splice(i, 1);
                            }
                        }
                    });
                }else {
                    // 在查看详情中执行“删除”
                    $scope.tradeOrder.$remove(function () {
                        $location.path('/user/' + Authentication.user.username + '/tradeOrder');
                        // TODO: 这里应该导航到其它页面，比如“我的求购物品”页面
                    })
                }
            }
        }])