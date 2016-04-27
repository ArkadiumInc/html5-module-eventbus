function CallbackBinding(callback, context) {
    "use strict";
    this._callback = callback;
    this._context = context;
}
module.exports = CallbackBinding;

CallbackBinding.prototype.destroy = function() {
    "use strict";
    this._callback = null;
    this._context = null;
}

CallbackBinding.prototype.execute = function(/*arguments*/) {
    "use strict";
    this._callback.apply(this._context, arguments);
}

CallbackBinding.prototype.equals = function(/*[otherCallback] | [callback, context]*/) {
    "use strict";
    var otherCallback = null;
    var otherContext = null;
    if(arguments.length === 2) {
        otherCallback = arguments[0];
        otherContext = arguments[1];
    } else {
        otherCallback = arguments[0]._callback;
        otherContext = arguments[0]._context;
    }
    return this._callback === otherCallback && this._context === otherContext;
}
