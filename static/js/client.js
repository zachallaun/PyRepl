(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Lesson, Tutor, lesson, tutor;
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
        this.nextExercise(ex ? ex.task : null);
        if (ex) {
          this.exercises = this.exercises.slice(1);
          console.log(ex.test);
          return ex;
        }
      };

      Tutor.prototype.nextExercise = function(task) {
        var $ex;
        $ex = $("#exercise");
        if (task) {
          return $ex.html(markdown.toHTML(task));
        } else {
          return $ex.html(markdown.toHTML("**AT'LL DO, PIG**"));
        }
      };

      Tutor.prototype.watch = function(command, result) {
        if (this.current.test) {
          return this.validate(command, result, PyREPL.lastOutput);
        }
      };

      Tutor.prototype.validate = function(c, r, o) {
        var _this = this;
        return caja.load(void 0, void 0, function(frame) {
          return frame.code(window.location.origin, 'application/javascript', _this.current.test).api({
            code: c,
            result: r,
            output: o
          }).run(function(fn) {
            return _this.doTest(fn);
          });
        });
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
        return "api/exercise?q=" + (JSON.stringify(query));
      };

      return Lesson;

    })();
    window.Lesson = Lesson;
    lesson = new Lesson(2);
    if (lesson.exercises.length > 0) {
      tutor = new Tutor(lesson);
      return PyREPL.init(tutor.watch);
    } else {
      return PyREPL.init(function() {});
    }
  });

}).call(this);
