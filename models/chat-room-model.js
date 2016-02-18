/**
 * Created by Dhian on 2/14/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Chat', {
    members: [Schema.Types.Mixed],
    creator: Schema.Types.Mixed,
    isGroup: { type: Boolean, default: false },
    groupName: String,
    messages: [{
        user: Schema.Types.Mixed,
        timestamp: Date,
        message: String,
        readBy: []
    }],
    lastUpdateTime: Date
});