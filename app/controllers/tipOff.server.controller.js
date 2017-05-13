/**
 * Created by 晖莹 on 2017/4/26.
 */
var mongoose = require('mongoose'),
    TipOff = mongoose.model('TipOff');

// error handling function
var getErrorMessage = function (err) {
    if(err.errors) {
        for (var errName in err.errors) {
            if(err.errors[errName].message) {
                return err.errors[errName].message;
            }
        }
    }else {
        return 'Unknown server error';
    }
};

exports.create = function (req, res) {
    var tipOff = new TipOff(req.body);
    tipOff.creator = req.user;

    tipOff.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else {
            res.json(tipOff);
        }
    })
};

exports.list = function (req, res) {
    TipOff.find(req.query).sort('-created').populate('creator', 'username')
        .exec(function (err, tipOffs) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }else {
                res.json(tipOffs);
            }
        });
};

// find a tipOff by id
exports.tipOffByID = function (req, res, next, id) {
    TipOff.findById(id).populate('creator', 'username')
        .exec(function (err, tipOff) {
            if(err) {
                return next(err);
            }
            if (!tipOff) {
                return next(new Error('Failed to load tipOff ' + id));
            }
            req.tipOff = tipOff;
            next();
        })
};

exports.read = function (req, res) {
    res.json(req.tipOff);
};

exports.update = function (req, res) {
    var tipOff = req.tipOff;
    tipOff.status = req.body.status;//修改处理状态
    tipOff.result = req.body.result;//修改处理结果
    tipOff.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }else {
            res.json(tipOff);
        }
    })
};

exports.delete = function (req, res) {
    var tipOff = req.tipOff;

    tipOff.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        } else {
            res.json(tipOff);
        }
    });
};

// 对物品进行修改、删除操作前，需要验证物品的creator与当前的操作用户是否为同一个人
exports.hasAuthentication = function (req, res, next) {
    if (req.user.authority) {
        return res.status(403).send({
            message: '用户未获得授权'
        })
    }
    next();
};