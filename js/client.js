(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Tutor, exObj, exercises, fnOrTrue, parseFn, testFiles, tutor;
    Tutor = (function() {

      function Tutor(exercises) {
        this.exercises = exercises;
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

      Tutor.prototype.watch = function(c, r, o) {
        var _this = this;
        return caja.load(void 0, void 0, function(frame) {
          return frame.code(_this.current.url, 'application/javascript', _this.current.fn).api({
            code: c,
            result: r,
            output: o
          }).run(function(fn) {
            return _this.doTest(fn);
          });
        });
      };

      Tutor.prototype.doTest = function(testfn) {
        if (testfn()) {
          return console.log(testfn());
        } else {
          return console.log("GREAT FAILURE");
        }
      };

      return Tutor;

    })();
    testFiles = ["file://localhost/Users/ggzach/Dropbox/" + "projects/python27/pyrepl/js/test.js"];
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
        success: function(data) {
          return fn = data;
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
    return $("#python-runtime").on('load', function(event) {
      return PyREPL(tutor.watch);
    });
  });

}).call(this);
