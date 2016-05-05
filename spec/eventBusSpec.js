/* globals describe, require, beforeEach, afterEach, it, expect */

describe('EventBus module tests', function() {
    'use strict';
    var EventBusModule = require('../index.js');
    var eventBus = null;

    var EVENT_1 = 'event1';
    var EVENT_2 = 'event2';

    var TOPIC_1 = 'topic1';
    // var TOPIC_2 = 'topic2';

    beforeEach(function() {
        eventBus = new EventBusModule.EventBus();
    });

    afterEach(function() {
        eventBus.destroy();
        eventBus = null;
    });

    it('Test EventBus definition', function() {
        expect(eventBus).not.toBe(null);
    });

    it('Test EventBus events registrations', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);
        expect(eventBus).not.toBe(null);
    });

    it('Test EventBus empty validation', function() {
        var validateEmptyEventBus = function() {
            eventBus.validate();
        };

        expect(validateEmptyEventBus).not.toThrow();
        expect(eventBus).not.toBe(null);
    });

    it('Test EventBus validation with event registered', function() {
        var registerEventInEventBus = function() {
            eventBus.registerEvent(TOPIC_1, EVENT_1);
        };

        var validateEventBusWithRegisteredEvent = function() {
            eventBus.validate();
        };

        expect(registerEventInEventBus).not.toThrow();
        expect(validateEventBusWithRegisteredEvent).not.toThrow();
        expect(eventBus).not.toBe(null);
    });

    it('Test EventBus add listeners before validated', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callback = function() {
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback, this);
        };

        //incorret listeners won't throw until the eventbus is validated
        var addListenerIncorrectly1 = function() {
            eventBus.addListener(TOPIC_1, EVENT_2, callback, this);
        };

        var addListenerIncorrectly2 = function() {
            eventBus.addListener('unknownTopic', EVENT_1, callback, this);
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(addListenerIncorrectly1).not.toThrow();
        expect(addListenerIncorrectly2).not.toThrow();
    });

    it('Test EventBus add listeners after validated', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);
        eventBus.validate();

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


    it('Test EventBus dispatch event before validated', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        // var callback = function() {
        // };

        var dispacthEventCorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_1);
        };

        var dispacthEventIncorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_2);
        };

        expect(dispacthEventCorrectly).toThrow();
        expect(dispacthEventIncorrectly).toThrow();
    });

    it('Test EventBus dispatch event after validated', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);
        eventBus.validate();

        // var callback = function() {
        // };

        var dispacthEventCorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_1);
        };

        var dispacthEventIncorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_2);
        };

        expect(dispacthEventCorrectly).not.toThrow();
        expect(dispacthEventIncorrectly).toThrow();
    });

    it('Test EventBus dispatch and receive event before validated', function() {
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

        expect(addListenerCorrectly).not.toThrow();
        expect(dispacthEventCorrectly).toThrow();
        expect(callbackCounter).toBe(0);
        expect(dispacthEventCorrectly).toThrow();
        expect(callbackCounter).toBe(0);

    });

    it('Test EventBus dispatch and receive event after validated', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);
        eventBus.validate();

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

    it('Test EventBus remove listener before validated', function() {
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

        expect(addListenerCorrectly).not.toThrow();
        expect(dispacthEventCorrectly).toThrow();
        expect(callbackCounter).toBe(0);
        expect(dispacthEventCorrectly).toThrow();
        expect(callbackCounter).toBe(0);
        expect(removeListenerCorrectly).not.toThrow();
        expect(dispacthEventCorrectly).toThrow();
        expect(callbackCounter).toBe(0);
    });

    it('Test EventBus remove listener after validated', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);
        eventBus.validate();

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

    it('Test EventBus add listener then validate correctly', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callback = function() {
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback, this);
        };

        var validateEventBus = function() {
            eventBus.validate();
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(validateEventBus).not.toThrow();
    });

    it('Test EventBus add listener then validate incorrectly', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callback = function() {
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback, this);
        };

        //incorret listeners won't throw until the eventbus is validated
        var addListenerIncorrectly1 = function() {
            eventBus.addListener(TOPIC_1, EVENT_2, callback, this);
        };

        var addListenerIncorrectly2 = function() {
            eventBus.addListener('unknownTopic', EVENT_1, callback, this);
        };

        var validateEventBus = function() {
            eventBus.validate();
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(addListenerIncorrectly1).not.toThrow();
        expect(addListenerIncorrectly2).not.toThrow();
        expect(validateEventBus).toThrow();
    });

    it('Test EventBus add listener then validate then dispatch event', function() {
        eventBus.registerEvent(TOPIC_1, EVENT_1);

        var callbackCounter = 0;

        var callback = function(){
            callbackCounter++;
        };

        var addListenerCorrectly = function() {
            eventBus.addListener(TOPIC_1, EVENT_1, callback);
        };

        var validateEventBus = function() {
            eventBus.validate();
        };

        var dispatchEventCorrectly = function() {
            eventBus.dispatchEvent(TOPIC_1, EVENT_1);
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(dispatchEventCorrectly).toThrow(); //no dispatching before validation
        expect(callbackCounter).toBe(0);
        expect(validateEventBus).not.toThrow();
        expect(callbackCounter).toBe(0);
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(1);
    });
});
