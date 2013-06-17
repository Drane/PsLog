define(function() {

    var App = function(el) {
        this.el = el;
    };

    App.prototype.render = function() {
        this.el.appendChild(document.createTextNode('require.js up and running'));
    };

    return App;

});
