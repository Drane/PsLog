/**
 * Created with JetBrains WebStorm.
 * User: jochen
 * Date: 4/9/13
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 */
'use strict';
define(['lodash', 'PsUtil'], function(_, PsUtil){

    function getFmtSpecifiers(fmtSpecifiers){
        if(!fmtSpecifiers || !_)
            return null;

        return fmtSpecifiers.match(/%[0-9]*[\\.0-9]*[a-zA-Z]/g);
    }

    function getArgsFormatSpec(args){
        return _.map(args,
            function(arg){
                if(_.isArray(arg))
                    return this.isArray;
                else if(_.isFloat(arg))
                    return this.isFloat;
                else if(_.isInteger(arg))
                    return this.isInteger;
                else if(_.isObject(arg))
                    return this.isObject;
                //by default (e.g. boolean, regexp) return as String format
                return this.isString;

            },
            {
                isString: "%s",
                isArray: "%O",
                isFloat: "%f",
                isInteger: "%d",
                isObject: "%O"
            });
    }

    function validateLayoutArray(layoutArray){
        _.each(layoutArray, function(templateArray, templateIndex){
            var fmtSpecifierArray = getFmtSpecifiers(templateArray[0]);

            if(fmtSpecifierArray && fmtSpecifierArray.length > 0){
                var varCount = fmtSpecifierArray.length;

                if(varCount !== templateArray.length-1){
                    throw new Error('Variable parameter count ('+varCount+') in "'+templateArray[0]+'"' +
                        'differs from remaining argument count ('+(templateArray.length-1)+'): "'+templateArray.slice(1)+
                        '" for item with index '+templateIndex+'.', 'LayoutArrayItemMismatch');
                }
            }
        });
    }

    function PrintFormatter(cfg){
        //default cfg object is a layoutArray
        if(_.isObject(cfg) && ! (cfg instanceof _.PsCtx)){
            cfg = {layoutArray: cfg};
        }

        PsUtil.setCtx(this, "PrintFormatter",{
            layoutArray : [
                ['%c%s','color: #909090','[{{timeStamp}}]'],
//                ['%s','[{{timeStamp}}]'],
//                ['%c%d','color: red','[{{user.age}}]'],
//                ['%s - %f - %d ','[{{timeStamp}}]',function(){return Math.random()},666],
                ['%c%a','color: red','[{{args}}]'],
                ['%c@ %s','color: black','{{logLine}}'],
                ['%c%O','color: red','[{{user}}]']
            ],
            beginTag: '{{',
            endTag: '}}',
            path: '[a-z0-9_][\\.a-z0-9_]*',
            autoFmtSpecifier: '%a',
            autoFmtSpecifierSeparator: ' '
        }, cfg);

        validateLayoutArray(this.layoutArray);

        var pattern = new RegExp(this.beginTag +
            "\\s*(" + this.path + ")\\s*" + this.endTag, "gi");

        /**
         *
         * @param {Object=|string=} data
         * @returns {Array}
         */
        this.format = function(data){
            var fmtArray =[];
            var args = [];

            //for each array of templates in the layout array
            _.each(this.layoutArray, function(templateArray){
                console.debug('templateArray',templateArray);
                var fmtSpecifierArray = null;
                var fmtSpecifier = null;

                //for each template in the template array
                _.each(templateArray, function(template, templateIndex){

                    console.debug('template %s index %d', template, templateIndex);
                    var lookup = data;
                    var currToken = null;
                    var mergedTemplate = null;
                    if(!_.isNull(fmtSpecifierArray))
                        fmtSpecifier = fmtSpecifierArray[templateIndex-1];

                    //string template
                    if(_.isString(template)){
                        mergedTemplate = template.replace(pattern, function(tag, token){
                            var result = null;
                            var path = token.split(".");

                            for(var subPathIndex=0;subPathIndex<path.length;subPathIndex++){
                                lookup = lookup[path[subPathIndex]];

                                if(lookup!==undefined && subPathIndex === path.length-1){
                                    currToken = token;
                                    result = lookup;
                                }
                            }
                            return result;
                        });
                        console.debug('mergedTemplate', mergedTemplate);
                    }else if(_.isFunction(template)){ //function template
                        mergedTemplate = template.apply(template, _.toArg(lookup));
                        args.push(mergedTemplate);
                        return;
                    }else{ //other template
                        mergedTemplate = template;
                    }

//                    debugger;
                    if(templateIndex==0){
                        fmtArray.push(mergedTemplate);
                        fmtSpecifierArray = getFmtSpecifiers(mergedTemplate);
                    }else if(!lookup && mergedTemplate === template){
//                        debugger;
                        args.push(mergedTemplate);
                    }else if(lookup){
                        if(_.contains(["%s", "%c"], fmtSpecifier))
//                            if(fmtSpecifier == "%s")
                            args.push(mergedTemplate);
                        else{
                            if(_.isString(template)){
                                //wrap non string specified values (fmtArray and args)
                                var wrap = template.split(this.beginTag+currToken+this.endTag);
                                //prefix
//                                fmtArray.splice(fmtArray.length-1, 0, "(%s)");

                                //args prefix
                                args.push(wrap[0]);

                                //value
                                if(fmtSpecifier == this.autoFmtSpecifier){
                                    if(!_.isArray(lookup))
                                        lookup = _.toArray(lookup);

                                    //handle auto expansion of args
//                                    fmtArray.pop();
                                    var argsFormatSpec = getArgsFormatSpec(lookup);
                                    //add separator
                                    _.each(argsFormatSpec, function(formatSpec, fSpecIndex){
                                        if(fSpecIndex>0 && argsFormatSpec.length-1>fSpecIndex){

                                            argsFormatSpec[fSpecIndex]= this.autoFmtSpecifierSeparator +
                                                argsFormatSpec[fSpecIndex];
                                        }
                                    },this);
                                    //format prefix
                                    argsFormatSpec[0] = '%s'+argsFormatSpec[0];
                                    fmtArray[fmtArray.length-1] = fmtArray[fmtArray.length-1].replace(/%a/g, argsFormatSpec);
//                                    fmtArray = fmtArray.concat(argsFormatSpec);

                                    args = args.concat(lookup);
                                }else{
                                    //format prefix

                                    var string = fmtArray[fmtArray.length-1];
                                    var cFSpecIndex = string.indexOf("%c");

                                    if(cFSpecIndex != -1){
                                        debugger;
                                        var afterC = string.substr(cFSpecIndex+2);
                                        var replaceWith = '%s'+afterC.match(/%[0-9]*[\\.0-9]*[a-zA-Z]/)[0];
                                        afterC = afterC.replace(/%[0-9]*[\\.0-9]*[a-zA-Z]/, replaceWith);
                                        fmtArray[fmtArray.length-1] = string.substr(0, cFSpecIndex+2) + afterC;
                                    }else{
                                        fmtArray[fmtArray.length-1] = fmtArray[fmtArray.length-1].
                                            replace(/%[0-9]*[\\.0-9]*[a-zA-Z](.*)(?!.*%[0-9]*[\\.0-9]*[a-zA-Z](.*))(.*)$/,'%s'+string);
                                    }
                                    console.debug('fmtArray[fmtArray.length-1]',fmtArray[fmtArray.length-1]);
/*                                    fmtArray[fmtArray.length-1] = fmtArray[fmtArray.length-1].
                                        replace(/%[0-9]*[\\.0-9]*[a-zA-Z](.*)(?!.*%[0-9]*[\\.0-9]*[a-zA-Z](.*))(.*)$/,'%s'+string);*/
                                    /*fmtArray[fmtArray.length-1] = fmtArray[fmtArray.length-1].
                                        replace(/%[0-9]*[\\.0-9]*[a-zA-Z](.*)(?!.*%[0-9]*[\\.0-9]*[a-zA-Z](.*))(.*)$/,'%s'+fmtSpecifier);*/
                                    args.push(lookup);
                                }

                                //suffix
//                                fmtArray.push("%s");
                                fmtArray[fmtArray.length-1]+= "%s";
                                args.push(wrap[1]);
                            }else{
                                args.push(lookup);
                            }
                        }
                    }
                }, this);
            }, this);
            args.unshift(fmtArray.join(""));
            return args;
        };

        this.setLayoutArray = function(layoutArray){
            validateLayoutArray(layoutArray);
            this.layoutArray = layoutArray;
        }

        this.template = _.template;

    }

    return PrintFormatter;
});