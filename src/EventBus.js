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

    this._validated = false;

    this._registeredEvents = [
        /*
        ["topicName", "eventName"],
        ["topicName", "eventName"]
        */
    ];

    this._addedListeners = [
        /*
        ["topicName", "eventName", callback, context],
        ["topicName", "eventName", callback, context]
        */
    ];
}
module.exports = EventBus;

/**
 * EventBus needs to be validated before dispatching any events
 * This is a measure to allow registering events and adding listeners in places where they logically belong,
 * instead of making a spaghetti style code for event registration all in one place.
 */
EventBus.prototype.validate = function() {
    this._validated = true;

    var i, topicName, eventName, callback, callbackContext;

    for(i=0; i<this._registeredEvents.length; i++) {
        topicName = this._registeredEvents[i][0];
        eventName = this._registeredEvents[i][1];
        this.registerEvent(topicName, eventName);
    }

    for(i=0; i<this._addedListeners.length; i++) {
        topicName = this._addedListeners[i][0];
        eventName = this._addedListeners[i][1];
        callback = this._addedListeners[i][2];
        callbackContext = this._addedListeners[i][3];
        this.addListener(topicName, eventName, callback, callbackContext);
    }

    this._registeredEvents = null; //FIXME: ensure this is memory-leak-safe
    this._addedListeners = null;
};

/**
 * Registers an event in the event bus instance.
 * Adding/Removing event listeners or Dispatching on unregistered event results in exception.
 * @param {string} eventTopic - topic name for the event
 * @param {string} eventName - name of the event in the topic
 */
EventBus.prototype.registerEvent = function(eventTopic, eventName) {
    'use strict';
    if(!this._validated) {
        this._registeredEvents.push([eventTopic, eventName]);
        return;
    }

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
    if(!this._validated) {
        this._addedListeners.push([eventTopic, eventName, callback, callbackContext]);
        return;
    }

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
    if(!this._validated) {
        var removeAt = null;

        for(var i=0; i<this._addedListeners.length; i++) {
            var listener = this._addedListeners[i];
            if(listener[0] === eventTopic && listener[1] === eventName &&
               listener[2] === callback && listener[3] === callbackContext) {
                   removeAt = i;
                   break;
            }
        }

        if(removeAt !== null) {
            this._addedListeners.splice(removeAt, 1); //FIXME: ensure this is memory-leak-safe
        }
        return;
    }

    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    eventEmitter.removeListener(eventName, callback, callbackContext);
};

/**
 * Dispatch a specified event
 * dispatching a non-registered event will result in exception
 * Also NOTE: .validate() needs to be called before any event dispatch can happen, otherwise you'll be greeted with an exception :)
 * @param {string} eventTopic - topic name for the event to dispatch
 * @param {string} eventName - name ofthe event in the topic to dispatch
 * @param {...} any parameters will be passed to the callback
 */
EventBus.prototype.dispatchEvent = function(eventTopic/*, eventName, ...*/) {
    'use strict';
    if(!this._validated) {
        throw new Error('Call .validate() on eventbus before dispatching events.');
    }

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

    this._validated = false;
    this._registeredEvents = null;
    this._addedListeners = null;
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
