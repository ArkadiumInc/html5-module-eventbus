/**
 * Created by alexey.shmakov on 2/2/2016.
 */

function Signal() {
    'use strict';
    this._listeners = [
        /*
        {
            callback: function,
            context: object
        }
        */
    ];
}
module.exports = Signal;

Signal.prototype.addListener = function(callback, callbackContext) {
    'use strict';
    var listeners = this._listeners;
    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        if(binding.callback === callback && binding.context === callbackContext) {
            console.log('Attempt to add the same listener twice.');
            return; //already hooked, no-op
        }
    }

    listeners.push({
        callback: callback,
        context: callbackContext
    });
};

Signal.prototype.removeListener = function(callback, callbackContext) {
    'use strict';
    var removeAt = null;

    var listeners = this._listeners;
    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        if(binding.callback === callback && binding.context === callbackContext) {
            removeAt = i;
            break;
        }
    }

    if(removeAt === null) {
        console.log('Attempt to remove listener that was not added.');
    } else {
        listeners.splice(removeAt, 1);
    }
};

Signal.prototype.dispatch = function(/*...*/){
    'use strict';
    var listeners = this._listeners;
    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        var callback = binding.callback;
        var context = binding.context;
        callback.apply(context, arguments);
    }
};

Signal.prototype.destroy = function() { //removes all listeners
    var listeners = this._listeners;
    while(listeners.length) {
        var binding = listeners.pop();
        binding.callback = null;
        binding.context = null;
    }
};
