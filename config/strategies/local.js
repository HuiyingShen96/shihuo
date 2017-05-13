/**
 * Created by 晖莹 on 2017/3/14.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use( // 注册策略。这里的参数为本地策略的实例。
        new LocalStrategy(function(username, password, done) {
            User.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: '用户不存在'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: '密码错误'
                    });
                }
                return done(null, user);
            });
        })
    );
};