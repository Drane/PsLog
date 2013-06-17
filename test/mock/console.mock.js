define(function(){
    'use strict';

    var consoleMock = {
        enabled: false,
        originalConsole: {
            log: console.log.bind(console)
        },
        lastArguments: {
            log: null,
            info: null,
            warn: null,
            debug: null,
            error: null
        }
    };

    consoleMock.toggleEnabled = function(){
        consoleMock.enabled = !consoleMock.enabled;

        if(consoleMock.enabled){
            console.log = consoleMock.log;
        }else{
            console.log = consoleMock.originalConsole.log;
        }
    }

    consoleMock.log = function(){
        consoleMock.lastArguments.log = arguments;
        consoleMock.originalConsole.log('consoleMock.log!');
        consoleMock.originalConsole.log.apply(console, arguments);
    };
    consoleMock.info = function(){
        consoleMock.lastArguments.info = arguments;
        consoleMock.originalConsole.log('consoleMock.info!');
        consoleMock.originalConsole.info.apply(console, arguments);
    };
    consoleMock.warn = function(){
        consoleMock.lastArguments.warn = arguments;
        consoleMock.originalConsole.log('consoleMock.warn!');
        consoleMock.originalConsole.warn.apply(console, arguments);
    };
    consoleMock.debug = function(){
        consoleMock.lastArguments.debug = arguments;
        consoleMock.originalConsole.log('consoleMock.debug!');
        consoleMock.originalConsole.debug.apply(console, arguments);
    };
    consoleMock.error = function(){
        consoleMock.lastArguments.error = arguments;
        consoleMock.originalConsole.log('consoleMock.error!');
        consoleMock.originalConsole.error.apply(console, arguments);
    };

    return consoleMock;
});
/*

(function(exports) {
    var consoleMock = {
        originalConsole : console,
        lastArguments: {
            log: null
        }
    };
    consoleMock.log = function(){
        consoleMock.lastArguments.log = arguments;
        consoleMock.originalConsole.log('consoleMock.log!');
        consoleMock.originalConsole.log.apply(consoleMock.originalConsole, arguments);
    };
    consoleMock.info = function(){
        consoleMock.originalConsole.log('consoleMock.info!');
    };
    consoleMock.warn = function(){
        consoleMock.originalConsole.log('consoleMock.warn!');
    };
    consoleMock.debug = function(){
        consoleMock.originalConsole.log('consoleMock.debug!');
    };
    consoleMock.error = function(){
        consoleMock.originalConsole.log('consoleMock.error!');
    };

    exports.console = consoleMock;

}(typeof exports === "object" && exports || this));*/
