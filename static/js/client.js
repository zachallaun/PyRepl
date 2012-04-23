(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Tutor, exercises, getExercises, tutor;
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
        var ex;
        ex = this.exercises[0];
        this.exercises = this.exercises.slice(1);
        return ex;
      };

      Tutor.prototype.watch = function(command, result) {
        return this.validate(command, result, PyREPL.lastOutput);
      };

      Tutor.prototype.validate = function(c, r, o) {
        var _this = this;
        if (this.current.test) {
          return caja.load(void 0, void 0, function(frame) {
            return frame.code(window.location.origin, 'application/javascript', _this.current.test).api({
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
    getExercises = function(url) {
      var x;
      x = $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        error: function() {
          return console.log('ajax error');
        },
        async: false
      });
      return JSON.parse(x.responseText).objects;
    };
    exercises = getExercises('api/lesson');
    tutor = new Tutor(exercises);
    return PyREPL.init(tutor.watch);
  });

}).call(this);
