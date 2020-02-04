var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    _id: { type: String, required: true },
    current_price: {
        value: { type: Number, required: true },
        currency_code: { type: String, required: true }
    }
})

module.exports = mongoose.model('Product', ProductSchema);

