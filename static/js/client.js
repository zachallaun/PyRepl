(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Tutor, exObj, exercises, fnOrTrue, parseFn, testFiles, tutor;
    Tutor = (function() {

      function Tutor(exercises) {
        this.exercises = exercises;
        this.validate = __bind(this.validate, this);
        this.watch = __bind(this.watch, this);
        this.current = this.next();
        this.completed = [];
        caja.initialize({
          cajaServer: 'https://caja.appspot.com',
          debug: true
        });
      }

      Tutor.prototype.next = function() {
        var fn;
        fn = this.exercises[0];
        this.exercises = this.exercises.slice(1);
        return fn;
      };

      Tutor.prototype.watch = function(command, result) {
        return this.validate(command, result, PyREPL.lastOutput);
      };

      Tutor.prototype.validate = function(c, r, o) {
        var _this = this;
        if (this.current.fn) {
          return caja.load(void 0, void 0, function(frame) {
            return frame.code(window.location.origin + _this.current.url, 'application/javascript', _this.current.fn).api({
              code: c,
              result: r,
              output: o
            }).run(function(fn) {
              return _this.doTest(fn);
            });
          });
        }
      };

      Tutor.prototype.doTest = function(fn) {
        if (fn()) {
          return console.log(fn());
        } else {
          return console.log("GREAT FAILURE");
        }
      };

      return Tutor;

    })();
    testFiles = ["/static/js/tests/test.js"];
    fnOrTrue = function(fn) {
      if (fn === !"") {
        return fn;
      } else {
        return "function(){return true;}";
      }
    };
    parseFn = function(url) {
      var fn;
      fn = null;
      $.ajax({
        url: url,
        dataType: 'text',
        success: function(data) {
          return fn = data;
        },
        error: function(data) {
          return console.log('ajax error');
        },
        async: false
      });
      return fn;
    };
    exObj = {
      task: "This is the first task.",
      url: testFiles[0]
    };
    exObj.fn = parseFn(exObj.url);
    exercises = [exObj];
    tutor = new Tutor(exercises);
    return PyREPL.init(tutor.watch);
  });

}).call(this);
