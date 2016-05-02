/* globals require, module*/

var CallbackBinding = require('./CallbackBinding');

/**
 * Singal class
 * Singals can have event listeners attached to them and can dispatch events to those listeners,
 * basically implementing the observer pattern.
 * @class
 */
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

/**
 * Adds an event listener to the singal
 * Attempts to add same listener multiple times are ignored. There can be only 1 listener of the same type.
 * @param {function} callback - callback that will be called when the event is dispatched
 * @param {Object} [callbackContext=undefined] - context for callback to execute in, helps to avoid costly creation of listeners via .bind()
 */
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

/**
 * Removes an event listener from the singal
 * If listener wasn't really added before then it's no operation (just ignored).
 * @param {function} callback - callback to remove in
 * @param {Object} [callbackContext=undefined] - context for callback, to specify which callback to remove exactly since you can add same callback in a multiple contexts.
 */
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

/**
 * Dispatch an event to all subscribed listeners
 * @param {...} any parameters will be passed to the callback
 */
Signal.prototype.dispatch = function(/*...*/){
    'use strict';
    var listeners = this._listeners;
    for(var i=0; i<listeners.length; i++) {
        var binding = listeners[i];
        binding.execute.apply(binding, arguments);
    }
};

/**
 * Destroy the signal
 * make sure to call this, so all event listeners are unsubscribed and destroyed properly and not left hanging in memory
 */
Signal.prototype.destroy = function() { //removes all listeners
    var listeners = this._listeners;
    while(listeners.length) {
        var binding = listeners.pop();
        binding.destroy();
    }
};
