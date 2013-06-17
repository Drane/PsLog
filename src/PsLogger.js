/**
 * Created with JetBrains WebStorm.
 * User: jochen
 * Date: 4/2/13
 * Time: 10:47 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';
define(['lodash', 'PsUtil', 'PrintFormatter'], function(_, PsUtil, PrintFormatter){

    function getLogInfo(){
        Error.prototype.write = function(){
            var getLogLine = function(stack){
                console.debug(stack);

                //"    at null.<anonymous> (http://localhost:9000/dev/index.html:91:23)"
                var stackArray = stack.split('\n');
                if(stackArray[stackArray.length-1].indexOf(' (')>0){//Chrome
                    var line = stackArray[stackArray.length-1];
                    line = line.split(' (')[1];
                    /* line = (line.indexOf(' (') < 0 ? line.split('at ')[1] :
                     line.split(' (')[1]);*/
                    if(line.indexOf("<anonymous>") == -1)
                        line = line.substring(0, line.length - 1);
                    else
                        line = line.substring(0, line.length - 8);
                }else{//Firefox
                    var line = stackArray[stackArray.length-2];
                    line = line.substring(1, line.length);
                }
                return line;
            };
            return {logLine: getLogLine(this.stack), stack: this.stack};
        };
        return Error().write();
    };

    /**
     * 1 string arg => return new named defaultLogger
     * nog arg => return unnamed defaultLogger
     * 1 object arg => cfg
     * @returns {Function}
     * @constructor
     */
    function PsLogger(cfg){
        //default cfg object is a logger

        if(_.isObject(cfg) && !(cfg instanceof _.PsCtx)){
            cfg = {logger: cfg};
        }
        this.ctx = PsUtil.getCtx("PsLogger", {
            logger: console,
            enabled: false,
            //automatically converted to factors 100/x + assigned default styles
            logLevelArray: [
                'log',
                'debug',
                'info',
                'warn',
                'error'
            ],
            hijackFnArray: ['log'],
            printFormatter: (cfg && cfg.PrintFormatter) || new PrintFormatter
        }).merge(cfg);

        this.resultFn = this.ctx.logger[this.ctx.logLevelArray[0]].bind(this.ctx.logger/*,'['+(this.ctx.name||this.ctx.logLevelArray[0])+']'*/);

        _.each(this.ctx.logLevelArray, function(logLevelCfg){
            if(_.isString(logLevelCfg)){
                if(_.contains(this.ctx.hijackFnArray, logLevelCfg)){
//                if(this.ctx.hijackFnArray.indexOf(logLevelCfg)>0){


                    /*
                     Hijacked logger config
                     Return self via _.identity
                     */



                    this.resultFn[logLevelCfg] = function(){

                        function Address(){
                            this.street= 'Pelshei';
                            this.number= 7;
                            this.suffix= 'b';
                        }

                        function User(){
                            this.id = 1;
                            this.age = 32;
                            this.name = 'jochen';
                            this.address = new Address;
                        }

                        var data = {
                            timeStamp: PsUtil.getTimeStamp(),

                            logLine: getLogInfo().logLine,
                            user: new User
                        };
                        console.debug('this.ctx.printFormatter.format(data)', this.ctx.printFormatter.format(data));
                        

//                        this.ctx.logger[logLevelCfg].apply(this.ctx.logger, );
                        this.ctx.logger[logLevelCfg].apply(this.ctx.logger, this.ctx.printFormatter.format(data));
                    }.bind(this);
//                    this.resultFn[logLevelCfg] = _.partial(this.ctx.logger[logLevelCfg].bind(this.ctx.logger),[_.getTimeStamp()]);
//                    this.resultFn[logLevelCfg] = this.ctx.logger[logLevelCfg].apply(this.ctx.logger, [_.getTimeStamp()]);
                }else{
                    if(this.ctx.logger[logLevelCfg]){
                        this.resultFn[logLevelCfg] = this.ctx.logger[logLevelCfg]
                            .bind(this.ctx.logger/*,'['+(this.ctx.name||logLevelCfg)+']'*/);

                    }
                }
            }
        }, this);

        return this.resultFn;
    }

    return PsLogger;
});