/**
 * Created by 晖莹 on 2017/3/28.
 */
angular.module('user').factory('Authentication', [
    function () {
        this.user = window.user;
        return {
            user: this.user
        }
    }
])