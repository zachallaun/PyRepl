(function() {

  $(function() {
    var PyWatcher, watcher;
    PyWatcher = (function() {

      function PyWatcher() {}

      PyWatcher.prototype.act = function(c, r, o) {
        return console.log(c, r, o);
      };

      return PyWatcher;

    })();
    watcher = new PyWatcher();
    return $("#python-runtime").on('load', function(event) {
      return PyREPL(watcher.act);
    });
  });

}).call(this);
