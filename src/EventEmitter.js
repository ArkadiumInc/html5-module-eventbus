/* globals require, module */

var Signal = require('./Signal');

/**
 * Event emitter class
 * @class
 */
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

/**
 * Registers an event in the event emitter instance.
 * Adding/Removing event listeners or Dispatching on unregistered event results in exception.
 * @param {string} eventName - name of the event
 */
EventEmitter.prototype.registerEvent = function(eventName) {
    'use strict';
    var events = this._events;
    events[eventName] = events[eventName] || new Signal();
};

/**
 * Adds an event listener to the event emitter
 * adding event listener for non-registered event results in exception
 * @param {string} eventName - name of the event
 * @param {function} callback - callback that will be called when the event is dispatched
 * @param {Object} [callbackContext=undefined] - context for callback to execute in, helps to avoid costly creation of listeners via .bind()
 */
EventEmitter.prototype.addListener = function(eventName, callback, callbackContext) {
    'use strict';
    var ensuredEventName = this._ensureEventName(eventName);
    var signal = this._ensureEventExists(ensuredEventName);
    signal.addListener(callback, callbackContext);
};

/**
 * Removes an event listener from the event bus
 * removing event listener for non-registered event results in exception
 * @param {string} eventName - name of the event
 * @param {function} callback - callback to remove in
 * @param {Object} [callbackContext=undefined] - context for callback, to specify which callback to remove exactly since you can add same callback in a multiple contexts.
 */
EventEmitter.prototype.removeListener = function(eventName, callback, callbackContext) {
    'use strict';
    var ensuredEventName = this._ensureEventName(eventName);
    var signal = this._ensureEventExists(ensuredEventName);
    signal.removeListener(callback, callbackContext);
};

/**
 * Dispatch a specified event
 * dispatching a non-registered event will result in exception
 * @param {string} eventName - name ofthe event in the topic to dispatch
 * @param {...} any parameters will be passed to the callback
 */
EventEmitter.prototype.dispatchEvent = function(eventName/*, ...*/) {
    'use strict';
    var ensuredEventName = this._ensureEventName(eventName);
    var signal = this._ensureEventExists(ensuredEventName);
    Array.prototype.shift.call(arguments);
    signal.dispatch.apply(signal, arguments);
};

/**
 * Destroy the event emitter
 * make sure to call this, so all event listeners are unsubscribed and destroyed properly and not left hanging in memory
 */
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
