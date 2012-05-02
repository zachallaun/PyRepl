(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Tester, tester;
    Tester = (function() {

      function Tester() {
        this.validate = __bind(this.validate, this);
        this.watch = __bind(this.watch, this);        caja.initialize({
          cajaServer: 'https://caja.appspot.com',
          debug: true
        });
      }

      Tester.prototype.watch = function(command, result) {
        var test;
        test = $('#ex-test').val();
        if (test) {
          this.test = test;
          return this.validate(command, result, PyREPL.lastOutput);
        }
      };

      Tester.prototype.validate = function(c, r, o) {
        var _this = this;
        return caja.load(void 0, void 0, function(frame) {
          return frame.code(window.location.origin, 'application/javascript', _this.test).api({
            code: c,
            result: r,
            output: o
          }).run(function(fn) {
            return _this.doTest(fn);
          });
        });
      };

      Tester.prototype.doTest = function(fn) {
        if (fn()) {
          return PyREPL.console.Write('Passed\n');
        } else {
          return PyREPL.console.Write('Failed\n');
        }
      };

      return Tester;

    })();
    tester = new Tester();
    return PyREPL.init(tester.watch);
  });

}).call(this);
