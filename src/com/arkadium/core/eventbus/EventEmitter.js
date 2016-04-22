/**
 * Created by alexey.shmakov on 2/2/2016.
 */

var Signal = require('./Signal');

function EventEmitter(){
    'use strict';
    this._events = {
        /*
        eventName1: signal,
        eventName2: signal
         */
    };
}
module.exports = EventEmitter;

EventEmitter.prototype.registerEvent = function(eventName) {
    'use strict';
    var events = this._events;
    events[eventName] = events[eventName] || new Signal();
};

EventEmitter.prototype.addListener = function(eventName, callback, callbackContext) {
    'use strict';
    var eventName = this._ensureEventName(eventName);
    var signal = this._ensureEventExists(eventName);
    signal.addListener(callback, callbackContext);
};

EventEmitter.prototype.removeListener = function(eventName, callback, callbackContext) {
    'use strict';
    var eventName = this._ensureEventName(eventName);
    var signal = this._ensureEventExists(eventName);
    signal.removeListener(callback, callbackContext);
};

EventEmitter.prototype.dispatchEvent = function(eventName/*, ...*/) {
    'use strict';
    var eventName = this._ensureEventName(eventName);
    var signal = this._ensureEventExists(eventName);
    Array.prototype.shift.call(arguments);
    signal.dispatch.apply(signal, arguments);
};

EventEmitter.prototype.destroy = function() {
    var events = this._events;
    for(var k in events) {
        if(events.hasOwnProperty(k)){
            var signal = events[k];
            signal.destroy();
            events[k] = null;
        }
    }
};


EventEmitter.prototype._ensureEventName = function(eventName) {
    'use strict';
    if(!eventName) {
        throw new Error('Parameter eventName must be a string.');
    }
    return eventName;
};

EventEmitter.prototype._ensureEventExists = function(eventName) {
    'use strict';
    var signal = this._events[eventName];
    if(!signal) {
        throw new Error('Event ' + eventName + ' is not registered.');
    }
    return signal;
};
