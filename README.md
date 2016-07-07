# EventBus module

* EventBus -- emits named events in named topics to subscribed listeners
* EventEmitter -- emits named events to subscribed listeners
* Signal -- emits a single unnamed event to subscribed listeners

## EventBus Basic Usage Example

```javascript
var EventBus = require('arkadium-eventbus').EventBus;

var eventBus = new EventBus();

var TOPIC_GREETINGS = 'greetings';
var EVENT_READY = 'ready';

eventBus.registerEvent(TOPIC_GREETINGS, EVENT_READY);

var greeter = {
    whom: 'world!',
    say: function() {
        console.log('Hello '+this.whom);
    }
}

eventBus.addListener(TOPIC_GREETINGS, EVENT_READY, greeter.say, greeter);

eventBus.validate(); //must be validated before dispatching

eventBus.dispatchEvent(TOPIC_GREETINGS, EVENT_READY);

eventBus.destroy(); //don't forget to destroy when done using
```

## EventEmitter Basic Usage Example

```javascript
var EventEmitter = require('arkadium-eventbus').EventEmitter;

var eventEmitter = new EventEmitter();

var EVENT_READY = 'ready';

eventEmitter.registerEvent(EVENT_READY);

var greeter = {
    whom: 'world!',
    say: function() {
        console.log('Hello '+this.whom);
    }
}

eventEmitter.addListener(EVENT_READY, greeter.say, greeter);

eventEmitter.dispatchEvent(EVENT_READY);

eventEmitter.destroy(); //don't forget to destroy when done using
```

## Signal Basic Usage Example

```javascript
var Signal = require('arkadium-eventbus').Signal;

var signal = new Signal();

var greeter = {
    whom: 'world!',
    say: function() {
        console.log('Hello '+this.whom);
    }
}

signal.addListener(greeter.say, greeter);

signal.dispatch();

signal.destroy(); //don't forget to destroy when done using
```
