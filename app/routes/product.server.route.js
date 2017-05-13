/**
 * Created by 晖莹 on 2017/5/1.
 */
var users = require('../controllers/user.server.controller'),
    product = require('../controllers/product.server.controller');

module.exports = function (app) {
    app.route('/api/product')
        .post(users.requiresLogin, product.create)
        .get(product.query);

    app.route('/api/product/:productId')
        .get(product.read)
        .put(users.requiresLogin, product.update)
        .delete(users.requiresLogin, product.hasAuthentication, product.delete);

    app.param('productId', product.productByID);
}