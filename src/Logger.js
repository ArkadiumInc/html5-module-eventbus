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
