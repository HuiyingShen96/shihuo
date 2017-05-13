/**
 * Created by 晖莹 on 2017/3/14.
 */
var users = require('../controllers/user.server.controller.js'),
    passport = require('passport');

module.exports = function (app) {
    app.param('userById', users.userById);

    app.route('/api/user/:userId')
        .get(users.requiresLogin, users.read) // 获取用户信息
        .put(users.requiresLogin, users.update) // 修改用户信息
        .delete(users.requiresLogin, users.delete); // 删除用户

    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);

    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local',{
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
        }));
    app.get('/signout', users.signout);
};