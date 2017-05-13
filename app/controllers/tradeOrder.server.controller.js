/**
 * Created by 晖莹 on 2017/4/26.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TradeOrder = mongoose.model('TradeOrder');

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

// create()方法
exports.create = function (req, res) {
    var tradeOrder = new TradeOrder(req.body);
    tradeOrder.creator = req.user;

    tradeOrder.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }else {
            res.json(tradeOrder);
        }
    })
};

// query()方法
exports.query = function (req, res) {
    var params = {  $or: [ { 'creator':req.user.id }, { 'receiver':req.user.id } ] };
    TradeOrder.find(params) // 使用Mongoose的find()函数，获取了tradeOrder集合的符合req.query条件的文档
    // 在查询过程中使用排序，获取的文档按照created进行排序
    // 还使用了populate()方法将user对象中的username属性填充到了product对象的creator属性中
    //     .or([{'creator.id':'59105c6476e2c20f44c41785'},{'receiver.id':'59105c6476e2c20f44c41785'}])
        .sort('-created')
        .populate('creator', 'username')
        .populate('receiver', 'username')
        .populate('product', 'name')
        .exec(function (err, orders) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }else {
                res.json(orders);
            }
        });
};

// 中间件函数
exports.tradeOrderByID = function (req, res, next, id) {
    console.log('TradeOrder：tradeOrderID中间件');
    TradeOrder.findById(id)
        .populate('creator', ['username','mobile', 'address', 'Wechat_ID', 'QQ_ID']) // 中间件通过id参数来查找tradeOrder对象
        .populate('receiver', ['username','mobile', 'address', 'Wechat_ID', 'QQ_ID'])
        .populate('product', ['name', 'image_url'])
        .exec(function (err, tradeOrder) {
            if(err) {
                return next(err);
            }
            if (!tradeOrder) {
                return next(new Error('Failed to load product ' + id));
            }
            req.tradeOrder = tradeOrder; // 将检索到的product对象添加到请求对象中
            next();
        })
};

// read()方法
exports.read = function (req, res) { // 用于返回tradeOrder对象
    res.json(req.tradeOrder);
};

// update()方法
exports.update = function (req, res) {
    console.log('tradeOrder update');
    var tradeOrder = req.tradeOrder;
    tradeOrder.status = req.body.status;//修改处理状态
    tradeOrder.creator_message = req.body.creator_message;
    tradeOrder.receiver_message = req.body.receiver_message;

    tradeOrder.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }else {
            res.json(tradeOrder);
        }
    })
};

// delete()方法
exports.delete = function (req, res) {
    var tradeOrder = req.tradeOrder;

    tradeOrder.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        } else {
            res.json(tradeOrder);
        }
    });
};

// 需要验证该用户是creator或receiver
exports.userIdentify = function (req, res, next) {
    //todo:
    var tradeOrder = req.body;
    if (tradeOrder.creator._id == req.user._id || tradeOrder.receiver._id == req.user._id) {

    }else{
        return res.status(403).send({
            message: '非交易订单的接收者或发送者不得更改订单内容'
        })
    }
    next();
};