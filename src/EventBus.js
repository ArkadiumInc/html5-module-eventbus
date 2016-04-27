/**
 * Created by alexey.shmakov on 2/1/2016.
 */

/* globals require, module */

var EventEmitter = require('./EventEmitter');

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

EventBus.prototype.registerEvent = function(eventTopic, eventName) {
    'use strict';
    var topics = this._topics;
    topics[eventTopic] = topics[eventTopic] || new EventEmitter();
    topics[eventTopic].registerEvent(eventName);
};

EventBus.prototype.addListener = function(eventTopic, eventName, callback, callbackContext) {
    'use strict';
    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    eventEmitter.addListener(eventName, callback, callbackContext);
};

EventBus.prototype.removeListener = function(eventTopic, eventName, callback, callbackContext) {
    'use strict';
    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    eventEmitter.removeListener(eventName, callback, callbackContext);
};


EventBus.prototype.dispatchEvent = function(eventTopic/*, eventName, ...*/) {
    'use strict';
    var ensuredEventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(ensuredEventTopic);
    Array.prototype.shift.call(arguments);
    eventEmitter.dispatchEvent.apply(eventEmitter, arguments);
};

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
