/**
 * Created by 晖莹 on 2017/4/25.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
    created: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    offer_or_get: {
        type: String, // [offer, get]
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    status: {
        type: String, // [上架, 下架, 已处理]
        default: 'offline'
    },
    category: {
        type: String,
    },
    image_url: {
        type: String
    },
    price: {
        type: Number,
    },
    details: {
        type: String,
    },
    way: {
        type: String, // [售卖,捐赠]
        require: true,
    },
    exchange_or_not:{
        type: Boolean, // [true, false]
        default: false,
    },
    exchange_condition:{
        type: String,
    }
});
mongoose.model('Product', ProductSchema);