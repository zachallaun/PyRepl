(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Tester, codemirror, tester;
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
        test = $('#ex-code').val();
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
            return _this.doTest(fn, c, r, o);
          });
        });
      };

      Tester.prototype.doTest = function(fn, code, result, output) {
        if (fn()) {
          PyREPL.console.Write('Passed\n');
          return console.log("code: " + code, "result: " + result, "output: " + output);
        } else {
          PyREPL.console.Write('Failed\n');
          return console.log("code: " + code, "result: " + result, "output: " + output);
        }
      };

      return Tester;

    })();
    tester = new Tester();
    PyREPL.init(tester.watch);
    codemirror = CodeMirror.fromTextArea(document.getElementById("ex-code"), {
      mode: "javascript",
      theme: "blackboard",
      lineNumbers: true,
      matchBrackets: true,
      tabSize: 2,
      lineWrapping: true,
      onBlur: function() {
        return document.getElementById("ex-code").value = codemirror.getValue();
      }
    });
    return window.codemirror = codemirror;
  });

}).call(this);
