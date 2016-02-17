/**
 * Created by Dhian on 2/14/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Chat', {
    members: [Schema.Types.Mixed],
    messages: [{
        user: Schema.Types.Mixed,
        timestamp: Date,
        message: String,
        readBy: []
    }],
    lastUpdateTime: Date
});