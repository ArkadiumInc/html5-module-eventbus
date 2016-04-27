(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/tests.js":[function(require,module,exports){
describe("EventBus module tests", function() {
    'use strict';
    var EventBusModule = require('../index.js');
    var eventBus = null;

    var EVENT_1 = 'event1';
    var EVENT_2 = 'event2';

    var TOPIC_1 = 'topic1';
    var TOPIC_2 = 'topic2';

    beforeEach(function() {
        eventBus = new EventBusModule.EventBus();
    });

    afterEach(function() {
        eventBus.destroy();
        eventBus = null;
    });

    it("Test EventBus definition", function() {
        expect(eventBus).not.toBe(null);
    });

    it("Test EventBus events registrations", function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);
        expect(eventBus).not.toBe(null);
    });


    it("Test EventBus add listeners", function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callback = function() {
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback, this);
        };

        var addListenerIncorrectly1 = function() {
            eventBus.addListener(TOPIC_1, EVENT_2, callback, this);
        };

        var addListenerIncorrectly2 = function() {
            eventBus.addListener('unknownTopic', EVENT_1, callback, this);
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(addListenerIncorrectly1).toThrow();
        expect(addListenerIncorrectly2).toThrow();
    });

    it("Test EventBus dispatch event", function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callback = function() {
        };

        var dispacthEventCorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_1);
        };

        var dispacthEventIncorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_2);
        };

        expect(dispacthEventCorrectly).not.toThrow();
        expect(dispacthEventIncorrectly).toThrow();
    });

    it("Test EventBus dispatch and receive event", function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callbackCounter = 0;

        var callback = function() {
            callbackCounter++;
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback, this);
        };

        var dispacthEventCorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_1);
        };

        addListenerCorrectly();
        dispacthEventCorrectly();
        expect(callbackCounter).toBe(1);
        dispacthEventCorrectly();
        expect(callbackCounter).toBe(2);

    });

    it("Test EventBus remove listener", function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callbackCounter = 0;

        var callback = function() {
            callbackCounter++;
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback, this);
        };

        var dispacthEventCorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_1);
        };

        var removeListenerCorrectly = function() {
            eventBus.removeListener(TOPIC_1, EVENT_1, callback, this);
        };

        addListenerCorrectly();
        dispacthEventCorrectly();
        expect(callbackCounter).toBe(1);
        dispacthEventCorrectly();
        expect(callbackCounter).toBe(2);
        removeListenerCorrectly();
        dispacthEventCorrectly();
        expect(callbackCounter).toBe(2);
    });

});
},{"../../src/com/arkadium/core/eventbus/EventBus":"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\EventBus.js"}],"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\EventBus.js":[function(require,module,exports){
/**
 * Created by alexey.shmakov on 2/1/2016.
 */

var EventEmitter = require('./EventEmitter');
var Logger = require('./Logger');
var logger = Logger.getLogger();

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
    //logger.debug('EventBus.registerEvent', eventTopic, eventName);
    var topics = this._topics;
    topics[eventTopic] = topics[eventTopic] || new EventEmitter();
    topics[eventTopic].registerEvent(eventName);
};

EventBus.prototype.addListener = function(eventTopic, eventName, callback, callbackContext) {
    'use strict';
    //logger.debug('EventBus.addListener', eventTopic, eventName);
    var eventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(eventTopic);
    eventEmitter.addListener(eventName, callback, callbackContext);
};

EventBus.prototype.removeListener = function(eventTopic, eventName, callback, callbackContext) {
    'use strict';
    //logger.debug('EventBus.removeListener', eventTopic, eventName);
    var eventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(eventTopic);
    eventEmitter.removeListener(eventName, callback, callbackContext);
};


EventBus.prototype.dispatchEvent = function(eventTopic/*, eventName, ...*/) {
    'use strict';
    logger.debug('EventBus.dispatchEvent', eventTopic, arguments);
    var eventTopic = this._ensureEventTopic(eventTopic);
    var eventEmitter = this._ensureEventTopicExists(eventTopic);
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

},{"./EventEmitter":"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\EventEmitter.js","./Logger":"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\Logger.js"}],"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\EventEmitter.js":[function(require,module,exports){
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

},{"./Signal":"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\Signal.js"}],"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\Logger.js":[function(require,module,exports){
/**
 * Created by alexey.shmakov on 2/2/2016.
 */


function Logger(){
    'use strict';
    this.setLogLevel(Logger.LEVEL.INFO);
}
module.exports = Logger;

Logger.PRIORITY = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};
Object.freeze(Logger.PRIORITY);

Logger.LEVEL = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};
Object.freeze(Logger.LEVEL);

