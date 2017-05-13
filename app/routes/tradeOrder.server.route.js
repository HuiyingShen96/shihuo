/**
 * Created by 晖莹 on 2017/4/26.
 */
var users = require('../controllers/user.server.controller'),
    tradeOrder = require('../controllers/tradeOrder.server.controller');

module.exports = function (app) {
    app.route('/api/tradeOrder')
        .post(users.requiresLogin, tradeOrder.create)
        .get(tradeOrder.query);

    app.route('/api/tradeOrder/:tradeOrderId')
        .get(tradeOrder.read)
        .put(users.requiresLogin, tradeOrder.userIdentify, tradeOrder.update)
        .delete(users.requiresLogin, tradeOrder.userIdentify, tradeOrder.delete);

    app.param('tradeOrderId', tradeOrder.tradeOrderByID);
}