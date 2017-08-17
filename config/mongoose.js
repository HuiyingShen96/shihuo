/**
 * Created by 晖莹 on 2017/3/14.
 */
var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    var db = mongoose.connect(config.db);

    require('../app/models/product.server.model');
    require('../app/models/tradeOrder.server.model');
    require('../app/models/user.server.model');

    return db;
}