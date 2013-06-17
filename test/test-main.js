console.groupCollapsed('loading tests');
var testArray = Object.keys(window.__karma__.files).filter(function (file) {
    console.debug('file: ', file.toString());
    return /Spec\.js$/.test(file);
});
console.debug('testArray ready: ', testArray);
console.groupEnd();

requirejs.config({
//    urlArgs:'v=1.1',
    // Karma serves files from '/base'
    baseUrl: '/base/src',
    paths: {
        'lodash': '../lib/lodash'
    },

    shim: {
        'lodash': {
            exports: '_'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: testArray,

    // start test run, once Require.js is done
    callback: window.__karma__.start

});