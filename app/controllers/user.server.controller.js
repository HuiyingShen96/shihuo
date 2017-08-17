/**
 * Created by 晖莹 on 2017/3/14.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

// error handling function
var getErrorMessage = function(err) {
    var message = '';
    if (err.code) { // MongoDB索引错误的错误代码
        switch (err.code) {
            case 11000:
            case 11001:
                message = '用户名已存在';
                break;
            default:
                message = 'Something went wrong';
        }
    } else if(err.errors) { // Mongoose检验错误的err.errors对象
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].
                message;
        }
    }else {
        message = 'Unknown server error';
    }
    return message;
};

exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: '用户登录',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};
exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: '用户注册',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};
exports.signup = function(req, res, next) {
    if (!req.user) {
        if(req.body.password != req.body.passwordAgain){
            var message = '两次输入的密码不一致';
            req.flash('error', message);
            return res.redirect('/signup');
        }
        var user = new User(req.body);
        user.provider = 'local';

        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

// 实现身份验证中间件（P151）验证是否已登录
exports.requiresLogin = function (req, res, next) {
    console.log('user：验证身份中间件')
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: '用户未登录！'
        })
    }
    next();
};
// 获取一个user对象
exports.userById = function (req, res, next, id) {
    console.log('user：userById中间件')
    User.findOne({
        _id: id
    }, function (err, user) {
        if(err) {
            return next(err);
        }else{
            req.user = user;
            next();
        }
    });
};
exports.read = function (req, res) {
    res.json(req.user);
};

// 更新已有user对象
exports.update = function (req, res) {
    User.findByIdAndUpdate(req.user._id, req.body, function (err, user) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        } else {
            res.json(user);
        }
    });
};
// 删除user对象（不应该？）
exports.delete = function (req, res) {
    var user = req.user;

    user.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        } else {
            res.json(user);
        }
    });
};


// // 创建新用户
// exports.create = function (req, res, next) {
//     var user = new User(req.body);
//     user.save(function (err) {
//         if (err) {
//             return next(err);
//         } else {
//             res.json(user);
//         }
//     });
// };
//
// // 查询用户列表
// exports.list = function (req, res, next) {
//     User.find({}, function (err, user) {
//         if (err) {
//             return next(err);
//         } else {
//             res.json(user);
//         }
//     });
// };
//
// // ??????
// exports.read = function (req, res) {
//     res.json(req.user);
// };
// // 获取一个user对象
// exports.userById = function (req, res, next, id) {
//     User.findOne({
//         _id: id
//     }, function (err, user) {
//         if(err) {
//             return next(err);
//         }else{
//             req.user = user;
//             next();
//         }
//     });
// };
//
// // 更新已有user对象
// exports.update = function (req, res, next) {
//     User.findByIdAndUpdate(req.user.id, req.body, function (err, user) {
//         if (err) {
//             return next(err);
//         } else {
//             res.json(user);
//         }
//     });
// };
//
// //删除已有user对象
// exports.delete = function (req, res, next) {
//     User.findByIdAndRemove(req.user.id, req.body, function (err, user) {
//         if(err) {
//             return next(err);
//         }else{
//             res.json(user);
//         }
//     });
//     // 另一种方式，效果一致
//     // req.user.remove(function (err) {
//     //     if(err) {
//     //         return next(err);
//     //     }else{
//     //         res.json(req.user);
//     //     }
//     // })
// }




