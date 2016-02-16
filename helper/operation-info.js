/**
 * Created by Dhian on 2/11/2016.
 */
var modelInfo = {
    success: false,
    validations: [],
    exception: {},
    dataResult: {}
};

var operationInfo = {
    success: function(doc){
        var info = modelInfo;
        info.success = true;
        info.result = doc;
        return info;
    },
    fail: function(err){
        var info = modelInfo;
        info.exception = err;
        return info;
    }
};

module.exports = operationInfo;