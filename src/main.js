requirejs.config({
    paths: {
        'lodash': '../lib/lodash',
        'hooker': '../lib/hooker'
    },

    shim: {
        'lodash': {
            exports: '_'
        }
    }
});

define(['app', 'lodash', 'PsUtil', 'PsLog', 'PsLogger'], function (App, _, PsUtil, PsLog, PsLogger) {
    var app = new App(document.body);
    app.render();

    window.PsUtil = PsUtil;
    window.PsLog = PsLog;
    window.PsLogger = PsLogger;

    PsUtil.addButton('log()', function () {_log.log('constructor log test');}, document.body);
    PsUtil.addButton('clear', function () {console.clear();}, document.body);
    PsUtil.addButton('error', function () {_log.error('error test');}, document.body);
    PsUtil.addButton('warn', function () {_log.warn('warn test');}, document.body);
    PsUtil.addButton('info', function () {_log.info('info test');}, document.body);
    PsUtil.addButton('debug', function () {_log.debug('debug test');}, document.body);
    PsUtil.addButton('log', function () {_log.log('log test');}, document.body);





});
