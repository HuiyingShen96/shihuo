/**
 * Created by 晖莹 on 2017/3/14.
 */
module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};