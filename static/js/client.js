(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Lesson, Tutor, lesson, requestId, tutor;
    Tutor = (function() {

      function Tutor(lesson) {
        this.lesson = lesson;
        this.validate = __bind(this.validate, this);
        this.watch = __bind(this.watch, this);
        $("h1.standout").append(": " + this.lesson.title);
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
          $ex.html(markdown.toHTML(task));
        } else {
          $ex.html(markdown.toHTML("**AT'LL DO, PIG**"));
        }
        return $ex.fadeIn(1000);
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
        this.setExercises(id);
        this.setTitle(id);
      }

      Lesson.prototype.setExercises = function(id) {
        var query;
        query = $.ajax({
          url: 'api/exercise' + this.buildEqQuery('lesson_id', id),
          dataType: 'json',
          error: function() {
            return console.log("Couldn't load Lesson id" + id);
          },
          async: false
        });
        return this.exercises = JSON.parse(query.responseText)['objects'];
      };

      Lesson.prototype.setTitle = function(id) {
        var query;
        query = $.ajax({
          url: 'api/lesson' + this.buildEqQuery('id', id),
          dataType: 'json',
          async: false
        });
        return this.title = JSON.parse(query.responseText).objects[0].title;
      };

      Lesson.prototype.buildEqQuery = function(name, val) {
        var query;
        query = {
          filters: [
            {
              name: name,
              op: 'eq',
              val: val
            }
          ]
        };
        return "?q=" + (JSON.stringify(query));
      };

      return Lesson;

    })();
    requestId = function() {
      var lesson_id;
      if (!window.location.hash) window.location.hash = "#2";
      return lesson_id = parseInt((window.location.hash.split("#"))[1]);
    };
    lesson = new Lesson(requestId());
    if (lesson.exercises != null) {
      tutor = new Tutor(lesson);
      return PyREPL.init(tutor.watch);
    } else {
      return PyREPL.init(function() {});
    }
  });

}).call(this);
