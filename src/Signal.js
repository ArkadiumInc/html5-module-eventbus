/**
 * Created by alexey.shmakov on 2/2/2016.
 */

var CallbackBinding = require('./CallbackBinding');

function Signal() {
    'use strict';
    this._listeners = [//array of callback bindings
        /*
        CallbackBinding,
        CallbackBinding,
        CallbackBinding,
        ...
        */
    ];
}
module.exports = Signal;

Signal.prototype.addListener = function(callback, callbackContext) {
    'use strict';
    var listeners = this._listeners;

    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        if(binding.equals(callback, callbackContext)) {
            console.log('Attempt to add the same listener twice.');
            return; //already hooked, no-op
        }
    }

    listeners.push(new CallbackBinding(callback, callbackContext));
};

Signal.prototype.removeListener = function(callback, callbackContext) {
    'use strict';
    var removeAt = null;

    var listeners = this._listeners;
    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        if(binding.equals(callback, callbackContext)) {
            removeAt = i;
            break;
        }
    }

    if(removeAt !== null) {
        listeners[removeAt].destroy();
        listeners.splice(removeAt, 1);
    } else {
        console.log('Attempt to remove listener that was not added.');
    }
};

Signal.prototype.dispatch = function(/*...*/){
    'use strict';
    var listeners = this._listeners;
    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        binding.execute.apply(binding, arguments);
    }
};

Signal.prototype.destroy = function() { //removes all listeners
    var listeners = this._listeners;
    while(listeners.length) {
        var binding = listeners.pop();
        binding.destroy();
    }
};
