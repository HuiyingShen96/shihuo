/**
 * Created by 晖莹 on 2017/5/1.
 */
var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    fs = require('fs'),
    formidable = require('formidable'),
    path = require('path');

// 错误处理函数方法
var getErrorMessage = function (err) {
    if(err.errors) {
        for (var errName in err.errors) {
            if(err.errors[errName].message) {
                return err.errors[errName].message;
            }
        }
    }else {
        return '未知的服务端错误';
    }
};

// create()方法
// 添加新product（包括上传图片）
exports.create = function (req, res) {
    var upImageDir = path.resolve(__dirname, '../../public/img/products/') + '/';
    fs.existsSync(upImageDir) || fs.mkdirSync(upImageDir);
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = upImageDir;
    form.keepExtensions = true;
    form.maxFieldsSize = 3 * 1024 * 1024;

    var product = new Product();

    form.parse(req, function (err, fields, files) {
        if(files) {
            product.creator = req.user;
            product.offer_or_get = fields.offer_or_get;
            product.name = fields.name;
            product.status = fields.status;
            product.category = fields.category;
            product.price = fields.price;
            product.details = fields.details;
            product.way = fields.way;
            product.exchange_or_not = fields.exchange_or_not;
            product.exchange_condition = fields.exchange_condition;
        }
        product.image_url = 'img/bg.jpg';

        if(err) {
            res.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: '来自product.server.controller.js的报错！',
            };
            return res.redirect(303, '/error')
        }
        for (var key in files) {
            var extName = ''; //后缀名
            switch (key.type) {
                case 'image/pjpeg':
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                case 'image/x-png':
                default:
                    extName = 'png';
                    break;
            }
            var productName = (new Date()).getTime() + '.' + extName;
            var newPath = form.uploadDir + productName;

            fs.renameSync(files[key].path, newPath); // 重命名
            product.image_url = "/img/products/" + productName;
        }

        product.save(function (err) {
            if(err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }else {
                req.flash = {
                    type: 'success',
                    intro: 'Good luck!',
                    message: 'YOU have been entered into the contest.（来自product.server.controller.js）'
                }
                return res.json(product);
            }
        })
    })
}

// query()方法
exports.query = function (req, res) {
    var params = JSON.parse(req.query.queryParams);
    var page = new Number(req.query.page);
    var pageSize  = new Number(req.query.pageSize);
    // if(params.name){
    //     params.name = new RegExp(params.name, 'g');
    // }
    console.log(params)
    Product.find(params) // 使用Mongoose的find()函数，获取了product集合的符合req.query条件的文档
    // 在查询过程中使用排序，获取的文档按照created进行排序
    // 还使用了populate()方法将user对象中的username属性填充到了product对象的creator属性中
        .sort('-created')
        .skip((page-1) * pageSize) // 分页查询1
        .limit(pageSize)          // 分页查询2
        .populate('creator', 'username')
        .exec(function (err, products) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }else {
                res.json(products);
            }
        });
};

// 中间件函数
exports.productByID = function (req, res, next, id) {
    console.log('product：productByID中间件');
    Product.findById(id).populate('creator', 'username') // 中间件通过id参数来查找product对象
        .exec(function (err, product) {
            if(err) {
                return next(err);
            }
            if (!product) {
                return next(new Error('Failed to load product ' + id));
            }
            req.product = product; // 将检索到的product对象添加到请求对象中
            next();
        })
};

// read()方法
exports.read = function (req, res) { // 用于返回product对象
    res.json(req.product);
};

// update()方法
exports.update = function (req, res) {
    console.log('product update');
    var product = req.product;

    product.name = req.body.name;
    product.status = req.body.status;
    product.category = req.body.category;
    product.price = req.body.price;
    product.details = req.body.details;
    product.way = req.body.way;
    product.exchange_or_not = req.body.exchange_or_not;
    product.exchange_condition = req.body.exchange_condition;

    product.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }else {
            res.json(product);
        }
    })
};

// delete()方法
exports.delete = function (req, res) {
    // todo: 删除相应的图片文件
    var product = req.product;
    product.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        } else {
            res.json(product);
        }
    });
};

// 实现授权中间件（update()和delete()方法都有使用限制，只有创建者可以调用）
// 检查编辑者是否的确是文档的创建者
exports.hasAuthentication = function (req, res, next) {
    console.log('product：授权中间件');
    if (req.product.creator.id !== req.user.id) {
        return res.status(403).send({
            message: '用户未获得授权'
        })
    }
    next();
};

// 旧的create()方法

// create()方法
// exports.create = function (req, res) {
//     var product = new Product(req.body); // 创建模型实例
//     product.creator = req.user; // 将经过Passport身份验证的当前用户设置为product的creator
//
//     product.save(function (err) { // 调用Mongoose模型实例的save()方法保存product文档
//         if(err) {
//             return res.status(400).send({
//                 message: getErrorMessage(err)
//             });
//         }else {
//             res.json(product); // 将product对象转换为JSON作为响应返回
//         }
//     })
// };