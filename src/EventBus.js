/* globals require, module */

var EventEmitter = require('./EventEmitter');

/**
 * Event bus class
 * @class
 */
function EventBus(){
    'use strict';

    this._topics = {
        /*
        topic1: eventEmitter,
        topic2: eventEmitter
         */
    };
}
module.exports = EventBus;

/**
 * Registers an event in the event bus instance.
 * Adding/Removing event listeners or Dispatching on unregistered event results in exception.
 * @param {string} eventTopic - topic name for the event
 * @param {string} eventName - name of the event in the topic
 */
EventBus.prototype.registerEvent = function(eventTopic, eventName) {
    'use strict';
    var topics = this._topics;
    topics[eventTopic] = topics[eventTopic] || new EventEmitter();
    topics[eventTopic].registerEvent(eventName);
};

/**
 * Adds an event listener to the event bus
 * adding event listener for non-registered event results in exception
 * @param {string} eventTopic - topic name for the event
 * @param {string} eventName - name of the event in the topic
 * @param {function} callback - callback that will be called when the event is dispatched
 * @param {Object} [callbackContext=undefined] - context for callback to execute in, helps to avoid costly creation of listeners via .bind()
 */
EventBus.prototype.addListener = function(eventTopic, eventName, callback, callbackContext) {
    'use strict';
    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    eventEmitter.addListener(eventName, callback, callbackContext);
};

/**
 * Removes an event listener from the event bus
 * removing event listener for non-registered event results in exception
 * @param {string} eventTopic - topic name for the event
 * @param {string} eventName - name of the event in the topic
 * @param {function} callback - callback to remove in
 * @param {Object} [callbackContext=undefined] - context for callback, to specify which callback to remove exactly since you can add same callback in a multiple contexts.
 */
EventBus.prototype.removeListener = function(eventTopic, eventName, callback, callbackContext) {
    'use strict';
    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    eventEmitter.removeListener(eventName, callback, callbackContext);
};

/**
 * Dispatch a specified event
 * dispatching a non-registered event will result in exception
 * @param {string} eventTopic - topic name for the event to dispatch
 * @param {string} eventName - name ofthe event in the topic to dispatch
 * @param {...} any parameters will be passed to the callback
 */
EventBus.prototype.dispatchEvent = function(eventTopic/*, eventName, ...*/) {
    'use strict';
    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    Array.prototype.shift.call(arguments);
    eventEmitter.dispatchEvent.apply(eventEmitter, arguments);
};

/**
 * Destroy the event bus
 * make sure to call this, so all event listeners are unsubscribed and destroyed properly and not left hanging in memory
 */
EventBus.prototype.destroy = function(){
    var topics = this._topics;
    for(var k in topics) {
        if(topics.hasOwnProperty(k)){
            var emitter = topics[k];
            emitter.destroy();
            topics[k] = null;
        }
    }
};


EventBus.prototype._ensureEventTopic = function(eventTopic) {
    'use strict';
    if(!eventTopic) {
        throw new Error('Parameter eventTopic must be a string.');
    }
    return eventTopic;
};

EventBus.prototype._ensureEventTopicExists = function(eventTopic) {
    'use strict';
    var eventEmitter = this._topics[eventTopic];
    if(!eventEmitter) {
        throw new Error('Event ' + eventTopic + ' is not registered.');
    }
    return eventEmitter;
};
