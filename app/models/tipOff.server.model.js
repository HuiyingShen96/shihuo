/**
 * Created by 晖莹 on 2017/4/25.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TipOffSchema = new Schema({
    created: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    tipOff_object: {// 举报对象 用户：user 出售物品：sellProduct 求购信息：seekProduct
        type: String,
    },
    reason: {
        type: String,
    },
    status: {
        type: String, // 待处理：pending 已处理：finished
        default: 'pending'
    },
    result: {
        type: String,
    }
});
mongoose.model('TipOff', TipOffSchema);