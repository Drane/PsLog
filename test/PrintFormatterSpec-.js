/**
 * Created with JetBrains WebStorm.
 * User: jochen
 * Date: 4/23/13
 * Time: 6:47 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

define(['PrintFormatter', 'PsUtil'], function(PrintFormatter, _) {

    describe('PrintFormatter', function () {

        var printFormatter = new PrintFormatter;

        describe('.format()', function () {

            it('lets "string only template parts" (without format specifier) pass through', function () {
                var str = 'justAString';
                printFormatter.setLayoutArray([
                    [str]
                ]);
                var args = printFormatter.format();
                expect(args.length).toBe(1);
                expect(args[0]).toBe(str);
            });

            it('lets template items with %x specifier pass through', function () {
                var layoutItemArray = [
                    ['%s','justAString'],
                    ['%d',666],
                    ['%i',666],
                    ['%f',666.666],
                    ['%o',['one',1]],
                    ['%O',['one',1]],
                    ['%O',{one: 'one'}],
                    ['%c',666.666]
                ];

                _.each(layoutItemArray, function(templateArray){
                    printFormatter.setLayoutArray([
                        [templateArray[0], templateArray[1]]
                    ]);
                    var args = printFormatter.format();
                    console.debug('args', args);//debugger;
                    expect(args.length).toBe(2);
                    expect(args[0]).toBe(templateArray[0]);
                    expect(args[1]).toBe(templateArray[1]);
                });
            });

            it('calls template functions with %x specifier and format args as input', function () {
                var fn = function(param){return "["+param+"]"};
                var layoutItemArray = [
                    ['%s',fn],
                    ['%d',fn],
                    ['%i',fn],
                    ['%f',fn],
                    ['%o',fn],
                    ['%O',fn],
                    ['%c',fn]
                ];

                _.each(layoutItemArray, function(templateArray){
                    printFormatter.setLayoutArray([
                        [templateArray[0], templateArray[1]]
                    ]);
                    var randomString = _.getRandomString(_.getRandomInt());
                    console.debug('randomString', randomString);
//                    debugger;
                    var args = printFormatter.format(randomString);
                    console.debug('args', args);//debugger;
                    expect(args.length).toBe(2);
                    expect(args[0]).toBe(templateArray[0]);
                    expect(args[1]).toBe(templateArray[1](randomString));
                });
            });

            /**
             * TODO:
             * test function in template
             */

        });
    });

});