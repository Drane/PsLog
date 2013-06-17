'use strict';

define(['app', 'lodash'], function(App, _) {

    describe('testing require.js and lodash', function() {

        it('works for app', function() {
//            var el = $('<div></div>');
            var el = document.createElement('div');

            var app = new App(el);
            app.render();

            expect(_.size([1,2,3])).toEqual(3);
            expect(el.innerText).toEqual('require.js up and running');
        });

        it('works for lodash', function() {
            // just checking that _ works

        });

    });

});
