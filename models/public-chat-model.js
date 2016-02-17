/**
 * Created by Dhian on 2/17/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('PublicChat', {
    user: Schema.Types.Mixed,
    timestamp: Date,
    message: String
});