/**
 * Created by 晖莹 on 2017/3/14.
 */
exports.render = function(req, res) {
    res.render('index',{
        title: '拾货',
        user: JSON.stringify(req.user)
    })
};