/* globals describe, require, beforeEach, afterEach, it, expect */

describe('Event Emitter tests', function() {
    'use strict';
    var EventBusModule = require('../index.js');
    var eventEmitter = null;

    var EVENT_1 = 'event1';
    var EVENT_2 = 'event2';

    beforeEach(function() {
        eventEmitter = new EventBusModule.EventEmitter();
    });

    afterEach(function() {
        eventEmitter.destroy();
        eventEmitter = null;
    });

    it('Test EventEmitter definition', function() {
        expect(eventEmitter).not.toBe(null);
    });

    it('Test EventEmitter event registrations', function() {
        var registerEvent1 = function(){
            eventEmitter.registerEvent(EVENT_1);
        };

        var registerEvent2 = function(){
            eventEmitter.registerEvent(EVENT_2);
        };

        expect(eventEmitter).not.toBe(null);
        expect(registerEvent1).not.toThrow();
        expect(registerEvent2).not.toThrow();
    });

    it('Test EventEmitter add listeners', function() {
        eventEmitter.registerEvent(EVENT_1);
        var callback = function(){};

        var addListenerCorrectly = function() {
            eventEmitter.addListener(EVENT_1, callback);
        };

        var addListenerCorrectlyWithContext = function() {
            eventEmitter.addListener(EVENT_1, callback, this);
        };

        var addListenerIncorrectly = function() {
            eventEmitter.addListener(EVENT_2, callback);
        };

        var addListenerIncorrectlyWithContext = function() {
            eventEmitter.addListener(EVENT_2, callback, this);
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(addListenerIncorrectly).toThrow();
        expect(addListenerCorrectlyWithContext).not.toThrow();
        expect(addListenerIncorrectlyWithContext).toThrow();
    });

    it('Test EventEmitter dispatch event', function() {
        eventEmitter.registerEvent(EVENT_2);

        var dispatchEventCorrectly = function() {
            eventEmitter.dispatchEvent(EVENT_2);
        };

        var dispatchEventIncorrectly = function() {
            eventEmitter.dispatchEvent(EVENT_1);
        };

        expect(dispatchEventIncorrectly).toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(dispatchEventIncorrectly).toThrow();
    });

    it('Test EventEmitter dispatch and receieve event', function() {
        eventEmitter.registerEvent(EVENT_1);

        var callbackCounter = 0;

        var callback = function() {
            callbackCounter++;
        };

        var addListenerCorrectly = function() {
            eventEmitter.addListener(EVENT_1, callback);
        };

        var dispatchEventCorrectly = function() {
            eventEmitter.dispatchEvent(EVENT_1);
        };

        var addListenerIncorrectly = function() {
            eventEmitter.addListener(EVENT_2);
        };

        var dispatchEventIncorrectly = function() {
            eventEmitter.dispatchEvent(EVENT_2);
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(dispatchEventIncorrectly).toThrow();
        expect(callbackCounter).toBe(1);
        expect(addListenerIncorrectly).toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(2);
        expect(dispatchEventIncorrectly).toThrow();
        expect(callbackCounter).toBe(2);
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(3);
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(4);
    });

    it('Test EventEmitter remove listener', function() {
        eventEmitter.registerEvent(EVENT_1);
        
        var callbackCounter = 0;

        var callback = function() {
            callbackCounter++;
        };

        var addListenerCorrectly = function() {
            eventEmitter.addListener(EVENT_1, callback);
        };

        var dispatchEventCorrectly = function() {
            eventEmitter.dispatchEvent(EVENT_1);
        };

        var removeListenerCorrectly = function() {
            eventEmitter.removeListener(EVENT_1, callback);
        };

        var removeListenerIncorrectly = function() {
            eventEmitter.removeListener(EVENT_1, this);
        };

        var removeListenerFromIncorrectEvent = function() {
            eventEmitter.removeListener(EVENT_2, callback);
        };

        expect(addListenerCorrectly).not.toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(1);
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(2);
        expect(removeListenerCorrectly).not.toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(2);
        expect(removeListenerIncorrectly).not.toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(2);
        expect(removeListenerFromIncorrectEvent).toThrow();
        expect(dispatchEventCorrectly).not.toThrow();
        expect(callbackCounter).toBe(2);
    });
});
