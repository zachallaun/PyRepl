(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Lesson, Tutor, tutor;
    Tutor = (function() {

      function Tutor(lesson) {
        this.lesson = lesson;
        this.validate = __bind(this.validate, this);
        this.watch = __bind(this.watch, this);
        $("h1.standout").append(this.lesson.title);
        this.exercises = this.lesson.exercises;
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
        if (ex) {
          this.exercises = this.exercises.slice(1);
          $("#exercise").html(markdown.toHTML(ex.task));
          console.log(ex.test);
          return ex;
        } else {
          return $("#exercise").html(markdown.toHTML("**AT'LL DO, PIG**"));
        }
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
          return this.current = this.next();
        } else {
          return console.log("GREAT FAILURE");
        }
      };

      return Tutor;

    })();
    Lesson = (function() {

      function Lesson(id) {
        this.id = id;
        this.getExercises(this.id);
      }

      Lesson.prototype.getExercises = function(id) {
        var query;
        query = $.ajax({
          url: this.exQuery(id),
          method: 'GET',
          dataType: 'json',
          error: function() {
            return console.log("Couldn't load Lesson id" + id);
          },
          async: false
        });
        return this.exercises = JSON.parse(query.responseText)['objects'];
      };

      Lesson.prototype.exQuery = function(id) {
        var query;
        query = {
          filters: [
            {
              name: 'lesson_id',
              op: 'eq',
              val: id
            }
          ]
        };
        return "api/exercise?=" + (JSON.stringify(query));
      };

      return Lesson;

    })();
    tutor = new Tutor(new Lesson(1));
    return PyREPL.init(tutor.watch);
  });

}).call(this);
