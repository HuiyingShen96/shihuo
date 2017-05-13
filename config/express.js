/**
 * Created by 晖莹 on 2017/3/14.
 */
var config = require('./config'),
    http = require('http'),
    socketio = require('socket.io'),
    express = require('express'),
    morgan = require('morgan'), // 提供简单的日志中间件
    compress = require('compression'), // 提供响应内容的压缩功能
    bodyParser = require('body-parser'), // 包含几个处理请求数据的中间件
    methodOverride = require('method-override'), // 提供了对HTTP DELETE和PUT两个遗留方法的支持
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');

module.exports = function() {
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);

    //Express应用配置
    if (process.env.NODE_ENV === 'development') {  // 对系统环境进行判定
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // 配置会话
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }))

    // 配置视图系统
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    // 注册Passport中间件
    app.use(passport.initialize()); // 启动
    app.use(passport.session()); // 追踪用户会话

    //添加路由
    require('../app/routes/index.server.route')(app);
    require('../app/routes/user.server.route')(app);
    require('../app/routes/product.server.route')(app);
    // require('../app/routes/tipOff.server.route')(app);
    require('../app/routes/tradeOrder.server.route')(app);

    //配置静态文件服务
    app.use(express.static('./public'));

    return server;
};