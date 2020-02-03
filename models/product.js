var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    _id: String,
    current_price: {
        value: { type: Number },
        currency_code: { type: String }
    }
})

module.exports = mongoose.model('Product', ProductSchema);

