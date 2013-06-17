/**
 * Created with JetBrains WebStorm.
 * User: jochen
 * Date: 4/2/13
 * Time: 6:05 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

define(['lodash'], function(_){

    var PsUtil = {
        /**
         * Returns a random string of specified length (default: 5)
         * @param {number=} length
         * @returns {string}
         */
        getRandomString : function(length){
            var length = length || 5;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < length; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },

        isFloat: function(value){
            if(!_.isNumber(value))
                return false;
            return value % 1 !== 0;
        },

        isInteger: function(value){
            if(!_.isNumber(value))
                return false;
            return value % 1 === 0;
        },

        replaceNthMatch: function (original, pattern, n, replace) {
            var parts, tempParts;

            if (pattern.constructor === RegExp) {

                // If there's no match, bail
                if (original.search(pattern) === -1) {
                    return original;
                }

                // Every other item should be a matched capture group;
                // between will be non-matching portions of the substring
                parts = original.split(pattern);

                // If there was a capture group, index 1 will be
                // an item that matches the RegExp
                if (parts[1].search(pattern) !== 0) {
                    throw {name: "ArgumentError", message: "RegExp must have a capture group"};
                }
            } else if (pattern.constructor === String) {
                parts = original.split(pattern);
                // Need every other item to be the matched string
                tempParts = [];

                for (var i=0; i < parts.length; i++) {
                    tempParts.push(parts[i]);

                    // Insert between, but don't tack one onto the end
                    if (i < parts.length - 1) {
                        tempParts.push(pattern);
                    }
                }
                parts = tempParts;
            }  else {
                throw {name: "ArgumentError", message: "Must provide either a RegExp or String"};
            }

            // Parens are unnecessary, but explicit. :)
            var indexOfNthMatch = (n * 2) - 1;

            if (parts[indexOfNthMatch] === undefined) {
                // There IS no Nth match
                return original;
            }

            if (typeof(replace) === "function") {
                // Call it. After this, we don't need it anymore.
                replace = replace(parts[indexOfNthMatch]);
            }

            // Update our parts array with the new value
            parts[indexOfNthMatch] = replace;

            // Put it back together and return
            return parts.join('');

        },

        /**
         *
         * @param name The button label.
         * @param {function} fn The function to be called.
         * @param {object} element The element to attach it on.
         * @param {boolean=} appendAtEnd Boolean
         */
        addButton : function(name, fn, element, appendAtEnd){
            var button = document.createElement('input');
            button.type = "button";
            button.value = name;
            button.onclick = fn;
            element = element || document.body;

            if(appendAtEnd)
                element.appendChild(button);
            else
                element.insertBefore(button, element.firstChild);
        },

        padLeft: function(string, length, char){
            if(string.length < length){
                var padLength = length - string.length;
                for(var i = 0; i < padLength; i++){
                    string = char + string;
                }
            }
            return string;
        },

        getTimeStamp: function(){
            var date = arguments.length > 0 ? arguments[0] : new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            return this.padLeft(hours.toString(), 2, "0") + ":" +
                this.padLeft(minutes.toString(), 2, "0") + ":" +
                this.padLeft(seconds.toString(), 2, "0");
        },

        toArg: function(){
            var result = [];

            for(var i = 0; i < arguments.length; i++){
                var arg = arguments[i];
                result = result.concat(_.isArguments(arg) ? _.toArray(arg) : arg);
            }

            console.debug('toArg from %O to %O:',arguments, result);

            return result;
        },

        capitalize: function(string){
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        },

        /**
         * @param {*} targetObject
         * @param {*} cfg
         */
        addAccessModifiers: function(targetObject, cfg){
            cfg = cfg || cfg;
            _.each(cfg, function(cfgItem, key){
                var capitalKey = _.capitalize(key);

                targetObject['set' + capitalKey] = function(value){
                    cfg[key] = value;
                };
                targetObject['get' + capitalKey] = function(){
                    return cfg[key];
                };

                var beginString = _(key).stringEnds('Array').value();
                if(beginString){
//                    console.debug('found Array access modifier:', key, 'for '+stringEnd);
                    var tempOnError = requirejs.onError;
                    requirejs.onError = function(e){
                        console.info('foutje: ',e.message);
                    };
                    var capitalBeginString = _.capitalize(beginString);
                    require(['Ps' + capitalBeginString], function(type){

                        targetObject[key] = [];
                        _.each(cfgItem, function(arrayMember){
                            console.debug('>cfg[key]', cfg[key]);
                            targetObject[key].push(new type(arrayMember));
                            console.debug('<cfg[key]', cfg[key]);
                        });
                        console.debug('targetObject[key]', targetObject[key]);
                        


                        console.debug('found Type:', type, 'for ' + beginString);
                        targetObject['add' + capitalBeginString] = function(constructorArgs){
                            cfg[key].push(new type(constructorArgs));
                        };
                    });
//                    requirejs.onError = tempOnError;
                }
            });
            return targetObject;
        },

        stringEnds: function(string, endString){
            return string.substr(-endString.length) === endString ?
                string.substr(0, string.length - endString.length) : false;
        },

        PsCtx: function(args){
            this._name = "unnamed";
            var ctx;
            if(args.length>1 && _.isString(args[0])){
                this._name = args[0];
                ctx = args[1];
            }else{
                ctx = args[0];
            }
            this._ctxArray = [];

            this.reset = function(){
                _.merge(this, this._ctxArray[0]);
                this._ctxArray.clear();
            };

            this.merge = function(ctx){
                this._ctxArray.push(_.cloneDeep(this));
                _.merge(this, ctx);
                console.debug('getCtx "merge" for "%s" result', this._name, this);
                return this;
            };

            this.isDefault = function(){
                return this._ctxArray.length===0;
            };

            _.merge(this, ctx);
        },

        getCtx: function(){
            var result = new PsUtil.PsCtx(PsUtil.toArg(arguments));
            console.debug('getCtx for "%s" result', this._name, result);

            return result;
        },

        setCtx: function(){
            var arg = PsUtil.toArg(arguments);
            var that = arg.splice(0,1)[0];
            var cfg = arg.pop();
            var ctx = new PsUtil.PsCtx(arg);
            ctx.merge(cfg);
            console.debug('setCtx for "%s" ctx', this._name, ctx);
            _.each(ctx, function(value, key){
               that[key] = value;
            });
        }

    };

//    hooker.watch(PsUtil);


//    _.mixin(PsUtil);

    return PsUtil;
});