Logger.getLogger = function() {
    'use strict';
    Logger._logger = Logger._logger || new Logger();
    return Logger._logger;
};

Logger.prototype.setLogLevel = function(logLevel) {
    'use strict';
    var logLevel = this._ensureLogLevel(logLevel);
    this._level = Logger.PRIORITY[logLevel];
};

Logger.prototype.log = function(logLevel/*, ...messages*/) {
    'use strict';
    var logLevel = this._ensureLogLevel(logLevel);
    if(this._level <= Logger.PRIORITY[logLevel] && console.log) {
        arguments[0] = Logger.LEVEL[logLevel];
        console.log.apply(console, arguments);
    }
};

//create aliased functions: debug, info, ward, error etc.
for(var levelName in Logger.LEVEL) {
    if(Logger.LEVEL.hasOwnProperty(levelName)){
        (function(levelName){
            Logger.prototype[levelName.toLocaleLowerCase()] = function(/*...messages*/){
                Array.prototype.unshift.call(arguments, Logger.LEVEL[levelName]);
                this.log.apply(this, arguments);
            };
        })(levelName);
    }
}


Logger.prototype._ensureLogLevel = function(logLevel) {
    'use strict';
    if(typeof logLevel === 'string') {
        var logLevelName = logLevel.toUpperCase(); //'debug' or 'DEBUG' we don't care
        var level = Logger.LEVEL[logLevelName];
        if(!level) {
            throw new Error('No log level with name '+logLevelName+' exists.');
        }
        return level;
    }
    throw new Error('Parameter logLevel must be a string.');
};

},{}],"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\Signal.js":[function(require,module,exports){
/**
 * Created by alexey.shmakov on 2/2/2016.
 */

var Logger = require('./Logger');
var log = Logger.getLogger();

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
            log.warn('Attempt to add the same listener twice.');
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
        log.warn('Attempt to remove listener that was not added.');
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

},{"./Logger":"f:\\Home\\jedi\\projects\\html5\\Simfy\\modules\\html5-module-eventbus\\src\\com\\arkadium\\core\\eventbus\\Logger.js"}]},{},["./src/tests.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNyYy90ZXN0cy5qcyIsIi4uL3NyYy9jb20vYXJrYWRpdW0vY29yZS9ldmVudGJ1cy9FdmVudEJ1cy5qcyIsIi4uL3NyYy9jb20vYXJrYWRpdW0vY29yZS9ldmVudGJ1cy9FdmVudEVtaXR0ZXIuanMiLCIuLi9zcmMvY29tL2Fya2FkaXVtL2NvcmUvZXZlbnRidXMvTG9nZ2VyLmpzIiwiLi4vc3JjL2NvbS9hcmthZGl1bS9jb3JlL2V2ZW50YnVzL1NpZ25hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZGVzY3JpYmUoXCJFdmVudEJ1cyBtb2R1bGUgdGVzdHNcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgRXZlbnRCdXMgPSByZXF1aXJlKCcuLi8uLi9zcmMvY29tL2Fya2FkaXVtL2NvcmUvZXZlbnRidXMvRXZlbnRCdXMnKTtcclxuICAgIHZhciBldmVudEJ1cyA9IG51bGw7XHJcblxyXG4gICAgdmFyIEVWRU5UXzEgPSAnZXZlbnQxJztcclxuICAgIHZhciBFVkVOVF8yID0gJ2V2ZW50Mic7XHJcblxyXG4gICAgdmFyIFRPUElDXzEgPSAndG9waWMxJztcclxuICAgIHZhciBUT1BJQ18yID0gJ3RvcGljMic7XHJcblxyXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV2ZW50QnVzLmRlc3Ryb3koKTtcclxuICAgICAgICBldmVudEJ1cyA9IG51bGw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdChcIlRlc3QgRXZlbnRCdXMgZGVmaW5pdGlvblwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBleHBlY3QoZXZlbnRCdXMpLm5vdC50b0JlKG51bGwpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJUZXN0IEV2ZW50QnVzIGV2ZW50cyByZWdpc3RyYXRpb25zXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV2ZW50QnVzLnJlZ2lzdGVyRXZlbnQoVE9QSUNfMSwgRVZFTlRfMSk7XHJcbiAgICAgICAgZXhwZWN0KGV2ZW50QnVzKS5ub3QudG9CZShudWxsKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBpdChcIlRlc3QgRXZlbnRCdXMgYWRkIGxpc3RlbmVyc1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBldmVudEJ1cy5yZWdpc3RlckV2ZW50KFRPUElDXzEsIEVWRU5UXzEpO1xyXG5cclxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgYWRkTGlzdGVuZXJDb3JyZWN0bHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXZlbnRCdXMuYWRkTGlzdGVuZXIoVE9QSUNfMSwgRVZFTlRfMSwgY2FsbGJhY2ssIHRoaXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBhZGRMaXN0ZW5lckluY29ycmVjdGx5MSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBldmVudEJ1cy5hZGRMaXN0ZW5lcihUT1BJQ18xLCBFVkVOVF8yLCBjYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGFkZExpc3RlbmVySW5jb3JyZWN0bHkyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV2ZW50QnVzLmFkZExpc3RlbmVyKCd1bmtub3duVG9waWMnLCBFVkVOVF8xLCBjYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGFkZExpc3RlbmVyQ29ycmVjdGx5KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIGV4cGVjdChhZGRMaXN0ZW5lckluY29ycmVjdGx5MSkudG9UaHJvdygpO1xyXG4gICAgICAgIGV4cGVjdChhZGRMaXN0ZW5lckluY29ycmVjdGx5MikudG9UaHJvdygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJUZXN0IEV2ZW50QnVzIGRpc3BhdGNoIGV2ZW50XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGV2ZW50QnVzLnJlZ2lzdGVyRXZlbnQoVE9QSUNfMSwgRVZFTlRfMSk7XHJcblxyXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBkaXNwYWN0aEV2ZW50Q29ycmVjdGx5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV2ZW50QnVzLmRpc3BhdGNoRXZlbnQoVE9QSUNfMSwgRVZFTlRfMSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGRpc3BhY3RoRXZlbnRJbmNvcnJlY3RseSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBldmVudEJ1cy5kaXNwYXRjaEV2ZW50KFRPUElDXzEsIEVWRU5UXzIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV4cGVjdChkaXNwYWN0aEV2ZW50Q29ycmVjdGx5KS5ub3QudG9UaHJvdygpO1xyXG4gICAgICAgIGV4cGVjdChkaXNwYWN0aEV2ZW50SW5jb3JyZWN0bHkpLnRvVGhyb3coKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwiVGVzdCBFdmVudEJ1cyBkaXNwYXRjaCBhbmQgcmVjZWl2ZSBldmVudFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBldmVudEJ1cy5yZWdpc3RlckV2ZW50KFRPUElDXzEsIEVWRU5UXzEpO1xyXG5cclxuICAgICAgICB2YXIgY2FsbGJhY2tDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrQ291bnRlcisrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBhZGRMaXN0ZW5lckNvcnJlY3RseSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBldmVudEJ1cy5hZGRMaXN0ZW5lcihUT1BJQ18xLCBFVkVOVF8xLCBjYWxsYmFjaywgdGhpcyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGRpc3BhY3RoRXZlbnRDb3JyZWN0bHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXZlbnRCdXMuZGlzcGF0Y2hFdmVudChUT1BJQ18xLCBFVkVOVF8xKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhZGRMaXN0ZW5lckNvcnJlY3RseSgpO1xyXG4gICAgICAgIGRpc3BhY3RoRXZlbnRDb3JyZWN0bHkoKTtcclxuICAgICAgICBleHBlY3QoY2FsbGJhY2tDb3VudGVyKS50b0JlKDEpO1xyXG4gICAgICAgIGRpc3BhY3RoRXZlbnRDb3JyZWN0bHkoKTtcclxuICAgICAgICBleHBlY3QoY2FsbGJhY2tDb3VudGVyKS50b0JlKDIpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwiVGVzdCBFdmVudEJ1cyByZW1vdmUgbGlzdGVuZXJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZXZlbnRCdXMucmVnaXN0ZXJFdmVudChUT1BJQ18xLCBFVkVOVF8xKTtcclxuXHJcbiAgICAgICAgdmFyIGNhbGxiYWNrQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjYWxsYmFja0NvdW50ZXIrKztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgYWRkTGlzdGVuZXJDb3JyZWN0bHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZXZlbnRCdXMuYWRkTGlzdGVuZXIoVE9QSUNfMSwgRVZFTlRfMSwgY2FsbGJhY2ssIHRoaXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBkaXNwYWN0aEV2ZW50Q29ycmVjdGx5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV2ZW50QnVzLmRpc3BhdGNoRXZlbnQoVE9QSUNfMSwgRVZFTlRfMSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHJlbW92ZUxpc3RlbmVyQ29ycmVjdGx5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGV2ZW50QnVzLnJlbW92ZUxpc3RlbmVyKFRPUElDXzEsIEVWRU5UXzEsIGNhbGxiYWNrLCB0aGlzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhZGRMaXN0ZW5lckNvcnJlY3RseSgpO1xyXG4gICAgICAgIGRpc3BhY3RoRXZlbnRDb3JyZWN0bHkoKTtcclxuICAgICAgICBleHBlY3QoY2FsbGJhY2tDb3VudGVyKS50b0JlKDEpO1xyXG4gICAgICAgIGRpc3BhY3RoRXZlbnRDb3JyZWN0bHkoKTtcclxuICAgICAgICBleHBlY3QoY2FsbGJhY2tDb3VudGVyKS50b0JlKDIpO1xyXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyQ29ycmVjdGx5KCk7XHJcbiAgICAgICAgZGlzcGFjdGhFdmVudENvcnJlY3RseSgpO1xyXG4gICAgICAgIGV4cGVjdChjYWxsYmFja0NvdW50ZXIpLnRvQmUoMik7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXhleS5zaG1ha292IG9uIDIvMS8yMDE2LlxyXG4gKi9cclxuXHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL0V2ZW50RW1pdHRlcicpO1xyXG52YXIgTG9nZ2VyID0gcmVxdWlyZSgnLi9Mb2dnZXInKTtcclxudmFyIGxvZ2dlciA9IExvZ2dlci5nZXRMb2dnZXIoKTtcclxuXHJcbmZ1bmN0aW9uIEV2ZW50QnVzKCl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdGhpcy5fdG9waWNzID0ge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgdG9waWMxOiBldmVudEVtaXR0ZXIsXHJcbiAgICAgICAgdG9waWMyOiBldmVudEVtaXR0ZXJcclxuICAgICAgICAgKi9cclxuICAgIH07XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEJ1cztcclxuXHJcbkV2ZW50QnVzLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnRUb3BpYywgZXZlbnROYW1lKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICAvL2xvZ2dlci5kZWJ1ZygnRXZlbnRCdXMucmVnaXN0ZXJFdmVudCcsIGV2ZW50VG9waWMsIGV2ZW50TmFtZSk7XHJcbiAgICB2YXIgdG9waWNzID0gdGhpcy5fdG9waWNzO1xyXG4gICAgdG9waWNzW2V2ZW50VG9waWNdID0gdG9waWNzW2V2ZW50VG9waWNdIHx8IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRvcGljc1tldmVudFRvcGljXS5yZWdpc3RlckV2ZW50KGV2ZW50TmFtZSk7XHJcbn07XHJcblxyXG5FdmVudEJ1cy5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFRvcGljLCBldmVudE5hbWUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIC8vbG9nZ2VyLmRlYnVnKCdFdmVudEJ1cy5hZGRMaXN0ZW5lcicsIGV2ZW50VG9waWMsIGV2ZW50TmFtZSk7XHJcbiAgICB2YXIgZXZlbnRUb3BpYyA9IHRoaXMuX2Vuc3VyZUV2ZW50VG9waWMoZXZlbnRUb3BpYyk7XHJcbiAgICB2YXIgZXZlbnRFbWl0dGVyID0gdGhpcy5fZW5zdXJlRXZlbnRUb3BpY0V4aXN0cyhldmVudFRvcGljKTtcclxuICAgIGV2ZW50RW1pdHRlci5hZGRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpO1xyXG59O1xyXG5cclxuRXZlbnRCdXMucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUb3BpYywgZXZlbnROYW1lLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICAvL2xvZ2dlci5kZWJ1ZygnRXZlbnRCdXMucmVtb3ZlTGlzdGVuZXInLCBldmVudFRvcGljLCBldmVudE5hbWUpO1xyXG4gICAgdmFyIGV2ZW50VG9waWMgPSB0aGlzLl9lbnN1cmVFdmVudFRvcGljKGV2ZW50VG9waWMpO1xyXG4gICAgdmFyIGV2ZW50RW1pdHRlciA9IHRoaXMuX2Vuc3VyZUV2ZW50VG9waWNFeGlzdHMoZXZlbnRUb3BpYyk7XHJcbiAgICBldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KTtcclxufTtcclxuXHJcblxyXG5FdmVudEJ1cy5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50VG9waWMvKiwgZXZlbnROYW1lLCAuLi4qLykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgbG9nZ2VyLmRlYnVnKCdFdmVudEJ1cy5kaXNwYXRjaEV2ZW50JywgZXZlbnRUb3BpYywgYXJndW1lbnRzKTtcclxuICAgIHZhciBldmVudFRvcGljID0gdGhpcy5fZW5zdXJlRXZlbnRUb3BpYyhldmVudFRvcGljKTtcclxuICAgIHZhciBldmVudEVtaXR0ZXIgPSB0aGlzLl9lbnN1cmVFdmVudFRvcGljRXhpc3RzKGV2ZW50VG9waWMpO1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmNhbGwoYXJndW1lbnRzKTtcclxuICAgIGV2ZW50RW1pdHRlci5kaXNwYXRjaEV2ZW50LmFwcGx5KGV2ZW50RW1pdHRlciwgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbkV2ZW50QnVzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciB0b3BpY3MgPSB0aGlzLl90b3BpY3M7XHJcbiAgICBmb3IodmFyIGsgaW4gdG9waWNzKSB7XHJcbiAgICAgICAgaWYodG9waWNzLmhhc093blByb3BlcnR5KGspKXtcclxuICAgICAgICAgICAgdmFyIGVtaXR0ZXIgPSB0b3BpY3Nba107XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0b3BpY3Nba10gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblxyXG5FdmVudEJ1cy5wcm90b3R5cGUuX2Vuc3VyZUV2ZW50VG9waWMgPSBmdW5jdGlvbihldmVudFRvcGljKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBpZighZXZlbnRUb3BpYykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIGV2ZW50VG9waWMgbXVzdCBiZSBhIHN0cmluZy4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBldmVudFRvcGljO1xyXG59O1xyXG5cclxuRXZlbnRCdXMucHJvdG90eXBlLl9lbnN1cmVFdmVudFRvcGljRXhpc3RzID0gZnVuY3Rpb24oZXZlbnRUb3BpYykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGV2ZW50RW1pdHRlciA9IHRoaXMuX3RvcGljc1tldmVudFRvcGljXTtcclxuICAgIGlmKCFldmVudEVtaXR0ZXIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50ICcgKyBldmVudFRvcGljICsgJyBpcyBub3QgcmVnaXN0ZXJlZC4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBldmVudEVtaXR0ZXI7XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXhleS5zaG1ha292IG9uIDIvMi8yMDE2LlxyXG4gKi9cclxuXHJcbnZhciBTaWduYWwgPSByZXF1aXJlKCcuL1NpZ25hbCcpO1xyXG5cclxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB0aGlzLl9ldmVudHMgPSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICBldmVudE5hbWUxOiBzaWduYWwsXHJcbiAgICAgICAgZXZlbnROYW1lMjogc2lnbmFsXHJcbiAgICAgICAgICovXHJcbiAgICB9O1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xyXG5cclxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xyXG4gICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudHNbZXZlbnROYW1lXSB8fCBuZXcgU2lnbmFsKCk7XHJcbn07XHJcblxyXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZW5zdXJlRXZlbnROYW1lKGV2ZW50TmFtZSk7XHJcbiAgICB2YXIgc2lnbmFsID0gdGhpcy5fZW5zdXJlRXZlbnRFeGlzdHMoZXZlbnROYW1lKTtcclxuICAgIHNpZ25hbC5hZGRMaXN0ZW5lcihjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KTtcclxufTtcclxuXHJcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9lbnN1cmVFdmVudE5hbWUoZXZlbnROYW1lKTtcclxuICAgIHZhciBzaWduYWwgPSB0aGlzLl9lbnN1cmVFdmVudEV4aXN0cyhldmVudE5hbWUpO1xyXG4gICAgc2lnbmFsLnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpO1xyXG59O1xyXG5cclxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnROYW1lLyosIC4uLiovKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZW5zdXJlRXZlbnROYW1lKGV2ZW50TmFtZSk7XHJcbiAgICB2YXIgc2lnbmFsID0gdGhpcy5fZW5zdXJlRXZlbnRFeGlzdHMoZXZlbnROYW1lKTtcclxuICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICBzaWduYWwuZGlzcGF0Y2guYXBwbHkoc2lnbmFsLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xyXG4gICAgZm9yKHZhciBrIGluIGV2ZW50cykge1xyXG4gICAgICAgIGlmKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrKSl7XHJcbiAgICAgICAgICAgIHZhciBzaWduYWwgPSBldmVudHNba107XHJcbiAgICAgICAgICAgIHNpZ25hbC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGV2ZW50c1trXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2Vuc3VyZUV2ZW50TmFtZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgaWYoIWV2ZW50TmFtZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIGV2ZW50TmFtZSBtdXN0IGJlIGEgc3RyaW5nLicpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV2ZW50TmFtZTtcclxufTtcclxuXHJcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2Vuc3VyZUV2ZW50RXhpc3RzID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgc2lnbmFsID0gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV07XHJcbiAgICBpZighc2lnbmFsKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCAnICsgZXZlbnROYW1lICsgJyBpcyBub3QgcmVnaXN0ZXJlZC4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzaWduYWw7XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXhleS5zaG1ha292IG9uIDIvMi8yMDE2LlxyXG4gKi9cclxuXHJcblxyXG5mdW5jdGlvbiBMb2dnZXIoKXtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHRoaXMuc2V0TG9nTGV2ZWwoTG9nZ2VyLkxFVkVMLklORk8pO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTG9nZ2VyO1xyXG5cclxuTG9nZ2VyLlBSSU9SSVRZID0ge1xyXG4gICAgREVCVUc6IDAsXHJcbiAgICBJTkZPOiAxLFxyXG4gICAgV0FSTjogMixcclxuICAgIEVSUk9SOiAzXHJcbn07XHJcbk9iamVjdC5mcmVlemUoTG9nZ2VyLlBSSU9SSVRZKTtcclxuXHJcbkxvZ2dlci5MRVZFTCA9IHtcclxuICAgIERFQlVHOiAnREVCVUcnLFxyXG4gICAgSU5GTzogJ0lORk8nLFxyXG4gICAgV0FSTjogJ1dBUk4nLFxyXG4gICAgRVJST1I6ICdFUlJPUidcclxufTtcclxuT2JqZWN0LmZyZWV6ZShMb2dnZXIuTEVWRUwpO1xyXG5cclxuTG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgTG9nZ2VyLl9sb2dnZXIgPSBMb2dnZXIuX2xvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XHJcbiAgICByZXR1cm4gTG9nZ2VyLl9sb2dnZXI7XHJcbn07XHJcblxyXG5Mb2dnZXIucHJvdG90eXBlLnNldExvZ0xldmVsID0gZnVuY3Rpb24obG9nTGV2ZWwpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBsb2dMZXZlbCA9IHRoaXMuX2Vuc3VyZUxvZ0xldmVsKGxvZ0xldmVsKTtcclxuICAgIHRoaXMuX2xldmVsID0gTG9nZ2VyLlBSSU9SSVRZW2xvZ0xldmVsXTtcclxufTtcclxuXHJcbkxvZ2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24obG9nTGV2ZWwvKiwgLi4ubWVzc2FnZXMqLykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGxvZ0xldmVsID0gdGhpcy5fZW5zdXJlTG9nTGV2ZWwobG9nTGV2ZWwpO1xyXG4gICAgaWYodGhpcy5fbGV2ZWwgPD0gTG9nZ2VyLlBSSU9SSVRZW2xvZ0xldmVsXSAmJiBjb25zb2xlLmxvZykge1xyXG4gICAgICAgIGFyZ3VtZW50c1swXSA9IExvZ2dlci5MRVZFTFtsb2dMZXZlbF07XHJcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vY3JlYXRlIGFsaWFzZWQgZnVuY3Rpb25zOiBkZWJ1ZywgaW5mbywgd2FyZCwgZXJyb3IgZXRjLlxyXG5mb3IodmFyIGxldmVsTmFtZSBpbiBMb2dnZXIuTEVWRUwpIHtcclxuICAgIGlmKExvZ2dlci5MRVZFTC5oYXNPd25Qcm9wZXJ0eShsZXZlbE5hbWUpKXtcclxuICAgICAgICAoZnVuY3Rpb24obGV2ZWxOYW1lKXtcclxuICAgICAgICAgICAgTG9nZ2VyLnByb3RvdHlwZVtsZXZlbE5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKV0gPSBmdW5jdGlvbigvKi4uLm1lc3NhZ2VzKi8pe1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuY2FsbChhcmd1bWVudHMsIExvZ2dlci5MRVZFTFtsZXZlbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSkobGV2ZWxOYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbkxvZ2dlci5wcm90b3R5cGUuX2Vuc3VyZUxvZ0xldmVsID0gZnVuY3Rpb24obG9nTGV2ZWwpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGlmKHR5cGVvZiBsb2dMZXZlbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICB2YXIgbG9nTGV2ZWxOYW1lID0gbG9nTGV2ZWwudG9VcHBlckNhc2UoKTsgLy8nZGVidWcnIG9yICdERUJVRycgd2UgZG9uJ3QgY2FyZVxyXG4gICAgICAgIHZhciBsZXZlbCA9IExvZ2dlci5MRVZFTFtsb2dMZXZlbE5hbWVdO1xyXG4gICAgICAgIGlmKCFsZXZlbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvZyBsZXZlbCB3aXRoIG5hbWUgJytsb2dMZXZlbE5hbWUrJyBleGlzdHMuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsZXZlbDtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIGxvZ0xldmVsIG11c3QgYmUgYSBzdHJpbmcuJyk7XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXhleS5zaG1ha292IG9uIDIvMi8yMDE2LlxyXG4gKi9cclxuXHJcbnZhciBMb2dnZXIgPSByZXF1aXJlKCcuL0xvZ2dlcicpO1xyXG52YXIgbG9nID0gTG9nZ2VyLmdldExvZ2dlcigpO1xyXG5cclxuZnVuY3Rpb24gU2lnbmFsKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24sXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG9iamVjdFxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG4gICAgXTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpZ25hbDtcclxuXHJcblNpZ25hbC5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbihjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xyXG4gICAgZm9yKHZhciBpPTA7IGk8bGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBsaXN0ZW5lcnNbaV07XHJcbiAgICAgICAgaWYoYmluZGluZy5jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiYgYmluZGluZy5jb250ZXh0ID09PSBjYWxsYmFja0NvbnRleHQpIHtcclxuICAgICAgICAgICAgbG9nLndhcm4oJ0F0dGVtcHQgdG8gYWRkIHRoZSBzYW1lIGxpc3RlbmVyIHR3aWNlLicpO1xyXG4gICAgICAgICAgICByZXR1cm47IC8vYWxyZWFkeSBob29rZWQsIG5vLW9wXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlbmVycy5wdXNoKHtcclxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgY29udGV4dDogY2FsbGJhY2tDb250ZXh0XHJcbiAgICB9KTtcclxufTtcclxuXHJcblNpZ25hbC5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgcmVtb3ZlQXQgPSBudWxsO1xyXG5cclxuICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XHJcbiAgICBmb3IodmFyIGk9MDsgaTxsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYmluZGluZyA9IGxpc3RlbmVyc1tpXTtcclxuICAgICAgICBpZihiaW5kaW5nLmNhbGxiYWNrID09PSBjYWxsYmFjayAmJiBiaW5kaW5nLmNvbnRleHQgPT09IGNhbGxiYWNrQ29udGV4dCkge1xyXG4gICAgICAgICAgICByZW1vdmVBdCA9IGk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZihyZW1vdmVBdCA9PT0gbnVsbCkge1xyXG4gICAgICAgIGxvZy53YXJuKCdBdHRlbXB0IHRvIHJlbW92ZSBsaXN0ZW5lciB0aGF0IHdhcyBub3QgYWRkZWQuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UocmVtb3ZlQXQsIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuU2lnbmFsLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKC8qLi4uKi8pe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcclxuICAgIGZvcih2YXIgaT0wOyBpPGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBiaW5kaW5nID0gbGlzdGVuZXJzW2ldO1xyXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGJpbmRpbmcuY2FsbGJhY2s7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSBiaW5kaW5nLmNvbnRleHQ7XHJcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcclxuICAgIH1cclxufTtcclxuXHJcblNpZ25hbC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkgeyAvL3JlbW92ZXMgYWxsIGxpc3RlbmVyc1xyXG4gICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcclxuICAgIHdoaWxlKGxpc3RlbmVycy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgYmluZGluZyA9IGxpc3RlbmVycy5wb3AoKTtcclxuICAgICAgICBiaW5kaW5nLmNhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICBiaW5kaW5nLmNvbnRleHQgPSBudWxsO1xyXG4gICAgfVxyXG59O1xyXG4iXX0=
