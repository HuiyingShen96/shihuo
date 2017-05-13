/**
 * Created by 晖莹 on 2017/3/14.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { //必需，唯一
        type: String,
        trim: true,
        require: true,
        unique: [true, '用户名为必填项'],
    },
    password: { // 必需
        type: String,
        required: [true, '密码为必填项'],
        validate: [
            function(pw){
                return pw && pw.length > 6;
            },
            '密码长度应不低于6位'
        ]
    },
    mobile: {
        type: String,
        required: [true, '手机号码为必填项'],
        match: /\d{11}/ //手机号码的简单验证，11位
    },
    address: {
        type: String,
    },
    Wechat_ID: {
        type: String,
    },
    QQ_ID: {
        type: String,
    },
    regTime: {
        type: Date,
        default: Date.now
    },
    salt: { // 对密码进行哈希
        type: String
    },
    provider: { // 用于标明注册用户时所采用的Passport策略类型
        type: String,
        required: 'Provider is required'
    },
    providerId: String, // 用于标明身份验证策略的用户标识符
    providerData: {}, // 用于存储从OAuth提供方获取的用户信息
});

// 预存储处理中间件，用以执行对用户密码的哈希操作
UserSchema.pre('save', function(next) {
    if (this.password) {
        // 使用伪随机方法生成一个salt
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password); // 对原密码执行哈希操作
    }
    next();
});
// 实例方法，通过使用Node.js的crypto模块来执行用户密码的哈希操作
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};
// 实例方法，将接收的参数字符串的哈希结果与数据库中存储的用户密码哈希值进行对比
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};
// 静态方法，用于为新用户确定一个唯一可用的用户名
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};
// UserSchema.set('toJSON', {
//     getters: true, // 使用getter修饰符时需要使用
//     virtuals: true // 使用虚拟属性时需要使用
// });

mongoose.model('User', UserSchema);