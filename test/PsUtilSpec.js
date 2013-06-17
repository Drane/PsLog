'use strict';

define(['PsUtil'], function (PsUtil) {

    describe('PsUtil methods testing', function () {

        describe('getRandomString(max)', function () {
            it('Returns a random string of specified length (default: 5)', function () {
                var randomString =  PsUtil.getRandomString();
                expect(typeof randomString).toEqual("string");
                expect(randomString.length).toEqual(5);

                var length = _.random(0, 50);
                randomString =  PsUtil.getRandomString(length);
                expect(typeof randomString).toEqual("string");
                expect(randomString.length).toEqual(length);
            });
        });


        /*it('works for app', function() {
         var el = $('<div></div>');

         var app = new App(el);
         app.render();

         expect(el.text()).toEqual('require.js and jquery up and running');
         });*/

        /*
         it('works for lodash', function() {
         // just checking that _ works
         expect(_.size([1,2,3])).toEqual(3);
         });*/

    });

});
