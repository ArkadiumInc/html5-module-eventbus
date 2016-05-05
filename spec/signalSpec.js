/* globals describe, require, beforeEach, afterEach, it, expect */

describe('Signal tests', function() {
    'use strict';

    var EventBusModule = require('../index.js');
    var signal = null;

    beforeEach(function() {
        signal = new EventBusModule.Signal();
    });

    afterEach(function() {
        signal.destroy();
        signal = null;
    });

    it('Test Signal definition', function() {
        expect(signal).not.toBe(null);
    });

    it('Test Signal adding listener', function() {
        var callback = function() {};
        var context = {};

        var addListenerWithoutContext = function() {
            signal.addListener(callback);
        };

        var addListenerWithContext = function() {
            signal.addListener(callback, context);
        };

        var addNullListener = function() {
            signal.addListener(null);
        };

        var addNonFunctionListener = function() {
            signal.addListener('gotcha!');
        };

        expect(addListenerWithoutContext).not.toThrow();
        expect(addListenerWithContext).not.toThrow();
        expect(addNullListener).not.toThrow(); //FIXME: the signal should be more strict probably...
        expect(addNonFunctionListener).not.toThrow(); //FIXME: the signal should be more strict probably...
    });

    it('Test Signal dispatch event', function() {
        var callbackCounter = 0;

        var callback = function() {
            callbackCounter++;
        };
        var context = {};

        var addListenerWithoutContext = function() {
            signal.addListener(callback);
        };

        var addListenerWithContext = function() {
            signal.addListener(callback, context);
        };

        var dispatchEventOnSignal = function() {
            signal.dispatch();
        };

        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(0);
        expect(addListenerWithoutContext).not.toThrow();
        expect(callbackCounter).toBe(0);
        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(1);
        expect(addListenerWithContext).not.toThrow();
        expect(callbackCounter).toBe(1);
        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(3); //note: we have 2 listeners added now so it increments in a step of 2
        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(5);
    });

    it('Test Signal remove listener', function() {
        var callbackCounter = 0;

        var callback = function() {
            callbackCounter++;
        };
        var context = {};

        var addListenerWithoutContext = function() {
            signal.addListener(callback);
        };

        var addListenerWithContext = function() {
            signal.addListener(callback, context);
        };

        var removeListenerWithoutContext = function() {
            signal.removeListener(callback);
        };

        var removeListenerWithContext = function() {
            signal.removeListener(callback, context);
        };

        var dispatchEventOnSignal = function() {
            signal.dispatch();
        };

        expect(addListenerWithoutContext).not.toThrow();
        expect(addListenerWithContext).not.toThrow();
        expect(callbackCounter).toBe(0);
        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(2);
        expect(removeListenerWithContext).not.toThrow();
        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(3);
        expect(removeListenerWithoutContext).not.toThrow();
        expect(dispatchEventOnSignal).not.toThrow();
        expect(callbackCounter).toBe(3);
    });
});
