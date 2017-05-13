/**
 * Created by 晖莹 on 2017/4/26.
 */
var users = require('../controllers/user.server.controller.js'),
    tipOff = require('../controllers/tipOff.server.controller');

module.exports = function (app) {
    app.route('/api/tipOff')
        .get(tipOff.query)
        .post(users.requiresLogin, tipOff.create);

    app.route('/api/tipOff/:productId')
        .get(tipOff.read)
        .put(users.requiresLogin, tipOff.hasAuthentication, tipOff.update)
        .delete(users.requiresLogin, tipOff.hasAuthentication, tipOff.delete);

    app.param('productId', tipOff.productByID);
}