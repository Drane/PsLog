/**
 * Created with JetBrains WebStorm.
 * User: jochen
 * Date: 4/2/13
 * Time: 1:59 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

define(['lodash', 'PsUtil', 'PsLogger'], function(_, PsUtil, PsLogger){
    var ctx = PsUtil.getCtx("PsLog", {
        loggerArray: [
        ]
    });


//config done => create logger(s)
    function initLoggers(){
        var loggerArray = [];

        if(ctx.loggerArray.length===0){
            loggerArray.push(new PsLogger());
        }else{
            _.each(ctx.loggerArray, function(loggerCfg){
                loggerArray.push(new PsLogger(loggerCfg));
//        _.each(PsLog.loggerArray, function(logger){
//          logger.apply(logger, args);
            });
        }
        ctx.loggerArray = loggerArray;
    }


    /**
     * 1 string arg => return new named defaultLogger
     * nog arg => return unnamed defaultLogger
     * 1 object arg => cfg
     * @returns {Function}
     * @constructor
     */
    function PsLog(){

        //config part (might me abstracted)
        var args = _.toArray(arguments);
       /* if(args.length === 0){
            console.debug('PsLog "%s" with cfg: %O', ctx ? "reset" : "initialized", ctx);
            initLoggers();
        }else{
            if(!ctx.isDefault() && _.isObject(args[0])){
                ctx.merge(args.shift());
                initLoggers();
                console.debug('PsLog "%s" with custom cfg: %O', "initialized", ctx);
            }

        }*/
        _.each(ctx.loggerArray, function(logger){
//            console.debug(logger);
            logger.apply(ctx.loggerArray[0],args);
        });
/*        if(ctx.loggerArray.length === 1){
            ctx.loggerArray[0]
            return ctx.loggerArray[0];
//            return PsLog;
        }*/
//        _.addAccessModifiers(PsLog, cfg || defaultCfg);


        /*            cfg.defaultLogger.log.apply(cfg.defaultLogger, _.toArg(_.getTimeStamp(), arguments));
         return function(){
         console.log('in PsLog return function');

         //                return new Logger();
         };
         }*/

    }

//    var tmp = _.addAccessModifiers(PsLog, cfg || defaultCfg);
//    console.debug('tmp %O', tmp);


    PsLog.cfg = function _cfg(cfg){
        if(cfg){
            ctx.merge(cfg);
        }else{
            console.debug('PsLog>*%s*-[cfg: %O]', ctx.isDefault() ? "initialized" : "reset", ctx);
        }

    };

    return _.merge(PsLog, ctx.loggerArray[0]);
});

/*

 (function(exports){
 'use strict';

 function PsLog(){
 console.log.apply(console, arguments);
 }

 exports.PsLog = PsLog;

 //    return exports;

 }(typeof exports === "object" && exports || this));*/
